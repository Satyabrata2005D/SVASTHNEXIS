# Clinical Safety Case
## Unified Healthcare Management Ecosystem (SvasthNexis)
**Document Status:** Baseline Active (Stage 0 Foundation)  
**Governance Standard:** Aligned with DCB0129 / DCB0160 clinical risk management principles and Indian Telemedicine Practice Guidelines (2020).  
**Principle:** Patient safety overrides all convenience or technical optimizations. Clinical decisions remain exclusively with licensed medical professionals.

---

### 1. Clinical Hazard Analysis & Safety Controls

| Hazard ID | Clinical Hazard | Prevention Control | Detection Control | Recovery & Fallback Action | Verifiable Evidence |
|---|---|---|---|---|---|
| **CLIN-HAZ-01** | **Wrong-Patient Record Linkage:** Clinical notes, prescriptions, or lab results attached to the wrong patient ID. | Mandatory patient verification (Full Name, DOB, Gender, Phone/ABHA) before encounter creation; strict foreign-key linkage. | Audit log validation; duplicate match warning algorithm flags ambiguous patient identities. | Immediate encounter suspension; clinical supervisor notification; unlinking workflow preserving audit record. | Unit & integration tests for encounter patient immutability. |
| **CLIN-HAZ-02** | **Delayed Emergency Care in Routine Booking:** Patient with critical emergency symptoms (e.g., acute chest pain, severe dyspnea, stroke signs) waiting in an ordinary appointment queue. | AI Navigation and Patient Portal frontends enforce immediate emergency red-flag screening; red-flags display direct 108/112 dial prompts and nearest ER directions; bypasses booking. | Real-time symptom keyword and red-flag trigger monitoring. | Direct immediate transfer to emergency workflow; alerts triage nurse desk. | Test CAT-12 verifying emergency symptom redirection. |
| **CLIN-HAZ-03** | **Premature / Unvalidated Lab Result Publication:** Pathological test values published to patient portal without pathologist sign-off. | Multi-tier LIS state machine: `SPECIMEN_COLLECTED` -> `PROCESSING` -> `PRELIMINARY` -> `VALIDATED` -> `RELEASED`. Release API requires pathologist cryptographic signature. | Scheduled query for unvalidated released results (alerts if count > 0). | Instant revocation of released status; notification to attending clinician of unverified status. | Test CAT-10 verifying release attempt without authorization is rejected with 403. |
| **CLIN-HAZ-04** | **Unsafe Medication / Prescription Errors:** Silent alteration of prescribed dosage, frequency, or medication name. | Signed prescriptions are cryptographically sealed and immutable. Formulary lookup validates standardized generic names and strengths. Drug interaction alerts are advisory only. | Prescriptions cannot be edited; any change must be an explicit signed amendment. | Prescribing clinician issues signed cancellation and new prescription with notification to dispensing pharmacy. | Test CAT-09 verifying signed prescription cannot be updated via SQL. |
| **CLIN-HAZ-05** | **Misleading AI Extraction Highlights:** Doctor relies on erroneous OCR extraction of lab values or incorrect reference ranges. | Extracted values are presented alongside the original PDF scan in split-screen; confidence scores and uncertainty flags are prominently rendered; clinician MUST click "Verify & Accept". | Low confidence scores (< 0.90) automatically flagged for manual review; unreadable scans blocked. | Clinician manually inputs true values from source image; feedback logged to AI audit dataset. | Test CAT-11 verifying unaccepted AI extraction cannot populate structured chart. |
| **CLIN-HAZ-06** | **Teleconsultation Inappropriateness:** Remote consultation conducted for clinical conditions requiring immediate physical examination. | Clinician is empowered with a single-click "Escalate to In-Person Examination" button; telemedicine guidelines display reminder of practitioner responsibility. | Real-time clinical encounter status tracking. | Session terminated with advice for immediate physical clinical visit; refund/fee transfer processed per facility policy. | Telemedicine session transition integration test. |
| **CLIN-HAZ-07** | **Inadvertent Exposure of Sensitive Health Data:** Doctor or staff viewing medical records of patients outside a legitimate care relationship. | Dynamic ABAC policy engine checks care relationship and active patient consent grant at moment of query; Customer Care restricted from chart access. | Access logging of all views, downloads, and search queries with declared purpose. | Immediate session termination; security incident raised; notification to data protection officer. | Tests CAT-05, CAT-06, CAT-07. |

---

### 2. Clinical Sign-Off Gate Requirements
Before any clinical module (Encounter, Prescription, LIS, Nursing, Inpatient) is enabled in a production environment:
1. Named Clinical Safety Officer (licensed RMP) must sign off on clinical workflows.
2. Standardized clinical terminology sets (ICD-10, SNOMED CT, LOINC) must be mapped and reviewed.
3. Local facility downtime procedures must be distributed and trained with clinical staff.
