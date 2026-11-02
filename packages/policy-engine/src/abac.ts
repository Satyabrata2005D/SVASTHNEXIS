/**
 * @file packages/policy-engine/src/abac.ts
 * Attribute-Based Access Control and Tenant Isolation Evaluator
 * Derived from Blueprint Section 03 & Section 14.
 */

import { UserSession } from '@svasthnexis/shared-types';
import { SystemAction, evaluateRbac } from './rbac.js';

export interface AccessRequestContext {
  session: UserSession;
  action: SystemAction;
  targetTenantId?: string; // Target hospital/facility
  targetPatientId?: string;
  hasActiveCareRelationship?: boolean;
  isBreakGlass?: boolean;
  breakGlassReason?: string;
  declaredPurpose?: string;
}

export interface AbacDecision {
  allowed: boolean;
  decisionCode: 'ALLOW' | 'DENY_RBAC' | 'DENY_TENANT' | 'DENY_MFA' | 'DENY_CARE_RELATION' | 'ALLOW_BREAK_GLASS';
  reason: string;
}

/**
 * High-privilege actions requiring MFA verification
 */
const MFA_REQUIRED_ACTIONS: readonly SystemAction[] = [
  'platform:configure',
  'platform:admin-lifecycle',
  'platform:view-audit',
  'clinical:sign-note',
  'clinical:write-prescription',
  'finance:issue-refund',
  'diagnostics:release-result',
];

/**
 * Evaluates contextual and attribute-based security parameters for an access request
 */
export function evaluateAbac(context: AccessRequestContext): AbacDecision {
  const { session, action, targetTenantId, targetPatientId, hasActiveCareRelationship, isBreakGlass } = context;

  // 1. RBAC baseline check
  const rbac = evaluateRbac(session.roles, action);
  if (!rbac.allowed) {
    return {
      allowed: false,
      decisionCode: 'DENY_RBAC',
      reason: rbac.reason,
    };
  }

  // 2. MFA Requirement check for privileged actions
  if (MFA_REQUIRED_ACTIONS.includes(action) && !session.isMfaVerified) {
    return {
      allowed: false,
      decisionCode: 'DENY_MFA',
      reason: `Action '${action}' requires verified Multi-Factor Authentication (MFA)`,
    };
  }

  // 3. Multi-Tenant Boundary Enforcement
  // If targetTenantId is specified, user must belong to that tenant OR be PLATFORM_ADMIN (for platform governance actions only)
  if (targetTenantId) {
    const isPlatformAdmin = session.roles.includes('PLATFORM_ADMIN');
    const isTenantMember = session.tenantId === targetTenantId || session.facilityId === targetTenantId;

    if (!isTenantMember && !isPlatformAdmin) {
      return {
        allowed: false,
        decisionCode: 'DENY_TENANT',
        reason: `Cross-tenant access forbidden. Session tenant (${session.tenantId}) does not match target (${targetTenantId})`,
      };
    }

    // Platform admins cannot read clinical data even if targeting a tenant
    if (isPlatformAdmin && action.startsWith('clinical:')) {
      return {
        allowed: false,
        decisionCode: 'DENY_TENANT',
        reason: 'Platform administrators are explicitly barred from clinical record access',
      };
    }
  }

  // 4. Clinical Relationship & Break-Glass Logic
  if (action === 'clinical:read-chart') {
    // If clinician has active care relationship, access is permitted
    if (hasActiveCareRelationship) {
      return {
        allowed: true,
        decisionCode: 'ALLOW',
        reason: 'Access granted via active care relationship',
      };
    }

    // Patient reading their own chart
    if (session.roles.includes('PATIENT') && session.userId === targetPatientId) {
      return {
        allowed: true,
        decisionCode: 'ALLOW',
        reason: 'Patient accessing own chart',
      };
    }

    // Break-Glass clinical emergency exception
    if (isBreakGlass) {
      if (session.roles.includes('DOCTOR_RMP')) {
        if (!context.breakGlassReason || context.breakGlassReason.trim().length < 10) {
          return {
            allowed: false,
            decisionCode: 'DENY_CARE_RELATION',
            reason: 'Break-glass access requires a documented emergency clinical justification (min 10 chars)',
          };
        }
        return {
          allowed: true,
          decisionCode: 'ALLOW_BREAK_GLASS',
          reason: `Break-glass emergency override granted for Doctor ${session.userId}: ${context.breakGlassReason}`,
        };
      }
    }

    return {
      allowed: false,
      decisionCode: 'DENY_CARE_RELATION',
      reason: 'No active clinical care relationship or valid break-glass justification exists',
    };
  }

  return {
    allowed: true,
    decisionCode: 'ALLOW',
    reason: 'ABAC authorization policies satisfied',
  };
}
