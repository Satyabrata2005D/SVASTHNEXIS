import { describe, it, expect } from 'vitest';
import {
  evaluateRbac,
  evaluateAbac,
  evaluateConsent,
} from '../../../packages/policy-engine/src/index.js';
import { UserSession, ConsentGrant } from '../../../packages/shared-types/src/index.js';

describe('Policy Engine: RBAC & ABAC Enforcement (BP Sec 03, IP Sec 06)', () => {
  it('explicitly denies Customer Care from accessing full clinical chart (CAT-07)', () => {
    const customerCareSession: UserSession = {
      userId: 'cc-agent-01',
      email: 'support@svasthnexis.org',
      roles: ['CUSTOMER_CARE'],
      isMfaVerified: true,
      activeSessionId: 'sess-01',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const rbacResult = evaluateRbac(customerCareSession.roles, 'clinical:read-chart');
    expect(rbacResult.allowed).toBe(false);
    expect(rbacResult.reason).toContain("explicitly denied for role 'CUSTOMER_CARE'");

    const abacResult = evaluateAbac({
      session: customerCareSession,
      action: 'clinical:read-chart',
      targetPatientId: 'pat-999',
    });
    expect(abacResult.allowed).toBe(false);
    expect(abacResult.decisionCode).toBe('DENY_RBAC');
  });

  it('explicitly denies Platform Administrator from reading or modifying clinical records', () => {
    const adminSession: UserSession = {
      userId: 'admin-01',
      email: 'admin@svasthnexis.org',
      roles: ['PLATFORM_ADMIN'],
      isMfaVerified: true,
      activeSessionId: 'sess-admin',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const readChart = evaluateRbac(adminSession.roles, 'clinical:read-chart');
    expect(readChart.allowed).toBe(false);

    const writePrescription = evaluateRbac(adminSession.roles, 'clinical:write-prescription');
    expect(writePrescription.allowed).toBe(false);
  });

  it('enforces multi-tenant isolation and blocks cross-tenant access (CAT-08)', () => {
    const hospitalAdminSession: UserSession = {
      userId: 'hosp-admin-a',
      email: 'admin@hospital-a.org',
      roles: ['HOSPITAL_ADMIN'],
      tenantId: 'facility-alpha',
      facilityId: 'facility-alpha',
      isMfaVerified: true,
      activeSessionId: 'sess-hosp',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    // Attempting to manage beds in Hospital Beta
    const crossTenantDecision = evaluateAbac({
      session: hospitalAdminSession,
      action: 'facility:manage-beds',
      targetTenantId: 'facility-beta',
    });

    expect(crossTenantDecision.allowed).toBe(false);
    expect(crossTenantDecision.decisionCode).toBe('DENY_TENANT');
    expect(crossTenantDecision.reason).toContain('Cross-tenant access forbidden');
  });

  it('allows verified clinician with active care relationship to read chart', () => {
    const doctorSession: UserSession = {
      userId: 'doc-123',
      email: 'dr.sharma@hospital-a.org',
      roles: ['DOCTOR_RMP'],
      tenantId: 'facility-alpha',
      facilityId: 'facility-alpha',
      isMfaVerified: true,
      activeSessionId: 'sess-doc',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    const legitimateAccess = evaluateAbac({
      session: doctorSession,
      action: 'clinical:read-chart',
      targetTenantId: 'facility-alpha',
      targetPatientId: 'pat-456',
      hasActiveCareRelationship: true,
    });

    expect(legitimateAccess.allowed).toBe(true);
    expect(legitimateAccess.decisionCode).toBe('ALLOW');
  });

  it('requires valid justification for emergency Break-Glass clinical override', () => {
    const doctorSession: UserSession = {
      userId: 'doc-er-01',
      email: 'dr.emergency@hospital-a.org',
      roles: ['DOCTOR_RMP'],
      tenantId: 'facility-alpha',
      facilityId: 'facility-alpha',
      isMfaVerified: true,
      activeSessionId: 'sess-doc-er',
      issuedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    };

    // Break glass without justification
    const missingJustification = evaluateAbac({
      session: doctorSession,
      action: 'clinical:read-chart',
      targetTenantId: 'facility-alpha',
      targetPatientId: 'pat-unknown',
      hasActiveCareRelationship: false,
      isBreakGlass: true,
      breakGlassReason: '',
    });
    expect(missingJustification.allowed).toBe(false);

    // Break glass with verified clinical emergency justification
    const validBreakGlass = evaluateAbac({
      session: doctorSession,
      action: 'clinical:read-chart',
      targetTenantId: 'facility-alpha',
      targetPatientId: 'pat-unknown',
      hasActiveCareRelationship: false,
      isBreakGlass: true,
      breakGlassReason: 'Unconscious patient brought to ER with severe trauma, checking allergy history',
    });
    expect(validBreakGlass.allowed).toBe(true);
    expect(validBreakGlass.decisionCode).toBe('ALLOW_BREAK_GLASS');
  });
});

describe('Scoped Patient Consent Evaluation (BP Sec 09, CAT-05, CAT-06)', () => {
  const sampleConsent: ConsentGrant = {
    id: 'cg-001',
    dataSubjectId: 'pat-100',
    recipientId: 'doc-200',
    purpose: 'CONSULTATION',
    scopeCategories: ['LAB_REPORT', 'PRESCRIPTION'],
    validFrom: '2026-11-01T00:00:00.000Z',
    validUntil: '2026-11-03T00:00:00.000Z',
    status: 'ACTIVE',
    noticeVersion: 'PRIV-2026-V1',
    grantedAt: '2026-11-01T00:00:00.000Z',
  };

  it('permits access when active consent matches recipient, category, and validity window', () => {
    const result = evaluateConsent({
      patientId: 'pat-100',
      recipientId: 'doc-200',
      requestedCategory: 'LAB_REPORT',
      declaredPurpose: 'CONSULTATION',
      currentTimeIso: '2026-11-02T12:00:00.000Z',
      activeConsents: [sampleConsent],
    });

    expect(result.isGranted).toBe(true);
    expect(result.matchedConsentId).toBe('cg-001');
  });

  it('strictly blocks access if requested category is outside consented scope (CAT-05)', () => {
    const result = evaluateConsent({
      patientId: 'pat-100',
      recipientId: 'doc-200',
      requestedCategory: 'DISCHARGE_SUMMARY', // Not in ['LAB_REPORT', 'PRESCRIPTION']
      declaredPurpose: 'CONSULTATION',
      currentTimeIso: '2026-11-02T12:00:00.000Z',
      activeConsents: [sampleConsent],
    });

    expect(result.isGranted).toBe(false);
    expect(result.reason).toContain('No active, unexpired consent grant permits');
  });

  it('strictly blocks access when consent has expired (CAT-06)', () => {
    const result = evaluateConsent({
      patientId: 'pat-100',
      recipientId: 'doc-200',
      requestedCategory: 'LAB_REPORT',
      declaredPurpose: 'CONSULTATION',
      currentTimeIso: '2026-11-04T00:00:00.000Z', // After validUntil (2026-11-03)
      activeConsents: [sampleConsent],
    });

    expect(result.isGranted).toBe(false);
    expect(result.reason).toContain('Access denied');
  });

  it('strictly blocks access when consent has been revoked by patient (CAT-06)', () => {
    const revokedConsent: ConsentGrant = {
      ...sampleConsent,
      status: 'REVOKED',
      revokedAt: '2026-11-02T08:00:00.000Z',
    };

    const result = evaluateConsent({
      patientId: 'pat-100',
      recipientId: 'doc-200',
      requestedCategory: 'LAB_REPORT',
      declaredPurpose: 'CONSULTATION',
      currentTimeIso: '2026-11-02T09:00:00.000Z',
      activeConsents: [revokedConsent],
    });

    expect(result.isGranted).toBe(false);
  });
});
