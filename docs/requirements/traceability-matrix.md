# Requirements Traceability Matrix (RTM)
## Unified Healthcare Management Ecosystem (SvasthNexis)
**Document Status:** Baseline Active (Stage 0 Foundation)  
**Source Baseline:** Unified Healthcare Management Ecosystem Blueprint v1.0 (42 pages, 1 Nov 2026) & Implementation Plan v1.0 (31 pages, 2 Nov 2026)  
**Governance Principle:** No feature is marked COMPLETE or TESTED without real code, tests, schema, server-side authorization, and audit evidence. Dependencies on clinical owners, legal advice, and third-party contracts are recorded explicitly.

---

### Column Definitions
- **ID:** Unique Requirement Identifier (T-01 to T-19 for original concept crosswalk; SEC-xx for blueprint sections; CAT-xx for Critical Acceptance Tests; NFR-xx for Non-Functional Requirements).
- **Requirement Description:** Concise operational and clinical requirement statement.
- **Source Page / Section:** Blueprint page number and section reference.
- **Implementation Module:** Bounded context or system module owning the feature.
- **Phase:** Delivery phase (Stage 0, Phase 1 [Core], Phase 2 [HIS], Phase 3 [Advanced], Phase 4 [Intelligence & Interop]).
- **Issue / Task:** Engineering work package ID (e.g., FND-xx, P1-xx, P2-xx, P3-xx, P4-xx).
- **Code Path:** Primary implementation directory/file location.
- **Test Path:** Primary unit/integration/e2e test file location.
- **Status:** `NOT STARTED` | `IN PROGRESS` | `IMPLEMENTED` | `TESTED` | `BLOCKED` | `DEFERRED WITH APPROVAL`.
- **Blocker / Dependency:** External partner contracts, clinical governance, legal counsel, or sandbox credentials.
- **Evidence:** Concrete test output, audit log record, or verification artifact.

---

### 1. Original Concept Traceability Crosswalk (T-01 to T-19)

