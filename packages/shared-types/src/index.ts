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

// ============================================================================
// 8. OPD QUEUE MANAGEMENT (Section 7.1)
// ============================================================================

export type QueueTokenState = 'WAITING' | 'CALLED' | 'IN_CONSULTATION' | 'PAUSED' | 'COMPLETED' | 'NO_SHOW';
export type TriagePriority = 'ROUTINE' | 'URGENT' | 'EMERGENT';

export interface QueueToken {
  id: string;
  facilityId: string;
  departmentId: string;
  doctorId: string;
  patientId: string;
  patientMaskedName: string;
  tokenNumber: string;
  state: QueueTokenState;
  triagePriority: TriagePriority;
  issuedAt: string;
  calledAt?: string;
  startedAt?: string;
  completedAt?: string;
  estimatedWaitMinutes: number;
}

// ============================================================================
// 9. INPATIENT ADMISSION & BED MANAGEMENT (Section 7.2)
// ============================================================================

export type WardCategory =
  | 'GENERAL'
  | 'SEMI_PRIVATE'
  | 'PRIVATE'
  | 'ICU'
  | 'STEP_DOWN'
  | 'EMERGENCY_OBSERVATION';

export type BedState =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'BLOCKED'
  | 'CLEANING'
  | 'MAINTENANCE'
  | 'RESERVED';

export interface HospitalBed {
  id: string;
  facilityId: string;
  wardName: string;
  bedNumber: string;
  wardCategory: WardCategory;
  status: BedState;
  currentAdmissionId?: string;
  isEquippedForVentilator: boolean;
  lastSanitizedAt: string;
  updatedAt: string;
}

export interface InpatientAdmission {
  id: string;
  patientId: string;
  facilityId: string;
  admittingDoctorId: string;
  admittedAt: string;
  dischargeDate?: string;
  admittingDiagnosis: string;
  status: 'ADMITTED' | 'PREPARING_DISCHARGE' | 'DISCHARGED' | 'TRANSFERRED';
  bedId: string;
  careTeamDoctorIds: string[];
  depositMinorUnits: number;
}

export interface DischargeChecklist {
  id: string;
  admissionId: string;
  dischargeReason: string;
  finalDiagnosis: string;
  dischargeMedications: string[];
  followUpInstructions: string;
  warningSigns: string[];
  isDoctorSigned: boolean;
  signedAt?: string;
  doctorSignatureHash?: string;
  isBedReleased: boolean;
  finalBillCleared: boolean;
}

// ============================================================================
// 10. NURSING MANAGEMENT & MAR (Section 7.3)
// ============================================================================

export interface NursingObservation {
  id: string;
  admissionId: string;
  patientId: string;
  nurseId: string;
  timestamp: string;
  heartRateBpm: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  spO2Percent: number;
  temperatureCelsius: number;
  respiratoryRateBpm: number;
  painScore: number; // 0-10
  intakeMl?: number;
  outputMl?: number;
  gcsScore?: number;
  notes?: string;
  isAbnormalAlert: boolean;
}

export type MarStatus = 'ADMINISTERED' | 'HELD_CLINICAL_REASON' | 'PATIENT_REFUSED' | 'OMITTED';

export interface MedicationAdministrationRecord {
  id: string;
  admissionId: string;
  patientId: string;
  prescriptionItemId: string;
  medicineName: string;
  dose: string;
  route: string;
  scheduledTime: string;
  administeredTime?: string;
  nurseId: string;
  status: MarStatus;
  clinicalReason?: string;
  nurseSignatureHash?: string;
}

// ============================================================================
// 11. LABORATORY INFORMATION SYSTEM (LIS) (Section 7.4)
// ============================================================================

export type LabOrderStatus =
  | 'ORDERED'
  | 'SPECIMEN_COLLECTED'
  | 'ACCESSIONED'
  | 'IN_PROCESSING'
  | 'PENDING_VALIDATION'
  | 'RELEASED'
  | 'CANCELLED';

export interface LabOrder {
  id: string;
  encounterId?: string;
  admissionId?: string;
  patientId: string;
  orderingDoctorId: string;
  facilityId: string;
  testCode: string;
  testName: string;
  clinicalIndication?: string;
  status: LabOrderStatus;
  createdAt: string;
}

export interface Specimen {
  id: string;
  labOrderId: string;
  specimenBarcode: string;
  sampleType: 'SERUM' | 'WHOLE_BLOOD' | 'URINE' | 'SWAB' | 'CSF' | 'TISSUE';
  collectionTime: string;
  collectorId: string;
  storageConditions: string;
}

