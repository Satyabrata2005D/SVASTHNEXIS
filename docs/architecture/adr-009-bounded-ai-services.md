# ADR-009: Bounded AI Services & Mandatory Clinical Safety Boundaries

## Status
Accepted (Mandatory Clinical Safety & Legal Baseline)

## Context
Deploying an unrestricted, open-ended conversational AI ("medical chatbot") directly to patients poses unacceptable clinical risks: hallucinations, improper self-diagnosis, delayed emergency care, medication dosage errors, and violation of the Telemedicine Practice Guidelines (2020) which strictly prohibit AI systems from counselling patients or prescribing medications.

## Decision
1. **Five Explicit, Bounded AI Capabilities:**
   Rather than a monolithic AI bot, AI is strictly partitioned into five distinct micro-services with narrow, auditable scopes:
   - **Service 1: Patient Navigation Assistant:** Assists users in locating appropriate hospital departments or specialties based on non-emergency symptoms. Must strictly route red-flag/emergency symptoms to immediate offline emergency services. Never provides medical diagnoses or prescriptions.
   - **Service 2: Doctor Medical-Report Assistant:** Extracts structured laboratory test names, values, units, and reference ranges from uploaded lab PDFs. Highlights out-of-range values based purely on the lab's printed reference range. Never synthesizes a clinical diagnosis. Displays original document side-by-side with bounding boxes and extraction confidence scores. Requires clinician review and manual acceptance before any value enters the medical record.
   - **Service 3: Clinical Documentation Assistant:** Transcribes or formats clinician-entered notes into structured SOAP (Subjective, Objective, Assessment, Plan) drafts. Strictly marks outputs as `DRAFT_AI_GENERATED`. Requires explicit clinician review and digital signature before saving.
   - **Service 4: Hospital Operations Intelligence:** Aggregated operational forecasting for bed occupancy, OPD queue wait times, and inventory consumption. Advisory only; all capacity decisions require human administrative approval.
   - **Service 5: Customer Support Assistant:** Answers platform operational FAQs (booking status, password recovery, navigation help). Refuses medical queries and routes clinical concerns to care teams.
2. **Mandatory Human-in-the-Loop Gate:**
   - No AI-generated content can directly write to or update a patient's active medical chart, prescription, or diagnostic report without certified clinician sign-off.
3. **Data Protection & Subprocessor Policy:**
   - Identifiable patient data (PII) is masked/de-identified before transit to external model providers.
   - No patient medical data is permitted to be retained for general foundation model training.
4. **Feature Flagging:**
   - All AI services remain disabled by default (`FEATURE_FLAG_AI_ASSISTANCE=false`) until clinical validation datasets pass acceptance gates.

## Consequences
- Guaranteed adherence to Indian Telemedicine Practice Guidelines (2020) and patient safety principles.
- Eradicates hallucinated clinical records or unauthorized autonomous prescriptions.
