# SVASTHNEXIS — Final System Architecture
**Version:** 2.0.0  
**Blueprint:** Enterprise Unified Healthcare Management Ecosystem (Modular Monolith)  
**Author:** Principal Software Architect

---

## 1. Architectural Topology

```mermaid
flowchart TD
    subgraph CLIENT_TIER["Client Layer (apps/web)"]
        SPA["React 18 + Vite + TypeScript SPA"]
        ROUTER["React Router (Role Workspaces)"]
        QUERY["TanStack Query (Cache & State)"]
        TAILWIND["Tailwind CSS (Clinical Horizon Tokens)"]
    end

    subgraph WORKSPACES["Role Workspaces"]
        W1["Patient & Family"]
        W2["Doctor Clinical (RMP)"]
        W3["Hospital Authority"]
        W4["Staff Operations (LIS & Rx)"]
        W5["Customer Care Triage"]
        W6["Platform Super Admin"]
    end

    subgraph API_TIER["Modular Monolith Backend (apps/api)"]
        EXP["Express REST API Engine"]
        AUTH_MW["RBAC & Correlation Middleware"]
        AUDIT_MW["Tamper-Evident SHA-256 Logger"]
        STORE["DomainStore & Business Engines"]
    end

    subgraph DOMAIN_PACKAGES["Core Domain Packages"]
        PKG_POLICY["@svasthnexis/policy-engine<br/>(RBAC, ABAC, Consent, Admin Lifecycle)"]
        PKG_AUDIT["@svasthnexis/audit<br/>(Cryptographic Event Chain)"]
        PKG_DB["@svasthnexis/database<br/>(PostgreSQL Pool, Outbox, Migrations)"]
        PKG_OBS["@svasthnexis/observability<br/>(Structured Logger, Correlation)"]
        PKG_TYPES["@svasthnexis/shared-types<br/>(Domain Contracts & Events)"]
        PKG_DS["@svasthnexis/design-system<br/>(Tokens, Palette, Dimensions)"]
    end

    subgraph INFRA_TIER["Infrastructure & Storage (infra/local)"]
        PG["PostgreSQL 16 (Transactional Source of Truth)"]
        REDIS["Redis 7 (TTL Holds & Distributed Locks)"]
        MINIO["MinIO S3 (Private Document Vault)"]
    end

    SPA --> ROUTER
    ROUTER --> W1 & W2 & W3 & W4 & W5 & W6
    W1 & W2 & W3 & W4 & W5 & W6 --> QUERY
    QUERY --> EXP
    EXP --> AUTH_MW --> AUDIT_MW --> STORE
    STORE --> PKG_POLICY & PKG_AUDIT & PKG_DB & PKG_OBS
    PKG_DB --> PG
    STORE -.-> REDIS & MINIO
```

---

## 2. Key Architecture Decisions

1. **Modular Monolith over Microservices (ADR-001):** Single deployable artifact containing cleanly bounded internal packages (`packages/*`). Eliminates distributed transaction failures, network serialization overhead, and RPC latency while preserving strict domain boundaries.
2. **Multi-Tenant Isolation (ADR-002):** Every hospital facility represents an isolated tenant partition with row-level security policies (`tenant_id = current_setting(...)`).
3. **Signed Clinical Immutability (ADR-004):** Once a registered medical practitioner signs an encounter or prescription, it is immutable. PostgreSQL triggers reject `UPDATE` or `DELETE`; modifications must be appended as linked `ClinicalAmendment` addenda.
4. **Scoped Consent Policy (ADR-005):** Patients retain explicit sovereignty over health records. Consents define granular purpose, permitted document categories, and validity windows. Immediate revocation terminates access tokens instantly.
5. **Transactional Outbox Eventing (ADR-007):** Domain events (e.g. `AppointmentConfirmed`, `PaymentCaptured`) are committed into PostgreSQL within the same ACID transaction as the business entity, eliminating split-brain state between database and message brokers.
6. **Bounded AI Services with Mandatory Human Review (ADR-009):** Five isolated AI services operate under strict non-diagnostic boundaries: AI outputs require clinical human review and digital acceptance prior to record commitment.

