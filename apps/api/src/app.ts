/**
 * @file apps/api/src/app.ts
 * Core Modular Monolith API Express Application
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
      database: 'CONNECTED_STORE',
      storage: 'LOCAL_MINIO_CONFIGURED',
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
  // APPOINTMENTS (T-12, T-13, T-14)
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
