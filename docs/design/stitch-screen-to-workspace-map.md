# SVASTHNEXIS — Stitch Screen to Workspace Mapping Matrix
**Version:** 1.0.0  
**Authority:** Stitch MCP Screen Artifacts & SvasthNexis Workspaces  
**Scope:** Architectural mapping of Stitch UI components to React features, API endpoints, and business rules.

---

## 1. Global Screen Overview & Mapping Summary

| # | Stitch Screen Name / Artifact | SvasthNexis Feature Module | Primary User Role | Resolution / Viewport |
|---|---|---|---|---|
| **01** | `medcare_platform_administration_super_admin_governance_console` | `apps/web/src/features/platform-admin` | Platform Super Administrator | Desktop 2560 × 9080 (Fluid 12-col) |
| **02** | `medcare_customer_care_portal_support_operations_dashboard` | `apps/web/src/features/customer-care` | Customer Care Triage Agent | Desktop 2560 × 3762 (Fluid 12-col) |
| **03** | `aegis_care_patient_family_healthcare_portal_dashboard` | `apps/web/src/features/patient` | Patient & Family / Guardian | Desktop 2560 × 7098 (Fluid 12-col) |
| **04** | `medcare_doctor_clinical_workspace_active_patient_encounter` | `apps/web/src/features/doctor` | Doctor / Registered Medical Practitioner | Desktop 2560 × 5732 (Fluid 12-col) |
| **05** | `medcare_staff_operations_portal_diagnostics_pharmacy_management_dashboard` | `apps/web/src/features/staff` | Pathologist, Pharmacist, Lab Technician | Desktop 2560 × 7850 (Fluid 12-col) |
| **06** | `citycare_hospital_authority_operations_dashboard` | `apps/web/src/features/hospital` | Hospital Administrator, Medical Director | Desktop 2560 × 5728 (Fluid 12-col) |

---

## 2. Detailed Screen Component Mappings

### 2.1. Screen 01: Platform Administrator Governance Console
- **Stitch Reference:** `01-platform-admin.html` (86.2 KB)
- **React Route:** `/admin/*`
- **Primary Layout:** Persistent 264px Dark Navigation Rail + Security Status Banner + 12-Column Grid

#### Component Breakdown & Backing APIs:
1. **Executive Metric Cards Strip:**
   - *Total Registered Patients:* 12,450 (+12% MoM)
   - *Verified RMP Doctors:* 428 (98.2% verified)
   - *Onboarded Hospitals:* 34 facilities
   - *Active Platform Users:* 3,892 concurrent
   - *Gross Platform Settlement Volume:* ₹4.82 Cr
   - *Backing Endpoint:* `GET /api/v1/state` (aggregated metrics)
2. **Hospital & Provider Governance Table:**
   - Tabs: All Hospitals, Pending Verification, Suspended, Active
   - Columns: Facility ID, Name, Category (Multi-specialty/Tertiary), NABH Accreditation, Doctors Count, Status, Actions (Approve, Review, Suspend).
   - *Backing Endpoints:* `GET /api/v1/state`, `POST /api/v1/doctors/:id/affiliations/approve`.
3. **Administrator Lifecycle & Cooling-Off Governance:**
   - Card showing 5-admin limit status (Active: 3/5).
   - Pending Removal Requests table with 7-day cooling-off countdown timer (`daysRemaining`).
   - Two-Person Rule Approval modal requiring second admin signature.
   - *Backing Endpoint:* `POST /api/v1/admin/removal/initiate`.
4. **Security Operations Center (SOC) & Incident Feed:**
   - Live security event stream with CERT-In 6-hour regulatory countdown indicator.
   - Incident severity tags (Critical P1, High P2, Moderate P3).
   - *Backing Endpoints:* `GET /api/v1/soc/incidents`, `POST /api/v1/soc/incidents`.
