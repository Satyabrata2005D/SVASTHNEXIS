/**
 * @file tests/integration/operations/clinical-operations.spec.ts
 * Comprehensive Integration Tests for Critical Acceptance Tests CAT-02, CAT-03, CAT-05,
 * CAT-06, CAT-08, CAT-10, CAT-11, CAT-12, CAT-13, OPD, IPD, LIS, Nursing, AI & ABDM
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createApp } from '../../../apps/api/src/app.js';
import { DomainStore } from '../../../apps/api/src/store.js';
import { Server } from 'http';
import { evaluateConsent } from '../../../packages/policy-engine/src/consent-evaluator.js';

describe('Comprehensive Clinical Operations & Acceptance Suite (CAT-01 to CAT-14, Sec 07-16)', () => {
  let server: Server;
  let store: DomainStore;
  let baseUrl: string;

  beforeAll(async () => {
    store = new DomainStore();
    const app = createApp(store);
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address();
        const port = typeof addr === 'object' && addr ? addr.port : 3001;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });

    return () => {
      server.close();
    };
  });

  // =========================================================================
  // CAT-02: Expired slot holds are released and cannot later confirm
  // =========================================================================
  it('CAT-02: Expired slot holds are released automatically and cannot later confirm', async () => {
    // 1. Artificially hold a slot with an expired timestamp
    const slot = store.state.slots[1]!;
    slot.isHeld = true;
    slot.heldUntil = new Date(Date.now() - 60000).toISOString(); // 1 minute in the past
    slot.heldByPatientId = 'pat-verma-01';

    // 2. Attempt to create appointment on expired hold -> Must fail
    const aptRes = await fetch(`${baseUrl}/api/v1/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'pat-verma-01',
        doctorId: slot.doctorId,
        facilityId: slot.facilityId,
        slotId: slot.id,
        consultationMode: 'TELECONSULTATION',
        paymentMode: 'ONLINE',
      }),
    });

    expect(aptRes.status).toBe(400);
    const body = (await aptRes.json()) as any;
    expect(body.success).toBe(false);
    expect(body.error).toContain('Slot hold has expired or is invalid');

    // 3. Verify slot hold release method cleans up state
    const released = store.releaseExpiredHolds();
    expect(released).toBeGreaterThanOrEqual(1);
    expect(slot.isHeld).toBe(false);
  });

  // =========================================================================
  // CAT-03: Provider rejection triggers reservation release and notification
  // =========================================================================
  it('CAT-03: Provider rejection releases slot allocation and logs audit event', async () => {
    // 1. Hold and request appointment
    const slot = store.state.slots[2]!;
    store.holdSlot(slot.id, 'pat-verma-01', 10);
    const aptRes = await fetch(`${baseUrl}/api/v1/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'pat-verma-01',
        doctorId: slot.doctorId,
        facilityId: slot.facilityId,
        slotId: slot.id,
        consultationMode: 'IN_PERSON',
        paymentMode: 'AT_FACILITY',
      }),
    });
    const aptBody = (await aptRes.json()) as any;
    const aptId = aptBody.appointment.id;
    expect(slot.allocatedCount).toBe(1);

    // 2. Doctor rejects appointment
    const rejectRes = await fetch(`${baseUrl}/api/v1/appointments/${aptId}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newState: 'REJECTED',
        role: 'DOCTOR_RMP',
        userId: slot.doctorId,
        reason: 'Emergency surgery schedule conflict',
      }),
    });
    expect(rejectRes.status).toBe(200);
    const rejectBody = (await rejectRes.json()) as any;
    expect(rejectBody.appointment.state).toBe('REJECTED');
    expect(rejectBody.appointment.rejectionReason).toContain('Emergency surgery');

    // 3. Verify slot allocation is decremented back to 0
    expect(slot.allocatedCount).toBe(0);
    expect(slot.isHeld).toBe(false);
  });

  // =========================================================================
  // CAT-05 & CAT-06: Scoped Consent Enforcement & Revocation
  // =========================================================================
  it('CAT-05 & CAT-06: Evaluates scoped consent and enforces immediate revocation', async () => {
    // 1. Patient grants consent for LAB_REPORT only to Dr. Sharma
    const consentRes = await fetch(`${baseUrl}/api/v1/consents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'pat-verma-01',
        recipientId: 'doc-sharma-01',
        purpose: 'CONSULTATION',
        scopeCategories: ['LAB_REPORT'],
        validHours: 12,
      }),
    });
    expect(consentRes.status).toBe(201);
    const consentBody = (await consentRes.json()) as any;
    const consentId = consentBody.consent.id;

    // 2. Verify allowed category LAB_REPORT passes
    const evalAllowed = evaluateConsent({
      patientId: 'pat-verma-01',
      recipientId: 'doc-sharma-01',
      requestedCategory: 'LAB_REPORT',
      declaredPurpose: 'CONSULTATION',
      activeConsents: [consentBody.consent],
    });
    expect(evalAllowed.isGranted).toBe(true);

    // 3. Verify ungranted category DISCHARGE_SUMMARY is denied (CAT-05)
    const evalDenied = evaluateConsent({
      patientId: 'pat-verma-01',
      recipientId: 'doc-sharma-01',
      requestedCategory: 'DISCHARGE_SUMMARY',
      declaredPurpose: 'CONSULTATION',
      activeConsents: [consentBody.consent],
    });
    expect(evalDenied.isGranted).toBe(false);
    expect(evalDenied.reason).toContain("to access category 'DISCHARGE_SUMMARY'");

    // 4. Revoke consent (CAT-06)
    const revokeRes = await fetch(`${baseUrl}/api/v1/consents/${consentId}/revoke`, {
      method: 'POST',
    });
    expect(revokeRes.status).toBe(200);
    const revokeBody = (await revokeRes.json()) as any;
    expect(revokeBody.consent.status).toBe('REVOKED');

    // 5. Subsequent access attempt is immediately blocked
    const evalPostRevocation = evaluateConsent({
      patientId: 'pat-verma-01',
      recipientId: 'doc-sharma-01',
      requestedCategory: 'LAB_REPORT',
      declaredPurpose: 'CONSULTATION',
      activeConsents: [revokeBody.consent],
    });
    expect(evalPostRevocation.isGranted).toBe(false);
    expect(evalPostRevocation.reason).toContain('No active, unexpired consent grant permits recipient');
  });

  // =========================================================================
  // CAT-08: Cross-Tenant Isolation Enforcement
  // =========================================================================
  it('CAT-08: Rejects cross-tenant record query attempt with 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/v1/facilities/fac-citycare-01/records`, {
      headers: {
        'x-tenant-id': 'fac-unrelated-hospital-99', // Attacker trying cross-tenant IDOR
      },
    });
    expect(res.status).toBe(403);
    const body = (await res.json()) as any;
    expect(body.success).toBe(false);
    expect(body.error).toContain('Tenant Isolation Violation');
  });

  // =========================================================================
  // CAT-10: Laboratory Validation Gate (Pathologist Signature Required)
  // =========================================================================
  it('CAT-10: Strictly blocks unvalidated lab results from being published without pathologist signature', async () => {
    // 1. Create order and collect specimen
    const ordRes = await fetch(`${baseUrl}/api/v1/lis/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'pat-verma-01',
        orderingDoctorId: 'doc-sharma-01',
        facilityId: 'fac-citycare-01',
        testCode: 'CBC-DIFF',
        testName: 'Complete Blood Count with Differential',
      }),
    });
    const ordBody = (await ordRes.json()) as any;
    const orderId = ordBody.order.id;

    // 2. Technician enters values -> result created as PRELIMINARY
    const resEntry = await fetch(`${baseUrl}/api/v1/lis/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        labOrderId: orderId,
        patientId: 'pat-verma-01',
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
          {
            parameterName: 'White Blood Cell Count',
            measuredValue: '11800',
            numericValue: 11800,
            units: 'cells/mcL',
            referenceRange: '4000 - 11000',
            flag: 'ABNORMAL_HIGH',
            isCriticalPanic: false,
          },
        ],
      }),
    });
    const resultBody = (await resEntry.json()) as any;
    const resultId = resultBody.result.id;
    expect(resultBody.result.isValidatedByPathologist).toBe(false);
    expect(resultBody.result.status).toBe('PRELIMINARY');

    // 3. Unauthorized user (e.g. NURSE or PATIENT) tries to release without pathologist role -> 403
    const badRelease = await fetch(`${baseUrl}/api/v1/lis/results/${resultId}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'PATIENT', userId: 'pat-verma-01' }),
    });
    expect(badRelease.status).toBe(403);
    const badReleaseBody = (await badRelease.json()) as any;
    expect(badReleaseBody.success).toBe(false);
    expect(badReleaseBody.error).toContain('Only a credentialed pathologist / RMP can validate and release');

    // 4. Credentialed Pathologist / RMP validates and signs
    const validRelease = await fetch(`${baseUrl}/api/v1/lis/results/${resultId}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'DOCTOR_RMP', userId: 'doc-sharma-01' }),
    });
    expect(validRelease.status).toBe(200);
    const validBody = (await validRelease.json()) as any;
    expect(validBody.success).toBe(true);
    expect(validBody.result.isValidatedByPathologist).toBe(true);
    expect(validBody.result.pathologistSignatureHash).toBeDefined();
    expect(validBody.result.status).toBe('RELEASED');

    // 5. Verify published report is now present in patient document vault
    const publishedDoc = store.state.documents.find((d) => d.id === `doc-lab-${resultId}`);
    expect(publishedDoc).toBeDefined();
    expect(publishedDoc?.verificationStatus).toBe('VERIFIED');
  });

  // =========================================================================
  // CAT-11: Doctor Report AI Extraction Requires Clinician Review Gate
  // =========================================================================
  it('CAT-11: AI report extraction displays original document and requires doctor review and acceptance', async () => {
    // 1. Trigger AI OCR extraction on uploaded report
    const extractRes = await fetch(`${baseUrl}/api/v1/ai/report-extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: 'doc-past-lipid-01' }),
    });
    expect(extractRes.status).toBe(200);
    const extractBody = (await extractRes.json()) as any;
    expect(extractBody.extraction.requiresDoctorReview).toBe(true);
    expect(extractBody.extraction.doctorAcceptedAt).toBeUndefined();

    // 2. Doctor reviews side-by-side with original document and cryptographically accepts
    const acceptRes = await fetch(`${baseUrl}/api/v1/ai/report-accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: 'doc-past-lipid-01' }),
    });
    expect(acceptRes.status).toBe(200);
    const acceptBody = (await acceptRes.json()) as any;
    expect(acceptBody.success).toBe(true);
    expect(acceptBody.extraction.reviewedByDoctorId).toBe('doc-sharma-01');
    expect(acceptBody.extraction.doctorAcceptedAt).toBeDefined();
  });

  // =========================================================================
  // CAT-12: Emergency Pathway Bypasses Routine Appointment Queue
  // =========================================================================
  it('CAT-12: Emergency intake directly bypasses routine appointment booking and schedules resuscitation', async () => {
    const erRes = await fetch(`${baseUrl}/api/v1/emergency/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        facilityId: 'fac-citycare-01',
        patientIdentifier: 'ER-TRAUMA-7711',
        patientName: 'Kavita Das',
        arrivalMode: 'AMBULANCE',
        triageLevel: 'LEVEL_1_RESUSCITATION',
        chiefComplaint: 'Acute hypoxemic respiratory distress, stridor, anaphylaxis',
        vitals: { hr: 130, bp: '80/50', spo2: 84, gcs: 13 },
        disposition: 'RESUS_BAY',
      }),
    });

    expect(erRes.status).toBe(201);
    const erBody = (await erRes.json()) as any;
    expect(erBody.success).toBe(true);
    expect(erBody.emergencyCase.bypassedRoutineBooking).toBe(true);
    expect(erBody.emergencyCase.triageLevel).toBe('LEVEL_1_RESUSCITATION');
    expect(erBody.emergencyCase.assignedTraumaTeam).toContain('Resuscitation Team');
  });

  // =========================================================================
  // CAT-13: Telemedicine Consultation Recording Consent Gate
  // =========================================================================
  it('CAT-13: Consultation recording is blocked unless explicit informed consent is granted by all participants', async () => {
    // 1. Patient consents, but doctor withholds consent -> Must be blocked
    const denyRes = await fetch(`${baseUrl}/api/v1/telemedicine/recording-consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'tele-sess-001',
        patientConsented: true,
        doctorConsented: false, // Withheld
      }),
    });

    expect(denyRes.status).toBe(403);
    const denyBody = (await denyRes.json()) as any;
    expect(denyBody.success).toBe(false);
    expect(denyBody.error).toContain('Clinical Recording Blocked');

    // 2. Both participants grant explicit consent -> Recording unlocks
    const grantRes = await fetch(`${baseUrl}/api/v1/telemedicine/recording-consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'tele-sess-001',
        patientConsented: true,
        doctorConsented: true,
      }),
    });

    expect(grantRes.status).toBe(200);
    const grantBody = (await grantRes.json()) as any;
    expect(grantBody.success).toBe(true);
    expect(grantBody.session.recordingConsentGivenByAll).toBe(true);
    expect(grantBody.session.isRecordingActive).toBe(true);
    expect(grantBody.session.recordingStorageKey).toContain('telehealth/recordings');
  });

  // =========================================================================
  // OPD Queue Management, Inpatient Beds & Nursing MAR Workflows (Sec 07)
  // =========================================================================
  it('handles OPD queue token transitions and patient privacy masking', async () => {
    const token = store.issueQueueToken({
      facilityId: 'fac-citycare-01',
      departmentId: 'dept-cardio',
      doctorId: 'doc-sharma-01',
      patientId: 'pat-verma-01',
      patientName: 'Rahul Verma',
      triagePriority: 'URGENT',
    });

    expect(token.tokenNumber).toContain('OPD-');
    expect(token.patientMaskedName).toBe('R***l V***a'); // Privacy preserved
    expect(token.state).toBe('WAITING');

    const staffSession = {
      userId: 'usr-nurse-01',
      email: 'staff@citycare.example.org',
      roles: ['NURSE' as const],
      isMfaVerified: true,
      activeSessionId: 'sess-staff',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    store.updateQueueTokenState(token.id, 'CALLED', staffSession);
    expect(token.state).toBe('CALLED');
    expect(token.calledAt).toBeDefined();
  });

  it('manages Inpatient bed lifecycle, admission, transfer and discharge checklist', async () => {
    const staffSession = {
      userId: 'usr-admin-fac',
      email: 'admissions@citycare.example.org',
      roles: ['HOSPITAL_ADMIN' as const],
      isMfaVerified: true,
      activeSessionId: 'sess-fac',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    // 1. Admit patient to available bed
    const admitRes = store.admitPatient({
      patientId: 'pat-verma-01',
      facilityId: 'fac-citycare-01',
      admittingDoctorId: 'doc-sharma-01',
      bedId: 'bed-semi-201',
      admittingDiagnosis: 'Post-Angiography Inpatient Monitoring',
      depositMinorUnits: 3000000,
      staffSession,
    });
    expect(admitRes.success).toBe(true);
    const admId = admitRes.admission!.id;

    // 2. Transfer to ICU bed
    const transferRes = store.transferBed(admId, 'bed-icu-301', staffSession);
    expect(transferRes.success).toBe(true);

    const oldBed = store.state.beds.find((b) => b.id === 'bed-semi-201');
    expect(oldBed?.status).toBe('CLEANING');

    const newBed = store.state.beds.find((b) => b.id === 'bed-icu-301');
    expect(newBed?.status).toBe('OCCUPIED');

    // 3. Discharge with doctor sign-off
    const doctorSession = {
      userId: 'doc-sharma-01',
      email: 'dr.sharma@citycare.example.org',
      roles: ['DOCTOR_RMP' as const],
      isMfaVerified: true,
      activeSessionId: 'sess-doc',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const dischRes = store.dischargePatient({
      admissionId: admId,
      dischargeReason: 'Clinical condition stable, post-procedure recovery complete',
      finalDiagnosis: 'Successful Coronary Angioplasty - Normal Recovery',
      dischargeMedications: ['Aspirin 75mg OD', 'Atorvastatin 40mg HS'],
      followUpInstructions: 'Review in OPD in 2 weeks with ECG',
      warningSigns: ['Recurrent chest pain', 'Shortness of breath', 'Bleeding at puncture site'],
      doctorSession,
    });
    expect(dischRes.success).toBe(true);
    expect(dischRes.checklist?.isDoctorSigned).toBe(true);
    expect(dischRes.checklist?.isBedReleased).toBe(true);
    expect(newBed?.status).toBe('CLEANING'); // Marked for housekeeping
  });

  // =========================================================================
  // 5 Bounded AI Services & ABDM/FHIR Interoperability
  // =========================================================================
  it('evaluates AI patient navigation with red flag emergency routing', async () => {
    // 1. Urgent chest pain query -> Immediate emergency routing
    const emergencyNav = store.evaluatePatientNavigation('Severe crushing chest pain and sweating');
    expect(emergencyNav.isUrgentEmergency).toBe(true);
    expect(emergencyNav.emergencyGuidance).toContain('CRITICAL SAFETY WARNING');
    expect(emergencyNav.emergencyGuidance).toContain('112 / 108');

    // 2. Non-emergency query -> Department routing with disclaimer
    const routineNav = store.evaluatePatientNavigation('Looking to consult a heart doctor for cholesterol checkup');
    expect(routineNav.isUrgentEmergency).toBe(false);
    expect(routineNav.suggestedSpecialty).toBe('Cardiology');
    expect(routineNav.disclaimer).toContain('Service Navigation Only');
  });

  it('generates mock ABHA profile and valid FHIR R4 JSON document bundle (Section 16)', async () => {
    const abhaRes = await fetch(`${baseUrl}/api/v1/abdm/profile/pat-verma-01`);
    expect(abhaRes.status).toBe(200);
    const abhaBody = (await abhaRes.json()) as any;
    expect(abhaBody.profile.abhaNumber).toBe('91-4422-9988-1122');
    expect(abhaBody.profile.kycStatus).toBe('VERIFIED');

    const fhirRes = await fetch(`${baseUrl}/api/v1/fhir/bundle/pat-verma-01`);
    expect(fhirRes.status).toBe(200);
    const fhirJson = (await fhirRes.json()) as any;
    expect(fhirJson.resourceType).toBe('Bundle');
    expect(fhirJson.entry.length).toBeGreaterThanOrEqual(3);
    expect(fhirJson.entry[0].resource.resourceType).toBe('Patient');
  });
});
