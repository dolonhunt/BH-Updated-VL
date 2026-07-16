/**
 * Structured Logger for BH HR APP DOCUGEN
 * 
 * Usage:
 *   import { logger } from '@/shared/lib/logger';
 *   logger.info({ event: 'document_generated', docType: 'payslip', empId: 'EMP001' });
 *   logger.error({ event: 'pdf_failed', error: err.message, docType: 'appointment' });
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private level: LogLevel = 'info';
  private isDev = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };
    return JSON.stringify(entry);
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  debug(message: string, context?: LogContext) {
    if (this.shouldLog('debug')) {
      const formatted = this.formatMessage('debug', message, context);
      // eslint-disable-next-line no-console
      if (this.isDev) console.debug(`[DEBUG] ${formatted}`);
      // In production, send to log aggregation service (e.g., Sentry, Datadog)
    }
  }

  info(message: string, context?: LogContext) {
    if (this.shouldLog('info')) {
      const formatted = this.formatMessage('info', message, context);
      // eslint-disable-next-line no-console
      console.log(`[INFO] ${formatted}`);
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.shouldLog('warn')) {
      const formatted = this.formatMessage('warn', message, context);
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${formatted}`);
    }
  }

  error(message: string, context?: LogContext) {
    if (this.shouldLog('error')) {
      const formatted = this.formatMessage('error', message, context);
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${formatted}`);
      // In production, send to error tracking (e.g., Sentry)
      if (context?.error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error('Stack:', context.error.stack);
      }
    }
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }
}

export const logger = new Logger();

// Convenience namespaces for common operations
export const log = {
  document: {
    generated: (docType: string, empId?: string) => logger.info('Document generated', { category: 'document', docType, empId }),
    exported: (docType: string, format: 'pdf' | 'docx' | 'print', empId?: string) => logger.info('Document exported', { category: 'document', docType, format, empId }),
    error: (docType: string, error: Error) => logger.error('Document generation failed', { category: 'document', docType, error: error.message }),
  },
  employee: {
    created: (empId: string, name: string) => logger.info('Employee created', { category: 'employee', empId, name }),
    updated: (empId: string, changes: string[]) => logger.info('Employee updated', { category: 'employee', empId, changes }),
    deleted: (empId: string) => logger.warn('Employee deleted', { category: 'employee', empId }),
  },
  api: {
    request: (route: string, method: string) => logger.debug('API request', { category: 'api', route, method }),
    error: (route: string, status: number, error: string) => logger.error('API error', { category: 'api', route, status, error }),
  },
  export: {
    pdf: (docType: string, duration: number) => logger.info('PDF generated', { category: 'export', format: 'pdf', docType, durationMs: duration }),
    docx: (docType: string, duration: number) => logger.info('DOCX generated', { category: 'export', format: 'docx', docType, durationMs: duration }),
    print: (docType: string) => logger.info('Print triggered', { category: 'export', format: 'print', docType }),
  },
};
