import { app, InvocationContext, Timer } from '@azure/functions';
import { runPlaywrightTests } from '../index';

app.timer('syntheticMonitor', {
  schedule: process.env.SYNTHETIC_MONITOR_SCHEDULE || '0 0 * * * *',
  handler: async (myTimer: Timer, context: InvocationContext) => {
    try {
      context.log("Executing synthetic monitoring tests...");
      await runPlaywrightTests(context);
      context.log("Synthetic monitoring tests completed successfully!");
    } catch (error) {
      context.log("Error in synthetic monitoring tests:", error);
    } finally {
      context.log("Synthetic monitoring cycle completed.");
    }
  }
});