/**
 * Logger utility for Next.js frontend.
 *
 * - In development (NODE_ENV=development): logs to console
 * - In production: silences debug/info, only logs warn/error
 *
 * Usage:
 *   import logger from "@/lib/logger";
 *   logger.info("User signed in", { userId: "123" });
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV === "development";

const logger = {
  debug(message: string, _context?: LogContext) {
    if (isDev) console.debug(`[DEBUG] ${message}`);
  },

  info(message: string, _context?: LogContext) {
    if (isDev) console.info(`[INFO] ${message}`);
  },

  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context ?? "");
  },

  error(message: string, context?: LogContext) {
    console.error(`[ERROR] ${message}`, context ?? "");
  },
};

export default logger;
