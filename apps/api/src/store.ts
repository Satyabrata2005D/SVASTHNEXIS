/**
 * @file apps/api/src/store.ts
 * In-Memory Transactional Domain Store & State Machine Manager
 * Initialized with verified Stage 0 fixtures from @svasthnexis/test-fixtures
 */

import {
  UserSession,
  PlatformAdminLifecycle,
  HospitalFacility,
  DoctorProfile,
  DoctorAffiliation,
  DoctorScheduleSlot,
  Appointment,
  AppointmentState,
  MedicalDocument,
  ConsentGrant,
  ClinicalEncounter,
  ClinicalAmendment,
  Prescription,
  PaymentTransaction,
  SupportTicket,
} from '@svasthnexis/shared-types';
import { AuditLogEngine } from '@svasthnexis/audit';
import {
  DEMO_FACILITY,
  DEMO_DOCTORS,
  DEMO_AFFILIATIONS,
  DEMO_SLOTS,
  DEMO_PATIENTS,
} from '@svasthnexis/test-fixtures';
import { evaluateRbac } from '@svasthnexis/policy-engine';
import * as crypto from 'crypto';

export interface AppState {
  admins: PlatformAdminLifecycle[];
  facilities: HospitalFacility[];
  doctors: DoctorProfile[];
  affiliations: DoctorAffiliation[];
  slots: DoctorScheduleSlot[];
  appointments: Appointment[];
  documents: MedicalDocument[];
  consents: ConsentGrant[];
  encounters: ClinicalEncounter[];
  amendments: ClinicalAmendment[];
  prescriptions: Prescription[];
  payments: PaymentTransaction[];
  tickets: SupportTicket[];
  idempotencyKeys: Set<string>;
}

export class DomainStore {
  public state: AppState;
  public audit: AuditLogEngine;

  constructor() {
    this.audit = new AuditLogEngine();
    this.state = {
      admins: [
        {
          adminId: 'admin-001',
          userId: 'usr-admin-01',
          status: 'ACTIVE',
          appointedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          adminId: 'admin-002',
          userId: 'usr-admin-02',
          status: 'ACTIVE',
          appointedAt: '2026-02-01T00:00:00.000Z',
        },
      ],
      facilities: [{ ...DEMO_FACILITY }],
      doctors: [...DEMO_DOCTORS],
      affiliations: [...DEMO_AFFILIATIONS],
      slots: [...DEMO_SLOTS],
      appointments: [],
      documents: [
        {
          id: 'doc-past-lipid-01',
          patientId: DEMO_PATIENTS[0]!.id,
          title: 'Lipid Profile Comprehensive Report',
          category: 'LAB_REPORT',
          mimeType: 'application/pdf',
          fileSizeBytes: 245800,
          storageKey: 'quarantine/lipid-profile-2025.pdf',
          documentDate: '2025-10-12',
          source: 'PATIENT_UPLOADED',
          verificationStatus: 'VERIFIED',
          version: 1,
          isArchived: false,
          createdAt: '2026-01-15T10:00:00.000Z',
        },
      ],
      consents: [],
      encounters: [],
      amendments: [],
      prescriptions: [],
      payments: [],
      tickets: [
        {
          id: 'tkt-001',
          requesterId: 'usr-pat-verma',
          category: 'BOOKING',
          severity: 'MEDIUM',
          status: 'TRIAGED',
          assignedQueue: 'CUSTOMER_CARE',
          title: 'Reschedule request for upcoming appointment',
          description: 'Patient requested guidance on changing slot timing.',
          slaDueAt: '2026-11-03T18:00:00.000Z',
          createdAt: '2026-11-02T10:00:00.000Z',
          updatedAt: '2026-11-02T10:30:00.000Z',
        },
      ],
      idempotencyKeys: new Set<string>(),
    };

    // Log Genesis Event
    this.audit.log({
      correlationId: 'genesis-boot',
      actorId: 'system',
      actorRole: 'PLATFORM_ADMIN',
      action: 'platform:configure',
      resourceType: 'SystemState',
      resourceId: 'genesis',
      outcome: 'SUCCESS',
      metadata: { initializedAt: new Date().toISOString() },
    });
  }

  // =========================================================================
  // SCHEDULING & CONCURRENCY-SAFE ATOMIC SLOT HOLD (CAT-01, CAT-02)
  // =========================================================================