export interface LabResultItem {
  parameterName: string;
  measuredValue: string;
  numericValue?: number;
  units: string;
  referenceRange: string;
  flag: 'NORMAL' | 'ABNORMAL_HIGH' | 'ABNORMAL_LOW' | 'CRITICAL';
  isCriticalPanic: boolean;
}

export interface LabResult {
  id: string;
  labOrderId: string;
  patientId: string;
  technicianId: string;
  items: LabResultItem[];
  pathologistReviewerId?: string;
  isValidatedByPathologist: boolean;
  validatedAt?: string;
  pathologistSignatureHash?: string;
  releasedAt?: string;
  status: 'PRELIMINARY' | 'VALIDATED' | 'RELEASED' | 'AMENDED';
  version: number;
}

// ============================================================================
// 12. RADIOLOGY & IMAGING (Section 7.5)
// ============================================================================

export interface ImagingStudy {
  id: string;
  patientId: string;
  facilityId: string;
  orderingDoctorId: string;
  modality: 'XRAY' | 'CT' | 'MRI' | 'ULTRASOUND';
  anatomicalRegion: string;
  studyInstanceUid: string;
  status: 'SCHEDULED' | 'ACQUIRED' | 'PRELIMINARY' | 'FINAL_VERIFIED' | 'AMENDED';
  radiologistId?: string;
  findingsSummary?: string;
  impression?: string;
  isVerified: boolean;
  signedAt?: string;
  imageUrlSecureToken: string;
}

// ============================================================================
// 13. PHARMACY & FORMULARY (Section 7.6)
// ============================================================================

export interface FormularyItem {
  id: string;
  facilityId: string;
  genericName: string;
  brandName: string;
  dosageForm: string;
  strength: string;
  batchNumber: string;
  expiryDate: string;
  stockQuantity: number;
  reorderLevel: number;
  unitPriceMinorUnits: number;
}

export interface DispenseRecord {
  id: string;
  prescriptionId: string;
  patientId: string;
  pharmacistId: string;
  facilityId: string;
  itemsDispensed: {
    genericName: string;
    brandName: string;
    quantity: number;
    batchNumber: string;
    unitPriceMinorUnits: number;
  }[];
  totalPriceMinorUnits: number;
  substitutionNotes?: string;
  counselingProvided: boolean;
  dispensedAt: string;
}

// ============================================================================
// 14. OPERATION THEATRE (OT) & SURGERY (Section 7.7)
// ============================================================================

export interface OTBooking {
  id: string;
  facilityId: string;
  otRoomId: string;
  patientId: string;
  leadSurgeonId: string;
  anaesthetistId: string;
  procedureName: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  status:
    | 'SCHEDULED'
    | 'PRE_OP_CHECK_DONE'
    | 'IN_SURGERY'
    | 'POST_OP_RECOVERY'
    | 'COMPLETED'
    | 'CANCELLED';
  whoChecklist: {
    signInDone: boolean;
    timeOutDone: boolean;
    signOutDone: boolean;
    scrubNurseId: string;
  };
  operativeNotes?: string;
  implantsUsed?: string[];
}

// ============================================================================
// 15. EMERGENCY & AMBULANCE (Section 7.8)
// ============================================================================

export type TriageLevel =
  | 'LEVEL_1_RESUSCITATION'
  | 'LEVEL_2_EMERGENT'
  | 'LEVEL_3_URGENT'
  | 'LEVEL_4_LESS_URGENT'
  | 'LEVEL_5_NON_URGENT';

export interface EmergencyTriageCase {
  id: string;
  facilityId: string;
  patientIdentifier: string;
  patientName?: string;
  arrivalMode: 'WALK_IN' | 'AMBULANCE' | 'POLICE_DROP';
  arrivalTime: string;
  triageLevel: TriageLevel;
  chiefComplaint: string;
  vitals: { hr: number; bp: string; spo2: number; gcs: number };
  assignedTraumaTeam: string;
  disposition: 'RESUS_BAY' | 'EMERGENCY_OT' | 'ICU_DIRECT' | 'ACUTE_OBSERVATION' | 'DISCHARGED';
  bypassedRoutineBooking: true;
}

export interface AmbulanceDispatch {
  id: string;
  callerPhone: string;
  pickupLocation: string;
  vehicleNumber: string;
  crewLeadName: string;
  destinationFacilityId: string;
  status: 'DISPATCHED' | 'ARRIVED_AT_SCENE' | 'TRANSIT_TO_HOSPITAL' | 'HANDOVER_COMPLETE';
  estimatedArrivalMins: number;
}

