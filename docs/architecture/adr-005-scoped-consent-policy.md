# ADR-005: Scoped Patient Consent & Dynamic Access Enforcement

## Status
Accepted (Mandatory Privacy & Regulatory Baseline)

## Context
Under the Digital Personal Data Protection Act (DPDP Act 2023) and standard medical confidentiality principles, patient health records cannot be shared globally across all doctors or facilities without explicit, informed, purpose-limited consent. Blanket "accept all terms" checkboxes violate privacy-by-design standards.

## Decision
1. **Granular Consent Entity Schema:**
   Consent is modeled as a first-class transactional entity (`ConsentGrant`) with mandatory fields:
   - `dataSubjectId`: Patient ID or verified dependent ID.
   - `recipientId`: Named doctor ID, facility ID, or explicitly defined care-team group.
   - `purpose`: Enumerated clinical purpose (e.g., `CONSULTATION`, `SECOND_OPINION`, `EMERGENCY_CARE`, `DIAGNOSTIC_EVALUATION`).
   - `scopeCategories`: Granular list of included record categories (e.g., `LAB_REPORTS`, `PRESCRIPTIONS`, `DISCHARGE_SUMMARIES`, `IMAGING`).
   - `documentIds`: Specific document IDs explicitly shared by the patient.
   - `validFrom` / `validUntil`: Strict time boundaries (e.g., appointment duration or 24/48 hours).
   - `status`: `GRANTED`, `REVOKED`, `EXPIRED`, `DENIED`.
   - `noticeVersion`: Identifier of the exact privacy notice displayed when consent was collected.
2. **Point-in-Time Access Policy Evaluation:**
   - Every read request for medical records dynamically queries the Policy Engine.
   - Access is allowed only if:
     `Identity Verified` AND `Care Relationship Valid` AND `Valid Unexpired Consent Exists matching Recipient, Purpose, and Document Category`.
   - If consent is revoked or expired, subsequent reads return `403 Forbidden` immediately.
3. **Audit of All Access and Denial Events:**
   - Every access decision (both `ALLOW` and `DENY`) generates an immutable `AccessEvent` containing: timestamp, actor ID, patient ID, document ID, declared purpose, authorization rule ID, and IP/device fingerprint.
4. **Emergency Break-Glass Exception:**
   - In verified life-threatening clinical emergencies, certified clinicians may invoke Break-Glass mode to view critical history without prior consent.
   - Break-glass creates a high-priority audit alarm, notifies the patient immediately, and queues the incident for retrospective clinical review.

## Consequences
- Protects patient autonomy and ensures full auditability.
- Blocks unauthorized provider queries and protects against clinical data harvesting.
