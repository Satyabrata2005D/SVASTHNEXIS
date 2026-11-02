# Facility Downtime Standard Operating Procedure (SOP)
## Unified Healthcare Management Ecosystem (SvasthNexis)
**Document Status:** Operational Clinical SOP  
**Target Audience:** Hospital Administrators, Reception Staff, Triage Nurses, Clinicians, Billing Clerks.  
**Purpose:** Ensure clinical continuity, emergency triage, and patient safety during scheduled maintenance, network disruption, or cloud platform outages.

---

### 1. Downtime Activation Trigger
- **Scheduled Downtime:** Announced at least 7 days in advance; scheduled during lowest historical census (e.g., Sunday 02:00-04:00 local time).
- **Unscheduled Emergency Downtime:** Declared immediately by Facility Authority or IT Lead if API connectivity is severed for > 5 minutes or database availability drops below functional thresholds.

---

### 2. Departmental Offline Procedures

#### A. Emergency Department (ED)
- **Principle:** Emergency care never stops for system downtime.
- **Intake:** Shift to pre-printed Emergency Triage Paper Forms (Yellow/Red carbon copies).
- **Patient ID:** Assign physical emergency disaster bands with pre-printed sequential barcodes (e.g., `EM-HOSP01-0001`).
- **Clinical Orders:** Handwritten stat laboratory and medication orders using paper requisitions with urgent stamp.

#### B. Outpatient Department (OPD) & Reception
- **Arrival Registration:** Reception desk retrieves physical printed appointment roster (generated daily at 07:00 and 13:00 local time).
- **Walk-Ins:** Register on manual OPD log sheets with: Full Name, Age/DOB, Contact Phone, Token Number, Assigned Doctor.
- **Payments:** Collect via offline physical cash or standalone EDC card terminal; issue physical receipt booklet with manual sequential receipt numbers.

#### C. Inpatient & Nursing Wards
- **Vital Signs & MAR:** Shift to bedside paper Nursing Charts and physical Medication Administration Records (MAR).
- **Medication Administration:** Double-check against printed MAR sheets; nurse and co-signer initial physical sheet upon administration.
- **Transfers & Bed Moves:** Maintain physical ward whiteboard showing bed occupancy; telephone notifications to central bed manager.

#### D. Laboratory & Diagnostics
- **Accession:** Log physical specimens on manual laboratory ledger matching the specimen collection tube barcode.
- **Stat Results:** Phone critical values directly to the attending clinician with verbal read-back confirmation.

---

### 3. Post-Downtime System Catch-Up & Reconciliation

1. **Step 1 - System Green Verification:**
   - IT Lead confirms all SvasthNexis core services and databases are fully operational and healthy (`/health/readiness` returns 200).
2. **Step 2 - Prioritized Data Ingestion:**
   - Batch 1: Inpatient admissions, discharges, and bed transfers.
   - Batch 2: Medication administrations and critical lab results.
   - Batch 3: Emergency arrivals and outpatient encounters.
   - Batch 4: Financial receipts and billing reconciliations.
3. **Step 3 - Discrepancy & Conflict Resolution:**
   - Compare manual offline receipts against digital payment intents.
   - Reconcile physical bed assignments with digital bed state machine.
   - Mark physical paper records as `RECONCILED_DIGITALLY` and archive in Medical Records Department (MRD) per statutory retention policy.
