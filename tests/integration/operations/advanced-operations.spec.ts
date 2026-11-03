/**
 * @file tests/integration/operations/advanced-operations.spec.ts
 * Comprehensive Advanced Operations & Phase 2-4 Acceptance Test Suite
 * Verifies P2-07, P2-08, P3-01, P3-03, P3-04, P3-06, P4-04, P4-05, P4-08
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../../../apps/api/src/app.js';
import { DomainStore } from '../../../apps/api/src/store.js';
import { Server } from 'http';

describe('Advanced Operations & Governance Suite (Phases 2 - 4)', () => {
  let server: Server;
  let store: DomainStore;
  let baseUrl: string;

  beforeAll(async () => {
    store = new DomainStore();
    const app = createApp(store);
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address();
        const port = typeof addr === 'object' && addr ? addr.port : 3002;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  // =========================================================================
  // 1. P2-07: PHARMACY FORMULARY & DISPENSING
  // =========================================================================
  describe('P2-07: Pharmacy Formulary & Dispensing', () => {
    it('successfully dispenses in-stock medication and decrements inventory', async () => {
      const initialStock = store.state.formulary[0]!.stockQuantity;
      const res = await fetch(`${baseUrl}/api/v1/pharmacy/dispense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionId: 'rx-7788',
          medicationId: store.state.formulary[0]!.id,
          quantity: 20,
          pharmacistId: 'pharma-lead-01',
          batchNumber: store.state.formulary[0]!.batchNumber,
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.record.itemsDispensed[0].quantity).toBe(20);
      expect(store.state.formulary[0]!.stockQuantity).toBe(initialStock - 20);
    });

    it('blocks dispensing when requested quantity exceeds available stock', async () => {
      const res = await fetch(`${baseUrl}/api/v1/pharmacy/dispense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionId: 'rx-7789',
          medicationId: store.state.formulary[0]!.id,
          quantity: 999999, // Exceeds stock
          pharmacistId: 'pharma-lead-01',
          batchNumber: store.state.formulary[0]!.batchNumber,
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toContain('Insufficient stock');
    });
  });

  // =========================================================================
  // 2. P2-08: INPATIENT BILLING & TARIFF RETENTION
  // =========================================================================
  describe('P2-08: Inpatient Billing & Tariff Snapshots', () => {
    it('calculates total charges, applies approved insurance claim, and retains tariff version', async () => {
      const res = await fetch(`${baseUrl}/api/v1/inpatient/billing/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: 'pat-verma-01',
          admissionId: 'adm-001',
          facilityId: 'fac-city-care-01',
          lineItems: [
            { description: 'ICU Bed (2 Days)', quantity: 2, unitRate: 7500, category: 'BED' },
            { description: 'Consultation', quantity: 2, unitRate: 800, category: 'CONSULTATION' },
          ],
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.invoice.totalAmount).toBe(15000 + 1600); // 16,600
      expect(body.invoice.lineItems[0].tariffVersion).toBe('v1.0-2026');
      expect(body.invoice.status).toBe('ISSUED');
    });
  });

  // =========================================================================
  // 3. P3-01: OT SURGERY & WHO CHECKLIST STATE MACHINE
  // =========================================================================
  describe('P3-01: OT Surgery & WHO Surgical Safety Checklist', () => {
    it('enforces sequential WHO Checklist: Sign-In must precede Time-Out and Sign-Out', async () => {
      // 1. Schedule OT Booking
      const bookRes = await fetch(`${baseUrl}/api/v1/ot/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: 'pat-verma-01',
          facilityId: 'fac-city-care-01',
          otRoom: 'OR-1 (Cardiothoracic)',
          procedureName: 'Coronary Artery Bypass',
          leadSurgeonId: 'doc-sharma-01',
          anesthesiologistId: 'doc-anes-01',
          scheduledTime: new Date(Date.now() + 3600 * 1000).toISOString(),
        }),
      });

      const bookBody = await bookRes.json();
      expect(bookRes.status).toBe(201);
      const bookingId = bookBody.booking.id;

      // 2. Attempt Time-Out before Sign-In -> MUST FAIL
      const failTimeOut = await fetch(`${baseUrl}/api/v1/ot/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          phase: 'TIME_OUT',
          verifiedBy: 'doc-sharma-01',
        }),
      });

      const failBody = await failTimeOut.json();
      expect(failTimeOut.status).toBe(400);
      expect(failBody.error).toContain('WHO Sign-In must precede Time-Out');

      // 3. Complete Sign-In -> Status becomes PRE_OP_CHECK_DONE
      const signInRes = await fetch(`${baseUrl}/api/v1/ot/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          phase: 'SIGN_IN',
          verifiedItems: ['Patient identity', 'Site marked', 'Anesthesia safety check'],
          verifiedBy: 'doc-sharma-01',
        }),
      });

      const signInBody = await signInRes.json();
      expect(signInRes.status).toBe(200);
      expect(signInBody.booking.whoChecklist.signInDone).toBe(true);
      expect(signInBody.booking.status).toBe('PRE_OP_CHECK_DONE');

      // 4. Complete Time-Out -> Status becomes IN_SURGERY
      const timeOutRes = await fetch(`${baseUrl}/api/v1/ot/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          phase: 'TIME_OUT',
          verifiedItems: ['Team introduced', 'Anticipated critical events reviewed'],
          verifiedBy: 'doc-sharma-01',
        }),
      });

      const timeOutBody = await timeOutRes.json();
      expect(timeOutRes.status).toBe(200);
      expect(timeOutBody.booking.status).toBe('IN_SURGERY');

      // 5. Complete Sign-Out -> Status becomes COMPLETED
      const signOutRes = await fetch(`${baseUrl}/api/v1/ot/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          phase: 'SIGN_OUT',
          verifiedItems: ['Instrument counts correct', 'Specimen labelled'],
          verifiedBy: 'doc-sharma-01',
        }),
      });

      const signOutBody = await signOutRes.json();
      expect(signOutRes.status).toBe(200);
      expect(signOutBody.booking.status).toBe('COMPLETED');
    });
  });

  // =========================================================================
  // 4. P3-03: AMBULANCE COORDINATION & TELEMETRY
  // =========================================================================
  describe('P3-03: Ambulance Coordination & GPS Telemetry', () => {
    it('dispatches ambulance and updates live GPS telemetry to ARRIVED_AT_SCENE', async () => {
      const dRes = await fetch(`${baseUrl}/api/v1/ambulance/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callerPhone: '+919988776655',
          pickupLocation: 'Indiranagar 100ft Road, Bengaluru',
          vehicleNumber: 'KA-01-AM-9900',
          crewLeadName: 'Paramedic Ankit R',
          destinationFacilityId: 'fac-city-care-01',
        }),
      });

      const dBody = await dRes.json();
      expect(dRes.status).toBe(201);
      const dispatchId = dBody.dispatch.id;
      expect(dBody.dispatch.status).toBe('DISPATCHED');

      // Update telemetry to arrival (ETA 1 min)
      const telRes = await fetch(`${baseUrl}/api/v1/ambulance/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispatchId,
          latitude: 12.9784,
          longitude: 77.6408,
          estimatedArrivalMins: 1,
        }),
      });

      const telBody = await telRes.json();
      expect(telRes.status).toBe(200);
      expect(telBody.dispatch.status).toBe('ARRIVED_AT_SCENE');
    });
  });

  // =========================================================================
  // 5. P3-04: INSURANCE / TPA CLAIMS MANAGEMENT
  // =========================================================================
  describe('P3-04: Insurance Claims & Cashless Pre-Auth', () => {
    it('submits and adjudicates insurance claim with cashless settlement', async () => {
      const subRes = await fetch(`${baseUrl}/api/v1/insurance/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: 'pat-verma-01',
          facilityId: 'fac-city-care-01',
          payerName: 'HDFC ERGO General Insurance',
          policyNumber: 'POL-HDFC-991283',
          requestedAmountMinorUnits: 4500000,
          copayMinorUnits: 200000,
        }),
      });

      const subBody = await subRes.json();
      expect(subRes.status).toBe(201);
      const claimId = subBody.claim.id;
      expect(subBody.claim.preAuthStatus).toBe('SUBMITTED');

      const adjRes = await fetch(`${baseUrl}/api/v1/insurance/claims/${claimId}/adjudicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'APPROVED',
          approvedAmountMinorUnits: 4300000,
          settlementStatus: 'SETTLED',
        }),
      });

      const adjBody = await adjRes.json();
      expect(adjRes.status).toBe(200);
      expect(adjBody.claim.preAuthStatus).toBe('APPROVED');
      expect(adjBody.claim.settlementStatus).toBe('SETTLED');
    });
  });

  // =========================================================================
  // 6. P3-06: BLOOD BANK & CROSSMATCH RESERVATION
  // =========================================================================
  describe('P3-06: Blood Bank & Crossmatch Reservation', () => {
    it('reserves compatible blood units and decrements inventory', async () => {
      const initialStock = store.state.bloodStock.find((b) => b.bloodGroup === 'O+')!.unitsAvailable;
      const res = await fetch(`${baseUrl}/api/v1/blood-bank/crossmatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: 'pat-verma-01',
          facilityId: 'fac-city-care-01',
          bloodGroup: 'O+',
          unitsRequired: 2,
          crossmatchCompatibility: 'COMPATIBLE',
          requesterId: 'doc-sharma-01',
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.crossmatch.compatibilityResult).toBe('COMPATIBLE');

      const updatedStock = store.state.bloodStock.find((b) => b.bloodGroup === 'O+')!.unitsAvailable;
      expect(updatedStock).toBe(initialStock - 2);
    });

    it('blocks blood reservation when crossmatch compatibility test fails', async () => {
      const res = await fetch(`${baseUrl}/api/v1/blood-bank/crossmatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: 'pat-verma-01',
          facilityId: 'fac-city-care-01',
          bloodGroup: 'O+',
          unitsRequired: 2,
          crossmatchCompatibility: 'INCOMPATIBLE',
          requesterId: 'doc-sharma-01',
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toContain('incompatibility');
    });
  });

  // =========================================================================
  // 7. P4-08: CYBERSECURITY SOC & CERT-IN 6-HOUR DEADLINE
  // =========================================================================
  describe('P4-08: Cybersecurity SOC & CERT-In Incident Reporting', () => {
    it('records high severity security incident and calculates statutory 6-hour CERT-In reporting deadline', async () => {
      const res = await fetch(`${baseUrl}/api/v1/soc/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          severity: 'HIGH',
          incidentType: 'SUSPICIOUS_BULK_EXFILTRATION',
          description: 'Anomalous attempt to download 500 patient discharge summaries across tenant boundary',
          affectedEntities: ['/api/v1/clinical/chart', '/api/v1/documents'],
          detectedBy: 'SOC_AUTOMATION_01',
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.incident.severity).toBe('HIGH');
      expect(body.incident.certInReported).toBe(true);

      const detectedTime = new Date(body.incident.detectedAt).getTime();
      const deadlineTime = new Date(body.incident.certInDeadline).getTime();
      const hoursDiff = (deadlineTime - detectedTime) / (3600 * 1000);
      expect(Math.round(hoursDiff)).toBe(6);
    });
  });

  // =========================================================================
  // 8. P1-04: DOCTOR AFFILIATION APPROVAL BY FACILITY
  // =========================================================================
  describe('P1-04: Doctor Facility Affiliation Approval', () => {
    it('allows hospital authority to approve doctor affiliation with permitted scope', async () => {
      const res = await fetch(`${baseUrl}/api/v1/doctors/doc-sharma-01/affiliations/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facilityId: 'fac-city-care-01',
          approvedBy: 'med-superintendent-01',
          permittedSpecialties: ['Cardiology', 'Electrophysiology'],
        }),
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.affiliation.approvalStatus).toBe('ACTIVE');
    });
  });

  // =========================================================================
  // 9. P4-04 & P4-05: BOUNDED OPERATIONS & SUPPORT AI
  // =========================================================================
  describe('P4-04 & P4-05: Operations Forecast & Support FAQ AI', () => {
    it('returns advisory operations forecast with data confidence and caveats', async () => {
      const res = await fetch(`${baseUrl}/api/v1/ai/forecast?facilityId=fac-city-care-01`);
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.forecast.advisoryNotice).toContain('Operations Advisory');
      expect(body.forecast.predictedOccupancyPercent).toBeGreaterThan(0);
    });

    it('answers non-clinical support FAQ and flags clinical restriction', async () => {
      const res = await fetch(`${baseUrl}/api/v1/ai/support-faq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: 'How can I download my consultation receipt?' }),
      });

      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.response.isClinicalRestricted).toBe(true);
      expect(body.response.matchedAnswer).toContain('Receipt');
    });
  });
});