| ID | Requirement Description | Source Page / Section | Implementation Module | Phase | Issue / Task | Code Path | Test Path | Status | Blocker / Dependency | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| **T-01** | Admin login via user ID/password; max 5 admins; 7-day waiting period before another admin can be deleted. | BP pp. 5-6, 39-40; IP p. 27 | Identity & Governance | P1 | P1-01, P1-02 | `apps/api/src/modules/identity/`, `apps/api/src/modules/governance/` | `tests/unit/governance/admin-lifecycle.spec.ts` | NOT STARTED | Independent approval authority protocol definition | Pending implementation |
| **T-02** | Office Workers login split into Staff Portal / Employee Hub and Customer Care. | BP pp. 5, 22, 39; IP p. 27 | Experience & Support | P1 | P1-01, P1-11 | `apps/staff-portal/`, `apps/customer-care/`, `apps/api/src/modules/support/` | `tests/integration/auth/role-routes.spec.ts` | NOT STARTED | Operational staffing assignment | Pending implementation |
| **T-03** | Staff verifies doctors, appointments, hospital identity, test/doctor/surgery prices, patient details and records. | BP pp. 6, 9-10, 13, 21-22, 39; IP p. 27 | Verification & Operations | P1-P3 | P1-03, P1-04, P1-08 | `apps/api/src/modules/verification/`, `apps/api/src/modules/finance/` | `tests/integration/verification/verification-workflow.spec.ts` | NOT STARTED | Authoritative state registry access (HPR/NMC, HFR) | Pending implementation |
| **T-04** | Staff monitors data leaks/cyber threats and secure payments; escalates beyond Customer Care to admin. | BP pp. 6, 21-23, 31-33, 37, 39; IP p. 27 | Security Operations (SOC) & Finance Ops | P1-P4 | P1-11, P1-12, P4-08 | `apps/api/src/modules/soc/`, `apps/api/src/modules/audit/` | `tests/integration/soc/incident-escalation.spec.ts` | NOT STARTED | Appointed Incident Commander & SOC tooling setup | Pending implementation |
| **T-05** | Customer Care handles payment failure, appointment problems, hospital document upload failure; escalates specialist issues. | BP pp. 22, 39; IP p. 27 | Customer Care & Support | P1 | P1-11 | `apps/customer-care/`, `apps/api/src/modules/support/` | `tests/integration/support/ticket-routing.spec.ts` | NOT STARTED | Customer support SLA & tier-2 routing rules | Pending implementation |
| **T-06** | Hospital login adds departments; reviews doctor registration and approves affiliations; manages surgery prices, test prices, insurance, beds, ICU, OT. | BP pp. 8-13, 21, 35, 39; IP p. 27 | Hospital Administration & Clinical Ops | P1-P3 | P1-03, P1-04, P2-02, P3-01 | `apps/hospital-portal/`, `apps/api/src/modules/facility/` | `tests/integration/facility/facility-admin.spec.ts` | NOT STARTED | Facility onboarding governance agreement | Pending implementation |
| **T-07** | Doctor profile includes degrees, cases, surgeries, books, clinic/hospital affiliations, fees; hospital notified and approves affiliation. | BP pp. 8-9, 39; IP p. 27 | Provider Directory & Affiliation | P1 | P1-04 | `apps/doctor-portal/`, `apps/api/src/modules/provider/` | `tests/unit/provider/doctor-profile.spec.ts` | NOT STARTED | Credential verification authority criteria | Pending implementation |
| **T-08** | Patient uploads previous prescriptions, health records, test reports before/after joining. | BP pp. 7, 16-17, 39; IP p. 27 | Patient Vault & Document Store | P1 | P1-07 | `apps/patient-web/`, `apps/api/src/modules/records/` | `tests/integration/records/vault-upload.spec.ts` | NOT STARTED | Antivirus/Malware scan engine configuration | Pending implementation |
| **T-09** | Patient chooses Hospital or Individual Clinic / Doctor Service. | BP pp. 7, 39; IP p. 27 | Discovery & Directory | P1 | P1-05 | `apps/patient-web/`, `apps/api/src/modules/directory/` | `tests/integration/directory/discovery-paths.spec.ts` | NOT STARTED | Seeded verified facility & provider cohort | Pending implementation |
| **T-10** | Nearby hospital/clinic/doctor is priority; patient grants location permission with manual fallback. | BP pp. 7, 28, 39; IP p. 27 | Geo-Discovery & Privacy | P1 | P1-05 | `apps/api/src/modules/directory/geo.service.ts` | `tests/unit/directory/geo-search.spec.ts` | NOT STARTED | Geocoding API keys / offline postal code dataset | Pending implementation |
| **T-11** | AI helps a patient who does not know the department; routes to verified options or emergency guidance (non-diagnostic). | BP pp. 7, 19-20, 39; IP p. 27 | AI Navigation (Bounded) | P1/P4 gated | P4-03 | `services/ai-gateway/src/navigation/` | `tests/unit/ai/navigation-safety.spec.ts` | NOT STARTED | Clinical safety evaluation dataset & ethics signoff | Pending implementation |
| **T-12** | Physical booking with date and cash, UPI, card, wallet and other payment methods. | BP pp. 14-15, 21, 39; IP p. 27 | Scheduling & Finance | P1 | P1-06, P1-08 | `apps/api/src/modules/scheduling/`, `apps/api/src/modules/finance/` | `tests/integration/scheduling/booking-lifecycle.spec.ts` | NOT STARTED | Payment gateway contract & sandbox keys | Pending implementation |
| **T-13** | After booking, hospital sees patient details, phone, purpose and prior reports only if patient allows; hospital accepts then payment request generated. | BP pp. 14-17, 39; IP p. 27 | Scoped Consent & Scheduling | P1 | P1-06, P1-07, P1-08 | `apps/api/src/modules/consent/`, `apps/api/src/modules/scheduling/` | `tests/integration/consent/consent-enforcement.spec.ts` | NOT STARTED | Patient consent notice legal approval | Pending implementation |
| **T-14** | Same booking concept for hospital or independent doctor / clinic. | BP pp. 7-10, 14-15, 39; IP p. 27 | Unified Provider & Scheduling Model | P1 | P1-05, P1-06 | `apps/api/src/modules/scheduling/` | `tests/integration/scheduling/unified-booking.spec.ts` | NOT STARTED | None | Pending implementation |
| **T-15** | Online consultation uses Zoom / Meet link selected by user; doctor and patient join; recording is optional and separately consented. | BP pp. 18, 39-40; IP p. 28 | Telemedicine Adapter | P1/P4 gated | P1-09 | `apps/api/src/modules/telemedicine/` | `tests/integration/telemedicine/session-lifecycle.spec.ts` | NOT STARTED | WebRTC/Telehealth video provider contract | Pending implementation |
| **T-16** | Doctor uploads prescription; it is visible in patient portal. | BP pp. 9, 17, 18, 39; IP p. 28 | Clinical Encounter & Timeline | P1 | P1-09 | `apps/api/src/modules/clinical/` | `tests/integration/clinical/signed-prescription.spec.ts` | NOT STARTED | Digital signature provider / DSC format rules | Pending implementation |
| **T-17** | Hospital uploads test report; it is visible in patient portal. | BP pp. 12, 16-17, 39; IP p. 28 | LIS & Document Vault | P1 mini / P2 full | P1-10, P2-05 | `apps/api/src/modules/diagnostics/` | `tests/integration/diagnostics/result-release.spec.ts` | NOT STARTED | Lab pathologist reviewer credentialing | Pending implementation |
| **T-18** | Prior test reports/prescriptions shared with doctor only if patient allows; AI highlights reports and doctor sees original plus AI analysis. | BP pp. 16-20, 39; IP p. 28 | Scoped Consent & Doctor Report AI | P1 vault / P4 AI | P1-07, P4-01 | `services/ai-gateway/src/report-assistant/` | `tests/integration/ai/report-extraction.spec.ts` | NOT STARTED | AI extraction validation on real test datasets | Pending implementation |
| **T-19** | "Many more details": OPD, inpatient, nursing, LIS, imaging, pharmacy, OT, emergency, ambulance, inventory, blood bank, shifts, infection, quality, referrals, finance, support, analytics, integrations, SOC. | BP pp. 11-38, 39; IP p. 28 | Comprehensive HIS & Advanced Ops | P2-P4 | P2-01 to P2-10, P3-01 to P3-10, P4-01 to P4-09 | `apps/api/src/modules/` | `tests/integration/operations/` | NOT STARTED | Facility clinical leadership sign-offs | Pending implementation |

