import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';

const tmpDir = os.tmpdir();
const outputPath = process.env.PLAYWRIGHT_OUTPUT_DIR || path.join(tmpDir, 'playwright-artifacts');
const htmlReportPath = process.env.PLAYWRIGHT_HTML_REPORT || path.join(tmpDir, 'playwright-html-report');

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}
if (!fs.existsSync(htmlReportPath)) {
  fs.mkdirSync(htmlReportPath, { recursive: true });
}

export default defineConfig({
  testDir: './src/tests',
  timeout: 180 * 1000,
  retries: 1,
  fullyParallel: true,
  workers: 3,
  outputDir: outputPath,

  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    baseURL: process.env.baseUrl,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 30000
  },

  reporter: [
    ['html', { outputFolder: htmlReportPath, open: 'never' }],
    ['junit', { outputFile: path.join(outputPath, 'junit-report.xml') }],
    ['list'], 
    ['./src/support/reporter/appinsights-reporter.ts']
  ],

  projects: [
     {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});
