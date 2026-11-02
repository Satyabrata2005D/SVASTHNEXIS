# ADR-002: Multi-Tenant Isolation & Organization Scoping

## Status
Accepted (Mandatory Security & Architectural Baseline)

## Context
The ecosystem serves multiple independent hospitals, multi-facility hospital groups, clinics, diagnostic centers, and individual practitioners. Cross-tenant data exposure (e.g., Hospital A viewing Hospital B's patient charts or financial settlements) is a critical compliance failure and legal breach under data protection statutes (including DPDP Act 2023).

## Decision
1. **Trusted Identity Context:** Every authenticated request must carry a cryptographically signed tenant context (`tenantId` / `organizationId` and `facilityId`) derived from verified session tokens, never from client-modifiable headers, query parameters, or request body fields.
2. **Dual-Layer Enforcement:**
   - **Application Layer:** Every query, mutation, and domain repository explicitly scopes data operations with the session's verified `tenantId`.
   - **Database Layer (Defense in Depth):** PostgreSQL Row-Level Security (RLS) is applied on tenant-owned tables (`appointments`, `invoices`, `admissions`, `lab_orders`, `facility_resources`), with `tenant_id` session variables set at transaction initiation.
3. **Hierarchy Representation:** Multi-branch facility groups are modeled via a parent `HospitalGroup` entity with explicit child `Facility` and `Branch` entities. Cross-branch access within a group requires explicit parent-group permission grants; independent facilities have zero visibility into other tenants.
4. **Platform Admin Separation:** Platform Administrators govern platform metadata and configurations but are explicitly blocked from querying tenant clinical records without audited break-glass procedures.

## Consequences
- Guaranteed defense-in-depth preventing Insecure Direct Object Reference (IDOR) attacks.
- Automated security integration test suite (`tests/security/tenant-isolation.spec.ts`) continuously validates cross-tenant barriers.
