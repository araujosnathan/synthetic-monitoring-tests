import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import path from 'path';
import os from 'os';
import { uploadFileToBlobStorage } from '../azure/blob-storage';
import { zipReportFolder } from './utils';
import { appInsightsClient } from '../azure/app-insights-client';
import { flushTelemetry } from '../azure/app-insights';
import { log, logError } from '../logger/logger';

class AppInsightsReporter implements Reporter {
  private runTimestamp: string | null = null;

  onTestEnd(test: TestCase, result: TestResult) {
    if (!this.runTimestamp) {
      this.runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    }

    log(`[Reporter] onTestEnd called for test: ${test.title} with status: ${result.status}`);
    const retries = test.retries || 0;
    const isLastRetry = result.retry === retries;
    const testPassed = result.status === 'passed';

    // Only send telemetry for the final attempt
    const shouldSendTrace = testPassed || isLastRetry;
    if (!shouldSendTrace) {
      log(`[Reporter] Skipping report to AppInsights for intermediate retry: ${test.title} (retry ${result.retry})`);
      return;
    }


    const duration = result.duration || 0;
    const success = result.status === 'passed';

    appInsightsClient.trackAvailability({
      name: test.title,
      success,
      duration,
      runLocation: 'Azure Function - Playwright Synthetic Monitoring',
      message: success ? 'Test passed' : `Test failed: ${result.error?.message}`,
      time: new Date(this.runTimestamp),
      id: test.id,
    });
  }

  async onEnd(result: FullResult): Promise<void> {
    const shouldUpload = result.status === 'failed';

    log(`[Reporter] onEnd called. Test status: ${result.status}. Should upload: ${shouldUpload}`);

    if (shouldUpload) {
      try {
        const htmlReportPath = process.env.PLAYWRIGHT_HTML_REPORT || path.join(os.tmpdir(), 'playwright-html-report');

        const timestamp = this.runTimestamp ?? new Date().toISOString().replace(/[:.]/g, '-');
        const zipName = `report-${timestamp}`;
        const zipPath = await zipReportFolder(htmlReportPath, zipName);

        log(`[Reporter] Zipped report at: ${zipPath}`);
        log(`[Reporter] Uploading as: ${zipName}.zip`);

        await uploadFileToBlobStorage(zipPath, `${zipName}.zip`);

        log('[Reporter] Upload complete.');
      } catch (err) {
        logError('[Reporter] Failed to zip or upload report:', err);
      }
    } else {
      console.log('[Reporter] Skipping upload – test status was not "failed".');
    }

    try {
      await flushTelemetry(5000);
    } catch (err) {
      logError('[AppInsights] Error during flush:', err);
    }

    log('[Reporter] onEnd completed.');
  }
}

export default function (): Reporter {
  return new AppInsightsReporter();
}