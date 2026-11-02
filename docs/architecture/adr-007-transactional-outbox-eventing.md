# ADR-007: Asynchronous Processing via Transactional Outbox & Idempotent Workers

## Status
Accepted (Mandatory Architecture & Reliability Baseline)

## Context
Critical healthcare workflows trigger secondary operations (notifications, document OCR, payment reconciliation, audit publishing, cache invalidation). Direct inline execution risks dual-write failures (e.g., booking confirmed in DB but notification crash causes rollback, or payment recorded but ledger entry lost). Furthermore, distributed messaging without idempotency risks double processing of webhooks or duplicate notifications.

## Decision
1. **Transactional Outbox Pattern:**
   - Every domain mutation and its resulting domain event(s) are written within the **same atomic PostgreSQL transaction**.
   - Events are written to an `outbox_events` table (`id`, `aggregate_type`, `aggregate_id`, `event_type`, `payload`, `status`, `created_at`).
2. **Durable Relay Dispatcher:**
   - An asynchronous background poller / CDC relay reads pending `outbox_events` and enqueues them into Redis-backed BullMQ queues.
   - On successful queue acknowledgment, the outbox record is marked `PUBLISHED`.
3. **Idempotent Consumers:**
   - Every asynchronous worker records processed event IDs in an `idempotency_keys` table.
   - Duplicate events are detected and safely skipped without re-executing side effects.
4. **Retry with Exponential Backoff & Dead-Letter Queue (DLQ):**
   - Failed events are retried with exponential backoff and jitter (up to 5 attempts).
   - Poison messages are moved to a dead-letter queue (`failed_events_dlq`) and trigger alerts for engineer intervention and manual replay.
5. **Payload Hygiene:**
   - Event payloads contain references (e.g., `appointmentId`, `documentId`), event types, and metadata.
   - Unencrypted clinical narratives, raw credit card data, or patient PII are strictly excluded from event payloads.

## Consequences
- Guaranteed at-least-once delivery with exactly-once processing semantics.
- Resilient asynchronous operations that do not compromise primary transactional latency.

