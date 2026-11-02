/**
 * @file packages/observability/src/correlation.ts
 * Distributed Request Correlation ID Utilities
 */

import * as crypto from 'crypto';

export function generateCorrelationId(prefix = 'req'): string {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