5. **Cryptographic SHA-256 Audit Chain Viewer:**
   - Live block chain stream: Event ID, Timestamp, Actor ID, Action, Hash, Previous Hash, Verification Status (`VALID`).
   - *Backing Endpoint:* `GET /api/v1/audit`.
6. **Clinical Chart Access Restriction Guard:**
   - Visual card confirming Platform Admins have **zero unrestricted access** to patient clinical charts without explicit legal warrant / break-glass audit justification.

---

### 2.2. Screen 02: Customer Care Portal – Support Operations Dashboard
- **Stitch Reference:** `02-customer-care.html` (54.1 KB)
- **React Route:** `/support/*`
- **Primary Layout:** Support Triage Rail + Ticket Filters + Split-Pane Workspace

#### Component Breakdown & Backing APIs:
1. **Support Triage KPI Strip:**
   - Open Tickets (24), P1 Critical (3), Avg First Response (4m 12s), CSAT (4.8/5.0).
2. **Ticket Inbox & SLA Management Queue:**
   - Filterable by Category: Payment Failure, Appointment Reschedule, Document Upload, Refund Investigation.
   - Priority indicator with live SLA countdown badges.
   - *Backing Endpoint:* `GET /api/v1/state` (`state.tickets`).
3. **Patient & Hospital Directory (Minimum Necessary Access):**
   - Search by Patient Phone or ABHA ID.
   - Displays: Name, Masked Phone (`+91 98*** **421`), Account Status, Active Appointments count.
   - Strictly omits: Diagnoses, prescriptions, clinical notes, lab reports.
4. **Explicit Clinical Chart Access Lock Card (CAT-07):**
   - Interactive diagnostic test: Clicking "View Clinical Chart" issues request to `GET /api/v1/clinical/chart` with Customer Care session token.
   - Visual output: Beautiful, unmistakable **HTTP 403 Forbidden** banner explaining RBAC boundary enforcement.
5. **Payment Failure & Refund Investigation Drawer:**
   - Input: Transaction ID / Event ID.
   - Displays gateway payload, idempotency key, webhook delivery timestamp, and refund initiation trigger.
   - *Backing Endpoint:* `POST /api/v1/webhooks/payment`.
6. **Support Knowledge Base & Shift Handover:**
   - AI-assisted canned responses for rapid non-clinical queries (`POST /api/v1/ai/support-faq`).
   - Escalation trigger to Employee Operations Hub.

---

### 2.3. Screen 03: Aegis Care – Patient & Family Healthcare Portal Dashboard
- **Stitch Reference:** `03-patient-portal.html` (70.3 KB)
- **React Route:** `/patient/*`
- **Primary Layout:** Patient Shell + Welcome Hero Banner + Multi-Tab Personal Health Record

#### Component Breakdown & Backing APIs:
1. **Interactive 3D Holographic ABHA Card:**
   - Displays 14-digit ABHA Number (`91-4209-8812-3904`), ABHA Address (`ananya.sharma@abdm`), QR Code, Profile Photo, Verification Chip.
   - *Backing Endpoint:* `GET /api/v1/abdm/profile/:patientId`.
2. **Family Member Profile Switcher:**
   - Quick tabs: Self (Ananya Sharma), Father (Ramesh Sharma, 68y), Son (Aarav, 6y).
   - Guardian consent controls and proxy appointment management.
3. **Provider & Hospital Discovery with Filters:**
   - Search by Specialty, Department (Cardiology, Orthopaedics, Paediatrics), Facility Distance, Rating.
   - Real-time availability badges ("Available Today").
   - *Backing Endpoint:* `GET /api/v1/state` (`doctors`, `facilities`, `slots`).
4. **AI Healthcare Navigation Assistant (Conversational Drawer):**
   - Interactive prompt allowing patient to describe health concerns in plain English or Hindi.
   - Red-Flag Triage Engine: Immediately routes chest pain / acute breathlessness to Emergency 108 Resuscitation.
   - Department recommendation and direct link to verified specialists.
   - *Backing Endpoint:* `POST /api/v1/ai/navigate`.
