# ADR-003: Identity, Privileged Access & 5-Admin Governance Lifecycle

## Status
Accepted (Mandatory Governance & Security Baseline)

## Context
The source concept mandates:
1. Four login sections: Admin, Office Workers, Hospital/Doctor, Patient.
2. A strict maximum of 5 platform administrators.
3. A 7-day waiting period before an admin can delete another admin identity.
4. Mitigation against single-point takeover or rogue admin abuse.

## Decision
1. **Four Entry Points, Six Personas:**
   - Entry Point 1 (Admin Login): `Platform Administrator`.
   - Entry Point 2 (Office Workers Login): `Staff Portal / Employee Hub` (Operations, Verification, Records, Security) and `Customer Care` (First-line triage).
   - Entry Point 3 (Hospital & Doctor Login): `Hospital Authority` (Facility operations, beds, tariffs) and `Doctor / RMP` (Consultation, encounters, prescriptions).
   - Entry Point 4 (Patient Login): `Patient / Dependent` (Health records, discovery, booking, consent).
2. **5-Platform Admin Ceiling:** The system enforces an immutable constraint checking that active `PlatformAdmin` accounts never exceed 5. Any attempt to promote or create a 6th admin fails at the database constraint/service layer.
3. **Controlled 7-Day Admin Removal Lifecycle:**
   - Admin deletion is never an instantaneous destructive hard-delete.
   - Deletion follows a strict state machine: `REMOVAL_REQUESTED` -> `NOTIFICATION_DISPATCHED` (to all active admins) -> `7_DAY_COOLING_OFF_PERIOD` -> `INDEPENDENT_APPROVAL` (requires sign-off from a second active admin) -> `ACCOUNT_DEACTIVATED` -> `ARCHIVAL`.
   - Audit records and activity history of deactivated administrators are retained perpetually and cannot be purged.
4. **Separation of Duties & Two-Person Rules:** High-impact administrative actions (appointing new admins, disabling major security controls, altering global settlement configurations, tenant decommissioning) require dual-admin cryptographic authorization (Two-Person Approval).
5. **Audited Break-Glass Access:** Privileged users cannot browse clinical records routinely. Emergency break-glass access requires a stated clinical emergency justification, has an automatic 4-hour expiration, alerts security operations immediately, and triggers retrospective review.
6. **MFA Requirement:** Time-based one-time passwords (TOTP) or WebAuthn/FIDO2 MFA is strictly enforced for all administrative and clinical roles.

## Consequences
- Prevents administrative hostile takeovers and accidental deletions.
- Full compliance with requirement T-01 and blueprint Section 03.