// ============================================================================
// 16. BLOOD BANK & INVENTORY (Section 7.9)
// ============================================================================

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodStockItem {
  id: string;
  facilityId: string;
  bloodGroup: BloodGroup;
  componentType: 'WHOLE_BLOOD' | 'PACKED_RBC' | 'PLATELET_CONCENTRATE' | 'FRESH_FROZEN_PLASMA';
  unitsAvailable: number;
  expiryDate: string;
  storageTempCelsius: number;
}

export interface BloodCrossmatch {
  id: string;
  patientId: string;
  patientBloodGroup: BloodGroup;
  requiredUnits: number;
  compatibilityResult: 'COMPATIBLE' | 'INCOMPATIBLE' | 'PENDING';
  testedByTechnicianId: string;
  issuedForPatientId?: string;
}

// ============================================================================
// 17. INSURANCE & TARIFFS (Section 12)
// ============================================================================

export interface TariffItem {
  id: string;
  facilityId: string;
  category: 'CONSULTATION' | 'BED' | 'SURGERY' | 'LAB' | 'IMAGING' | 'PHARMACY';
  serviceCode: string;
  serviceName: string;
  rateMinorUnits: number;
  effectiveFrom: string;
  version: number;
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  facilityId: string;
  payerName: string;
  policyNumber: string;
  preAuthStatus: 'SUBMITTED' | 'APPROVED' | 'QUERIED' | 'REJECTED';
  requestedAmountMinorUnits: number;
  approvedAmountMinorUnits: number;
  copayMinorUnits: number;
  settlementStatus: 'PENDING' | 'SETTLED' | 'REJECTED';
}

// ============================================================================
// 18. TELEMEDICINE VIDEO (Section 10)
// ============================================================================

export interface TelemedicineSession {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  roomToken: string;
  waitingRoomActive: boolean;
  status: 'WAITING_ROOM' | 'CONNECTED' | 'ENDED';
  recordingConsentGivenByAll: boolean;
  isRecordingActive: boolean;
  recordingStorageKey?: string;
  recordingRetentionDays?: number;
}

// ============================================================================
// 19. 5 BOUNDED AI SERVICES (Section 11)
// ============================================================================

export interface AINavigationAssessment {
  queryText: string;
  suggestedSpecialty: string;
  suggestedDepartment: string;
  isUrgentEmergency: boolean;
  emergencyGuidance?: string;
  confidenceScore: number;
  disclaimer: string;
}

export interface AIDoctorReportExtraction {
  documentId: string;
  ocrExtractedDate: string;
  extractedFields: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    isAbnormalFlag: boolean;
    confidence: number;
  }[];
  requiresDoctorReview: true;
  reviewedByDoctorId?: string;
  doctorAcceptedAt?: string;
}

export interface AISoapDraft {
  encounterId: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  isDraft: true;
  clinicianSignatureRequired: true;
}

export interface AIOperationsForecast {
  facilityId: string;
  metric: 'BED_OCCUPANCY' | 'OPD_WAIT_TIME' | 'LAB_TAT';
  forecastHorizonHours: number;
  predictedOccupancyPercent: number;
  recommendedAction: string;
  advisoryNotice: string;
}

export interface AISupportFAQ {
  userQuery: string;
  category: string;
  matchedAnswer: string;
  isClinicalRestricted: true;
}

// ============================================================================
// 20. ABDM & FHIR INTEROPERABILITY (Section 16)
// ============================================================================

export interface AbhaProfile {
  abhaNumber: string;
  abhaAddress: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  mobile: string;
  kycStatus: 'VERIFIED' | 'SELF_ATTESTED';
}

export interface FhirResourceBundle {
  resourceType: 'Bundle';
  type: 'document' | 'collection';
  entryCount: number;
  fhirJson: Record<string, unknown>;
}

// ============================================================================
// 21. ADVANCED SECURITY & INPATIENT FINANCE (Sections 12, 13, 19)
// ============================================================================

export interface SecurityIncident {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  incidentType: string;
  description: string;
  detectedAt: string;
  detectedBy: string;
  status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';
  affectedEntities: string[];
  certInReported: boolean;
  certInDeadline: string; // 6-hour reporting window under Section 70B IT Act
}

export interface InpatientInvoice {
  id: string;
  admissionId: string;
  patientId: string;
  facilityId: string;
  createdAt: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitRate: number;
    totalAmount: number;
    category: string;
    tariffVersion: string;
  }>;
  totalAmount: number;
  insuranceCovered: number;
  patientPayable: number;
  status: 'DRAFT' | 'ISSUED' | 'SETTLED' | 'DISPUTED';
}