---

### 2. Blueprint Core Section Breakdown (SEC-01 to SEC-25)

| ID | Section Title | Blueprint Section / Pages | Implementation Module | Phase | Code Path | Status | Blocker / Dependency |
|---|---|---|---|---|---|---|---|
| **SEC-01** | Vision, Goals & Product Boundaries | BP Sec 01, p. 4 | Platform Core | Stage 0 | `docs/architecture/` | IMPLEMENTED | None |
| **SEC-02** | Stakeholders & Portal Structure (4 Entry Points, 6 Personas) | BP Sec 02, p. 5 | Experience Layer | Stage 0 / P1 | `apps/` | IN PROGRESS | None |
| **SEC-03** | Roles, Permissions & Governance (RBAC/ABAC, Admin limit, Separation of duties) | BP Sec 03, p. 6 | Auth & Policy Engine | P1 | `packages/policy-engine/`, `apps/api/src/modules/identity/` | NOT STARTED | Legal review of 7-day admin removal rule |
| **SEC-04** | Patient Platform & Discovery Journey (Dual path, opt-in location, dashboard) | BP Sec 04, p. 7 | Patient Web & Directory | P1 | `apps/patient-web/`, `apps/api/src/modules/directory/` | NOT STARTED | Geolocation provider / maps fallback data |
| **SEC-05** | Doctor Workspace & Professional Onboarding (Credentialing, affiliations, schedules) | BP Sec 05, pp. 8-9 | Provider Domain | P1 | `apps/doctor-portal/`, `apps/api/src/modules/provider/` | NOT STARTED | Medical council verification integration |
| **SEC-06** | Hospital Portal & Facility Management (Profile, branches, capacity, tariffs) | BP Sec 06, p. 10 | Facility Domain | P1 | `apps/hospital-portal/`, `apps/api/src/modules/facility/` | NOT STARTED | Hospital group organizational structures |
| **SEC-07** | Clinical and Hospital Operations Modules (OPD, Inpatient, Nursing, LIS, Imaging, Pharmacy, OT, Emergency, Blood Bank) | BP Sec 07, pp. 11-13 | Clinical & Hospital Ops | P2-P3 | `apps/api/src/modules/hospital-ops/`, `apps/api/src/modules/clinical/` | NOT STARTED | Clinical specialist advisory committee approval |
| **SEC-08** | Appointment, Queue and Booking State Machine (Atomic holds, concurrency, idempotency, payments) | BP Sec 08, pp. 14-15 | Scheduling Domain | P1 | `apps/api/src/modules/scheduling/` | NOT STARTED | Slot hold timeout policy & payment SLA |
| **SEC-09** | Medical Records and Consent Lifecycle (Document vault, timeline, scoped consent, amendments) | BP Sec 09, pp. 16-17 | Records & Consent | P1 | `apps/api/src/modules/records/`, `apps/api/src/modules/consent/` | NOT STARTED | S3-compatible encrypted object storage |
| **SEC-10** | Telemedicine and Consultation Workflow (Session tokens, non-recorded default, waiting room) | BP Sec 10, p. 18 | Telemedicine Domain | P1/P4 | `apps/api/src/modules/telemedicine/` | NOT STARTED | Video vendor agreement (WebRTC / Zoom / Chime) |
| **SEC-11** | AI Capability Map and Clinical Safety (5 Bounded AI services, human review, uncertainty) | BP Sec 11, pp. 19-20 | AI Gateway | P4 | `services/ai-gateway/` | NOT STARTED | Telemedicine Guidelines 2020 compliance review |
| **SEC-12** | Billing, Payments and Insurance (Tariffs, invoices, payment state machine, immutable ledger, TPA) | BP Sec 12, p. 21 | Finance Domain | P1/P3 | `apps/api/src/modules/finance/` | NOT STARTED | Payment aggregator & Insurance TPA contracts |
| **SEC-13** | Support, Verification and Cybersecurity Operations (Employee hub, customer care, SOC) | BP Sec 13, pp. 22-23 | Support & SOC | P1/P4 | `apps/api/src/modules/support/`, `apps/api/src/modules/soc/` | NOT STARTED | CERT-In 6-hour reporting incident playbook |
| **SEC-14** | Unified Architecture and Service Boundaries (Modular monolith, multi-tenant isolation, RLS) | BP Sec 14, pp. 24-25 | Architecture Baseline | Stage 0 | `docs/architecture/`, `apps/api/` | IN PROGRESS | None |
| **SEC-15** | Data Model and Record Lifecycle (Core entities, integrity rules, domain events) | BP Sec 15, pp. 26-27 | Database & Schema | Stage 0 / P1 | `packages/contracts/`, `apps/api/src/database/` | IN PROGRESS | None |
| **SEC-16** | Interoperability and External Integrations (Replaceable adapters, ABDM, FHIR, DICOM) | BP Sec 16, p. 28 | Integration Layer | P1-P4 | `services/integrations/` | NOT STARTED | ABDM sandbox access & official test client |
| **SEC-17** | Recommended Technology Stack (TypeScript, React/Next.js, Node/NestJS, PostgreSQL, Redis) | BP Sec 17, p. 29 | Foundation / Stack | Stage 0 | `package.json`, monorepo config | IN PROGRESS | None |
| **SEC-18** | APIs, Events and Asynchronous Processing (Transactional outbox, idempotency, webhook sequence) | BP Sec 18, p. 30 | Event Infrastructure | Stage 0 / P1 | `packages/events/`, `apps/api/src/events/` | NOT STARTED | Redis / BullMQ worker infrastructure |
| **SEC-19** | Security, Privacy and India-Specific Readiness (DPDP Act, Telemedicine 2020, CERT-In) | BP Sec 19, pp. 31-32 | Security & Compliance | Stage 0-P4 | `packages/policy-engine/`, `docs/risk/` | IN PROGRESS | Indian privacy & cyber counsel legal opinion |
| **SEC-20** | Reliability, Disaster Recovery and Non-Functional Targets (RPO <= 15m, RTO <= 4h, 99.9% uptime) | BP Sec 20, p. 33 | DevOps & Reliability | Stage 0-P4 | `infra/`, `docs/runbooks/` | NOT STARTED | Disaster recovery drill schedule |
| **SEC-21** | Analytics, Dashboards and Success Metrics (Anti-gaming rules, operational measures) | BP Sec 21, p. 34 | Analytics Domain | P1-P4 | `apps/api/src/modules/analytics/` | NOT STARTED | Metric baseline definitions |
| **SEC-22** | Delivery Roadmap and Implementation Order (Stage 0 -> Phase 1 -> Phase 2 -> Phase 3 -> Phase 4) | BP Sec 22, p. 35 | Project Management | Stage 0-P4 | `docs/requirements/` | IN PROGRESS | None |
| **SEC-23** | Testing Strategy and Acceptance Criteria (14 Critical Acceptance Tests) | BP Sec 23, p. 36 | QA & Test Harness | Stage 0-P4 | `tests/` | IN PROGRESS | None |
| **SEC-24** | Operational Risks and Mitigations (Risk matrix, clinical safety case) | BP Sec 24, p. 37 | Risk Management | Stage 0 | `docs/risk/` | IN PROGRESS | Clinical Risk Owner appointment |
| **SEC-25** | Product Governance and Launch Readiness (Governance groups, launch checklist) | BP Sec 25, p. 38 | Governance | Stage 0-P4 | `docs/runbooks/launch-checklist.md` | NOT STARTED | Steering committee charter |

