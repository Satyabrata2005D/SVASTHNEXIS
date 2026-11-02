import { describe, it, expect, vi } from 'vitest';
import { StructuredLogger, generateCorrelationId } from '../../../packages/observability/src/index.js';

describe('StructuredLogger & Scrubbing (BP Sec 20.3, NFR-05)', () => {
  it('generates unique correlation IDs with prefix', () => {
    const corrId1 = generateCorrelationId('req');
    const corrId2 = generateCorrelationId('req');
    expect(corrId1).toMatch(/^req-\d+-[0-9a-f]+$/);
    expect(corrId1).not.toBe(corrId2);
  });

  it('scrubs sensitive credentials, tokens, and clinical narratives from logs', () => {
    const logger = new StructuredLogger('TestService');
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    logger.info('User authenticated', {
      correlationId: 'req-001',
      userId: 'usr-123',
      password: 'PlainSecretPassword123!',
      jwt: 'header.payload.signature',
      clinicalNotes: 'Confidential patient psychiatric narrative',
      safeField: 'harmless_metric',
    });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const loggedJson = JSON.parse(consoleSpy.mock.calls[0]![0] as string);

    expect(loggedJson.context.password).toBe('[REDACTED_SENSITIVE_DATA]');
    expect(loggedJson.context.jwt).toBe('[REDACTED_SENSITIVE_DATA]');
    expect(loggedJson.context.clinicalNotes).toBe('[REDACTED_SENSITIVE_DATA]');
    expect(loggedJson.context.safeField).toBe('harmless_metric');

    consoleSpy.mockRestore();
  });
});

