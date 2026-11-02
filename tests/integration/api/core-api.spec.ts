import { describe, it, expect, beforeAll } from 'vitest';
import { DomainStore } from '../../../apps/api/src/store.js';
import { createApp } from '../../../apps/api/src/app.js';
import express from 'express';
import http from 'http';

describe('Core Modular API Integration Tests (Phase 1 Baseline)', () => {
  let app: express.Express;
  let server: http.Server;
  let baseUrl: string;
  let store: DomainStore;

  beforeAll(async () => {
    store = new DomainStore();
    app = createApp(store);
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as { port: number };
        baseUrl = `http://localhost:${address.port}`;
        resolve();
      });
    });

    return () => {
      server.close();
    };
  });

  it('GET /health/readiness returns 200 READY', async () => {
    const res = await fetch(`${baseUrl}/health/readiness`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.status).toBe('READY');
  });

  it('POST /api/v1/slots/hold atomically holds slot and prevents double booking (CAT-01)', async () => {
    // First hold succeeds
    const holdRes1 = await fetch(`${baseUrl}/api/v1/slots/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slotId: 'slot-sharma-101',
        patientId: 'pat-verma-01',
      }),
    });
    expect(holdRes1.status).toBe(200);
    const holdBody1 = (await holdRes1.json()) as any;
    expect(holdBody1.success).toBe(true);

    // Second hold on same slot by another patient gets 409 Conflict
    const holdRes2 = await fetch(`${baseUrl}/api/v1/slots/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slotId: 'slot-sharma-101',
        patientId: 'pat-competing-02',
      }),
    });
    expect(holdRes2.status).toBe(409);
    const holdBody2 = (await holdRes2.json()) as any;
    expect(holdBody2.success).toBe(false);
    expect(holdBody2.error).toContain('Concurrency conflict');
  });

  it('handles appointment state machine from REQUESTED to ACCEPTED and CONFIRMED via webhook (T-12, T-13, CAT-04)', async () => {
    // Create appointment from held slot
    const aptRes = await fetch(`${baseUrl}/api/v1/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'pat-verma-01',
        doctorId: 'doc-sharma-01',
        facilityId: 'fac-citycare-01',
        slotId: 'slot-sharma-101',
        consultationMode: 'IN_PERSON',
        paymentMode: 'ONLINE',
        chiefComplaint: 'Chest tightness on exertion',
      }),
    });
    expect(aptRes.status).toBe(201);
    const aptBody = (await aptRes.json()) as any;
    expect(aptBody.appointment.state).toBe('REQUESTED');
    const aptId = aptBody.appointment.id;

    // Doctor accepts appointment
    const acceptRes = await fetch(`${baseUrl}/api/v1/appointments/${aptId}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newState: 'ACCEPTED',
        role: 'DOCTOR_RMP',
        userId: 'doc-sharma-01',
      }),
    });
    expect(acceptRes.status).toBe(200);
    const acceptBody = (await acceptRes.json()) as any;
    expect(acceptBody.appointment.state).toBe('ACCEPTED');

    // Payment webhook received
    const payRes1 = await fetch(`${baseUrl}/api/v1/webhooks/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: 'evt-webhook-999',
        appointmentId: aptId,
        amountMinorUnits: 80000,
        status: 'SUCCESS',
      }),
    });
    expect(payRes1.status).toBe(200);
    const payBody1 = (await payRes1.json()) as any;
    expect(payBody1.isDuplicate).toBe(false);
    expect(payBody1.transaction.state).toBe('CAPTURED');

    // Duplicate webhook received (idempotency check CAT-04)
    const payRes2 = await fetch(`${baseUrl}/api/v1/webhooks/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: 'evt-webhook-999',
        appointmentId: aptId,
        amountMinorUnits: 80000,
        status: 'SUCCESS',
      }),
    });
    expect(payRes2.status).toBe(200);
    const payBody2 = (await payRes2.json()) as any;
    expect(payBody2.isDuplicate).toBe(true); // Must recognize duplicate without re-creating transaction
  });

  it('signs clinical encounter, locks note immutability, and supports amendments (CAT-09)', async () => {
    // 1. Sign encounter
    const signRes = await fetch(`${baseUrl}/api/v1/encounters/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId: store.state.appointments[0]!.id,
        clinicalNotes: 'Initial observation: Stable vitals. ECG normal sinus rhythm.',
        icd10DiagnosisCodes: ['R07.9'],
        prescriptionItems: [
          {
            medicineName: 'Aspirin 75mg',
            genericName: 'Acetylsalicylic acid',
            dosageForm: 'TABLET',
            strength: '75 mg',
            frequency: 'OD after meals',
            durationDays: 14,
          },
        ],
      }),
    });
    expect(signRes.status).toBe(201);
    const signBody = (await signRes.json()) as any;
    expect(signBody.encounter.isSigned).toBe(true);
    expect(signBody.encounter.doctorSignatureHash).toBeDefined();
    expect(signBody.prescription.isSigned).toBe(true);

    const encounterId = signBody.encounter.id;

    // 2. Amend encounter
    const amendRes = await fetch(`${baseUrl}/api/v1/encounters/amend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        encounterId,
        amendmentReason: 'Patient reported aspirin intolerance; switched to clopidogrel',
        correctedNotes: 'Amended: Patient intolerant to aspirin. Prescribed Clopidogrel 75mg.',
      }),
    });
    expect(amendRes.status).toBe(200);
    const amendBody = (await amendRes.json()) as any;
    expect(amendBody.amendment.amendmentReason).toContain('aspirin intolerance');
    expect(amendBody.amendment.signatureHash).toBeDefined();

    // Verify original encounter status changed to AMENDED but original text preserved
    const enc = store.state.encounters.find((e) => e.id === encounterId);
    expect(enc?.status).toBe('AMENDED');
    expect(enc?.clinicalNotes).toContain('Initial observation: Stable vitals');
  });

  it('enforces RBAC blocking Customer Care from patient clinical charts (CAT-07)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/clinical/chart?role=CUSTOMER_CARE`);
    expect(res.status).toBe(403);
    const body = (await res.json()) as any;
    expect(body.success).toBe(false);
    expect(body.error).toContain("explicitly denied for role 'CUSTOMER_CARE'");
  });

  it('maintains tamper-evident SHA-256 chain across all actions', async () => {
    const res = await fetch(`${baseUrl}/api/v1/audit`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.integrity.isValid).toBe(true);
    expect(body.count).toBeGreaterThan(5);
  });
});