  public holdSlot(
    slotId: string,
    patientId: string,
    holdDurationMinutes = 10
  ): { success: boolean; slot?: DoctorScheduleSlot; error?: string } {
    this.releaseExpiredHolds();

    const slot = this.state.slots.find((s) => s.id === slotId);
    if (!slot) {
      return { success: false, error: 'Slot not found' };
    }

    // Atomic concurrency lock check: Cannot hold if already held or fully allocated
    if (slot.isHeld && slot.heldByPatientId !== patientId) {
      return {
        success: false,
        error: 'Concurrency conflict: This slot is currently reserved by another patient. Try another slot.',
      };
    }

    if (slot.allocatedCount >= slot.capacity) {
      return {
        success: false,
        error: 'Slot capacity exceeded. No appointments available.',
      };
    }

    const now = new Date();
    const heldUntil = new Date(now.getTime() + holdDurationMinutes * 60 * 1000).toISOString();

    slot.isHeld = true;
    slot.heldUntil = heldUntil;
    slot.heldByPatientId = patientId;
    slot.version += 1;

    this.audit.log({
      correlationId: `hold-${Date.now()}`,
      actorId: patientId,
      actorRole: 'PATIENT',
      action: 'appointment:hold-slot',
      resourceType: 'DoctorScheduleSlot',
      resourceId: slot.id,
      outcome: 'SUCCESS',
      metadata: { heldUntil },
    });

    return { success: true, slot };
  }

  public releaseExpiredHolds(): number {
    const now = new Date();
    let releasedCount = 0;

    for (const slot of this.state.slots) {
      if (slot.isHeld && slot.heldUntil && new Date(slot.heldUntil) < now) {
        slot.isHeld = false;
        slot.heldUntil = undefined;
        slot.heldByPatientId = undefined;
        slot.version += 1;
        releasedCount += 1;
      }
    }
    return releasedCount;
  }

  // =========================================================================
  // APPOINTMENT CREATION & STATE MACHINE (T-12, T-13, T-14)
  // =========================================================================

