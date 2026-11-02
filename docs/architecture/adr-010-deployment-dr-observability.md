# ADR-010: Deployment, Disaster Recovery, RPO/RTO & Observability Baseline

## Status
Accepted (Mandatory Reliability Baseline)

## Context
Healthcare infrastructure requires resilient operations, auditable transactions, continuous monitoring, and clear disaster recovery targets. Blueprint Section 20 mandates:
- Patient-facing availability target: 99.9%.
- Recovery Point Objective (RPO): <= 15 minutes for transactional data.
- Recovery Time Objective (RTO): <= 4 hours for core patient/booking flows.
- 100% audit coverage for sensitive actions.

## Decision
1. **Containerized Deployment Architecture:**
   - Multi-stage Dockerfiles for all apps (`apps/api`, `apps/patient-web`, `apps/doctor-portal`, `apps/hospital-portal`, `apps/staff-portal`, `apps/customer-care`, `apps/admin-console`) and services (`services/document-processing`, `services/notifications`).
   - Standardized `docker-compose.yml` for unified local development, staging integration, and automated CI pipelines.
   - Production workloads deploy to containerized clusters (ECS or Kubernetes) with blue-green / rolling deployments.
2. **Disaster Recovery & Backup Strategy:**
   - **PostgreSQL Point-in-Time Recovery (PITR):** Continuous Write-Ahead Logging (WAL) archiving to encrypted off-site cloud storage.
   - **Automated Hourly Snapshots:** Enables satisfying RPO <= 15 minutes.
   - **Document Storage Replication:** Multi-region or cross-bucket asynchronous replication for private object storage.
   - **Regular Drills:** Mandatory quarterly recovery drills restoring database state and verifying data integrity against synthetic benchmarks (CAT-14).
3. **Observability & Telemetry Baseline:**
   - **Distributed Tracing:** OpenTelemetry headers (`traceparent`, `x-correlation-id`) propagated across frontend requests, API endpoints, outbox events, and worker queues.
   - **Structured JSON Logging:** Pino / Winston logger emitting standardized JSON records (`timestamp`, `correlationId`, `tenantId`, `userId`, `action`, `latencyMs`). Medical narratives and credentials are strictly scrubbed from application debug logs.
   - **Segregated Audit Trail:** Audit logs are routed to an append-only, tamper-resistant store (`audit_events` table and cold storage archive), separate from operational logs.
   - **Health Checks:** `/health/liveness` and `/health/readiness` probes monitoring PostgreSQL, Redis, and storage endpoints.

## Consequences
- Predictable, auditable operations and disaster recovery resilience.
- Full traceability for debugging and compliance investigations.
