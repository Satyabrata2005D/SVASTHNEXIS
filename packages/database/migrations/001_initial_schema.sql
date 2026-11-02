-- Migration 001: Initial Core Schema
-- Unified Healthcare Management Ecosystem (SvasthNexis)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tenants / Facilities (Hospital, Clinic, Diagnostic Centre)
CREATE TABLE IF NOT EXISTS facilities (
    id VARCHAR(64) PRIMARY KEY,
    hospital_group_id VARCHAR(64),
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255) NOT NULL,
    facility_type VARCHAR(32) NOT NULL CHECK (facility_type IN ('HOSPITAL', 'CLINIC', 'DIAGNOSTIC_CENTER')),
    registration_number VARCHAR(128) NOT NULL,
    issuing_authority VARCHAR(255) NOT NULL,
    address_json JSONB NOT NULL,
    contact_phone VARCHAR(32) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    operating_hours TEXT NOT NULL,
    is_emergency_ready BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (verification_status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'SUSPENDED')),
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Users & Sessions
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Platform Administrators (Max 5 constraint enforced)
CREATE TABLE IF NOT EXISTS platform_admins (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REMOVAL_REQUESTED', 'COOLING_OFF', 'DEACTIVATED', 'ARCHIVED')),
    appointed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    removal_requested_at TIMESTAMPTZ,
    removal_reason TEXT,
    cooling_off_ends_at TIMESTAMPTZ,
    independent_approver_id VARCHAR(64),
    archived_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_platform_admins_user ON platform_admins(user_id) WHERE status = 'ACTIVE';

-- 4. User Roles & Tenant Membership
CREATE TABLE IF NOT EXISTS user_roles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    tenant_id VARCHAR(64) REFERENCES facilities(id),
    role VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Doctors & Professional Credentials
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    full_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(128) NOT NULL,
    registration_council VARCHAR(255) NOT NULL,
    degrees_json JSONB NOT NULL DEFAULT '[]',
    primary_specialty VARCHAR(128) NOT NULL,
    sub_specialties_json JSONB NOT NULL DEFAULT '[]',
    languages_json JSONB NOT NULL DEFAULT '[]',
    years_experience INT NOT NULL DEFAULT 0,
    evidenced_surgeries_count INT DEFAULT 0,
    publications_json JSONB DEFAULT '[]',
    verification_status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (verification_status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'SUSPENDED')),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Doctor Affiliations
CREATE TABLE IF NOT EXISTS doctor_affiliations (
    id VARCHAR(64) PRIMARY KEY,
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id),
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id),
    department_name VARCHAR(128) NOT NULL,
    consultation_fee_minor_units INT NOT NULL,
    modes_json JSONB NOT NULL DEFAULT '["IN_PERSON"]',
    approval_status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'ACTIVE', 'REVOKED')),
    effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    effective_to TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Doctor Schedule Slots (Concurrency-safe slot holds)
CREATE TABLE IF NOT EXISTS doctor_slots (
    id VARCHAR(64) PRIMARY KEY,
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id),
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    mode VARCHAR(32) NOT NULL CHECK (mode IN ('IN_PERSON', 'TELECONSULTATION')),
    capacity INT NOT NULL DEFAULT 1,
    allocated_count INT NOT NULL DEFAULT 0,
    is_held BOOLEAN NOT NULL DEFAULT FALSE,
    held_until TIMESTAMPTZ,
    held_by_patient_id VARCHAR(64),
    version INT NOT NULL DEFAULT 1,
    CONSTRAINT chk_slot_capacity CHECK (allocated_count <= capacity)
);

CREATE INDEX IF NOT EXISTS idx_slots_doctor_time ON doctor_slots(doctor_id, start_time);

-- 8. Patients & Dependents
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    gender VARCHAR(16) NOT NULL,
    date_of_birth DATE NOT NULL,
    preferred_language VARCHAR(32) DEFAULT 'English',
    emergency_contact_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_dependents (
    id VARCHAR(64) PRIMARY KEY,
    primary_guardian_patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(16) NOT NULL,
    date_of_birth DATE NOT NULL,
    relationship VARCHAR(32) NOT NULL,
    guardian_authority_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Appointments State Machine
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id),
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id),
    slot_id VARCHAR(64) NOT NULL REFERENCES doctor_slots(id),
    state VARCHAR(32) NOT NULL DEFAULT 'REQUESTED',
    consultation_mode VARCHAR(32) NOT NULL,
    payment_mode VARCHAR(32) NOT NULL,
    payment_id VARCHAR(64),
    chief_complaint TEXT,
    rejection_reason TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Medical Documents Vault
