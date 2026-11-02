/**
 * @file packages/shared-types/src/index.ts
 * Core domain types and entities for Unified Healthcare Management Ecosystem (SvasthNexis)
 * Derived from Blueprint v1.0 Appendix B and Implementation Plan Section 13.
 */

// ============================================================================
// 1. ROLES, PERSONAS & ACCESS
// ============================================================================

export type UserRole =
  | 'PLATFORM_ADMIN'
  | 'VERIFICATION_OFFICER'
  | 'CUSTOMER_CARE'
  | 'STAFF_EMPLOYEE'
  | 'HOSPITAL_ADMIN'
  | 'DOCTOR_RMP'
  | 'NURSE'
  | 'LAB_TECHNICIAN'
  | 'RADIOLOGIST'
  | 'PHARMACIST'
  | 'PATIENT'
  | 'GUARDIAN';

export interface UserSession {
  userId: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  tenantId?: string; // Facility ID or HospitalGroup ID
  facilityId?: string;
  isMfaVerified: boolean;
  activeSessionId: string;
  issuedAt: number;
  expiresAt: number;
}

// ============================================================================
// 2. IDENTITY & GOVERNANCE
// ============================================================================

export interface PlatformAdminLifecycle {
  adminId: string;
  userId: string;
  status: 'ACTIVE' | 'REMOVAL_REQUESTED' | 'COOLING_OFF' | 'DEACTIVATED' | 'ARCHIVED';
  appointedAt: string;
  removalRequestedAt?: string;
  removalReason?: string;
  coolingOffEndsAt?: string;
  independentApproverId?: string;
  archivedAt?: string;
}

// ============================================================================
// 3. FACILITY & PROVIDER DIRECTORY
// ============================================================================

export interface HospitalFacility {
  id: string;
  hospitalGroupId?: string;
  legalName: string;
  tradeName: string;
  facilityType: 'HOSPITAL' | 'CLINIC' | 'DIAGNOSTIC_CENTER';
  registrationNumber: string;
  issuingAuthority: string;
  address: {
    line1: string;
    line2?: string;
    locality: string;
    city: string;
    state: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  };
  contactPhone: string;
  contactEmail: string;
  operatingHours: string;
  isEmergencyReady: boolean;
  verificationStatus: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'SUSPENDED';
  lastVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  fullName: string;
  registrationNumber: string; // State Medical Council / NMC
  registrationCouncil: string;
  qualificationDegrees: string[];
  primarySpecialty: string;
  subSpecialties: string[];
  languagesSpoken: string[];
  yearsExperience: number;
  evidencedSurgeriesCount?: number;
  publications?: { title: string; journal: string; year: number; doi?: string }[];
  verificationStatus: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'SUSPENDED';
  verifiedAt?: string;
}

export interface DoctorAffiliation {
  id: string;
  doctorId: string;
  facilityId: string;
  departmentName: string;
  consultationFeeMinorUnits: number; // In paise (e.g. 50000 = INR 500.00)
  modesSupported: ('IN_PERSON' | 'TELECONSULTATION')[];
  approvalStatus: 'PENDING' | 'ACTIVE' | 'REVOKED';
  effectiveFrom: string;
  effectiveTo?: string;
}

// ============================================================================
// 4. SCHEDULING & APPOINTMENT STATE MACHINE
// ============================================================================

