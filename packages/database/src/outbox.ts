/**
 * @file packages/database/src/outbox.ts
 * Transactional Outbox Pattern Manager & Durable Event Relay
 * Derived from ADR-007 and Blueprint Section 18.
 */

import pg from 'pg';
import * as crypto from 'crypto';
import { StructuredLogger } from '@svasthnexis/observability';

const logger = new StructuredLogger('TransactionalOutbox');

export interface OutboxEventRecord {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'PUBLISHED' | 'FAILED';
  retryCount: number;
  lastError?: string;
  createdAt: string;
  publishedAt?: string;
}

export class TransactionalOutboxManager {
  private clientOrPool: pg.Pool | pg.PoolClient;

  constructor(clientOrPool: pg.Pool | pg.PoolClient) {
    this.clientOrPool = clientOrPool;
  }

  /**
   * Enqueues an event into outbox_events within an active database transaction
   */
  public async enqueueEvent(
    aggregateType: string,
    aggregateId: string,
    eventType: string,
    payload: Record<string, unknown>,
    client?: pg.PoolClient
  ): Promise<string> {
    const id = `evt-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const executor = client || this.clientOrPool;

    const sql = `
      INSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload_json, status, retry_count)
      VALUES ($1, $2, $3, $4, $5, 'PENDING', 0)
      RETURNING id;
    `;

    await executor.query(sql, [id, aggregateType, aggregateId, eventType, JSON.stringify(payload)]);
    logger.debug(`Enqueued outbox event ${eventType} for ${aggregateType}:${aggregateId}`, { eventId: id });
    return id;
  }

  /**
   * Fetches pending events for dispatch to durable queue (e.g. BullMQ / Redis)
   */
  public async fetchPendingEvents(batchSize = 50): Promise<OutboxEventRecord[]> {
    const sql = `
      SELECT id, aggregate_type, aggregate_id, event_type, payload_json, status, retry_count, last_error, created_at, published_at
      FROM outbox_events
      WHERE status = 'PENDING'
      ORDER BY created_at ASC
      LIMIT $1;
    `;

    const res = await this.clientOrPool.query(sql, [batchSize]);
    return res.rows.map((r) => ({
      id: r.id,
      aggregateType: r.aggregate_type,
      aggregateId: r.aggregate_id,
      eventType: r.event_type,
      payload: r.payload_json,
      status: r.status,
      retryCount: r.retry_count,
      lastError: r.last_error,
      createdAt: r.created_at,
      publishedAt: r.published_at,
    }));
  }

  /**
   * Marks an outbox event as successfully published
   */
  public async markPublished(eventId: string): Promise<void> {
    const sql = `
      UPDATE outbox_events
      SET status = 'PUBLISHED', published_at = NOW()
      WHERE id = $1;
    `;
    await this.clientOrPool.query(sql, [eventId]);
  }

  /**
   * Marks an outbox event as failed with retry increment
   */
  public async markFailed(eventId: string, errorMessage: string): Promise<void> {
    const sql = `
      UPDATE outbox_events
      SET retry_count = retry_count + 1,
          last_error = $2,
          status = CASE WHEN retry_count + 1 >= 5 THEN 'FAILED' ELSE 'PENDING' END
      WHERE id = $1;
    `;
    await this.clientOrPool.query(sql, [eventId, errorMessage]);
  }
}

