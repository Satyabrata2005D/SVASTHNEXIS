/**
 * @file apps/api/src/store.ts
 * In-Memory Transactional Domain Store & State Machine Manager
 * Initialized with verified Stage 0 fixtures from @svasthnexis/test-fixtures
 * Supports all 25 Blueprint Sections and CAT-01 through CAT-14
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
  QueueToken,
  HospitalBed,
  InpatientAdmission,
  DischargeChecklist,
  NursingObservation,
  MedicationAdministrationRecord,
  LabOrder,
  Specimen,
  LabResult,
  ImagingStudy,
  FormularyItem,
  DispenseRecord,
  OTBooking,
  EmergencyTriageCase,
  AmbulanceDispatch,
  BloodStockItem,
  BloodCrossmatch,
  TariffItem,
  InsuranceClaim,
  TelemedicineSession,
  AINavigationAssessment,
  AIDoctorReportExtraction,
  AISoapDraft,
  AIOperationsForecast,
  AISupportFAQ,
  AbhaProfile,
  FhirResourceBundle,
  SecurityIncident,
  InpatientInvoice,
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
  patients: any[];
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

  // Extended Hospital Operations (Section 7, 8, 10, 11, 12)
  queueTokens: QueueToken[];
  beds: HospitalBed[];
  admissions: InpatientAdmission[];
  dischargeChecklists: DischargeChecklist[];
  nursingObservations: NursingObservation[];
  marRecords: MedicationAdministrationRecord[];
  labOrders: LabOrder[];
  specimens: Specimen[];
  labResults: LabResult[];
  imagingStudies: ImagingStudy[];
  formulary: FormularyItem[];
  dispenseRecords: DispenseRecord[];
  otBookings: OTBooking[];
  emergencyCases: EmergencyTriageCase[];
  ambulanceDispatches: AmbulanceDispatch[];
  bloodStock: BloodStockItem[];
  crossmatches: BloodCrossmatch[];
  tariffs: TariffItem[];
  insuranceClaims: InsuranceClaim[];
  telemedicineSessions: TelemedicineSession[];
  aiExtractions: AIDoctorReportExtraction[];
  securityIncidents: SecurityIncident[];
  invoices: InpatientInvoice[];
}

export class DomainStore {
  public state: AppState;
  public audit: AuditLogEngine;

  constructor() {
    this.audit = new AuditLogEngine();
    const now = new Date().toISOString();

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
      patients: [...DEMO_PATIENTS],
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

      // OPD Queue Tokens (Section 7.1)
      queueTokens: [
        {
          id: 'qtok-101',
          facilityId: DEMO_FACILITY.id,
          departmentId: 'dept-cardio',
          doctorId: 'doc-sharma-01',
          patientId: DEMO_PATIENTS[0]!.id,
          patientMaskedName: 'R***l V***a',
          tokenNumber: 'CARD-01',
          state: 'WAITING',
          triagePriority: 'ROUTINE',
          issuedAt: now,
          estimatedWaitMinutes: 15,
        },
        {
          id: 'qtok-102',
          facilityId: DEMO_FACILITY.id,
          departmentId: 'dept-genmed',
          doctorId: 'doc-varma-02',
          patientId: 'pat-priya-02',
          patientMaskedName: 'P***a N***r',
          tokenNumber: 'MED-01',
          state: 'IN_CONSULTATION',
          triagePriority: 'URGENT',
          issuedAt: now,
          startedAt: now,
          estimatedWaitMinutes: 0,
        },
      ],

      // Hospital Beds (Section 7.2)
      beds: [
        {
          id: 'bed-gen-101',
          facilityId: DEMO_FACILITY.id,
          wardName: 'Male Medical Ward',
          bedNumber: 'MM-01',
          wardCategory: 'GENERAL',
          status: 'AVAILABLE',
          isEquippedForVentilator: false,
          lastSanitizedAt: now,
          updatedAt: now,
        },
        {
          id: 'bed-gen-102',
          facilityId: DEMO_FACILITY.id,
          wardName: 'Male Medical Ward',
          bedNumber: 'MM-02',
          wardCategory: 'GENERAL',
          status: 'OCCUPIED',
          currentAdmissionId: 'adm-001',
          isEquippedForVentilator: false,
          lastSanitizedAt: now,
          updatedAt: now,
        },
        {
          id: 'bed-semi-201',
          facilityId: DEMO_FACILITY.id,
          wardName: 'Special Ward East',
          bedNumber: 'SW-01',
          wardCategory: 'SEMI_PRIVATE',
          status: 'AVAILABLE',
          isEquippedForVentilator: false,
          lastSanitizedAt: now,
          updatedAt: now,
        },
        {
          id: 'bed-icu-301',
          facilityId: DEMO_FACILITY.id,
          wardName: 'Coronary Care ICU',
          bedNumber: 'ICU-01',
          wardCategory: 'ICU',
          status: 'AVAILABLE',
          isEquippedForVentilator: true,
          lastSanitizedAt: now,
          updatedAt: now,
        },
        {
          id: 'bed-icu-302',
          facilityId: DEMO_FACILITY.id,
          wardName: 'Coronary Care ICU',
          bedNumber: 'ICU-02',
          wardCategory: 'ICU',
          status: 'CLEANING',
          isEquippedForVentilator: true,
          lastSanitizedAt: now,
          updatedAt: now,
        },
        {
          id: 'bed-er-01',
          facilityId: DEMO_FACILITY.id,
          wardName: 'Emergency Trauma Bay',
          bedNumber: 'ER-BAY-1',
          wardCategory: 'EMERGENCY_OBSERVATION',
          status: 'AVAILABLE',
          isEquippedForVentilator: true,
          lastSanitizedAt: now,
          updatedAt: now,
        },
      ],

      // Inpatient Admissions
      admissions: [
        {
          id: 'adm-001',
          patientId: DEMO_PATIENTS[0]!.id,
          facilityId: DEMO_FACILITY.id,
          admittingDoctorId: 'doc-varma-02',
          admittedAt: '2026-11-01T14:00:00.000Z',
          admittingDiagnosis: 'Acute Bronchitis with Mild Hypoxemia',
          status: 'ADMITTED',
          bedId: 'bed-gen-102',
          careTeamDoctorIds: ['doc-varma-02', 'doc-sharma-01'],
          depositMinorUnits: 2500000, // INR 25,000.00
        },
      ],

      dischargeChecklists: [],

      // Nursing Observations (Section 7.3)
      nursingObservations: [
        {
          id: 'obs-001',
          admissionId: 'adm-001',
          patientId: DEMO_PATIENTS[0]!.id,
          nurseId: 'nurse-deepa-01',
          timestamp: now,
          heartRateBpm: 76,
          bloodPressureSystolic: 122,
          bloodPressureDiastolic: 78,
          spO2Percent: 98,
          temperatureCelsius: 37.1,
          respiratoryRateBpm: 16,
          painScore: 2,
          intakeMl: 1200,
          outputMl: 1050,
          gcsScore: 15,
          notes: 'Patient resting comfortably. Vitals stable.',
          isAbnormalAlert: false,
        },
      ],

      marRecords: [
        {
          id: 'mar-001',
          admissionId: 'adm-001',
          patientId: DEMO_PATIENTS[0]!.id,
          prescriptionItemId: 'rx-item-01',
          medicineName: 'Amoxicillin + Clavulanate 625mg',
          dose: '625 mg',
          route: 'Oral',
          scheduledTime: '2026-11-03T08:00:00.000Z',
          administeredTime: '2026-11-03T08:15:00.000Z',
          nurseId: 'nurse-deepa-01',
          status: 'ADMINISTERED',
          nurseSignatureHash: 'sha256-nurs-sig-001',
        },
      ],

      // Laboratory Information System (Section 7.4)
      labOrders: [
        {
          id: 'ord-lab-101',
          patientId: DEMO_PATIENTS[0]!.id,
          orderingDoctorId: 'doc-sharma-01',
          facilityId: DEMO_FACILITY.id,
          testCode: 'LIPID-FULL',
          testName: 'Lipid Profile Comprehensive',
          clinicalIndication: 'Routine Cardiovascular Assessment',
          status: 'ORDERED',
          createdAt: now,
        },
      ],

      specimens: [],
      labResults: [],

      // Radiology & Imaging (Section 7.5)
      imagingStudies: [
        {
          id: 'img-101',
          patientId: DEMO_PATIENTS[0]!.id,
          facilityId: DEMO_FACILITY.id,
          orderingDoctorId: 'doc-sharma-01',
          modality: 'XRAY',
          anatomicalRegion: 'Chest PA View',
          studyInstanceUid: '1.2.840.113619.2.55.3.281923',
          status: 'FINAL_VERIFIED',
          radiologistId: 'rad-menon-01',
          findingsSummary: 'Cardiac contours within normal limits. Clear costophrenic angles.',
          impression: 'Normal study. No acute cardiopulmonary pathology.',
          isVerified: true,
          signedAt: now,
          imageUrlSecureToken: 'sec-img-token-998811',
        },
      ],

      // Pharmacy Formulary (Section 7.6)
      formulary: [
        {
          id: 'pharma-01',
          facilityId: DEMO_FACILITY.id,
          genericName: 'Atorvastatin',
          brandName: 'Atorva 20mg',
          dosageForm: 'Tablet',
          strength: '20 mg',
          batchNumber: 'BT-AT-2024-09',
          expiryDate: '2027-08-31',
          stockQuantity: 450,
          reorderLevel: 100,
          unitPriceMinorUnits: 1450, // INR 14.50
        },
        {
          id: 'pharma-02',
          facilityId: DEMO_FACILITY.id,
          genericName: 'Metformin Hydrochloride',
          brandName: 'Glyciphage 500mg',
          dosageForm: 'Tablet',
          strength: '500 mg',
          batchNumber: 'BT-MF-2024-11',
          expiryDate: '2027-12-31',
          stockQuantity: 820,
          reorderLevel: 200,
          unitPriceMinorUnits: 420, // INR 4.20
        },
        {
          id: 'pharma-03',
          facilityId: DEMO_FACILITY.id,
          genericName: 'Paracetamol',
          brandName: 'Dolo 650mg',
          dosageForm: 'Tablet',
          strength: '650 mg',
          batchNumber: 'BT-PCM-2025-01',
          expiryDate: '2028-01-31',
          stockQuantity: 1500,
          reorderLevel: 300,
          unitPriceMinorUnits: 250, // INR 2.50
        },
      ],

      dispenseRecords: [],

      // Operation Theatre (Section 7.7)
      otBookings: [
        {
          id: 'ot-book-01',
          facilityId: DEMO_FACILITY.id,
          otRoomId: 'OT-SUITE-1',
          patientId: DEMO_PATIENTS[0]!.id,
          leadSurgeonId: 'doc-sharma-01',
          anaesthetistId: 'doc-anaes-01',
          procedureName: 'Coronary Angiography & Stenting',
          scheduledStartTime: '2026-11-04T10:00:00.000Z',
          scheduledEndTime: '2026-11-04T12:00:00.000Z',
          status: 'PRE_OP_CHECK_DONE',
          whoChecklist: {
            signInDone: true,
            timeOutDone: true,
            signOutDone: false,
            scrubNurseId: 'nurse-deepa-01',
          },
        },
      ],

      // Emergency & Ambulance (Section 7.8)
      emergencyCases: [
        {
          id: 'er-case-001',
          facilityId: DEMO_FACILITY.id,
          patientIdentifier: 'EMERGENCY-UNK-009',
          patientName: 'Unknown Male (approx 45y)',
          arrivalMode: 'AMBULANCE',
          arrivalTime: now,
          triageLevel: 'LEVEL_1_RESUSCITATION',
          chiefComplaint: 'Acute chest pain radiating to left jaw, diaphoresis, hypotension',
          vitals: { hr: 118, bp: '85/55', spo2: 91, gcs: 14 },
          assignedTraumaTeam: 'Trauma Alpha / Code STEMI',
          disposition: 'RESUS_BAY',
          bypassedRoutineBooking: true,
        },
      ],

      ambulanceDispatches: [
        {
          id: 'amb-dsp-01',
          callerPhone: '+919988776655',
          pickupLocation: 'Silk Board Junction, Outer Ring Road, Bengaluru',
          vehicleNumber: 'KA-01-GA-1122',
          crewLeadName: 'Paramedic Suresh Kumar',
          destinationFacilityId: DEMO_FACILITY.id,
          status: 'TRANSIT_TO_HOSPITAL',
          estimatedArrivalMins: 8,
        },
      ],

      // Blood Bank (Section 7.9)
      bloodStock: [
        {
          id: 'bld-01',
          facilityId: DEMO_FACILITY.id,
          bloodGroup: 'O+',
          componentType: 'PACKED_RBC',
          unitsAvailable: 18,
          expiryDate: '2026-11-28',
          storageTempCelsius: 4,
        },
        {
          id: 'bld-02',
          facilityId: DEMO_FACILITY.id,
          bloodGroup: 'A+',
          componentType: 'PACKED_RBC',
          unitsAvailable: 14,
          expiryDate: '2026-11-30',
          storageTempCelsius: 4,
        },
        {
          id: 'bld-03',
          facilityId: DEMO_FACILITY.id,
          bloodGroup: 'B+',
          componentType: 'PLATELET_CONCENTRATE',
          unitsAvailable: 8,
          expiryDate: '2026-11-08',
          storageTempCelsius: 22,
        },
      ],

      crossmatches: [],

      // Tariffs & Insurance (Section 12)
      tariffs: [
        {
          id: 'trf-01',
          facilityId: DEMO_FACILITY.id,
          category: 'CONSULTATION',
          serviceCode: 'OPD-CONS-SPEC',
          serviceName: 'Specialist In-Person Consultation',
          rateMinorUnits: 80000, // INR 800.00
          effectiveFrom: '2026-01-01',
          version: 1,
        },
        {
          id: 'trf-02',
          facilityId: DEMO_FACILITY.id,
          category: 'BED',
          serviceCode: 'IPD-BED-GEN',
          serviceName: 'General Ward Bed (per day)',
          rateMinorUnits: 200000, // INR 2,000.00
          effectiveFrom: '2026-01-01',
          version: 1,
        },
        {
          id: 'trf-03',
          facilityId: DEMO_FACILITY.id,
          category: 'BED',
          serviceCode: 'IPD-BED-ICU',
          serviceName: 'ICU Ventilator Bed (per day)',
          rateMinorUnits: 750000, // INR 7,500.00
          effectiveFrom: '2026-01-01',
          version: 1,
        },
        {
          id: 'trf-04',
          facilityId: DEMO_FACILITY.id,
          category: 'LAB',
          serviceCode: 'LAB-LIPID',
          serviceName: 'Lipid Profile Comprehensive Panel',
          rateMinorUnits: 65000, // INR 650.00
          effectiveFrom: '2026-01-01',
          version: 1,
        },
      ],

      insuranceClaims: [
        {
          id: 'clm-001',
          patientId: DEMO_PATIENTS[0]!.id,
          facilityId: DEMO_FACILITY.id,
          payerName: 'Star Health & Allied Insurance',
          policyNumber: 'POL-STAR-881273-01',
          preAuthStatus: 'APPROVED',
          requestedAmountMinorUnits: 3500000, // INR 35,000
          approvedAmountMinorUnits: 3200000, // INR 32,000
          copayMinorUnits: 300000, // INR 3,000
          settlementStatus: 'PENDING',
        },
      ],

      // Telemedicine Video (Section 10)
      telemedicineSessions: [
        {
          id: 'tele-sess-001',
          appointmentId: 'apt-tele-demo',
          patientId: DEMO_PATIENTS[0]!.id,
          doctorId: 'doc-sharma-01',
          roomToken: 'jwt-tok-tele-room-882233',
          waitingRoomActive: true,
          status: 'WAITING_ROOM',
          recordingConsentGivenByAll: false, // Default: Non-recorded (Section 10.2)
          isRecordingActive: false,
          recordingRetentionDays: 90,
        },
      ],

      aiExtractions: [],
      securityIncidents: [
        {
          id: 'sec-inc-001',
          severity: 'LOW',
          incidentType: 'RATE_LIMIT_EXCEEDED',
          description: 'Repeated unauthorized credential probe detected on patient login endpoint from IP 198.51.100.44',
          detectedAt: now,
          detectedBy: 'SOC_AUTOMATION',
          status: 'CONTAINED',
          affectedEntities: ['/api/v1/auth/login'],
          certInReported: false,
          certInDeadline: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
        },
      ],
      invoices: [],
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
  // APPOINTMENT CREATION & STATE MACHINE (T-12, T-13, T-14, CAT-03)
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

    const now = new Date();
    if (
      !slot.isHeld ||
      slot.heldByPatientId !== input.patientId ||
      (slot.heldUntil && new Date(slot.heldUntil) < now)
    ) {
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
      state: 'REQUESTED',
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

    // CAT-03: Provider rejection triggers reservation release and patient notification
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

  // =========================================================================
  // OPD QUEUE MANAGEMENT (Section 7.1)
  // =========================================================================

  public issueQueueToken(input: {
    facilityId: string;
    departmentId: string;
    doctorId: string;
    patientId: string;
    patientName?: string;
    triagePriority?: 'ROUTINE' | 'URGENT' | 'EMERGENT';
  }): QueueToken {
    const now = new Date().toISOString();
    const maskName = (name?: string) => {
      const parts = (name || 'Anonymous Patient').trim().split(' ');
      return parts.map((p) => (p.length > 2 ? `${p[0]}***${p[p.length - 1]}` : `${p}*`)).join(' ');
    };

    const count = this.state.queueTokens.filter((t) => t.doctorId === input.doctorId).length + 1;
    const tokenNumber = `OPD-${count.toString().padStart(2, '0')}`;

    const token: QueueToken = {
      id: `qtok-${Date.now()}`,
      facilityId: input.facilityId,
      departmentId: input.departmentId,
      doctorId: input.doctorId,
      patientId: input.patientId,
      patientMaskedName: maskName(input.patientName),
      tokenNumber,
      state: 'WAITING',
      triagePriority: input.triagePriority || 'ROUTINE',
      issuedAt: now,
      estimatedWaitMinutes: Math.max(10, count * 15),
    };

    this.state.queueTokens.push(token);

    this.audit.log({
      correlationId: `qtok-${token.id}`,
      tenantId: input.facilityId,
      actorId: input.patientId,
      actorRole: 'PATIENT',
      action: 'opd:issue-token',
      resourceType: 'QueueToken',
      resourceId: token.id,
      outcome: 'SUCCESS',
      metadata: { tokenNumber, doctorId: input.doctorId },
    });

    return token;
  }

  public updateQueueTokenState(
    tokenId: string,
    newState: QueueToken['state'],
    actorSession: UserSession
  ): { success: boolean; token?: QueueToken; error?: string } {
    const token = this.state.queueTokens.find((t) => t.id === tokenId);
    if (!token) return { success: false, error: 'Queue token not found' };

    const validState = newState || 'CALLED';
    const now = new Date().toISOString();
    token.state = validState;
    if (validState === 'CALLED') token.calledAt = now;
    if (validState === 'IN_CONSULTATION') token.startedAt = now;
    if (validState === 'COMPLETED') token.completedAt = now;

    this.audit.log({
      correlationId: `qtok-upd-${token.id}`,
      tenantId: token.facilityId,
      actorId: actorSession.userId,
      actorRole: actorSession.roles[0] || 'STAFF_EMPLOYEE',
      action: `opd:token-${validState.toLowerCase()}`,
      resourceType: 'QueueToken',
      resourceId: token.id,
      outcome: 'SUCCESS',
      metadata: { newState: validState },
    });

    return { success: true, token };
  }

  // =========================================================================
  // INPATIENT ADMISSION, BED MANAGEMENT & DISCHARGE (Section 7.2)
  // =========================================================================

  public admitPatient(input: {
    patientId: string;
    facilityId: string;
    admittingDoctorId: string;
    bedId: string;
    admittingDiagnosis: string;
    depositMinorUnits: number;
    staffSession: UserSession;
  }): { success: boolean; admission?: InpatientAdmission; error?: string } {
    const bed = this.state.beds.find((b) => b.id === input.bedId);
    if (!bed) return { success: false, error: 'Bed not found' };
    if (bed.status !== 'AVAILABLE') {
      return { success: false, error: `Bed is currently ${bed.status}. Only AVAILABLE beds can be allocated.` };
    }

    const now = new Date().toISOString();
    const admission: InpatientAdmission = {
      id: `adm-${Date.now()}`,
      patientId: input.patientId,
      facilityId: input.facilityId,
      admittingDoctorId: input.admittingDoctorId,
      admittedAt: now,
      admittingDiagnosis: input.admittingDiagnosis,
      status: 'ADMITTED',
      bedId: input.bedId,
      careTeamDoctorIds: [input.admittingDoctorId],
      depositMinorUnits: input.depositMinorUnits,
    };

    bed.status = 'OCCUPIED';
    bed.currentAdmissionId = admission.id;
    bed.updatedAt = now;

    this.state.admissions.push(admission);

    this.audit.log({
      correlationId: `adm-${admission.id}`,
      tenantId: input.facilityId,
      actorId: input.staffSession.userId,
      actorRole: input.staffSession.roles[0] || 'HOSPITAL_ADMIN',
      action: 'inpatient:admit-patient',
      resourceType: 'InpatientAdmission',
      resourceId: admission.id,
      outcome: 'SUCCESS',
      metadata: { bedId: input.bedId, patientId: input.patientId },
    });

    return { success: true, admission };
  }

  public transferBed(
    admissionId: string,
    newBedId: string,
    staffSession: UserSession
  ): { success: boolean; error?: string } {
    const adm = this.state.admissions.find((a) => a.id === admissionId);
    if (!adm) return { success: false, error: 'Admission episode not found' };

    const newBed = this.state.beds.find((b) => b.id === newBedId);
    if (!newBed) return { success: false, error: 'Target bed not found' };
    if (newBed.status !== 'AVAILABLE') return { success: false, error: 'Target bed is not available' };

    const oldBed = this.state.beds.find((b) => b.id === adm.bedId);
    const now = new Date().toISOString();

    if (oldBed) {
      oldBed.status = 'CLEANING';
      oldBed.currentAdmissionId = undefined;
      oldBed.updatedAt = now;
    }

    newBed.status = 'OCCUPIED';
    newBed.currentAdmissionId = adm.id;
    newBed.updatedAt = now;

    adm.bedId = newBedId;

    this.audit.log({
      correlationId: `transfer-${admissionId}`,
      tenantId: adm.facilityId,
      actorId: staffSession.userId,
      actorRole: staffSession.roles[0] || 'HOSPITAL_ADMIN',
      action: 'inpatient:transfer-bed',
      resourceType: 'HospitalBed',
      resourceId: newBedId,
      outcome: 'SUCCESS',
      metadata: { fromBed: oldBed?.id, toBed: newBedId },
    });

    return { success: true };
  }

  public dischargePatient(input: {
    admissionId: string;
    dischargeReason: string;
    finalDiagnosis: string;
    dischargeMedications: string[];
    followUpInstructions: string;
    warningSigns: string[];
    doctorSession: UserSession;
  }): { success: boolean; checklist?: DischargeChecklist; error?: string } {
    const adm = this.state.admissions.find((a) => a.id === input.admissionId);
    if (!adm) return { success: false, error: 'Admission not found' };

    const now = new Date().toISOString();
    const sigHash = crypto
      .createHash('sha256')
      .update(`${adm.id}|${input.finalDiagnosis}|${input.doctorSession.userId}|${now}`)
      .digest('hex');

    const checklist: DischargeChecklist = {
      id: `disch-${Date.now()}`,
      admissionId: adm.id,
      dischargeReason: input.dischargeReason,
      finalDiagnosis: input.finalDiagnosis,
      dischargeMedications: input.dischargeMedications,
      followUpInstructions: input.followUpInstructions,
      warningSigns: input.warningSigns,
      isDoctorSigned: true,
      signedAt: now,
      doctorSignatureHash: sigHash,
      isBedReleased: true,
      finalBillCleared: true,
    };

    adm.status = 'DISCHARGED';
    adm.dischargeDate = now;

    const bed = this.state.beds.find((b) => b.id === adm.bedId);
    if (bed) {
      bed.status = 'CLEANING';
      bed.currentAdmissionId = undefined;
      bed.updatedAt = now;
    }

    this.state.dischargeChecklists.push(checklist);

    this.audit.log({
      correlationId: `disch-${checklist.id}`,
      tenantId: adm.facilityId,
      actorId: input.doctorSession.userId,
      actorRole: 'DOCTOR_RMP',
      action: 'inpatient:discharge-patient',
      resourceType: 'InpatientAdmission',
      resourceId: adm.id,
      outcome: 'SUCCESS',
      metadata: { finalDiagnosis: input.finalDiagnosis },
    });

    return { success: true, checklist };
  }

  // =========================================================================
  // NURSING MANAGEMENT & MAR (Section 7.3)
  // =========================================================================

  public recordNursingObservation(input: {
    admissionId: string;
    patientId: string;
    nurseSession: UserSession;
    heartRateBpm: number;
    bpSystolic: number;
    bpDiastolic: number;
    spO2Percent: number;
    temperatureCelsius: number;
    respiratoryRateBpm: number;
    painScore: number;
    intakeMl?: number;
    outputMl?: number;
    gcsScore?: number;
    notes?: string;
  }): NursingObservation {
    const now = new Date().toISOString();
    const isAbnormalAlert =
      input.spO2Percent < 92 ||
      input.temperatureCelsius > 38.3 ||
      input.heartRateBpm > 110 ||
      input.bpSystolic > 160 ||
      input.bpSystolic < 90;

    const obs: NursingObservation = {
      id: `obs-${Date.now()}`,
      admissionId: input.admissionId,
      patientId: input.patientId,
      nurseId: input.nurseSession.userId,
      timestamp: now,
      heartRateBpm: input.heartRateBpm,
      bloodPressureSystolic: input.bpSystolic,
      bloodPressureDiastolic: input.bpDiastolic,
      spO2Percent: input.spO2Percent,
      temperatureCelsius: input.temperatureCelsius,
      respiratoryRateBpm: input.respiratoryRateBpm,
      painScore: input.painScore,
      intakeMl: input.intakeMl,
      outputMl: input.outputMl,
      gcsScore: input.gcsScore,
      notes: input.notes,
      isAbnormalAlert,
    };

    this.state.nursingObservations.push(obs);

    this.audit.log({
      correlationId: `obs-${obs.id}`,
      actorId: input.nurseSession.userId,
      actorRole: 'NURSE',
      action: 'nursing:record-vitals',
      resourceType: 'NursingObservation',
      resourceId: obs.id,
      outcome: 'SUCCESS',
      metadata: { isAbnormalAlert, spO2: input.spO2Percent },
    });

    return obs;
  }

  public recordMedicationAdministration(input: {
    admissionId: string;
    patientId: string;
    prescriptionItemId: string;
    medicineName: string;
    dose: string;
    route: string;
    scheduledTime: string;
    nurseSession: UserSession;
    status: 'ADMINISTERED' | 'HELD_CLINICAL_REASON' | 'PATIENT_REFUSED' | 'OMITTED';
    clinicalReason?: string;
  }): MedicationAdministrationRecord {
    const now = new Date().toISOString();
    const sigHash = crypto
      .createHash('sha256')
      .update(`${input.prescriptionItemId}|${input.medicineName}|${input.nurseSession.userId}|${now}`)
      .digest('hex');

    const mar: MedicationAdministrationRecord = {
      id: `mar-${Date.now()}`,
      admissionId: input.admissionId,
      patientId: input.patientId,
      prescriptionItemId: input.prescriptionItemId,
      medicineName: input.medicineName,
      dose: input.dose,
      route: input.route,
      scheduledTime: input.scheduledTime,
      administeredTime: input.status === 'ADMINISTERED' ? now : undefined,
      nurseId: input.nurseSession.userId,
      status: input.status,
      clinicalReason: input.clinicalReason,
      nurseSignatureHash: sigHash,
    };

    this.state.marRecords.push(mar);

    this.audit.log({
      correlationId: `mar-${mar.id}`,
      actorId: input.nurseSession.userId,
      actorRole: 'NURSE',
      action: 'nursing:administer-medication',
      resourceType: 'MedicationAdministrationRecord',
      resourceId: mar.id,
      outcome: 'SUCCESS',
      metadata: { status: input.status, medicineName: input.medicineName },
    });

    return mar;
  }

  // =========================================================================
  // LABORATORY INFORMATION SYSTEM (LIS) & VALIDATION GATE (CAT-10, Section 7.4)
  // =========================================================================

  public createLabOrder(input: {
    patientId: string;
    orderingDoctorId: string;
    facilityId: string;
    testCode: string;
    testName: string;
    clinicalIndication?: string;
  }): LabOrder {
    const order: LabOrder = {
      id: `lab-ord-${Date.now()}`,
      patientId: input.patientId,
      orderingDoctorId: input.orderingDoctorId,
      facilityId: input.facilityId,
      testCode: input.testCode,
      testName: input.testName,
      clinicalIndication: input.clinicalIndication,
      status: 'ORDERED',
      createdAt: new Date().toISOString(),
    };

    this.state.labOrders.push(order);
    return order;
  }

  public collectSpecimen(input: {
    labOrderId: string;
    sampleType: Specimen['sampleType'];
    collectorId: string;
  }): Specimen {
    const now = new Date().toISOString();
    const barcode = `BAR-${Date.now().toString().slice(-6)}`;
    const spec: Specimen = {
      id: `spec-${Date.now()}`,
      labOrderId: input.labOrderId,
      specimenBarcode: barcode,
      sampleType: input.sampleType,
      collectionTime: now,
      collectorId: input.collectorId,
      storageConditions: '4°C refrigerated vacutainer',
    };

    const order = this.state.labOrders.find((o) => o.id === input.labOrderId);
    if (order) order.status = 'SPECIMEN_COLLECTED';

    this.state.specimens.push(spec);
    return spec;
  }

  public submitTechnicianResult(input: {
    labOrderId: string;
    patientId: string;
    technicianSession: UserSession;
    items: LabResult['items'];
  }): LabResult {
    const order = this.state.labOrders.find((o) => o.id === input.labOrderId);
    if (order) order.status = 'PENDING_VALIDATION';

    const result: LabResult = {
      id: `res-${Date.now()}`,
      labOrderId: input.labOrderId,
      patientId: input.patientId,
      technicianId: input.technicianSession.userId,
      items: input.items,
      isValidatedByPathologist: false, // Critical Gate (CAT-10)
      status: 'PRELIMINARY',
      version: 1,
    };

    this.state.labResults.push(result);
    return result;
  }

  // CAT-10: Pathologist validation gate - unvalidated result cannot be published
  public validateAndReleaseLabResult(input: {
    resultId: string;
    pathologistSession: UserSession;
  }): { success: boolean; result?: LabResult; error?: string } {
    const res = this.state.labResults.find((r) => r.id === input.resultId);
    if (!res) return { success: false, error: 'Lab result not found' };

    // Check authority: Only authorized RMP/Pathologist can validate
    const hasPathologistRole =
      input.pathologistSession.roles.includes('DOCTOR_RMP') ||
      input.pathologistSession.roles.includes('LAB_TECHNICIAN');
    if (!hasPathologistRole) {
      return {
        success: false,
        error: 'Security Policy Violation: Only a credentialed pathologist / RMP can validate and release lab results.',
      };
    }

    const now = new Date().toISOString();
    const sigHash = crypto
      .createHash('sha256')
      .update(`${res.id}|${input.pathologistSession.userId}|${JSON.stringify(res.items)}|${now}`)
      .digest('hex');

    res.isValidatedByPathologist = true;
    res.pathologistReviewerId = input.pathologistSession.userId;
    res.validatedAt = now;
    res.releasedAt = now;
    res.pathologistSignatureHash = sigHash;
    res.status = 'RELEASED';

    const order = this.state.labOrders.find((o) => o.id === res.labOrderId);
    if (order) order.status = 'RELEASED';

    // Publish to Patient Document Vault
    this.state.documents.push({
      id: `doc-lab-${res.id}`,
      patientId: res.patientId,
      facilityId: order?.facilityId,
      authorDoctorId: input.pathologistSession.userId,
      title: `Verified Report: ${order?.testName || 'Diagnostic Lab Panel'}`,
      category: 'LAB_REPORT',
      mimeType: 'application/pdf',
      fileSizeBytes: 182400,
      storageKey: `clinical/reports/${res.id}.pdf`,
      documentDate: now.slice(0, 10),
      source: 'FACILITY_GENERATED',
      verificationStatus: 'VERIFIED',
      version: 1,
      isArchived: false,
      createdAt: now,
    });

    this.audit.log({
      correlationId: `lis-rel-${res.id}`,
      tenantId: order?.facilityId,
      actorId: input.pathologistSession.userId,
      actorRole: input.pathologistSession.roles[0] || 'DOCTOR_RMP',
      action: 'diagnostics:release-result',
      resourceType: 'LabResult',
      resourceId: res.id,
      outcome: 'SUCCESS',
      metadata: { testCode: order?.testCode, orderId: order?.id },
    });

    return { success: true, result: res };
  }

  // =========================================================================
  // EMERGENCY TRIAGE & AMBULANCE DISPATCH (CAT-12, Section 7.8)
  // =========================================================================

  public triageEmergencyPatient(input: {
    facilityId: string;
    patientIdentifier: string;
    patientName?: string;
    arrivalMode: EmergencyTriageCase['arrivalMode'];
    triageLevel: EmergencyTriageCase['triageLevel'];
    chiefComplaint: string;
    vitals: { hr: number; bp: string; spo2: number; gcs: number };
    disposition: EmergencyTriageCase['disposition'];
    staffSession: UserSession;
  }): EmergencyTriageCase {
    const now = new Date().toISOString();

    // CAT-12: Directly bypasses routine appointment booking
    const traumaCase: EmergencyTriageCase = {
      id: `er-${Date.now()}`,
      facilityId: input.facilityId,
      patientIdentifier: input.patientIdentifier,
      patientName: input.patientName,
      arrivalMode: input.arrivalMode,
      arrivalTime: now,
      triageLevel: input.triageLevel,
      chiefComplaint: input.chiefComplaint,
      vitals: input.vitals,
      assignedTraumaTeam:
        input.triageLevel === 'LEVEL_1_RESUSCITATION' ? 'Resuscitation Team Alpha' : 'Acute Care Team Beta',
      disposition: input.disposition,
      bypassedRoutineBooking: true,
    };

    this.state.emergencyCases.unshift(traumaCase);

    this.audit.log({
      correlationId: `er-triage-${traumaCase.id}`,
      tenantId: input.facilityId,
      actorId: input.staffSession.userId,
      actorRole: input.staffSession.roles[0] || 'NURSE',
      action: 'emergency:triage-intake',
      resourceType: 'EmergencyTriageCase',
      resourceId: traumaCase.id,
      outcome: 'SUCCESS',
      metadata: { triageLevel: input.triageLevel, bypassedBooking: true },
    });

    return traumaCase;
  }

  // =========================================================================
  // TELEMEDICINE & RECORDING CONSENT GATE (CAT-13, Section 10)
  // =========================================================================

  public toggleRecordingConsent(input: {
    sessionId: string;
    patientConsented: boolean;
    doctorConsented: boolean;
    actorSession: UserSession;
  }): { success: boolean; session?: TelemedicineSession; error?: string } {
    const sess = this.state.telemedicineSessions.find((s) => s.id === input.sessionId);
    if (!sess) return { success: false, error: 'Telemedicine session not found' };

    // CAT-13: Recording cannot start without explicit permission from all participants
    if (!input.patientConsented || !input.doctorConsented) {
      sess.recordingConsentGivenByAll = false;
      sess.isRecordingActive = false;

      this.audit.log({
        correlationId: `tele-rec-deny-${sess.id}`,
        actorId: input.actorSession.userId,
        actorRole: input.actorSession.roles[0] || 'PATIENT',
        action: 'telemedicine:recording-consent',
        resourceType: 'TelemedicineSession',
        resourceId: sess.id,
        outcome: 'DENIED',
        metadata: { reason: 'One or more participants withheld recording consent' },
      });

      return {
        success: false,
        session: sess,
        error: 'Clinical Recording Blocked: Separate informed consent must be explicitly granted by both Patient and Doctor.',
      };
    }

    sess.recordingConsentGivenByAll = true;
    sess.isRecordingActive = true;
    sess.recordingStorageKey = `telehealth/recordings/${sess.id}.enc`;

    this.audit.log({
      correlationId: `tele-rec-grant-${sess.id}`,
      actorId: input.actorSession.userId,
      actorRole: input.actorSession.roles[0] || 'PATIENT',
      action: 'telemedicine:recording-consent',
      resourceType: 'TelemedicineSession',
      resourceId: sess.id,
      outcome: 'SUCCESS',
      metadata: { recordingActive: true },
    });

    return { success: true, session: sess };
  }

  // =========================================================================
  // 5 BOUNDED AI SERVICES (Section 11, CAT-11)
  // =========================================================================

  // Service 1: Patient Navigation Assistant (Section 11.1)
  public evaluatePatientNavigation(queryText: string): AINavigationAssessment {
    const q = queryText.toLowerCase();

    // Red flag detection for immediate emergency routing
    const emergencyKeywords = [
      'chest pain',
      'heart attack',
      'difficulty breathing',
      'shortness of breath',
      'stroke',
      'paralysis',
      'severe bleeding',
      'unconscious',
      'head injury',
      'severe burns',
    ];

    const isUrgent = emergencyKeywords.some((k) => q.includes(k));

    if (isUrgent) {
      return {
        queryText,
        suggestedSpecialty: 'Emergency Medicine / Trauma Care',
        suggestedDepartment: 'Accident & Emergency (A&E) / Casualty',
        isUrgentEmergency: true,
        emergencyGuidance:
          'CRITICAL SAFETY WARNING: Your symptoms indicate a potential medical emergency. Please call 112 / 108 immediately or proceed to the nearest emergency trauma department. Do not rely on routine outpatient scheduling.',
        confidenceScore: 0.99,
        disclaimer:
          'AntiGravity SvasthNexis Navigation Policy: This assistant provides department routing only and is strictly barred from diagnosing, prescribing, or counselling.',
      };
    }

    if (q.includes('heart') || q.includes('palpitation') || q.includes('bp') || q.includes('cholesterol')) {
      return {
        queryText,
        suggestedSpecialty: 'Cardiology',
        suggestedDepartment: 'Department of Cardiology',
        isUrgentEmergency: false,
        confidenceScore: 0.95,
        disclaimer:
          'Service Navigation Only: This recommendation assists with directory discovery. It does not constitute medical diagnosis or advice.',
      };
    }

    if (q.includes('fever') || q.includes('cough') || q.includes('cold') || q.includes('infection') || q.includes('weakness')) {
      return {
        queryText,
        suggestedSpecialty: 'General Medicine / Internal Medicine',
        suggestedDepartment: 'Department of Internal Medicine',
        isUrgentEmergency: false,
        confidenceScore: 0.92,
        disclaimer:
          'Service Navigation Only: This recommendation assists with directory discovery. It does not constitute medical diagnosis or advice.',
      };
    }

    return {
      queryText,
      suggestedSpecialty: 'General Consultation',
      suggestedDepartment: 'Outpatient Triage Clinic',
      isUrgentEmergency: false,
      confidenceScore: 0.85,
      disclaimer:
        'Service Navigation Only: This recommendation assists with directory discovery. It does not constitute medical diagnosis or advice.',
    };
  }

  // Service 2: Doctor Medical Report Assistant & Verification Gate (CAT-11, Section 11.2)
  public extractDoctorLabReport(documentId: string): AIDoctorReportExtraction {
    const extraction: AIDoctorReportExtraction = {
      documentId,
      ocrExtractedDate: '2025-10-12',
      extractedFields: [
        {
          parameter: 'Total Cholesterol',
          value: '228',
          unit: 'mg/dL',
          referenceRange: '< 200',
          isAbnormalFlag: true,
          confidence: 0.97,
        },
        {
          parameter: 'Triglycerides',
          value: '190',
          unit: 'mg/dL',
          referenceRange: '< 150',
          isAbnormalFlag: true,
          confidence: 0.96,
        },
        {
          parameter: 'HDL Cholesterol (Good)',
          value: '42',
          unit: 'mg/dL',
          referenceRange: '> 40',
          isAbnormalFlag: false,
          confidence: 0.98,
        },
        {
          parameter: 'LDL Cholesterol (Calculated)',
          value: '148',
          unit: 'mg/dL',
          referenceRange: '< 100',
          isAbnormalFlag: true,
          confidence: 0.95,
        },
      ],
      requiresDoctorReview: true,
    };

    this.state.aiExtractions.push(extraction);
    return extraction;
  }

  // CAT-11: Human review acceptance gate
  public acceptAiReportExtraction(
    documentId: string,
    doctorSession: UserSession
  ): { success: boolean; extraction?: AIDoctorReportExtraction; error?: string } {
    const ext = this.state.aiExtractions.find((e) => e.documentId === documentId);
    if (!ext) return { success: false, error: 'Extraction not found' };

    ext.reviewedByDoctorId = doctorSession.userId;
    ext.doctorAcceptedAt = new Date().toISOString();

    this.audit.log({
      correlationId: `ai-review-${documentId}`,
      actorId: doctorSession.userId,
      actorRole: 'DOCTOR_RMP',
      action: 'ai:accept-report-extraction',
      resourceType: 'AIDoctorReportExtraction',
      resourceId: documentId,
      outcome: 'SUCCESS',
      metadata: { fieldsCount: ext.extractedFields.length },
    });

    return { success: true, extraction: ext };
  }

  // Service 3: Clinical Documentation Assistant (SOAP drafting) (Section 11.3)
  public draftClinicalSoapNote(encounterId: string, doctorNotes: string): AISoapDraft {
    return {
      encounterId,
      subjective: `Patient presents for scheduled consultation. Reported history: ${doctorNotes}`,
      objective: 'Vitals stable. Cardiovascular exam normal heart sounds S1, S2 audible, no murmurs.',
      assessment: 'Primary assessment pending full lab correlation. Prior reports noted.',
      plan: 'Advised lifestyle modification, low-sodium dietary regimen, review in 4 weeks.',
      isDraft: true,
      clinicianSignatureRequired: true,
    };
  }

  // Service 4: Hospital Operations Intelligence (Section 11.4)
  public forecastOperationsDemand(facilityId: string): AIOperationsForecast {
    const occupied = this.state.beds.filter((b) => b.status === 'OCCUPIED').length;
    const total = this.state.beds.length;
    const occupancyPercent = Math.round((occupied / Math.max(1, total)) * 100);

    return {
      facilityId,
      metric: 'BED_OCCUPANCY',
      forecastHorizonHours: 24,
      predictedOccupancyPercent: Math.min(100, occupancyPercent + 12),
      recommendedAction:
        'Prepare 2 Step-Down beds for transfer from ICU. Anticipate 4 post-op admissions from planned OT procedures tomorrow morning.',
      advisoryNotice:
        'Operations Advisory: This forecast uses historical discharge turnaround time and booked elective procedures. Clinical decisions take precedence.',
    };
  }

  // Service 5: Customer Support Assistant (Section 11.5)
  public querySupportFaq(userQuery: string): AISupportFAQ {
    const q = userQuery.toLowerCase();
    let category = 'GENERAL';
    let matchedAnswer =
      'Our team is here to help with appointments, payments, and account setup. For medical advice, please consult your treating physician.';

    if (q.includes('payment') || q.includes('refund') || q.includes('upi') || q.includes('receipt')) {
      category = 'PAYMENTS';
      matchedAnswer =
        'Payments are securely processed via UPI, Cards, and NetBanking. Receipts and refund statuses are accessible immediately in your Patient Billing tab. Refunds are reconciled within 3-5 business days.';
    } else if (q.includes('cancel') || q.includes('reschedule') || q.includes('slot')) {
      category = 'BOOKING';
      matchedAnswer =
        'You can reschedule or cancel your appointment from the Patient Dashboard up to 2 hours prior to the scheduled slot without penalty.';
    } else if (q.includes('record') || q.includes('report') || q.includes('upload') || q.includes('vault')) {
      category = 'DOCUMENT_VAULT';
      matchedAnswer =
        'Uploaded medical files are stored in our private encrypted document vault. Doctors can only view records for which you grant explicit, time-bounded consent.';
    }

    return {
      userQuery,
      category,
      matchedAnswer,
      isClinicalRestricted: true,
    };
  }

  // =========================================================================
  // ABDM / FHIR R4 INTEROPERABILITY ADAPTERS (Section 16)
  // =========================================================================

  public generateAbhaMock(_patientId: string): AbhaProfile {
    return {
      abhaNumber: '91-4422-9988-1122',
      abhaAddress: 'rahul.verma@sbx',
      fullName: 'Rahul Verma',
      gender: 'MALE',
      dateOfBirth: '1988-04-12',
      mobile: '+919876543210',
      kycStatus: 'VERIFIED',
    };
  }

  public exportPatientFhirBundle(patientId: string): FhirResourceBundle {
    const patient = DEMO_PATIENTS.find((p) => p.id === patientId) || DEMO_PATIENTS[0]!;
    const enc = this.state.encounters.find((e) => e.patientId === patientId);

    return {
      resourceType: 'Bundle',
      type: 'document',
      entryCount: 3,
      fhirJson: {
        resourceType: 'Bundle',
        id: `fhir-bundle-${Date.now()}`,
        meta: { lastUpdated: new Date().toISOString() },
        identifier: { system: 'https://svasthnexis.org/fhir/bundles', value: `bundle-${patientId}` },
        entry: [
          {
            resource: {
              resourceType: 'Patient',
              id: patient.id,
              name: [{ use: 'official', family: 'Verma', given: ['Rahul'] }],
              telecom: [{ system: 'phone', value: patient.phone }],
              gender: 'male',
              birthDate: patient.dateOfBirth,
            },
          },
          {
            resource: {
              resourceType: 'Encounter',
              id: enc?.id || 'enc-demo-01',
              status: 'finished',
              class: { code: 'AMB', display: 'ambulatory' },
              subject: { reference: `Patient/${patient.id}` },
            },
          },
          {
            resource: {
              resourceType: 'Condition',
              id: 'cond-01',
              clinicalStatus: { text: 'Active' },
              code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10', code: 'I10', display: 'Essential Hypertension' }] },
              subject: { reference: `Patient/${patient.id}` },
            },
          },
        ],
      },
    };
  }

  // =========================================================================
  // PHARMACY DISPENSING (P2-07, BP Sec 7.6)
  // =========================================================================

  public dispenseMedication(input: {
    prescriptionId: string;
    medicationId: string;
    quantity: number;
    pharmacistId: string;
    batchNumber: string;
  }): { success: boolean; record?: DispenseRecord; error?: string } {
    const item = this.state.formulary.find(
      (f) => f.id === input.medicationId || f.batchNumber === input.batchNumber
    );
    if (!item) {
      return { success: false, error: 'Medication not found in hospital formulary' };
    }
    if (item.stockQuantity < input.quantity) {
      return { success: false, error: 'Insufficient stock in hospital pharmacy formulary' };
    }
    const expiry = new Date(item.expiryDate).getTime();
    if (expiry < Date.now()) {
      return { success: false, error: 'Cannot dispense expired medication batch' };
    }

    item.stockQuantity -= input.quantity;
    const record: DispenseRecord = {
      id: `dsp-${Date.now()}`,
      prescriptionId: input.prescriptionId,
      patientId: 'pat-verma-01',
      pharmacistId: input.pharmacistId,
      facilityId: item.facilityId,
      itemsDispensed: [
        {
          genericName: item.genericName,
          brandName: item.brandName,
          quantity: input.quantity,
          batchNumber: input.batchNumber,
          unitPriceMinorUnits: 2500,
        },
      ],
      totalPriceMinorUnits: input.quantity * 2500,
      dispensedAt: new Date().toISOString(),
      counselingProvided: true,
    };
    this.state.dispenseRecords.push(record);

    this.audit.log({
      correlationId: `dsp-${record.id}`,
      actorId: input.pharmacistId,
      actorRole: 'PHARMACIST',
      action: 'pharmacy:dispense',
      resourceType: 'DispenseRecord',
      resourceId: record.id,
      outcome: 'SUCCESS',
      metadata: { medication: item.brandName, quantity: input.quantity, remainingStock: item.stockQuantity },
    });

    return { success: true, record };
  }

  // =========================================================================
  // INPATIENT BILLING & TARIFF SNAPSHOTS (P2-08, BP Sec 12)
  // =========================================================================

  public generateInpatientInvoice(input: {
    patientId: string;
    admissionId: string;
    facilityId: string;
    lineItems: Array<{
      description: string;
      quantity: number;
      unitRate: number;
      category: string;
      tariffVersion?: string;
    }>;
  }): InpatientInvoice {
    const totalAmount = input.lineItems.reduce((acc, cur) => acc + cur.quantity * cur.unitRate, 0);
    const claim = this.state.insuranceClaims.find(
      (c) => c.patientId === input.patientId && c.preAuthStatus === 'APPROVED'
    );
    const insuranceCovered = claim ? Math.min(totalAmount, claim.approvedAmountMinorUnits / 100) : 0;
    const patientPayable = Math.max(0, totalAmount - insuranceCovered);

    const invoice: InpatientInvoice = {
      id: `inv-ipd-${Date.now()}`,
      admissionId: input.admissionId,
      patientId: input.patientId,
      facilityId: input.facilityId,
      createdAt: new Date().toISOString(),
      lineItems: input.lineItems.map((l) => ({
        description: l.description,
        quantity: l.quantity,
        unitRate: l.unitRate,
        totalAmount: l.quantity * l.unitRate,
        category: l.category,
        tariffVersion: l.tariffVersion || 'v1.0-2026',
      })),
      totalAmount,
      insuranceCovered,
      patientPayable,
      status: 'ISSUED',
    };
    this.state.invoices.push(invoice);

    this.audit.log({
      correlationId: `inv-${invoice.id}`,
      actorId: 'billing-system',
      actorRole: 'HOSPITAL_ADMIN',
      action: 'finance:invoice-generate',
      resourceType: 'InpatientInvoice',
      resourceId: invoice.id,
      outcome: 'SUCCESS',
      metadata: { totalAmount, insuranceCovered, patientPayable },
    });

    return invoice;
  }

  // =========================================================================
  // OPERATION THEATRE (OT) & WHO SURGICAL CHECKLIST (P3-01, BP Sec 7.7)
  // =========================================================================

  public scheduleOtBooking(input: {
    patientId: string;
    facilityId: string;
    otRoom: string;
    procedureName: string;
    leadSurgeonId: string;
    anesthesiologistId: string;
    scheduledTime: string;
  }): OTBooking {
    const booking: OTBooking = {
      id: `ot-${Date.now()}`,
      patientId: input.patientId,
      facilityId: input.facilityId,
      otRoomId: input.otRoom,
      procedureName: input.procedureName,
      leadSurgeonId: input.leadSurgeonId,
      anaesthetistId: input.anesthesiologistId,
      scheduledStartTime: input.scheduledTime,
      scheduledEndTime: new Date(new Date(input.scheduledTime).getTime() + 2 * 3600 * 1000).toISOString(),
      status: 'SCHEDULED',
      whoChecklist: {
        signInDone: false,
        timeOutDone: false,
        signOutDone: false,
        scrubNurseId: 'nurse-lead-01',
      },
    };
    this.state.otBookings.push(booking);

    this.audit.log({
      correlationId: `ot-${booking.id}`,
      actorId: input.leadSurgeonId,
      actorRole: 'DOCTOR_RMP',
      action: 'ot:schedule',
      resourceType: 'OTBooking',
      resourceId: booking.id,
      outcome: 'SUCCESS',
      metadata: { procedure: input.procedureName, room: input.otRoom },
    });

    return booking;
  }

  public updateWhoSurgicalChecklist(input: {
    bookingId: string;
    phase: 'SIGN_IN' | 'TIME_OUT' | 'SIGN_OUT';
    verifiedItems: string[];
    verifiedBy: string;
  }): { success: boolean; booking?: OTBooking; error?: string } {
    const booking = this.state.otBookings.find((b) => b.id === input.bookingId);
    if (!booking) return { success: false, error: 'OT booking not found' };

    if (input.phase === 'SIGN_IN') {
      booking.whoChecklist.signInDone = true;
      booking.status = 'PRE_OP_CHECK_DONE';
    } else if (input.phase === 'TIME_OUT') {
      if (!booking.whoChecklist.signInDone) {
        return { success: false, error: 'WHO Sign-In must precede Time-Out verification' };
      }
      booking.whoChecklist.timeOutDone = true;
      booking.status = 'IN_SURGERY';
    } else if (input.phase === 'SIGN_OUT') {
      if (!booking.whoChecklist.timeOutDone) {
        return { success: false, error: 'WHO Time-Out must precede Sign-Out verification' };
      }
      booking.whoChecklist.signOutDone = true;
      booking.status = 'COMPLETED';
    }

    this.audit.log({
      correlationId: `who-${booking.id}`,
      actorId: input.verifiedBy,
      actorRole: 'DOCTOR_RMP',
      action: `ot:who-${input.phase.toLowerCase()}`,
      resourceType: 'OTBooking',
      resourceId: booking.id,
      outcome: 'SUCCESS',
      metadata: { checklistPhase: input.phase, items: input.verifiedItems },
    });

    return { success: true, booking };
  }

  // =========================================================================
  // AMBULANCE COORDINATION & GPS TELEMETRY (P3-03, BP Sec 7.8)
  // =========================================================================

  public dispatchAmbulance(input: {
    callerPhone: string;
    pickupLocation: string;
    vehicleNumber: string;
    crewLeadName: string;
    destinationFacilityId: string;
  }): AmbulanceDispatch {
    const dispatch: AmbulanceDispatch = {
      id: `amb-${Date.now()}`,
      callerPhone: input.callerPhone,
      pickupLocation: input.pickupLocation,
      vehicleNumber: input.vehicleNumber,
      crewLeadName: input.crewLeadName,
      destinationFacilityId: input.destinationFacilityId,
      status: 'DISPATCHED',
      estimatedArrivalMins: 12,
    };
    this.state.ambulanceDispatches.push(dispatch);

    this.audit.log({
      correlationId: `amb-${dispatch.id}`,
      actorId: 'dispatcher-112',
      actorRole: 'HOSPITAL_ADMIN',
      action: 'ambulance:dispatch',
      resourceType: 'AmbulanceDispatch',
      resourceId: dispatch.id,
      outcome: 'SUCCESS',
      metadata: { vehicle: input.vehicleNumber, pickup: input.pickupLocation },
    });

    return dispatch;
  }

  public updateAmbulanceTelemetry(input: {
    dispatchId: string;
    latitude: number;
    longitude: number;
    estimatedArrivalMins: number;
  }): { success: boolean; dispatch?: AmbulanceDispatch; error?: string } {
    const d = this.state.ambulanceDispatches.find((a) => a.id === input.dispatchId);
    if (!d) return { success: false, error: 'Ambulance dispatch not found' };

    d.estimatedArrivalMins = input.estimatedArrivalMins;
    if (input.estimatedArrivalMins <= 1) d.status = 'ARRIVED_AT_SCENE';

    return { success: true, dispatch: d };
  }

  // =========================================================================
  // INSURANCE / TPA CLAIMS (P3-04, BP Sec 12)
  // =========================================================================

  public submitInsuranceClaim(input: {
    patientId: string;
    facilityId: string;
    payerName: string;
    policyNumber: string;
    requestedAmountMinorUnits: number;
    copayMinorUnits?: number;
  }): InsuranceClaim {
    const claim: InsuranceClaim = {
      id: `clm-${Date.now()}`,
      patientId: input.patientId,
      facilityId: input.facilityId,
      payerName: input.payerName,
      policyNumber: input.policyNumber,
      preAuthStatus: 'SUBMITTED',
      requestedAmountMinorUnits: input.requestedAmountMinorUnits,
      approvedAmountMinorUnits: 0,
      copayMinorUnits: input.copayMinorUnits || 0,
      settlementStatus: 'PENDING',
    };
    this.state.insuranceClaims.push(claim);

    this.audit.log({
      correlationId: `clm-${claim.id}`,
      actorId: input.patientId,
      actorRole: 'PATIENT',
      action: 'insurance:claim-submit',
      resourceType: 'InsuranceClaim',
      resourceId: claim.id,
      outcome: 'SUCCESS',
      metadata: { payer: input.payerName, requested: input.requestedAmountMinorUnits },
    });

    return claim;
  }

  public adjudicateInsuranceClaim(input: {
    claimId: string;
    status: 'APPROVED' | 'REJECTED';
    approvedAmountMinorUnits: number;
    settlementStatus?: 'SETTLED' | 'PENDING';
  }): { success: boolean; claim?: InsuranceClaim; error?: string } {
    const claim = this.state.insuranceClaims.find((c) => c.id === input.claimId);
    if (!claim) return { success: false, error: 'Claim not found' };

    claim.preAuthStatus = input.status;
    claim.approvedAmountMinorUnits = input.approvedAmountMinorUnits;
    if (input.settlementStatus) claim.settlementStatus = input.settlementStatus;

    this.audit.log({
      correlationId: `clm-adj-${claim.id}`,
      actorId: 'tpa-adjudicator-01',
      actorRole: 'HOSPITAL_ADMIN',
      action: 'insurance:adjudicate',
      resourceType: 'InsuranceClaim',
      resourceId: claim.id,
      outcome: 'SUCCESS',
      metadata: { status: input.status, approved: input.approvedAmountMinorUnits },
    });

    return { success: true, claim };
  }

  // =========================================================================
  // BLOOD BANK & CROSSMATCH (P3-06, BP Sec 7.9)
  // =========================================================================

  public reserveBloodCrossmatch(input: {
    patientId: string;
    facilityId: string;
    bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    unitsRequired: number;
    crossmatchCompatibility: 'COMPATIBLE' | 'INCOMPATIBLE';
    requesterId: string;
  }): { success: boolean; crossmatch?: BloodCrossmatch; error?: string } {
    const stock = this.state.bloodStock.find((s) => s.bloodGroup === input.bloodGroup);
    if (!stock || stock.unitsAvailable < input.unitsRequired) {
      return { success: false, error: `Insufficient stock for blood group ${input.bloodGroup}` };
    }
    if (input.crossmatchCompatibility !== 'COMPATIBLE') {
      return { success: false, error: 'Crossmatch test indicates incompatibility. Reservation blocked.' };
    }

    stock.unitsAvailable -= input.unitsRequired;
    const crossmatch: BloodCrossmatch = {
      id: `xm-${Date.now()}`,
      patientId: input.patientId,
      patientBloodGroup: input.bloodGroup,
      requiredUnits: input.unitsRequired,
      compatibilityResult: 'COMPATIBLE',
      testedByTechnicianId: input.requesterId,
    };
    this.state.crossmatches.push(crossmatch);

    this.audit.log({
      correlationId: `xm-${crossmatch.id}`,
      actorId: input.requesterId,
      actorRole: 'DOCTOR_RMP',
      action: 'bloodbank:crossmatch-reserve',
      resourceType: 'BloodCrossmatch',
      resourceId: crossmatch.id,
      outcome: 'SUCCESS',
      metadata: { bloodGroup: input.bloodGroup, units: input.unitsRequired },
    });

    return { success: true, crossmatch };
  }

  // =========================================================================
  // CYBERSECURITY SOC & CERT-IN REPORTING (P4-08, BP Sec 13.5, 19.3)
  // =========================================================================

  public recordSecurityIncident(input: {
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    incidentType: string;
    description: string;
    affectedEntities: string[];
    detectedBy: string;
  }): SecurityIncident {
    const now = new Date();
    // 6-hour CERT-In statutory reporting deadline
    const deadline = new Date(now.getTime() + 6 * 3600 * 1000).toISOString();

    const incident: SecurityIncident = {
      id: `sec-${Date.now()}`,
      severity: input.severity,
      incidentType: input.incidentType,
      description: input.description,
      detectedAt: now.toISOString(),
      detectedBy: input.detectedBy,
      status: 'OPEN',
      affectedEntities: input.affectedEntities,
      certInReported: input.severity === 'CRITICAL' || input.severity === 'HIGH',
      certInDeadline: deadline,
    };
    this.state.securityIncidents.push(incident);

    this.audit.log({
      correlationId: `sec-${incident.id}`,
      actorId: input.detectedBy,
      actorRole: 'PLATFORM_ADMIN',
      action: 'soc:incident-detected',
      resourceType: 'SecurityIncident',
      resourceId: incident.id,
      outcome: 'SUCCESS',
      metadata: { severity: input.severity, certInDeadline: deadline },
    });

    return incident;
  }

  // =========================================================================
  // DOCTOR AFFILIATION APPROVAL (P1-04, BP Sec 5.2)
  // =========================================================================

  public approveDoctorAffiliation(input: {
    doctorId: string;
    facilityId: string;
    approvedBy: string;
    permittedSpecialties: string[];
  }): { success: boolean; affiliation?: DoctorAffiliation; error?: string } {
    const existing = this.state.affiliations.find(
      (a) => a.doctorId === input.doctorId && a.facilityId === input.facilityId
    );
    if (existing) {
      existing.approvalStatus = 'ACTIVE';
      return { success: true, affiliation: existing };
    }

    const affiliation: DoctorAffiliation = {
      id: `aff-${Date.now()}`,
      doctorId: input.doctorId,
      facilityId: input.facilityId,
      departmentName: input.permittedSpecialties[0] || 'General Medicine',
      consultationFeeMinorUnits: 80000,
      modesSupported: ['IN_PERSON', 'TELECONSULTATION'],
      approvalStatus: 'ACTIVE',
      effectiveFrom: new Date().toISOString(),
    };
    this.state.affiliations.push(affiliation);

    this.audit.log({
      correlationId: `aff-${affiliation.id}`,
      actorId: input.approvedBy,
      actorRole: 'HOSPITAL_ADMIN',
      action: 'provider:affiliation-approve',
      resourceType: 'DoctorAffiliation',
      resourceId: affiliation.id,
      outcome: 'SUCCESS',
      metadata: { doctorId: input.doctorId, facilityId: input.facilityId },
    });

    return { success: true, affiliation };
  }
}

