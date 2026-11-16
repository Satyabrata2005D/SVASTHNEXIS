/**
 * @file tests/concurrency/slot-concurrency.spec.ts
 * Concurrency & Race-Condition Verification Suite for SvasthNexis
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DomainStore } from '../../apps/api/src/store.js';
import { createApp } from '../../apps/api/src/app.js';
import http from 'http';

describe('Concurrency & Atomic Lock Protection Suite', () => {
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

  it('atomically resolves 20 simultaneous hold requests for a single slot: exactly 1 wins, 19 collide with 409', async () => {
    const slotId = 'slot-concurrency-test-01';
    store.state.slots.push({
      id: slotId,
      doctorId: 'usr-doc-sharma',
      facilityId: 'fac-citycare-01',
      startTime: '2026-11-05T09:00:00Z',
      endTime: '2026-11-05T09:30:00Z',
      status: 'AVAILABLE',
    });

    const concurrentRequests = Array.from({ length: 20 }, (_, idx) =>
      fetch(`${baseUrl}/api/v1/slots/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId,
          patientId: `usr-pat-concurrent-${idx}`,
          durationMinutes: 10,
        }),
      })
    );

    const responses = await Promise.all(concurrentRequests);

    const successResponses = responses.filter((r) => r.status === 200);
    const collisionResponses = responses.filter((r) => r.status === 409);

    expect(successResponses.length).toBe(1);
    expect(collisionResponses.length).toBe(19);

    const successBody = (await successResponses[0].json()) as any;
    expect(successBody.success).toBe(true);
  });

  it('prevents over-dispensing when concurrent requests exceed available medication stock', async () => {
    const medName = 'Atorvastatin 20mg';
    store.state.formulary = [
      {
        id: 'form-atorva-conc',
        facilityId: 'fac-citycare-01',
        brandName: medName,
        genericName: 'Atorvastatin',
        dosageForm: 'TABLET',
        strength: '20mg',
        stockQuantity: 5,
        reorderLevel: 2,
        unitPriceMinorUnits: 1500,
        batchNumber: 'BATCH-CONC-01',
        expiryDate: '2027-12-31',
      },
    ];

    const dispenseRequests = Array.from({ length: 10 }, (_, idx) =>
      fetch(`${baseUrl}/api/v1/pharmacy/dispense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionId: `rx-conc-${idx}`,
          medicationName: medName,
          quantity: 1,
          batchNumber: 'BATCH-CONC-01',
        }),
      })
    );

    const responses = await Promise.all(dispenseRequests);
    const bodies = await Promise.all(responses.map((r) => r.json() as Promise<any>));

    const successes = responses.filter((r, idx) => r.status === 200 && bodies[idx].success === true);
    const failures = responses.filter((r, idx) => r.status === 400 || bodies[idx].success === false);

    expect(successes.length).toBe(5);
    expect(failures.length).toBe(5);

    const item = store.state.formulary.find((f) => f.batchNumber === 'BATCH-CONC-01');
    expect(item?.stockQuantity).toBe(0);
  });

  it('enforces single bed occupancy when multiple concurrent admissions target the same bed', async () => {
    const targetBedId = 'bed-icu-race-01';
    store.state.beds.push({
      id: targetBedId,
      facilityId: 'fac-citycare-01',
      ward: 'ICU',
      bedNumber: 'ICU-RACE-01',
      wardType: 'ICU',
      status: 'AVAILABLE',
    });

    const admissionRequests = Array.from({ length: 5 }, (_, idx) =>
      fetch(`${baseUrl}/api/v1/inpatient/admissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: `usr-pat-admission-${idx}`,
          bedId: targetBedId,
          admittingDoctorId: 'usr-doc-sharma',
          primaryDiagnosis: 'Acute Coronary Syndrome',
        }),
      })
    );

    const responses = await Promise.all(admissionRequests);
    const bodies = await Promise.all(responses.map((r) => r.json() as Promise<any>));

    const successes = responses.filter((r, idx) => r.status === 201 && bodies[idx].success === true);
    const failures = responses.filter((r) => r.status === 400);

    expect(successes.length).toBe(1);
    expect(failures.length).toBe(4);

    const finalBed = store.state.beds.find((b) => b.id === targetBedId);
    expect(finalBed?.status).toBe('OCCUPIED');
  });
});
