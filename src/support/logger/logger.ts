import { InvocationContext } from '@azure/functions';

let currentContext: InvocationContext | null = null;

export function setLoggerContext(ctx: InvocationContext) {
  currentContext = ctx;
}

export function log(message: string) {
  if (currentContext) {
    currentContext.log(message);
  } else {
    console.log(message);
  }
}

export function logError(...messages: unknown[]) {
  const errorMsg = messages.map(m => (m instanceof Error ? m.stack || m.message : String(m))).join(' ');
  if (currentContext) {
    currentContext.error(errorMsg);
  } else {
    console.error(errorMsg);
  }
}


export function logWarn(message: string) {
  if (currentContext) {
    currentContext.warn(message);
  } else {
    console.warn(message);
  }
}
