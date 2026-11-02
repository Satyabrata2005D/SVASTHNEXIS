import { describe, it, expect } from 'vitest';
import {
  checkAdminCap,
  initiateAdminRemoval,
  approveAdminRemoval,
  MAX_PLATFORM_ADMINS,
  COOLING_OFF_DAYS,
} from '../../../packages/policy-engine/src/admin-governance.js';
import { PlatformAdminLifecycle } from '../../../packages/shared-types/src/index.js';

describe('Admin Governance & 7-Day Removal Lifecycle (T-01, BP Sec 03)', () => {
  it('enforces maximum 5 active platform administrators', () => {
    // Under limit
    const allowedCheck = checkAdminCap(4);
    expect(allowedCheck.allowed).toBe(true);

    // At limit (5 active admins)
    const blockedCheck = checkAdminCap(5);
    expect(blockedCheck.allowed).toBe(false);
    expect(blockedCheck.reason).toContain('Platform administrator limit reached');

    // Over limit safeguard
    const overLimitCheck = checkAdminCap(6);
    expect(overLimitCheck.allowed).toBe(false);
  });

  it('initiates 7-day cooling-off period upon admin removal request', () => {
    const admin: PlatformAdminLifecycle = {
      adminId: 'admin-002',
      userId: 'user-002',
      status: 'ACTIVE',
      appointedAt: new Date('2026-01-01').toISOString(),
    };

    const initiationTime = new Date('2026-11-01T10:00:00.000Z');
    const result = initiateAdminRemoval(admin, 'admin-001', 'Suspected compromise', initiationTime);

    expect(result.success).toBe(true);
    expect(result.updatedAdmin.status).toBe('REMOVAL_REQUESTED');
    expect(result.updatedAdmin.removalReason).toBe('Suspected compromise');

    // Verify 7-day cooling-off end date
    const expectedEnd = new Date(initiationTime.getTime() + COOLING_OFF_DAYS * 24 * 60 * 60 * 1000).toISOString();
    expect(result.updatedAdmin.coolingOffEndsAt).toBe(expectedEnd);
  });

  it('strictly blocks removal approval before 7-day cooling-off period elapses', () => {
    const initiationTime = new Date('2026-11-01T10:00:00.000Z');
    const coolingOffEnd = new Date(initiationTime.getTime() + COOLING_OFF_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const pendingAdmin: PlatformAdminLifecycle = {
      adminId: 'admin-002',
      userId: 'user-002',
      status: 'REMOVAL_REQUESTED',
      appointedAt: new Date('2026-01-01').toISOString(),
      removalRequestedAt: initiationTime.toISOString(),
      coolingOffEndsAt: coolingOffEnd,
    };

    // Attempting approval on Day 3 (premature)
    const day3 = new Date('2026-11-04T10:00:00.000Z');
    const prematureResult = approveAdminRemoval(pendingAdmin, 'admin-003', day3);

    expect(prematureResult.success).toBe(false);
    expect(prematureResult.error).toContain('Cannot complete removal during the mandatory 7-day cooling-off window');

    // Attempting approval on Day 8 (cooling-off elapsed)
    const day8 = new Date('2026-11-09T10:00:00.000Z');
    const approvedResult = approveAdminRemoval(pendingAdmin, 'admin-003', day8);

    expect(approvedResult.success).toBe(true);
    expect(approvedResult.updatedAdmin?.status).toBe('DEACTIVATED');
    expect(approvedResult.updatedAdmin?.independentApproverId).toBe('admin-003');
    expect(approvedResult.updatedAdmin?.archivedAt).toBeDefined();
  });
});