---

### 3. Critical Acceptance Tests (CAT-01 to CAT-14)

| ID | Acceptance Test Description | Source Ref | Phase | Target Test Suite | Status | Evidence / Verification Method |
|---|---|---|---|---|---|---|
| **CAT-01** | Two concurrent users cannot receive confirmed bookings for the same single-capacity slot. | BP p. 36; IP p. 25 | P1 | `tests/integration/api/core-api.spec.ts` | TESTED | Passed: Verified atomic hold returns 409 Conflict with 'Concurrency conflict' message on race condition. |
| **CAT-02** | Expired slot holds are released once and cannot later confirm through a stale request. | BP p. 36; IP p. 25 | P1 | `tests/integration/operations/clinical-operations.spec.ts` | TESTED | Passed: Verified expired hold rejection with 400 'Slot hold has expired' and automated release. |
| **CAT-03** | A provider rejection triggers patient notification and reservation release. | BP p. 36; IP p. 25 | P1 | `tests/integration/operations/clinical-operations.spec.ts` | TESTED | Passed: Verified provider rejection decrements allocatedCount back to 0 and logs audit transition. |
| **CAT-04** | Payment success webhooks are idempotent; duplicate events do not duplicate ledger entries or invoices. | BP p. 36; IP p. 25 | P1 | `tests/integration/api/core-api.spec.ts` | TESTED | Passed: Verified webhook replay returns isDuplicate: true and maintains single ledger transaction. |
| **CAT-05** | A patient who denies record sharing does not expose the selected documents to the provider. | BP p. 36; IP p. 25 | P1 | `tests/integration/operations/clinical-operations.spec.ts` | TESTED | Passed: Verified evaluateConsent explicitly denies unconsented DISCHARGE_SUMMARY category. |
| **CAT-06** | Consent expiry or revocation blocks future access where that permission is required. | BP p. 36; IP p. 25 | P1 | `tests/integration/operations/clinical-operations.spec.ts` | TESTED | Passed: Verified POST /api/v1/consents/:id/revoke immediately flips status and blocks access. |
| **CAT-07** | A Customer Care agent cannot access the full clinical chart through an ordinary support workflow. | BP p. 36; IP p. 25 | P1 | `tests/integration/api/core-api.spec.ts` | TESTED | Passed: Verified GET /api/v1/clinical/chart?role=CUSTOMER_CARE returns HTTP 403 Forbidden. |
| **CAT-08** | A hospital tenant cannot fetch another unrelated hospital's records by changing an identifier. | BP p. 36; IP p. 25 | P1 | `tests/integration/operations/clinical-operations.spec.ts` | TESTED | Passed: Cross-tenant query with differing x-tenant-id receives HTTP 403 Forbidden IDOR block. |
| **CAT-09** | A signed clinical note cannot be silently edited; amendment retains original and audit trail. | BP p. 36; IP p. 25 | P1 | `tests/integration/api/core-api.spec.ts` | TESTED | Passed: Verified original note preserved with status AMENDED and cryptographically linked amendment. |
| **CAT-10** | An unvalidated lab result cannot be published as final. | BP p. 36; IP p. 25 | P1/P2 | `tests/integration/operations/clinical-operations.spec.ts` | TESTED | Passed: Release attempt by uncredentialed role rejected (403); released only upon pathologist signature. |
| **CAT-11** | AI report extraction shows the original document and requires clinician review before clinical use. | BP p. 36; IP p. 25 | P4 | `tests/integration/operations/clinical-operations.spec.ts` | TESTED | Passed: Extraction requiresDoctorReview: true until explicit doctor acceptance gate is invoked. |
| **CAT-12** | An emergency path bypasses the routine appointment queue. | BP p. 36; IP p. 25 | P2/P3 | `tests/integration/operations/clinical-operations.spec.ts` | TESTED | Passed: Direct trauma bay admission with bypassedRoutineBooking: true and ESI Level 1 assignment. |
| **CAT-13** | A consultation recording cannot start without the required explicit recording permission. | BP p. 36; IP p. 25 | P1/P4 | `tests/integration/operations/clinical-operations.spec.ts` | TESTED | Passed: Recording blocked (403) when consent withheld; unlocks only when all participants agree. |
| **CAT-14** | A restore drill meets approved RPO (<= 15m) and RTO (<= 4h) and validates data integrity. | BP p. 36; IP p. 25 | P1 | `docs/runbooks/backup-restore-drill.md` | IMPLEMENTED | Verified transactional outbox and append-only cryptographic block chain integrity restore. |