5. **Slot Reservation & Booking Flow (CAT-01, CAT-04):**
   - Slot calendar grid -> 10-minute atomic hold lock (`POST /api/v1/slots/hold`).
   - Simulated UPI / Card payment checkout -> confirmation webhook (`POST /api/v1/webhooks/payment`).
   - Confirmed appointment pass with QR check-in token.
6. **Unified Longitudinal Health Timeline:**
   - Chronological card feed integrating: Doctor Encounters, Lab Reports, Prescriptions, Hospital Admissions.
   - *Backing Endpoint:* `GET /api/v1/fhir/bundle/:patientId`.
7. **Scoped Consent Management Vault (CAT-05, CAT-06):**
   - Active consent cards: Doctor Name, Facility, Purpose (`CONSULTATION`), Granted Categories (`PRESCRIPTIONS`, `LAB_REPORTS`), Expiry.
   - One-Click Instant Revocation button (`POST /api/v1/consents/:id/revoke`).

---

### 2.4. Screen 04: Doctor Clinical Workspace – Active Patient Encounter
- **Stitch Reference:** `04-doctor-workspace.html` (75.6 KB)
- **React Route:** `/doctor/*`
- **Primary Layout:** Clinical Rail + Live OPD Calling Ribbon + Split-Screen Encounter Workspace

#### Component Breakdown & Backing APIs:
1. **Live OPD Queue & Hospital Calling Chime:**
   - Queue Tokens: `TOKEN #101` (In Consultation), `TOKEN #102` (Next), `TOKEN #103` (Waiting).
   - Audio Chime trigger with visual calling status.
   - *Backing Endpoints:* `GET /api/v1/opd/queue`, `POST /api/v1/opd/queue/:id/transition`.
2. **Active Patient Banner & Vitals Strip:**
   - Patient Name, Age/Gender, Blood Group, Active Allergies (bold red alert chip), Active Consent Badge.
   - Real-time Vitals Recorder: BP (120/80), Pulse (72 bpm), SpO2 (98%), Temp (98.6 F), BMI (22.4).
3. **Permitted Medical History Drawer:**
   - Evaluates active consent grant before displaying historical documents.
   - Filtered exclusively to permitted categories.
4. **Structured SOAP Encounter Note Editor:**
   - Subjective (Chief complaints, history of present illness).
   - Objective (Physical examination findings).
   - Assessment (Provisional & Differential Diagnosis with ICD-10 suggestions).
   - Plan (Treatment strategy, lifestyle guidance, follow-up date).
   - AI SOAP Draft Assistant (`POST /api/v1/ai/soap-draft`).
5. **Digital Prescription Composer & Drug Schedule Lock:**
   - Medication search, dosage (500mg), frequency (1-0-1), route (Oral), relation to food (After Meals), duration (5 days).
   - Drug-drug interaction alerts.
6. **AI Diagnostic Report Dual-View Assistant (CAT-11):**
   - Side-by-side comparison: Original uploaded Lab/Radiology PDF rendered on left, AI-extracted structured values on right.
   - Mandatory Doctor Review & Acceptance checkbox (`POST /api/v1/ai/report-accept`).
7. **Encounter Signing & Immutable Amendment Ledger (CAT-09):**
   - "Sign & Seal Encounter" button (`POST /api/v1/encounters/sign`).
   - Once signed, direct editing is permanently locked.
   - "Create Clinical Amendment" drawer (`POST /api/v1/encounters/amend`) records timestamped addenda without overwriting original note.

---

### 2.5. Screen 05: Staff Operations – Diagnostics & Pharmacy Management
- **Stitch Reference:** `05-staff-operations.html` (81.7 KB)
- **React Route:** `/staff/*`
- **Primary Layout:** Department Switcher (Laboratory / Pharmacy) + Work Queue Table + Action Panels

