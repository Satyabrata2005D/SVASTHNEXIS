# ADR-004: Clinical Record Ownership, Federated Integrity & Amendments

## Status
Accepted (Mandatory Clinical Safety Baseline)

## Context
In healthcare systems, a clinical record (e.g., consultation note, diagnosis, prescription, lab report) represents a legal document authored by a licensed clinician under the umbrella of a care facility. Naively copying or centralizing all hospital data into an unrestricted shared data lake erodes clinical authorship, compromises legal chain-of-custody, and risks silent overwriting of medical history.

## Decision
1. **Federated Provenance Model:**
   - Every clinical record is owned by its originating facility (`facilityId`) and licensed clinician author (`authorDoctorId`).
   - The central platform maintains an authenticated **longitudinal index and timeline** of clinical encounters and documents, rather than forcibly extracting and merging source hospital systems into one monolithic database.
2. **Immutability of Signed Clinical Artifacts:**
   - Once a doctor signs a clinical note, prescription, or order, it transitions to status `SIGNED` and becomes strictly immutable.
   - Database triggers and application guards prohibit SQL `UPDATE` operations on signed clinical text, dosages, and diagnoses.
3. **Traceable Amendments / Addenda:**
   - Corrections to a signed clinical note or prescription are authored as explicit `Amendment` entities linked to the original record (`priorRecordId`).
   - The amendment captures: amendment timestamp, clinician identity, clinical justification/reason, and the delta.
   - The user interface renders the original record alongside all sequential amendments to preserve complete clinical context.
4. **Distinction between Patient-Uploaded & Facility-Authored Documents:**
   - Patient-uploaded documents (e.g., external past lab scans) are flagged as `SOURCE_PATIENT_UPLOADED` and segregated from `SOURCE_FACILITY_GENERATED` records.
   - Extracted values or patient-reported symptoms are never silently promoted to clinician-verified facts.

## Consequences
- Guaranteed forensic auditability and legal admissibility in medical negligence or malpractice reviews.
- Ensures absolute compliance with blueprint Sections 05, 07, 09, and Appendix A (T-16, T-17, T-18).
