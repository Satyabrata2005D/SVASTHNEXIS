/**
 * @file packages/policy-engine/src/rbac.ts
 * Role-Based Access Control and Explicit Deny Matrix
 * Derived from Blueprint Section 03 and Implementation Plan Section 06.
 */

import { UserRole } from '@svasthnexis/shared-types';

export type SystemAction =
  | 'platform:configure'
  | 'platform:admin-lifecycle'
  | 'platform:view-audit'
  | 'facility:manage-profile'
  | 'facility:manage-tariffs'
  | 'facility:manage-beds'
  | 'provider:verify-credentials'
  | 'provider:manage-affiliations'
  | 'appointment:book'
  | 'appointment:accept-reject'
  | 'clinical:read-chart'
  | 'clinical:write-note'
  | 'clinical:sign-note'
  | 'clinical:amend-note'
  | 'clinical:write-prescription'
  | 'diagnostics:order'
  | 'diagnostics:enter-result'
  | 'diagnostics:validate-result'
  | 'diagnostics:release-result'
  | 'finance:process-payment'
  | 'finance:record-offline-cash'
  | 'finance:issue-refund'
  | 'support:view-ticket'
  | 'support:resolve-ticket'
  | 'records:upload'
  | 'records:view'
  | 'records:manage-consent';

export interface RbacDecision {
  allowed: boolean;
  reason: string;
}

/**
 * Standard Role-to-Allowed-Actions mapping
 */
const ROLE_PERMISSIONS: Record<UserRole, readonly SystemAction[]> = {
  PLATFORM_ADMIN: [
    'platform:configure',
    'platform:admin-lifecycle',
    'platform:view-audit',
    'support:view-ticket',
    'support:resolve-ticket',
  ],
  VERIFICATION_OFFICER: [
    'provider:verify-credentials',
    'support:view-ticket',
    'support:resolve-ticket',
  ],
  CUSTOMER_CARE: [
    'support:view-ticket',
    'support:resolve-ticket',
  ],
  STAFF_EMPLOYEE: [
    'support:view-ticket',
    'support:resolve-ticket',
    'finance:record-offline-cash',
  ],
  HOSPITAL_ADMIN: [
    'facility:manage-profile',
    'facility:manage-tariffs',
    'facility:manage-beds',
    'provider:manage-affiliations',
    'appointment:accept-reject',
    'finance:record-offline-cash',
    'support:view-ticket',
  ],
  DOCTOR_RMP: [
    'appointment:accept-reject',
    'clinical:read-chart',
    'clinical:write-note',
    'clinical:sign-note',
    'clinical:amend-note',
    'clinical:write-prescription',
    'diagnostics:order',
    'records:view',
  ],
  NURSE: [
    'clinical:read-chart',
    'facility:manage-beds',
    'records:view',
  ],
  LAB_TECHNICIAN: [
    'diagnostics:enter-result',
    'diagnostics:validate-result',
    'diagnostics:release-result',
  ],
  RADIOLOGIST: [
    'diagnostics:enter-result',
    'diagnostics:validate-result',
    'diagnostics:release-result',
    'clinical:read-chart',
  ],
  PHARMACIST: [
    'records:view',
  ],
  PATIENT: [
    'appointment:book',
    'records:upload',
    'records:view',
    'records:manage-consent',
    'support:view-ticket',
    'finance:process-payment',
  ],
  GUARDIAN: [
    'appointment:book',
    'records:upload',
    'records:view',
    'records:manage-consent',
    'support:view-ticket',
    'finance:process-payment',
  ],
};

/**
 * Explicit Deny Matrix: Non-negotiable restrictions enforced regardless of other granted roles
 */
const EXPLICIT_DENIALS: Record<UserRole, readonly SystemAction[]> = {
  PLATFORM_ADMIN: [
    'clinical:read-chart',
    'clinical:write-note',
    'clinical:sign-note',
    'clinical:write-prescription',
    'diagnostics:enter-result',
    'diagnostics:release-result',
  ],
  CUSTOMER_CARE: [
    'clinical:read-chart',
    'clinical:write-note',
    'clinical:sign-note',
    'clinical:write-prescription',
    'finance:issue-refund', // Can triage, but not unilaterally authorize finance refunds
  ],
  VERIFICATION_OFFICER: [
    'clinical:read-chart',
    'clinical:write-note',
  ],
  HOSPITAL_ADMIN: [
    'clinical:write-note',
    'clinical:sign-note',
    'clinical:write-prescription',
  ],
  NURSE: [
    'clinical:sign-note',
    'clinical:write-prescription',
  ],
  LAB_TECHNICIAN: [
    'clinical:write-note',
    'clinical:write-prescription',
  ],
  RADIOLOGIST: [
    'clinical:write-prescription',
  ],
  PHARMACIST: [
    'clinical:sign-note',
  ],
  STAFF_EMPLOYEE: [
    'clinical:read-chart',
  ],
  PATIENT: [
    'clinical:write-note',
    'clinical:sign-note',
    'diagnostics:validate-result',
  ],
  GUARDIAN: [
    'clinical:write-note',
    'clinical:sign-note',
    'diagnostics:validate-result',
  ],
  DOCTOR_RMP: [],
};

/**
 * Evaluates whether a set of user roles is permitted to perform a given action under RBAC
 */
export function evaluateRbac(roles: UserRole[], action: SystemAction): RbacDecision {
  if (!roles || roles.length === 0) {
    return { allowed: false, reason: 'No active roles assigned to session' };
  }

  // Check explicit denials first across all user roles
  for (const role of roles) {
    const denials = EXPLICIT_DENIALS[role] || [];
    if (denials.includes(action)) {
      return {
        allowed: false,
        reason: `Action '${action}' is explicitly denied for role '${role}' under separation of duties`,
      };
    }
  }

  // Check if at least one role permits the action
  for (const role of roles) {
    const permissions = ROLE_PERMISSIONS[role] || [];
    if (permissions.includes(action)) {
      return {
        allowed: true,
        reason: `Action '${action}' permitted by role '${role}'`,
      };
    }
  }

  return {
    allowed: false,
    reason: `Action '${action}' is not granted to roles: [${roles.join(', ')}]`,
  };
}
