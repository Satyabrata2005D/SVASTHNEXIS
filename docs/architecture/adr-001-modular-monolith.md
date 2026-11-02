# ADR-001: Modular Monolith Architecture Pattern

## Status
Accepted (Mandatory Architecture Principle)

## Context
The Unified Healthcare Management Ecosystem must unify patient discovery, appointment booking, clinical encounters, hospital information operations (OPD, beds, LIS, pharmacy, OT), billing, and platform support. A naive distributed microservices architecture across dozens of services introduces distributed transaction failures, network latency, complex network partitions, distributed state inconsistencies (especially dangerous during slot holds and payment confirmations), and heavy operational overhead for initial pilot facilities.

## Decision
We adopt a **modular monolith** as the primary architecture pattern for core backend services:
1. **Single Deployable Core Service:** The core API (`apps/api`) encapsulates all domain modules within well-defined bounded contexts (Identity, Directory, Scheduling, Records, Clinical, Facility, Diagnostics, Finance, Support).
2. **Explicit Internal Boundaries:** Modules communicate internally via typed in-process interfaces, domain contracts (`packages/contracts`), and asynchronous domain events. Direct cross-domain database table joins across unowned aggregates are forbidden.
3. **Dedicated Auxiliary Workers:** Separate out-of-process workers are isolated only for tasks with distinct computational, runtime, or security profiles:
   - `services/document-processing`: OCR/extraction pipeline (Python).
   - `services/notifications`: Queue-backed notification worker (Node.js).
   - `services/ai-gateway`: Bounded model routing and policy engine.
4. **Microservices Extraction Gate:** Splitting a module into an independent microservice is only permitted when transaction volume, distinct compliance boundaries, or organizational team autonomy explicitly warrants it after Phase 2.

## Consequences
### Positive
- Strict transactional consistency via PostgreSQL transactions for atomic slot reservations and financial ledger entries.
- Rapid development and zero distributed transaction latency.
- Single unified migration timeline and shared type safety via TypeScript.

### Negative / Trade-offs
- Requires discipline in code reviews to prevent leaky boundaries between modules.
- Enforced through lint rules (`import/no-restricted-paths`) and automated dependency graph validation.