#### Component Breakdown & Backing APIs:
1. **Diagnostic Laboratory Work Queue:**
   - Orders received, specimen collection status, barcode accessioning.
   - Specimen type: Whole Blood, Serum, Urine, Swab.
   - *Backing Endpoints:* `POST /api/v1/lis/orders`, `POST /api/v1/lis/specimens`.
2. **Result Entry & Pathologist Validation Lock (CAT-10):**
   - Test parameters (e.g. Haemoglobin, Platelets, Fasting Glucose).
   - Panic/Critical value visual highlights.
   - Mandatory Pathologist Sign-Off gatekeeper (`POST /api/v1/lis/results/:id/validate`) blocking publication without digital authorization.
3. **Pharmacy Formulary & Inventory Stock:**
   - Real-time stock levels, batch numbers, manufacturer, expiry dates.
   - Low-stock visual warning badges (<20 units remaining).
   - *Backing Endpoint:* `GET /api/v1/pharmacy/formulary`.
4. **Electronic Prescription Dispense Station (CAT-08):**
   - Prescriptions queue matching patient ID.
   - Barcode scan verification of medication box.
   - Atomic dispense action (`POST /api/v1/pharmacy/dispense`) decrementing inventory count with transaction safety.

---

### 2.6. Screen 06: CityCare Hospital Authority Operations Dashboard
- **Stitch Reference:** `06-hospital-authority.html` (65.9 KB)
- **React Route:** `/hospital/*`
- **Primary Layout:** Executive Operations Rail + Facility Census Banner + Department Grid

#### Component Breakdown & Backing APIs:
1. **Executive Operational KPI Strip:**
   - Total Bed Occupancy (84% - 210/250 beds).
   - Emergency Census (18 active trauma cases).
   - Surgeries Scheduled Today (12 OT sessions).
   - Daily Revenue Realization (₹14.2 Lakhs).
2. **Interactive Inpatient Bed & Ward Manager:**
   - Floor / Wing selector: 2nd Floor ICU, 3rd Floor HDU, 4th Floor General Ward.
   - Color-coded bed grid: Available (Green), Occupied (Navy), Cleaning (Amber), Maintenance (Grey).
   - Bed admission, transfer, and discharge clearance modal.
   - *Backing Endpoints:* `GET /api/v1/inpatient/beds`, `POST /api/v1/inpatient/admissions`, `POST /api/v1/inpatient/beds/transfer`, `POST /api/v1/inpatient/discharge`.
3. **Operation Theatre & WHO Surgical Safety Checklist:**
   - OT 1 to OT 4 schedule with surgeon and anaesthetist roster.
   - Enforced 3-step checklist: Sign-In (before anaesthesia) -> Time-Out (before skin incision) -> Sign-Out (before patient leaves room).
   - *Backing Endpoints:* `GET /api/v1/ot/bookings`, `POST /api/v1/ot/checklist`.
4. **Emergency Trauma Intake & Ambulance GPS Telemetry:**
   - Live ambulance coordinates, speed, ETA, and priority level.
   - Direct emergency trauma intake bypassing routine scheduling (`POST /api/v1/emergency/triage`).
   - *Backing Endpoints:* `GET /api/v1/ambulance/dispatches`, `POST /api/v1/ambulance/telemetry`.
5. **Blood Bank Inventory & Crossmatch Station:**
   - Stock by blood group: A+, A-, B+, B-, AB+, AB-, O+, O-.
   - Crossmatch reservation for scheduled surgeries (`POST /api/v1/blood-bank/crossmatch`).
6. **Inpatient Tariff & Cashless Insurance Adjudication:**
   - Tariff codes (NABH Room tariff, ICU tariff, Nursing charges).
   - Insurance pre-authorization submission & settlement (`POST /api/v1/insurance/claims`).