  public createAppointment(input: {
    patientId: string;
    doctorId: string;
    facilityId: string;
    slotId: string;
    consultationMode: 'IN_PERSON' | 'TELECONSULTATION';
    paymentMode: 'ONLINE' | 'AT_FACILITY';
    chiefComplaint?: string;
  }): { success: boolean; appointment?: Appointment; error?: string } {
    const slot = this.state.slots.find((s) => s.id === input.slotId);
    if (!slot) {
      return { success: false, error: 'Invalid slot ID' };
    }

    // Verify patient holds this slot and it has not expired
    const now = new Date();
    if (!slot.isHeld || slot.heldByPatientId !== input.patientId || (slot.heldUntil && new Date(slot.heldUntil) < now)) {
      return {
        success: false,
        error: 'Slot hold has expired or is invalid. Please reserve a slot before requesting booking.',
      };
    }

    const appointment: Appointment = {
      id: `apt-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      patientId: input.patientId,
      doctorId: input.doctorId,
      facilityId: input.facilityId,
      slotId: input.slotId,
      state: 'REQUESTED', // Moves to REQUESTED (awaiting doctor/facility acceptance)
      consultationMode: input.consultationMode,
      paymentMode: input.paymentMode,
      chiefComplaint: input.chiefComplaint,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    slot.allocatedCount += 1;
    this.state.appointments.push(appointment);

    this.audit.log({
      correlationId: `apt-req-${appointment.id}`,
      actorId: input.patientId,
      actorRole: 'PATIENT',
      action: 'appointment:book',
      resourceType: 'Appointment',
      resourceId: appointment.id,
      outcome: 'SUCCESS',
      metadata: { doctorId: input.doctorId, facilityId: input.facilityId },
    });

    return { success: true, appointment };
  }

  public updateAppointmentState(
    appointmentId: string,
    newState: AppointmentState,
    actorSession: UserSession,
    reason?: string
  ): { success: boolean; appointment?: Appointment; error?: string } {
    const apt = this.state.appointments.find((a) => a.id === appointmentId);
    if (!apt) {
      return { success: false, error: 'Appointment not found' };
    }

    const validTransitions: Record<AppointmentState, AppointmentState[]> = {
      DRAFT: ['SLOT_HELD', 'CANCELLED'],
      SLOT_HELD: ['REQUESTED', 'CANCELLED'],
      REQUESTED: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
      ACCEPTED: ['PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED'],
      PAYMENT_PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
      CHECKED_IN: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED'],
      COMPLETED: [],
      REJECTED: [],
      CANCELLED: [],
      NO_SHOW: [],
    };

    const allowedNext = validTransitions[apt.state] || [];
    if (!allowedNext.includes(newState)) {
      return {
        success: false,
        error: `Invalid appointment transition: Cannot transition from '${apt.state}' to '${newState}'`,
      };
    }

    apt.state = newState;
    apt.updatedAt = new Date().toISOString();
    if (reason) {
      if (newState === 'REJECTED') apt.rejectionReason = reason;
      if (newState === 'CANCELLED') apt.cancellationReason = reason;
    }

    // If rejected or cancelled, release slot allocation
    if (newState === 'REJECTED' || newState === 'CANCELLED') {
      const slot = this.state.slots.find((s) => s.id === apt.slotId);
      if (slot && slot.allocatedCount > 0) {
        slot.allocatedCount -= 1;
        slot.isHeld = false;
        slot.heldUntil = undefined;
        slot.heldByPatientId = undefined;
      }
    }

    this.audit.log({
      correlationId: `apt-trans-${apt.id}`,
      tenantId: apt.facilityId,
      actorId: actorSession.userId,
      actorRole: actorSession.roles[0] || 'STAFF_EMPLOYEE',
      action: `appointment:transition-${newState.toLowerCase()}`,
      resourceType: 'Appointment',
      resourceId: apt.id,
      outcome: 'SUCCESS',
      metadata: { from: apt.state, to: newState, reason },
    });

    return { success: true, appointment: apt };
  }

  // =========================================================================
  // FINANCIAL LEDGER & IDEMPOTENT PAYMENT WEBHOOKS (CAT-04, T-12)
  // =========================================================================

  public processPaymentWebhook(input: {
    eventId: string;
    appointmentId: string;
    amountMinorUnits: number;
    paymentMode: 'ONLINE' | 'AT_FACILITY';
    gatewayProvider: 'SANDBOX' | 'RAZORPAY' | 'CASHFREE' | 'OFFLINE_CASH';
    status: 'SUCCESS' | 'FAILED';
  }): { success: boolean; isDuplicate: boolean; transaction?: PaymentTransaction; error?: string } {
    // Idempotency check: Duplicate webhook event IDs must never duplicate ledger entries
    if (this.state.idempotencyKeys.has(input.eventId)) {
      const existing = this.state.payments.find((p) => p.idempotencyKey === input.eventId);
      return {
        success: true,
        isDuplicate: true,
        transaction: existing,
      };
    }

    const apt = this.state.appointments.find((a) => a.id === input.appointmentId);
    if (!apt) {
      return { success: false, isDuplicate: false, error: 'Associated appointment not found' };
    }

    const tx: PaymentTransaction = {
      id: `tx-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      appointmentId: input.appointmentId,
      facilityId: apt.facilityId,
      patientId: apt.patientId,
      amountMinorUnits: input.amountMinorUnits,
      currency: 'INR',
      paymentMode: input.paymentMode,
      gatewayProvider: input.gatewayProvider,
      gatewayTransactionId: `gw-${Date.now()}`,
      state: input.status === 'SUCCESS' ? 'CAPTURED' : 'FAILED',
      idempotencyKey: input.eventId,
      capturedAt: input.status === 'SUCCESS' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.payments.push(tx);
    this.state.idempotencyKeys.add(input.eventId);

    if (input.status === 'SUCCESS') {
      apt.state = 'CONFIRMED';
      apt.paymentId = tx.id;
      apt.updatedAt = new Date().toISOString();
    }

    this.audit.log({
      correlationId: input.eventId,
      tenantId: apt.facilityId,
      actorId: 'payment-webhook',
      actorRole: 'STAFF_EMPLOYEE',
      action: 'finance:process-payment',
      resourceType: 'PaymentTransaction',
      resourceId: tx.id,
      outcome: input.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
      metadata: { amount: input.amountMinorUnits, appointmentId: apt.id },
    });

    return { success: true, isDuplicate: false, transaction: tx };
  }

  // =========================================================================
  // CLINICAL ENCOUNTERS, PRESCRIPTIONS & IMMUTABILITY (CAT-09, T-16)
  // =========================================================================

  public signClinicalEncounter(input: {
    appointmentId: string;
    clinicalNotes: string;
    icd10DiagnosisCodes: string[];
    doctorSession: UserSession;
    prescriptionItems?: Prescription['items'];
  }): { success: boolean; encounter?: ClinicalEncounter; prescription?: Prescription; error?: string } {
    // RBAC validation
    const rbac = evaluateRbac(input.doctorSession.roles, 'clinical:sign-note');
    if (!rbac.allowed) {
      return { success: false, error: rbac.reason };
    }

    const apt = this.state.appointments.find((a) => a.id === input.appointmentId);
    if (!apt) {
      return { success: false, error: 'Appointment not found' };
    }

    const now = new Date().toISOString();
    const signatureHash = crypto
      .createHash('sha256')
      .update(`${input.doctorSession.userId}|${apt.id}|${input.clinicalNotes}|${now}`)
      .digest('hex');

    const encounter: ClinicalEncounter = {
      id: `enc-${Date.now()}`,
      appointmentId: apt.id,
      patientId: apt.patientId,
      doctorId: input.doctorSession.userId,
      facilityId: apt.facilityId,
      encounterDate: now,
      status: 'COMPLETED',
      clinicalNotes: input.clinicalNotes,
      icd10DiagnosisCodes: input.icd10DiagnosisCodes,
      isSigned: true,
      signedAt: now,
      doctorSignatureHash: signatureHash,
      createdAt: now,
      updatedAt: now,
    };

    this.state.encounters.push(encounter);
    apt.state = 'COMPLETED';

    let prescription: Prescription | undefined;
    if (input.prescriptionItems && input.prescriptionItems.length > 0) {
      const rxSignatureHash = crypto
        .createHash('sha256')
        .update(`${encounter.id}|${JSON.stringify(input.prescriptionItems)}|${now}`)
        .digest('hex');

      prescription = {
        id: `rx-${Date.now()}`,
        encounterId: encounter.id,
        patientId: apt.patientId,
        doctorId: input.doctorSession.userId,
        facilityId: apt.facilityId,
        items: input.prescriptionItems,
        isSigned: true,
        signedAt: now,
        signatureHash: rxSignatureHash,
        createdAt: now,
      };
      this.state.prescriptions.push(prescription);
    }

    this.audit.log({
      correlationId: `sign-${encounter.id}`,
      tenantId: apt.facilityId,
      actorId: input.doctorSession.userId,
      actorRole: 'DOCTOR_RMP',
      action: 'clinical:sign-note',
      resourceType: 'ClinicalEncounter',
      resourceId: encounter.id,
      outcome: 'SUCCESS',
      metadata: { prescriptionId: prescription?.id },
    });

    return { success: true, encounter, prescription };
  }

  public amendClinicalEncounter(input: {
    encounterId: string;
    authorDoctorId: string;
    amendmentReason: string;
    correctedNotes: string;
    doctorSession: UserSession;
  }): { success: boolean; amendment?: ClinicalAmendment; error?: string } {
    const enc = this.state.encounters.find((e) => e.id === input.encounterId);
    if (!enc) {
      return { success: false, error: 'Encounter not found' };
    }

    const rbac = evaluateRbac(input.doctorSession.roles, 'clinical:amend-note');
    if (!rbac.allowed) {
      return { success: false, error: rbac.reason };
    }

    const now = new Date().toISOString();
    const signatureHash = crypto
      .createHash('sha256')
      .update(`${input.encounterId}|${input.amendmentReason}|${input.correctedNotes}|${now}`)
      .digest('hex');

    const amendment: ClinicalAmendment = {
      id: `amd-${Date.now()}`,
      encounterId: input.encounterId,
      authorDoctorId: input.authorDoctorId,
      amendmentReason: input.amendmentReason,
      correctedNotes: input.correctedNotes,
      timestamp: now,
      signatureHash,
    };

    // Original note is NEVER overwritten. Status is marked AMENDED, and amendment is linked.
    enc.status = 'AMENDED';
    enc.updatedAt = now;
    this.state.amendments.push(amendment);

    this.audit.log({
      correlationId: `amend-${amendment.id}`,
      tenantId: enc.facilityId,
      actorId: input.doctorSession.userId,
      actorRole: 'DOCTOR_RMP',
      action: 'clinical:amend-note',
      resourceType: 'ClinicalAmendment',
      resourceId: amendment.id,
      outcome: 'SUCCESS',
      metadata: { encounterId: enc.id, reason: input.amendmentReason },
    });

    return { success: true, amendment };
  }
}
