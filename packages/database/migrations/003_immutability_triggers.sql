-- Migration 003: Clinical Immutability & Admin Cap Triggers
-- Unified Healthcare Management Ecosystem (SvasthNexis)
-- Enforces CAT-09 (signed note immutability), CAT-10 (unvalidated lab results), and T-01 (5-admin ceiling).

-- 1. Clinical Note Immutability Trigger Function
CREATE OR REPLACE FUNCTION enforce_signed_encounter_immutability()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_signed = TRUE THEN
        IF NEW.clinical_notes != OLD.clinical_notes OR
           NEW.doctor_signature_hash != OLD.doctor_signature_hash OR
           NEW.doctor_id != OLD.doctor_id THEN
            RAISE EXCEPTION 'ERR_CLINICAL_NOTE_IMMUTABLE: Signed clinical encounters are legally immutable. Any correction must be authored as a linked ClinicalAmendment entity.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_encounter_immutability ON clinical_encounters;
CREATE TRIGGER trg_encounter_immutability
    BEFORE UPDATE ON clinical_encounters
    FOR EACH ROW
    EXECUTE FUNCTION enforce_signed_encounter_immutability();

-- 2. Prescription Immutability Trigger Function
CREATE OR REPLACE FUNCTION enforce_signed_prescription_immutability()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_signed = TRUE THEN
        IF NEW.items_json != OLD.items_json THEN
            RAISE EXCEPTION 'ERR_PRESCRIPTION_IMMUTABLE: Signed prescriptions cannot be altered. Clinician must issue a new prescription or formal cancellation.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prescription_immutability ON prescriptions;
CREATE TRIGGER trg_prescription_immutability
    BEFORE UPDATE ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION enforce_signed_prescription_immutability();

-- 3. Lab Result Validation Gate Trigger Function (CAT-10)
CREATE OR REPLACE FUNCTION enforce_lab_result_validation_gate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'RELEASED' THEN
        IF NEW.validated_by_doctor_id IS NULL OR NEW.validated_at IS NULL THEN
            RAISE EXCEPTION 'ERR_UNVALIDATED_LAB_RESULT: Lab result cannot be published as RELEASED without authorized pathologist/doctor validation (CAT-10).';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_lab_result_gate ON lab_results;
CREATE TRIGGER trg_lab_result_gate
    BEFORE INSERT OR UPDATE ON lab_results
    FOR EACH ROW
    EXECUTE FUNCTION enforce_lab_result_validation_gate();

-- 4. Maximum 5 Platform Administrators Trigger Function (T-01)
CREATE OR REPLACE FUNCTION enforce_platform_admin_ceiling()
RETURNS TRIGGER AS $$
DECLARE
    active_count INT;
BEGIN
    IF NEW.status = 'ACTIVE' THEN
        SELECT COUNT(*) INTO active_count FROM platform_admins WHERE status = 'ACTIVE' AND id != COALESCE(NEW.id, '');
        IF active_count >= 5 THEN
            RAISE EXCEPTION 'ERR_ADMIN_CAP_EXCEEDED: Maximum 5 active platform administrators permitted under platform governance (T-01).';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_platform_admin_cap ON platform_admins;
CREATE TRIGGER trg_platform_admin_cap
    BEFORE INSERT OR UPDATE ON platform_admins
    FOR EACH ROW
    EXECUTE FUNCTION enforce_platform_admin_ceiling();

