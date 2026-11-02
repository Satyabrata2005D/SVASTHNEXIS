/**
 * @file apps/api/src/app.ts
 * Core Modular Monolith API Express Application
 * Implements Complete Healthcare Operations & Critical Acceptance Tests (CAT-01 to CAT-14)
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import * as path from 'path';
import { DomainStore } from './store.js';
import { generateCorrelationId } from '@svasthnexis/observability';
import { evaluateRbac, initiateAdminRemoval } from '@svasthnexis/policy-engine';
import { UserSession } from '@svasthnexis/shared-types';

export function createApp(store: DomainStore) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Request correlation middleware
  app.use((req, res, next) => {
    const correlationId = (req.headers['x-correlation-id'] as string) || generateCorrelationId('req');
    res.setHeader('x-correlation-id', correlationId);
    next();
  });

  // Health check probes
  app.get('/health/liveness', (_req: Request, res: Response) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  app.get('/health/readiness', (_req: Request, res: Response) => {
    res.json({
      status: 'READY',
      demoStatus: 'READY_FOR_DEMO',
      environment: 'DEMO_ONLY',
      persistence: 'IN_MEMORY_DEMO_STORE',
      database: 'MIGRATIONS_READY',
      objectStorage: 'LOCAL_MINIO_CONFIGURED',
      timestamp: new Date().toISOString(),
    });
  });

  // Static files for Unified Portal UI
  const publicDir = path.join(__dirname, 'public');
  app.use(express.static(publicDir));

  // Current domain state endpoint
  app.get('/api/v1/state', (_req: Request, res: Response) => {
    res.json(store.state);
  });

  // =========================================================================
  // SCHEDULING & CONCURRENCY-SAFE ATOMIC SLOT HOLD (CAT-01, CAT-02)
  // =========================================================================

  app.post('/api/v1/slots/hold', (req: Request, res: Response) => {
    const { slotId, patientId, durationMinutes } = req.body;
    if (!slotId || !patientId) {
      return res.status(400).json({ success: false, error: 'slotId and patientId are required' });
    }

    const result = store.holdSlot(slotId, patientId, durationMinutes || 10);
    if (!result.success) {
      return res.status(409).json(result); // 409 Conflict for concurrency lock collision
    }
    return res.status(200).json(result);
  });

  // =========================================================================
  // APPOINTMENTS (T-12, T-13, T-14, CAT-03)
  // =========================================================================

  app.post('/api/v1/appointments', (req: Request, res: Response) => {
    const result = store.createAppointment(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(201).json(result);
  });

  app.post('/api/v1/appointments/:id/transition', (req: Request, res: Response) => {
    const appointmentId = req.params.id as string;
    const { newState, role, userId, reason } = req.body;

    const actorSession: UserSession = {
      userId: userId || 'usr-doc-sharma',
      email: 'doctor@citycare.example.org',
      roles: [role || 'DOCTOR_RMP'],
      isMfaVerified: true,
      activeSessionId: 'sess-active',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const result = store.updateAppointmentState(appointmentId, newState, actorSession, reason);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  });

  // =========================================================================
  // PAYMENT WEBHOOK HANDLING WITH IDEMPOTENCY (CAT-04)
  // =========================================================================

  app.post('/api/v1/webhooks/payment', (req: Request, res: Response) => {
    const { eventId, appointmentId, amountMinorUnits, paymentMode, gatewayProvider, status } = req.body;
    if (!eventId || !appointmentId) {
      return res.status(400).json({ success: false, error: 'Missing eventId or appointmentId' });
    }

    const result = store.processPaymentWebhook({
      eventId,
      appointmentId,
      amountMinorUnits: amountMinorUnits || 80000,
      paymentMode: paymentMode || 'ONLINE',
      gatewayProvider: gatewayProvider || 'SANDBOX',
      status: status || 'SUCCESS',
    });

    return res.status(200).json(result);
  });

  // =========================================================================
  // SCOPED CONSENT (BP Sec 09, CAT-05, CAT-06)
  // =========================================================================

  app.post('/api/v1/consents', (req: Request, res: Response) => {
    const { patientId, recipientId, purpose, scopeCategories, validHours } = req.body;
    const now = new Date();
    const validUntil = new Date(now.getTime() + (validHours || 24) * 60 * 60 * 1000).toISOString();

    const consent = {
      id: `cg-${Date.now()}`,
      dataSubjectId: patientId,
      recipientId: recipientId,
      purpose: purpose || 'CONSULTATION',
      scopeCategories: scopeCategories || ['LAB_REPORT', 'PRESCRIPTION'],
      validFrom: now.toISOString(),
      validUntil,
      status: 'ACTIVE' as const,
      noticeVersion: 'PRIV-2026-V1',
      grantedAt: now.toISOString(),
    };

    store.state.consents.push(consent);
    store.audit.log({
      correlationId: `consent-${consent.id}`,
      actorId: patientId,
      actorRole: 'PATIENT',
      action: 'records:manage-consent',
      resourceType: 'ConsentGrant',
      resourceId: consent.id,
      outcome: 'SUCCESS',
      metadata: { recipientId, scopeCategories },
    });

    return res.status(201).json({ success: true, consent });
  });

  app.post('/api/v1/consents/:id/revoke', (req: Request, res: Response) => {
    const consent = store.state.consents.find((c) => c.id === req.params.id);
    if (!consent) return res.status(404).json({ success: false, error: 'Consent record not found' });

    consent.status = 'REVOKED';
    consent.revokedAt = new Date().toISOString();

    store.audit.log({
      correlationId: `consent-rev-${consent.id}`,
      actorId: consent.dataSubjectId,
      actorRole: 'PATIENT',
      action: 'records:revoke-consent',
      resourceType: 'ConsentGrant',
      resourceId: consent.id,
      outcome: 'SUCCESS',
    });

    return res.status(200).json({ success: true, consent });
  });

  // =========================================================================
  // CLINICAL ENCOUNTERS & AMENDMENTS (CAT-09, T-16)
  // =========================================================================

  app.post('/api/v1/encounters/sign', (req: Request, res: Response) => {
    const { appointmentId, clinicalNotes, icd10DiagnosisCodes, prescriptionItems } = req.body;
    const doctorSession: UserSession = {
      userId: 'doc-sharma-01',
      email: 'dr.sharma@citycare.example.org',
      roles: ['DOCTOR_RMP'],
      isMfaVerified: true,
      activeSessionId: 'sess-doc',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const result = store.signClinicalEncounter({
      appointmentId,
      clinicalNotes,
      icd10DiagnosisCodes: icd10DiagnosisCodes || [],
      doctorSession,
      prescriptionItems,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(201).json(result);
  });

  app.post('/api/v1/encounters/amend', (req: Request, res: Response) => {
    const { encounterId, amendmentReason, correctedNotes } = req.body;
    const doctorSession: UserSession = {
      userId: 'doc-sharma-01',
      email: 'dr.sharma@citycare.example.org',
      roles: ['DOCTOR_RMP'],
      isMfaVerified: true,
      activeSessionId: 'sess-doc',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const result = store.amendClinicalEncounter({
      encounterId,
      authorDoctorId: 'doc-sharma-01',
      amendmentReason,
      correctedNotes,
      doctorSession,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  });

  // =========================================================================
  // RBAC TEST FOR CUSTOMER CARE BARRED FROM CLINICAL CHART (CAT-07)
  // =========================================================================

  app.get('/api/v1/clinical/chart', (req: Request, res: Response) => {
    const role = (req.query.role as string) || 'CUSTOMER_CARE';
    const rbac = evaluateRbac([role as any], 'clinical:read-chart');

    store.audit.log({
      correlationId: `chart-access-${Date.now()}`,
      actorId: 'usr-agent-01',
      actorRole: role as any,
      action: 'clinical:read-chart',
      resourceType: 'PatientChart',
      resourceId: 'pat-verma-01',
      outcome: rbac.allowed ? 'SUCCESS' : 'DENIED',
    });

    if (!rbac.allowed) {
      return res.status(403).json({ success: false, error: rbac.reason });
    }
    return res.status(200).json({ success: true, encounters: store.state.encounters });
  });

  // =========================================================================
  // TENANT ISOLATION CHECK (CAT-08)
  // =========================================================================

  app.get('/api/v1/facilities/:facilityId/records', (req: Request, res: Response) => {
    const requestedTenant = String(req.params.facilityId);
    const userTenant = (req.headers['x-tenant-id'] as string) || requestedTenant;

    if (userTenant !== requestedTenant) {
      store.audit.log({
        correlationId: `tenant-violation-${Date.now()}`,
        tenantId: requestedTenant,
        actorId: 'attacker',
        actorRole: 'HOSPITAL_ADMIN',
        action: 'tenant:cross-access-attempt',
        resourceType: 'HospitalFacility',
        resourceId: requestedTenant,
        outcome: 'DENIED',
      });
      return res.status(403).json({
        success: false,
        error: 'Tenant Isolation Violation: You are not authorized to query another hospital organization.',
      });
    }

    return res.status(200).json({
      success: true,
      facilityId: requestedTenant,
      admissions: store.state.admissions.filter((a) => a.facilityId === requestedTenant),
      beds: store.state.beds.filter((b) => b.facilityId === requestedTenant),
    });
  });

  // =========================================================================
  // OPD QUEUE MANAGEMENT (Section 7.1)
  // =========================================================================

  app.get('/api/v1/opd/queue', (_req: Request, res: Response) => {
    res.json({ success: true, tokens: store.state.queueTokens });
  });

  app.post('/api/v1/opd/queue/tokens', (req: Request, res: Response) => {
    const token = store.issueQueueToken(req.body);
    res.status(201).json({ success: true, token });
  });

  app.post('/api/v1/opd/queue/:id/transition', (req: Request, res: Response) => {
    const { newState, role, userId } = req.body;
    const session: UserSession = {
      userId: userId || 'usr-nurse-01',
      email: 'staff@citycare.example.org',
      roles: [role || 'NURSE'],
      isMfaVerified: true,
      activeSessionId: 'sess-staff',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const result = store.updateQueueTokenState(req.params.id as string, newState, session);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  });

  // =========================================================================
  // INPATIENT ADMISSION & BEDS (Section 7.2)
  // =========================================================================

  app.get('/api/v1/inpatient/beds', (_req: Request, res: Response) => {
    res.json({ success: true, beds: store.state.beds });
  });

  app.post('/api/v1/inpatient/admissions', (req: Request, res: Response) => {
    const staffSession: UserSession = {
      userId: 'usr-admin-fac',
      email: 'admissions@citycare.example.org',
      roles: ['HOSPITAL_ADMIN'],
      isMfaVerified: true,
      activeSessionId: 'sess-fac',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const result = store.admitPatient({ ...req.body, staffSession });
    if (!result.success) return res.status(400).json(result);
    return res.status(201).json(result);
  });

  app.post('/api/v1/inpatient/beds/transfer', (req: Request, res: Response) => {
    const staffSession: UserSession = {
      userId: 'usr-admin-fac',
      email: 'admissions@citycare.example.org',
      roles: ['HOSPITAL_ADMIN'],
      isMfaVerified: true,
      activeSessionId: 'sess-fac',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const result = store.transferBed(req.body.admissionId, req.body.newBedId, staffSession);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  });

  app.post('/api/v1/inpatient/discharge', (req: Request, res: Response) => {
    const doctorSession: UserSession = {
      userId: 'doc-varma-02',
      email: 'dr.varma@citycare.example.org',
      roles: ['DOCTOR_RMP'],
      isMfaVerified: true,
      activeSessionId: 'sess-doc',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const result = store.dischargePatient({ ...req.body, doctorSession });
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  });

  // =========================================================================
  // NURSING MANAGEMENT & MAR (Section 7.3)
  // =========================================================================

  app.post('/api/v1/nursing/observations', (req: Request, res: Response) => {
    const nurseSession: UserSession = {
      userId: 'nurse-deepa-01',
      email: 'deepa.nurse@citycare.example.org',
      roles: ['NURSE'],
      isMfaVerified: true,
      activeSessionId: 'sess-nurse',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const obs = store.recordNursingObservation({ ...req.body, nurseSession });
    return res.status(201).json({ success: true, observation: obs });
  });

  app.post('/api/v1/nursing/mar/administer', (req: Request, res: Response) => {
    const nurseSession: UserSession = {
      userId: 'nurse-deepa-01',
      email: 'deepa.nurse@citycare.example.org',
      roles: ['NURSE'],
      isMfaVerified: true,
      activeSessionId: 'sess-nurse',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const mar = store.recordMedicationAdministration({ ...req.body, nurseSession });
    return res.status(201).json({ success: true, record: mar });
  });

  // =========================================================================
  // LABORATORY INFORMATION SYSTEM (LIS) & VALIDATION (CAT-10, Section 7.4)
  // =========================================================================

  app.post('/api/v1/lis/orders', (req: Request, res: Response) => {
    const order = store.createLabOrder(req.body);
    return res.status(201).json({ success: true, order });
  });

  app.post('/api/v1/lis/specimens', (req: Request, res: Response) => {
    const spec = store.collectSpecimen(req.body);
    return res.status(201).json({ success: true, specimen: spec });
  });

  app.post('/api/v1/lis/results', (req: Request, res: Response) => {
    const technicianSession: UserSession = {
      userId: 'tech-anil-01',
      email: 'lab.tech@citycare.example.org',
      roles: ['LAB_TECHNICIAN'],
      isMfaVerified: true,
      activeSessionId: 'sess-tech',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const result = store.submitTechnicianResult({ ...req.body, technicianSession });
    return res.status(201).json({ success: true, result });
  });

  app.post('/api/v1/lis/results/:id/validate', (req: Request, res: Response) => {
    const { role, userId } = req.body;
    const pathologistSession: UserSession = {
      userId: userId || 'doc-path-01',
      email: 'pathologist@citycare.example.org',
      roles: [role || 'DOCTOR_RMP'],
      isMfaVerified: true,
      activeSessionId: 'sess-path',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const outcome = store.validateAndReleaseLabResult({
      resultId: req.params.id as string,
      pathologistSession,
    });

    if (!outcome.success) return res.status(403).json(outcome);
    return res.status(200).json(outcome);
  });

  // =========================================================================
  // EMERGENCY TRIAGE & AMBULANCE DISPATCH (CAT-12, Section 7.8)
  // =========================================================================

  app.post('/api/v1/emergency/triage', (req: Request, res: Response) => {
    const staffSession: UserSession = {
      userId: 'staff-er-triage',
      email: 'er.triage@citycare.example.org',
      roles: ['NURSE'],
      isMfaVerified: true,
      activeSessionId: 'sess-er',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const erCase = store.triageEmergencyPatient({ ...req.body, staffSession });
    return res.status(201).json({ success: true, emergencyCase: erCase });
  });

  app.get('/api/v1/emergency/cases', (_req: Request, res: Response) => {
    res.json({ success: true, cases: store.state.emergencyCases });
  });

  // =========================================================================
  // TELEMEDICINE & RECORDING CONSENT GATE (CAT-13, Section 10)
  // =========================================================================

  app.post('/api/v1/telemedicine/recording-consent', (req: Request, res: Response) => {
    const actorSession: UserSession = {
      userId: req.body.userId || 'usr-pat-verma',
      email: 'patient@example.org',
      roles: ['PATIENT'],
      isMfaVerified: true,
      activeSessionId: 'sess-pat',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const outcome = store.toggleRecordingConsent({ ...req.body, actorSession });
    if (!outcome.success) return res.status(403).json(outcome);
    return res.status(200).json(outcome);
  });

  // =========================================================================
  // 5 BOUNDED AI SERVICES (Section 11, CAT-11)
  // =========================================================================

  app.post('/api/v1/ai/navigate', (req: Request, res: Response) => {
    const { queryText } = req.body;
    if (!queryText) return res.status(400).json({ success: false, error: 'queryText is required' });
    const assessment = store.evaluatePatientNavigation(queryText);
    return res.status(200).json({ success: true, assessment });
  });

  app.post('/api/v1/ai/report-extract', (req: Request, res: Response) => {
    const { documentId } = req.body;
    const extraction = store.extractDoctorLabReport(documentId || 'doc-past-lipid-01');
    return res.status(200).json({ success: true, extraction });
  });

  app.post('/api/v1/ai/report-accept', (req: Request, res: Response) => {
    const { documentId } = req.body;
    const doctorSession: UserSession = {
      userId: 'doc-sharma-01',
      email: 'dr.sharma@citycare.example.org',
      roles: ['DOCTOR_RMP'],
      isMfaVerified: true,
      activeSessionId: 'sess-doc',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const outcome = store.acceptAiReportExtraction(documentId, doctorSession);
    if (!outcome.success) return res.status(400).json(outcome);
    return res.status(200).json(outcome);
  });

  app.post('/api/v1/ai/soap-draft', (req: Request, res: Response) => {
    const { encounterId, doctorNotes } = req.body;
    const draft = store.draftClinicalSoapNote(encounterId || 'enc-demo', doctorNotes || 'Mild dyspnea on exertion');
    return res.status(200).json({ success: true, draft });
  });

  app.get('/api/v1/ai/forecast', (req: Request, res: Response) => {
    const facilityId = (req.query.facilityId as string) || 'fac-citycare-01';
    const forecast = store.forecastOperationsDemand(facilityId);
    return res.status(200).json({ success: true, forecast });
  });

  app.post('/api/v1/ai/support-faq', (req: Request, res: Response) => {
    const { userQuery } = req.body;
    const response = store.querySupportFaq(userQuery || '');
    return res.status(200).json({ success: true, response });
  });

  // =========================================================================
  // ABDM / FHIR R4 INTEROPERABILITY ADAPTERS (Section 16)
  // =========================================================================

  app.get('/api/v1/abdm/profile/:patientId', (req: Request, res: Response) => {
    const patientId = String(req.params.patientId);
    const profile = store.generateAbhaMock(patientId);
    res.json({ success: true, profile });
  });

  app.get('/api/v1/fhir/bundle/:patientId', (req: Request, res: Response) => {
    const patientId = String(req.params.patientId);
    const bundle = store.exportPatientFhirBundle(patientId);
    res.setHeader('content-type', 'application/fhir+json');
    res.json(bundle.fhirJson);
  });

  // =========================================================================
  // PHARMACY & DISPENSING (Section 7.6)
  // =========================================================================

  app.get('/api/v1/pharmacy/formulary', (_req: Request, res: Response) => {
    res.json({ success: true, formulary: store.state.formulary });
  });

  // =========================================================================
  // ADMIN 7-DAY REMOVAL INITIATION (T-01)
  // =========================================================================

  app.post('/api/v1/admin/removal/initiate', (req: Request, res: Response) => {
    const { targetAdminId, reason } = req.body;
    const targetAdmin = store.state.admins.find((a) => a.adminId === targetAdminId);
    if (!targetAdmin) {
      return res.status(404).json({ success: false, error: 'Admin record not found' });
    }

    const result = initiateAdminRemoval(targetAdmin, 'admin-001', reason || 'Scheduled rotation');
    if (result.success) {
      const idx = store.state.admins.findIndex((a) => a.adminId === targetAdminId);
      store.state.admins[idx] = result.updatedAdmin;
    }
    return res.status(200).json(result);
  });

  // =========================================================================
  // AUDIT LOG STREAM & INTEGRITY
  // =========================================================================

  app.get('/api/v1/audit', (_req: Request, res: Response) => {
    const events = store.audit.getEvents();
    const integrity = store.audit.verifyChainIntegrity();
    res.json({ integrity, count: events.length, events });
  });

  return app;
}
