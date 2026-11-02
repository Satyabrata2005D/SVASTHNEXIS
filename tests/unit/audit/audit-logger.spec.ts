import { describe, it, expect } from 'vitest';
import { AuditLogEngine } from '../../../packages/audit/src/index.js';

describe('AuditLogEngine (BP Sec 09, Sec 19, NFR-04)', () => {
  it('appends audit events and maintains cryptographic SHA-256 chain continuity', () => {
    const engine = new AuditLogEngine();

    const event1 = engine.log({
      correlationId: 'req-001',
      tenantId: 'facility-city-care',
      actorId: 'doc-001',
      actorRole: 'DOCTOR_RMP',
      action: 'clinical:read-chart',
      resourceType: 'PatientRecord',
      resourceId: 'pat-001',
      declaredPurpose: 'CONSULTATION',
      outcome: 'SUCCESS',
    });

    const event2 = engine.log({
      correlationId: 'req-002',
      tenantId: 'facility-city-care',
      actorId: 'doc-001',
      actorRole: 'DOCTOR_RMP',
      action: 'clinical:sign-note',
      resourceType: 'ClinicalEncounter',
      resourceId: 'enc-001',
      outcome: 'SUCCESS',
    });

    expect(event1.eventHash).toBeDefined();
    expect(event2.previousEventHash).toBe(event1.eventHash);

    const integrityCheck = engine.verifyChainIntegrity();
    expect(integrityCheck.isValid).toBe(true);
  });

  it('detects tampering or altered historical events in the audit chain', () => {
    const engine = new AuditLogEngine();

    engine.log({
      correlationId: 'req-001',
      actorId: 'admin-01',
      actorRole: 'PLATFORM_ADMIN',
      action: 'platform:configure',
      resourceType: 'SystemConfig',
      resourceId: 'global-settlement',
      outcome: 'SUCCESS',
    });

    engine.log({
      correlationId: 'req-002',
      actorId: 'admin-01',
      actorRole: 'PLATFORM_ADMIN',
      action: 'platform:admin-lifecycle',
      resourceType: 'PlatformAdmin',
      resourceId: 'admin-02',
      outcome: 'SUCCESS',
    });

    // Tamper with an event in memory
    const mutableEvents = (engine as unknown as { events: Array<{ action: string }> }).events;
    mutableEvents[0]!.action = 'MALICIOUS_TAMPERED_ACTION';

    const integrityCheck = engine.verifyChainIntegrity();
    expect(integrityCheck.isValid).toBe(false);
    expect(integrityCheck.brokenAtIndex).toBe(0);
  });
});

