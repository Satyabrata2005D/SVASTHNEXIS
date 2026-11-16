# SVASTHNEXIS — Cybersecurity & Compliance Implementation Guide
**Version:** 2.0.0  
**Scope:** RBAC/ABAC Boundaries, Scoped Consent, SOC Incident Handling, Cryptographic Chaining  
**Author:** Cybersecurity & Healthcare Privacy Engineer

---

## 1. Role-Based & Attribute-Based Access Control

Access control is centrally governed by `@svasthnexis/policy-engine`. The policy engine enforces strict privilege boundaries:

| User Role | Permitted Operations | Prohibited Operations | Security Test |
|---|---|---|---|
| **PATIENT** | View own records, grant/revoke consent, hold slots, pay, book appointments | Access other patients' records, view unverified lab results | CAT-05, CAT-06 |
| **DOCTOR_RMP** | Review consented medical history, record vitals, sign encounters, order labs, draft SOAP | Access non-consented records, delete or overwrite signed encounters | CAT-09, CAT-11 |
| **STAFF_HUB** | Accession specimens, enter test values, dispense medications with stock decrement | Release lab results without pathologist signature (CAT-10), dispense over stock | CAT-08, CAT-10 |
| **CUSTOMER_CARE** | View ticket queue, lookup patient non-clinical metadata, investigate payment logs | **Access clinical charts, SOAP notes, prescriptions, diagnoses** | **CAT-07 (403 Forbidden)** |
| **SUPER_ADMIN** | Facility onboarding, doctor verification, admin lifecycle governance, audit inspection | **Access patient clinical charts without emergency break-glass** | Admin Boundary Guard |

---

## 2. Tamper-Evident SHA-256 Audit Logging

Every state transition produces an append-only audit event. Each event calculates its cryptographic block hash:

$$\text{eventHash} = \text{SHA256}(\text{previousEventHash} + \text{id} + \text{timestamp} + \text{actorId} + \text{action} + \text{resourceId} + \text{payload})$$

The `AuditLogEngine` maintains the chain. If any historical event is modified, deleted, or reordered, `verifyChainIntegrity()` returns `isValid: false`, immediately alerting the Cybersecurity SOC.

---

## 3. CERT-In Mandatory Incident Reporting

In compliance with Indian Computer Emergency Response Team (CERT-In) cybersecurity directions:
- All high-severity and critical security incidents trigger a persistent 6-hour disclosure countdown timer.
- Incident payloads capture event timestamps, affected subsystem, vector analysis, and containment actions.
- SOC feed is prominently visible in the Platform Administrator Console.

