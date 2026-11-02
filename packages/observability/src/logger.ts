/**
 * @file packages/observability/src/logger.ts
 * Structured JSON Logger with Sensitive Data Scrubbing
 * Adheres to Blueprint Section 20.3 & NFR targets
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'jwt',
  'authorization',
  'pin',
  'cvv',
  'cardNumber',
  'secret',
  'apiKey',
  'aadhaar',
  'clinicalNotes',
]);

function scrubSensitiveFields(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(scrubSensitiveFields);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key) || key.toLowerCase().includes('password') || key.toLowerCase().includes('secret')) {
      sanitized[key] = '[REDACTED_SENSITIVE_DATA]';
    } else if (typeof val === 'object' && val !== null) {
      sanitized[key] = scrubSensitiveFields(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

export interface StructuredLogRecord {
  timestamp: string;
  level: LogLevel;
  message: string;
  correlationId?: string;
  tenantId?: string;
  userId?: string;
  context?: Record<string, unknown>;
}

export class StructuredLogger {
  private componentName: string;

  constructor(componentName: string) {
    this.componentName = componentName;
  }

  private write(level: LogLevel, message: string, meta?: { correlationId?: string; tenantId?: string; userId?: string; [key: string]: unknown }) {
    const { correlationId, tenantId, userId, ...rest } = meta || {};
    const record: StructuredLogRecord = {
      timestamp: new Date().toISOString(),
      level,
      message: `[${this.componentName}] ${message}`,
      correlationId,
      tenantId,
      userId,
      context: rest && Object.keys(rest).length > 0 ? (scrubSensitiveFields(rest) as Record<string, unknown>) : undefined,
    };

    const serialized = JSON.stringify(record);
    if (level === 'error') {
      console.error(serialized);
    } else if (level === 'warn') {
      console.warn(serialized);
    } else if (level === 'info') {
      console.info(serialized);
    } else {
      console.debug(serialized);
    }
  }

  public debug(message: string, meta?: Record<string, unknown>) {
    this.write('debug', message, meta);
  }

  public info(message: string, meta?: Record<string, unknown>) {
    this.write('info', message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>) {
    this.write('warn', message, meta);
  }

  public error(message: string, meta?: Record<string, unknown>) {
    this.write('error', message, meta);
  }
}
