/**
 * @file logger.ts
 * @description Lightweight, structured logging utility for server environment lifecycle and request tracking.
 * 
 * PURPOSE:
 * Provides clean formatted console logging with timestamps and log severity levels (INFO, WARN, ERROR, DEBUG).
 * Avoids raw console.log statements across production code for standardized auditability.
 * 
 * ROLE IN REQUEST FLOW:
 * Used by application setup, database lifecycle events, error middleware, and service processes.
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

class Logger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}]: ${message}`;
  }

  public info(message: string, ...args: unknown[]): void {
    console.info(this.formatMessage('INFO', message), ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(this.formatMessage('WARN', message), ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    console.error(this.formatMessage('ERROR', message), ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }
}

export const logger = new Logger();