CREATE TABLE IF NOT EXISTS medical_documents (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    facility_id VARCHAR(64) REFERENCES facilities(id),
    author_doctor_id VARCHAR(64) REFERENCES doctors(id),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    mime_type VARCHAR(128) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_key VARCHAR(512) NOT NULL,
    document_date DATE NOT NULL,
    source VARCHAR(32) NOT NULL CHECK (source IN ('PATIENT_UPLOADED', 'FACILITY_GENERATED')),
    verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    version INT NOT NULL DEFAULT 1,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Scoped Consent Grants
CREATE TABLE IF NOT EXISTS consent_grants (
    id VARCHAR(64) PRIMARY KEY,
    data_subject_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    recipient_id VARCHAR(64) NOT NULL,
    purpose VARCHAR(64) NOT NULL,
    scope_categories_json JSONB NOT NULL,
    document_ids_json JSONB,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'GRANTED',
    notice_version VARCHAR(64) NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- 12. Clinical Encounters & Prescriptions
CREATE TABLE IF NOT EXISTS clinical_encounters (
    id VARCHAR(64) PRIMARY KEY,
    appointment_id VARCHAR(64) NOT NULL REFERENCES appointments(id),
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id),
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id),
    encounter_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS',
    clinical_notes TEXT NOT NULL,
    icd10_diagnosis_codes_json JSONB DEFAULT '[]',
    is_signed BOOLEAN NOT NULL DEFAULT FALSE,
    signed_at TIMESTAMPTZ,
    doctor_signature_hash VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clinical_amendments (
    id VARCHAR(64) PRIMARY KEY,
    encounter_id VARCHAR(64) NOT NULL REFERENCES clinical_encounters(id),
    author_doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id),
    amendment_reason TEXT NOT NULL,
    corrected_notes TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    signature_hash VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(64) PRIMARY KEY,
    encounter_id VARCHAR(64) NOT NULL REFERENCES clinical_encounters(id),
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id),
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id),
    items_json JSONB NOT NULL,
    is_signed BOOLEAN NOT NULL DEFAULT FALSE,
    signed_at TIMESTAMPTZ,
    signature_hash VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Diagnostics / Minimum LIS
CREATE TABLE IF NOT EXISTS lab_orders (
    id VARCHAR(64) PRIMARY KEY,
    encounter_id VARCHAR(64) NOT NULL REFERENCES clinical_encounters(id),
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id),
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id),
    test_code VARCHAR(64) NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ORDERED',
    clinical_indication TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lab_results (
    id VARCHAR(64) PRIMARY KEY,
    lab_order_id VARCHAR(64) NOT NULL REFERENCES lab_orders(id),
    parameter_name VARCHAR(128) NOT NULL,
    result_value VARCHAR(64) NOT NULL,
    unit VARCHAR(32),
    reference_interval VARCHAR(64),
    is_abnormal BOOLEAN DEFAULT FALSE,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VALIDATED', 'RELEASED')),
    validated_by_doctor_id VARCHAR(64) REFERENCES doctors(id),
    validated_at TIMESTAMPTZ,
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Finance & Immutable Payments Ledger
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(64) PRIMARY KEY,
    appointment_id VARCHAR(64) NOT NULL REFERENCES appointments(id),
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id),
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    total_minor_units INT NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'UNPAID',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(64) PRIMARY KEY,
    appointment_id VARCHAR(64) NOT NULL REFERENCES appointments(id),
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id),
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id),
    amount_minor_units INT NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    payment_mode VARCHAR(32) NOT NULL,
    gateway_provider VARCHAR(32) NOT NULL,
    gateway_transaction_id VARCHAR(128),
    state VARCHAR(32) NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    captured_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_ledger (
    id VARCHAR(64) PRIMARY KEY,
    transaction_id VARCHAR(64) NOT NULL REFERENCES payment_transactions(id),
    entry_type VARCHAR(16) NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    account_name VARCHAR(128) NOT NULL,
    amount_minor_units INT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(64) PRIMARY KEY,
    requester_id VARCHAR(64) NOT NULL REFERENCES users(id),
    category VARCHAR(32) NOT NULL,
    severity VARCHAR(16) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'NEW',
    assigned_queue VARCHAR(32) NOT NULL,
    assigned_user_id VARCHAR(64) REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sla_due_at TIMESTAMPTZ NOT NULL,
    resolution_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Transactional Outbox Pattern
CREATE TABLE IF NOT EXISTS outbox_events (
    id VARCHAR(64) PRIMARY KEY,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    payload_json JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PUBLISHED', 'FAILED')),
    retry_count INT NOT NULL DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending ON outbox_events(created_at) WHERE status = 'PENDING';

-- 17. Tamper-Evident SHA-256 Audit Stream
CREATE TABLE IF NOT EXISTS audit_events (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    correlation_id VARCHAR(128) NOT NULL,
    tenant_id VARCHAR(64),
    actor_id VARCHAR(64) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    action VARCHAR(64) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64) NOT NULL,
    declared_purpose VARCHAR(64),
    outcome VARCHAR(16) NOT NULL CHECK (outcome IN ('SUCCESS', 'DENIED', 'FAILED')),
    ip_address VARCHAR(64),
    user_agent TEXT,
    metadata_json JSONB,
    previous_hash VARCHAR(128) NOT NULL,
    event_hash VARCHAR(128) NOT NULL
);

