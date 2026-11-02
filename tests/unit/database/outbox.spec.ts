import { describe, it, expect, vi } from 'vitest';
import { TransactionalOutboxManager } from '../../../packages/database/src/outbox.js';

describe('Transactional Outbox Manager (ADR-007, BP Sec 18)', () => {
  it('enqueues domain events within database transaction with structured payload', async () => {
    const mockQuery = vi.fn().mockResolvedValue({ rows: [{ id: 'evt-test-123' }] });
    const mockClient = { query: mockQuery } as any;

    const outbox = new TransactionalOutboxManager(mockClient);
    const eventId = await outbox.enqueueEvent(
      'Appointment',
      'apt-001',
      'AppointmentConfirmed',
      { patientId: 'pat-001', facilityId: 'fac-001', slotId: 'slot-001' }
    );

    expect(eventId).toBeDefined();
    expect(mockQuery).toHaveBeenCalledTimes(1);
    const querySql = mockQuery.mock.calls[0][0];
    const queryParams = mockQuery.mock.calls[0][1];

    expect(querySql).toContain('INSERT INTO outbox_events');
    expect(queryParams[1]).toBe('Appointment');
    expect(queryParams[2]).toBe('apt-001');
    expect(queryParams[3]).toBe('AppointmentConfirmed');
    expect(JSON.parse(queryParams[4])).toEqual({
      patientId: 'pat-001',
      facilityId: 'fac-001',
      slotId: 'slot-001',
    });
  });

  it('fetches pending outbox events ordered by created_at', async () => {
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [
        {
          id: 'evt-001',
          aggregate_type: 'Encounter',
          aggregate_id: 'enc-001',
          event_type: 'ClinicalNoteSigned',
          payload_json: { doctorId: 'doc-001' },
          status: 'PENDING',
          retry_count: 0,
          created_at: new Date().toISOString(),
        },
      ],
    });
    const mockClient = { query: mockQuery } as any;

    const outbox = new TransactionalOutboxManager(mockClient);
    const events = await outbox.fetchPendingEvents(10);

    expect(events.length).toBe(1);
    expect(events[0]!.id).toBe('evt-001');
    expect(events[0]!.eventType).toBe('ClinicalNoteSigned');
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('LIMIT $1'), [10]);
  });

  it('marks published events successfully', async () => {
    const mockQuery = vi.fn().mockResolvedValue({ rowCount: 1 });
    const mockClient = { query: mockQuery } as any;

    const outbox = new TransactionalOutboxManager(mockClient);
    await outbox.markPublished('evt-001');

    expect(mockQuery).toHaveBeenCalledTimes(1);
    const sql = mockQuery.mock.calls[0][0];
    expect(sql).toContain("SET status = 'PUBLISHED'");
  });

  it('increments retry count on failure and moves to FAILED when retry threshold reached', async () => {
    const mockQuery = vi.fn().mockResolvedValue({ rowCount: 1 });
    const mockClient = { query: mockQuery } as any;

    const outbox = new TransactionalOutboxManager(mockClient);
    await outbox.markFailed('evt-001', 'Connection timeout to notification provider');

    expect(mockQuery).toHaveBeenCalledTimes(1);
    const sql = mockQuery.mock.calls[0][0];
    expect(sql).toContain('retry_count = retry_count + 1');
    expect(sql).toContain("status = CASE WHEN retry_count + 1 >= 5 THEN 'FAILED' ELSE 'PENDING' END");
  });
});

