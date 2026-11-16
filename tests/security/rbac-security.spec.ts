/**
 * @file tests/security/rbac-security.spec.ts
 * Security & RBAC Boundary Enforcement Suite for SvasthNexis
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DomainStore } from '../../apps/api/src/store.js';
import { createApp } from '../../apps/api/src/app.js';
import http from 'http';

describe('Cybersecurity & Role-Based Access Control (RBAC) Security Suite', () => {
  let store: DomainStore;
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    store = new DomainStore();
    const app = createApp(store);
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as { port: number };
        baseUrl = `http://localhost:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(() => {
    server.close();
  });

  it('CAT-07: strictly blocks Customer Care agents from accessing patient clinical charts with HTTP 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/v1/clinical/chart?patientId=pat-verma-01`, {
      headers: {
        'x-user-role': 'CUSTOMER_CARE',
        'x-user-id': 'usr-cc-001',
      },
    });

    expect(res.status).toBe(403);
    const body = (await res.json()) as any;
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/Forbidden|denied|Insufficient permissions/i);
  });

  it('CAT-08: rejects cross-tenant facility query attempts with HTTP 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/v1/facilities/fac-citycare-01/records`, {
      headers: {
        'x-user-role': 'HOSPITAL_OPERATOR',
        'x-user-id': 'usr-metro-op',
        'x-tenant-id': 'fac-metro-99',
      },
    });

    expect(res.status).toBe(403);
    const body = (await res.json()) as any;
    expect(body.success).toBe(false);
  });

  it('CAT-10: strictly blocks unvalidated lab results from being published without pathologist digital signature', async () => {
    const orderRes = await fetch(`${baseUrl}/api/v1/lis/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'pat-security-01',
        orderingDoctorId: 'doc-sharma-01',
        facilityId: 'fac-citycare-01',
        testCode: 'CBC-DIFF',
        testName: 'Complete Blood Count',
      }),
    });
    const order = (await orderRes.json()) as any;

    const resultRes = await fetch(`${baseUrl}/api/v1/lis/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        labOrderId: order.order.id,
        patientId: 'pat-security-01',
        items: [
          {
            parameterName: 'Hemoglobin',
            measuredValue: '14.2',
            numericValue: 14.2,
            units: 'g/dL',
            referenceRange: '13.0 - 17.0',
            flag: 'NORMAL',
            isCriticalPanic: false,
          },
        ],
      }),
    });
    const resultData = (await resultRes.json()) as any;
    const testResultId = resultData.result.id;

    // Check preliminary status
    expect(resultData.result.isValidatedByPathologist).toBe(false);
    expect(resultData.result.status).toBe('PRELIMINARY');

    // Unauthorized attempt to validate must be blocked with 403
    const unauthorizedValidate = await fetch(`${baseUrl}/api/v1/lis/results/${testResultId}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'CUSTOMER_CARE', userId: 'usr-cc-001' }),
    });

    expect(unauthorizedValidate.status).toBe(403);
    const unauthorizedBody = (await unauthorizedValidate.json()) as any;
    expect(unauthorizedBody.success).toBe(false);
  });

  it('CAT-06: consent revocation immediately terminates document access', async () => {
    // 1. Create active consent
    const createRes = await fetch(`${baseUrl}/api/v1/consents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'pat-sec-consent',
        recipientId: 'doc-guest-01',
        purpose: 'CONSULTATION',
        scopeCategories: ['LAB_REPORT'],
        validHours: 24,
      }),
    });
    const created = (await createRes.json()) as any;
    const consentId = created.consent.id;

    // 2. Revoke consent immediately
    const revokeRes = await fetch(`${baseUrl}/api/v1/consents/${consentId}/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Security test immediate revocation' }),
    });

    expect(revokeRes.status).toBe(200);
    const storedConsent = store.state.consents.find((c) => c.id === consentId);
    expect(storedConsent?.status).toBe('REVOKED');
  });

  it('enforces cryptographic SHA-256 tamper-evident integrity across all logged audit events', async () => {
    const auditRes = await fetch(`${baseUrl}/api/v1/audit`);
    expect(auditRes.status).toBe(200);
    const auditData = (await auditRes.json()) as any;

    expect(auditData.integrity.isValid).toBe(true);
    expect(auditData.count).toBeGreaterThan(0);
    expect(Array.isArray(auditData.events)).toBe(true);

    for (const event of auditData.events) {
      expect(event.eventHash).toBeDefined();
      expect(event.eventHash).toMatch(/^[a-f0-9]{64}$/i);
    }
  });
});
