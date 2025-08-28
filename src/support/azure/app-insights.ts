import { appInsightsClient } from "./app-insights-client";

export function flushTelemetry(timeoutMs = 5000): Promise<void> {
  return new Promise((resolve) => {
    appInsightsClient.flush();
    setTimeout(() => {
      console.log('[AppInsights] Flush complete (via timeout)');
      resolve();
    }, timeoutMs);
  });
}