export type AppointmentState =
  | 'DRAFT'
  | 'SLOT_HELD'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface DoctorScheduleSlot {
  id: string;
  doctorId: string;
  facilityId: string;
  startTime: string; // ISO 8601 UTC
  endTime: string;
  mode: 'IN_PERSON' | 'TELECONSULTATION';
  capacity: number; // default 1
  allocatedCount: number;
  isHeld: boolean;
  heldUntil?: string; // Atomic expiry
  heldByPatientId?: string;
  version: number; // Optimistic concurrency lock
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  facilityId: string;
  slotId: string;
  state: AppointmentState;
  consultationMode: 'IN_PERSON' | 'TELECONSULTATION';
  chiefComplaint?: string;
  paymentMode: 'ONLINE' | 'AT_FACILITY';
  paymentId?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 5. RECORDS, CONSENT & CLINICAL ENCOUNTER
// ============================================================================

export type DocumentCategory =
  | 'PRESCRIPTION'
  | 'LAB_REPORT'
  | 'IMAGING_REPORT'
  | 'DISCHARGE_SUMMARY'
  | 'VACCINATION_RECORD'
  | 'OTHER';

export interface MedicalDocument {
  id: string;
  patientId: string;
  facilityId?: string;
  authorDoctorId?: string;
  title: string;
  category: DocumentCategory;
  mimeType: string;
  fileSizeBytes: number;
  storageKey: string; // Private encrypted S3/MinIO key
  documentDate: string;
  source: 'PATIENT_UPLOADED' | 'FACILITY_GENERATED';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  version: number;
  isArchived: boolean;
  createdAt: string;
}

export type ConsentStatus = 'GRANTED' | 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'DENIED';

export interface ConsentGrant {
  id: string;
  dataSubjectId: string; // Patient ID
  recipientId: string; // Doctor ID or Facility ID
  purpose: 'CONSULTATION' | 'SECOND_OPINION' | 'EMERGENCY_CARE' | 'DIAGNOSTIC_EVALUATION';
  scopeCategories: DocumentCategory[];
  documentIds?: string[];
  validFrom: string;
  validUntil: string;
  status: ConsentStatus;
  noticeVersion: string;
  grantedAt: string;
  revokedAt?: string;
}

export interface ClinicalEncounter {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  facilityId: string;
  encounterDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'AMENDED';
  clinicalNotes: string; // SOAP note structure
  icd10DiagnosisCodes: string[];
  isSigned: boolean;
  signedAt?: string;
  doctorSignatureHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalAmendment {
  id: string;
  encounterId: string;
  authorDoctorId: string;
  amendmentReason: string;
  correctedNotes: string;
  timestamp: string;
  signatureHash: string;
}

export interface Prescription {
  id: string;
  encounterId: string;
  patientId: string;
  doctorId: string;
  facilityId: string;
  items: {
    medicineName: string;
    genericName: string;
    dosageForm: 'TABLET' | 'CAPSULE' | 'SYRUP' | 'INJECTION' | 'DROPS' | 'OINTMENT';
    strength: string;
    frequency: string;
    durationDays: number;
    specialInstructions?: string;
  }[];
  isSigned: boolean;
  signedAt?: string;
  signatureHash?: string;
  createdAt: string;
}

// ============================================================================
// 6. FINANCE & PAYMENT STATE MACHINE
// ============================================================================

export type PaymentState =
  | 'INITIATED'
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'EXPIRED'
  | 'CAPTURED'
  | 'SETTLED'
  | 'REFUNDED'
  | 'DISPUTED';

export interface PaymentTransaction {
  id: string;
  appointmentId: string;
  facilityId: string;
  patientId: string;
  amountMinorUnits: number; // e.g. 50000 = INR 500.00
  currency: 'INR';
  paymentMode: 'ONLINE' | 'AT_FACILITY';
  gatewayProvider: 'SANDBOX' | 'RAZORPAY' | 'CASHFREE' | 'OFFLINE_CASH';
  gatewayTransactionId?: string;
  state: PaymentState;
  idempotencyKey: string;
  capturedAt?: string;
  refundedAmountMinorUnits?: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 7. AUDIT & SUPPORT
// ============================================================================

export interface AuditEvent {
  id: string;
  timestamp: string;
  correlationId: string;
  tenantId?: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  resourceType: string;
  resourceId: string;
  declaredPurpose?: string;
  outcome: 'SUCCESS' | 'DENIED' | 'FAILED';
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export interface SupportTicket {
  id: string;
  requesterId: string;
  category: 'PAYMENT' | 'BOOKING' | 'ACCOUNT' | 'VERIFICATION' | 'RECORDS' | 'SECURITY' | 'TECHNICAL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'TRIAGED' | 'ASSIGNED' | 'AWAITING_USER' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
  assignedQueue: 'CUSTOMER_CARE' | 'PAYMENT_OPS' | 'VERIFICATION_OPS' | 'SECURITY_OPS' | 'PLATFORM_ADMIN';
  assignedUserId?: string;
  title: string;
  description: string;
  slaDueAt: string;
  resolutionSummary?: string;
  createdAt: string;
  updatedAt: string;
}

