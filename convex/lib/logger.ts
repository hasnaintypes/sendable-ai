"use node";

/**
 * Logger utility for Convex backend.
 *
 * - In local/development: logs to console
 * - In production/staging: sends logs to BetterStack (Logtail)
 *
 * Set LOGTAIL_SOURCE_TOKEN in your Convex environment variables
 * to enable production logging.
 *
 * Note: This file uses Node.js APIs and can only be imported from actions.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}

let logtailInstance: {
  debug: (msg: string, ctx?: LogContext) => void;
  info: (msg: string, ctx?: LogContext) => void;
  warn: (msg: string, ctx?: LogContext) => void;
  error: (msg: string, ctx?: LogContext) => void;
  flush: () => Promise<unknown>;
} | null = null;

async function getLogtail() {
  if (logtailInstance) return logtailInstance;

  const token = process.env.LOGTAIL_SOURCE_TOKEN;
  if (!token) return null;

  try {
    // Use a variable to prevent esbuild from statically resolving the import
    const pkg = "@logtail/node";
    const { Logtail } = await import(/* webpackIgnore: true */ pkg);
    logtailInstance = new Logtail(token);
    return logtailInstance;
  } catch {
    // @logtail/node not available — fall back to console
    return null;
  }
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const ctx = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctx}`;
}

function shouldLog(): boolean {
  return true; // Always log — level filtering can be added via LOGTAIL_MIN_LEVEL env var
}

const logger: Logger = {
  debug(message: string, context?: LogContext) {
    if (!shouldLog()) return;
    // Debug only logs locally, never to production
    console.debug(formatMessage("debug", message, context));
  },

  info(message: string, context?: LogContext) {
    if (!shouldLog()) return;
    console.info(formatMessage("info", message, context));
    getLogtail().then((lt) => lt?.info(message, context));
  },

  warn(message: string, context?: LogContext) {
    if (!shouldLog()) return;
    console.warn(formatMessage("warn", message, context));
    getLogtail().then((lt) => lt?.warn(message, context));
  },

  error(message: string, context?: LogContext) {
    if (!shouldLog()) return;
    console.error(formatMessage("error", message, context));
    getLogtail().then((lt) => lt?.error(message, context));
  },
};

export default logger;
export type { Logger, LogContext };
