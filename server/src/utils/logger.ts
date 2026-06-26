type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

/**
 * Formats a log entry as a structured JSON string.
 */
function formatLog(level: LogLevel, message: string, data?: unknown): string {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (data !== undefined) {
    entry.data = data;
  }

  return JSON.stringify(entry);
}

/**
 * Simple structured logger that outputs JSON-formatted log entries
 * with timestamp, level, message, and optional data payload.
 */
export const logger = {
  /** Log debug-level messages (only useful in development) */
  debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatLog('debug', message, data));
    }
  },

  /** Log informational messages */
  info(message: string, data?: unknown): void {
    console.info(formatLog('info', message, data));
  },

  /** Log warning messages */
  warn(message: string, data?: unknown): void {
    console.warn(formatLog('warn', message, data));
  },

  /** Log error messages */
  error(message: string, data?: unknown): void {
    console.error(formatLog('error', message, data));
  },
};