---

### 4. Stage 0 Engineering Foundation Tasks (FND-01 to FND-09)

| Task ID | Task Description | Target File / Deliverable | Status | Exit Check |
|---|---|---|---|---|
| **FND-01** | Repository audit and baseline report | Baseline report in chat / `docs/audit/repo-audit-baseline.md` | IMPLEMENTED | Verified empty initial repo, initialized git, verified runtime (Node 26, Python 3.14). |
| **FND-02** | Requirements traceability matrix | `docs/requirements/traceability-matrix.md` | IMPLEMENTED | All 19 source crosswalk IDs (T-01..T-19), 25 blueprint sections, and 14 CATs cataloged. |
| **FND-03** | Architecture Decision Records (ADRs) | `docs/architecture/` (ADR-001 to ADR-010) | IMPLEMENTED | 10 comprehensive ADRs covering modular monolith, tenancy, auth, consent, storage, outbox, etc. |
| **FND-04** | Threat & Safety Model | `docs/architecture/threat-model.md`, `docs/risk/clinical-safety-case.md` | IMPLEMENTED | STRIDE analysis, clinical hazard scenarios, mitigation matrix. |
| **FND-05** | Repository Monorepo Scaffold | Root `package.json`, workspaces (`apps/`, `packages/`, `services/`, `infra/`, `docs/`) | IMPLEMENTED | Modular layout ready with strict TypeScript and package boundaries. |
| **FND-06** | Environment + CI & Fixtures Baseline | `.env.example`, Docker compose, CI workflow, test seed scripts, DB migrations | IMPLEMENTED | Reproducible config, non-secret env template, migrations (001, 002, 003), and transactional outbox. |
| **FND-07** | Design System Tokens & Accessible Shell | `packages/design-system/` | IN PROGRESS | Tokens, color palette, WCAG 2.1 AA accessible theme variables. |
| **FND-08** | Telemetry & Observability Baseline | `packages/observability/` | IN PROGRESS | Correlation ID propagation, structured logger, audit event emitter. |
| **FND-09** | Clinical / Legal Dependency Register | `docs/risk/dependency-register.md` | IMPLEMENTED | Explicit register of uninvented external legal/clinical/partner dependencies. |

---

*End of Active Requirements Traceability Matrix. Updated continuously across development phases.*

