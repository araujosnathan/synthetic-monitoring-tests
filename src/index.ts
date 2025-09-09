import { spawn } from 'child_process';
import { setLoggerContext } from './support/logger/logger';
import { InvocationContext } from '@azure/functions';
import path from 'path';

// Import the function to register it
import './functions/synthetic-monitor';

export async function runPlaywrightTests(context: InvocationContext): Promise<void> {
  setLoggerContext(context);
  return new Promise((resolve, reject) => {
    context.log('▶️ Running Playwright tests via CLI...');
    
    // Use full path to playwright binary
    const playwrightPath = path.join(process.cwd(), 'node_modules', '.bin', 'playwright.cmd');
    const command = `"${playwrightPath}" test`;
    
    context.log(`📍 Using command: ${command}`);
    const child = spawn(command, { shell: true });

    child.stdout.on('data', (data) => {
      context.log(data.toString());
    });

    child.stderr.on('data', (data) => {
      context.log(data.toString());
    });

    child.on('error', (error) => {
      context.log(`❌ Playwright tests failed: ${error.message}`);
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        context.log('✅ Playwright tests completed.');
        resolve();
      } else {
        context.log(`❌ Playwright tests exited with code ${code}`);
        reject(new Error(`Playwright tests failed with code ${code}`));
      }
    });
  });
}
