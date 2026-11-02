/**
 * @file packages/audit/src/audit-logger.ts
 * Tamper-Evident Append-Only Audit Event Logger
 * Derived from Blueprint Sections 03, 09, 19 and Implementation Plan Section 13.
 */

import { AuditEvent, UserRole } from '@svasthnexis/shared-types';
import * as crypto from 'crypto';

export interface CreateAuditInput {
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

export interface StoredAuditEvent extends AuditEvent {
  previousEventHash?: string;
  eventHash: string;
}

export class AuditLogEngine {
  private events: StoredAuditEvent[] = [];
  private lastHash: string = 'GENESIS_HASH_SVASTHNEXIS_2026';

  /**
   * Appends an audit event to the tamper-evident chain
   */
  public log(input: CreateAuditInput): StoredAuditEvent {
    const id = `audit-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const timestamp = new Date().toISOString();

    const baseEvent: AuditEvent = {
      id,
      timestamp,
      correlationId: input.correlationId,
      tenantId: input.tenantId,
      actorId: input.actorId,
      actorRole: input.actorRole,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      declaredPurpose: input.declaredPurpose,
      outcome: input.outcome,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      metadata: input.metadata,
    };

    // Calculate SHA-256 block hash for immutable provenance
    const payloadToHash = JSON.stringify({
      ...baseEvent,
      previousHash: this.lastHash,
    });
    const eventHash = crypto.createHash('sha256').update(payloadToHash).digest('hex');

    const storedEvent: StoredAuditEvent = {
      ...baseEvent,
      previousEventHash: this.lastHash,
      eventHash,
    };

    this.events.push(storedEvent);
    this.lastHash = eventHash;

    return storedEvent;
  }

  /**
   * Retrieves all logged events (read-only)
   */
  public getEvents(): readonly StoredAuditEvent[] {
    return Object.freeze([...this.events]);
  }

  /**
   * Verifies the cryptographic chain integrity of the audit log
   */
  public verifyChainIntegrity(): { isValid: boolean; brokenAtIndex?: number } {
    let currentExpectedPrev = 'GENESIS_HASH_SVASTHNEXIS_2026';

    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i]!;
      if (event.previousEventHash !== currentExpectedPrev) {
        return { isValid: false, brokenAtIndex: i };
      }

      const payload = JSON.stringify({
        id: event.id,
        timestamp: event.timestamp,
        correlationId: event.correlationId,
        tenantId: event.tenantId,
        actorId: event.actorId,
        actorRole: event.actorRole,
        action: event.action,
        resourceType: event.resourceType,
        resourceId: event.resourceId,
        declaredPurpose: event.declaredPurpose,
        outcome: event.outcome,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        metadata: event.metadata,
        previousHash: currentExpectedPrev,
      });

      const recomputedHash = crypto.createHash('sha256').update(payload).digest('hex');
      if (recomputedHash !== event.eventHash) {
        return { isValid: false, brokenAtIndex: i };
      }

      currentExpectedPrev = event.eventHash;
    }

    return { isValid: true };
  }
}
