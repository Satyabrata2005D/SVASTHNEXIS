/**
 * @file packages/test-fixtures/src/demo-data.ts
 * Standard Seeded Test Fixtures for Local Development & Acceptance Testing
 * Visibly marked with `isDemoFixture: true`. Never copied to production.
 */

import {
  HospitalFacility,
  DoctorProfile,
  DoctorAffiliation,
  DoctorScheduleSlot,
} from '@svasthnexis/shared-types';

export const DEMO_FACILITY: HospitalFacility & { isDemoFixture: true } = {
  isDemoFixture: true,
  id: 'fac-citycare-01',
  legalName: 'City Care Healthcare Private Limited',
  tradeName: 'City Care General Hospital',
  facilityType: 'HOSPITAL',
  registrationNumber: 'KA-MED-REG-2024-88912',
  issuingAuthority: 'Karnataka State Health Authority',
  address: {
    line1: '42 Health Sciences Boulevard',
    locality: 'Koramangala 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560034',
    latitude: 12.9352,
    longitude: 77.6245,
  },
  contactPhone: '+918025550100',
  contactEmail: 'contact@citycare.example.org',
  operatingHours: '24/7 (Emergency & IPD); OPD: Mon-Sat 08:00 - 20:00',
  isEmergencyReady: true,
  verificationStatus: 'VERIFIED',
  lastVerifiedAt: '2026-10-15T09:00:00.000Z',
  createdAt: '2026-01-10T00:00:00.000Z',
  updatedAt: '2026-10-15T09:00:00.000Z',
};

export const DEMO_DOCTORS: Array<DoctorProfile & { isDemoFixture: true }> = [
  {
    isDemoFixture: true,
    id: 'doc-sharma-01',
    userId: 'usr-doc-sharma',
    fullName: 'Dr. Ananya Sharma',
    registrationNumber: 'KMC-77412',
    registrationCouncil: 'Karnataka Medical Council',
    qualificationDegrees: ['MBBS', 'MD (General Medicine)', 'DM (Cardiology)'],
    primarySpecialty: 'Cardiology',
    subSpecialties: ['Preventive Cardiology', 'Heart Failure Management'],
    languagesSpoken: ['English', 'Hindi', 'Kannada'],
    yearsExperience: 14,
    evidencedSurgeriesCount: 420,
    publications: [
      {
        title: 'Contemporary Management of Acute Coronary Syndromes in Urban India',
        journal: 'Indian Heart Journal',
        year: 2024,
        doi: '10.1016/j.ihj.2024.01.002',
      },
    ],
    verificationStatus: 'VERIFIED',
    verifiedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    isDemoFixture: true,
    id: 'doc-varma-02',
    userId: 'usr-doc-varma',
    fullName: 'Dr. Rajesh Varma',
    registrationNumber: 'KMC-55821',
    registrationCouncil: 'Karnataka Medical Council',
    qualificationDegrees: ['MBBS', 'MD (Internal Medicine)'],
    primarySpecialty: 'General Medicine',
    subSpecialties: ['Diabetology', 'Infectious Diseases'],
    languagesSpoken: ['English', 'Hindi', 'Telugu'],
    yearsExperience: 18,
    verificationStatus: 'VERIFIED',
    verifiedAt: '2026-09-05T14:30:00.000Z',
  },
];

export const DEMO_AFFILIATIONS: Array<DoctorAffiliation & { isDemoFixture: true }> = [
  {
    isDemoFixture: true,
    id: 'aff-sharma-citycare',
    doctorId: 'doc-sharma-01',
    facilityId: 'fac-citycare-01',
    departmentName: 'Department of Cardiology',
    consultationFeeMinorUnits: 80000, // INR 800.00
    modesSupported: ['IN_PERSON', 'TELECONSULTATION'],
    approvalStatus: 'ACTIVE',
    effectiveFrom: '2026-01-01T00:00:00.000Z',
  },
  {
    isDemoFixture: true,
    id: 'aff-varma-citycare',
    doctorId: 'doc-varma-02',
    facilityId: 'fac-citycare-01',
    departmentName: 'Department of General Medicine',
    consultationFeeMinorUnits: 60000, // INR 600.00
    modesSupported: ['IN_PERSON', 'TELECONSULTATION'],
    approvalStatus: 'ACTIVE',
    effectiveFrom: '2026-01-01T00:00:00.000Z',
  },
];

export const DEMO_SLOTS: Array<DoctorScheduleSlot & { isDemoFixture: true }> = [
  {
    isDemoFixture: true,
    id: 'slot-sharma-101',
    doctorId: 'doc-sharma-01',
    facilityId: 'fac-citycare-01',
    startTime: '2026-11-03T09:00:00.000Z',
    endTime: '2026-11-03T09:30:00.000Z',
    mode: 'IN_PERSON',
    capacity: 1,
    allocatedCount: 0,
    isHeld: false,
    version: 1,
  },
  {
    isDemoFixture: true,
    id: 'slot-sharma-102',
    doctorId: 'doc-sharma-01',
    facilityId: 'fac-citycare-01',
    startTime: '2026-11-03T09:30:00.000Z',
    endTime: '2026-11-03T10:00:00.000Z',
    mode: 'TELECONSULTATION',
    capacity: 1,
    allocatedCount: 0,
    isHeld: false,
    version: 1,
  },
  {
    isDemoFixture: true,
    id: 'slot-varma-201',
    doctorId: 'doc-varma-02',
    facilityId: 'fac-citycare-01',
    startTime: '2026-11-03T10:00:00.000Z',
    endTime: '2026-11-03T10:30:00.000Z',
    mode: 'IN_PERSON',
    capacity: 1,
    allocatedCount: 0,
    isHeld: false,
    version: 1,
  },
];

export const DEMO_PATIENTS = [
  {
    isDemoFixture: true,
    id: 'pat-verma-01',
    userId: 'usr-pat-verma',
    fullName: 'Rahul Verma',
    phone: '+919876543210',
    email: 'rahul.verma@example.org',
    gender: 'MALE',
    dateOfBirth: '1988-04-12',
    preferredLanguage: 'English',
    emergencyContact: {
      name: 'Sunita Verma',
      relationship: 'SPOUSE',
      phone: '+919876543211',
    },
  },
  {
    isDemoFixture: true,
    id: 'pat-aarav-dep',
    primaryGuardianPatientId: 'pat-verma-01',
    fullName: 'Aarav Verma',
    gender: 'MALE',
    dateOfBirth: '2020-08-19',
    relationship: 'CHILD',
    guardianAuthorityVerified: true,
  },
];
