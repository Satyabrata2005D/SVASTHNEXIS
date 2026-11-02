-- Migration 002: Multi-Tenant Row Level Security (RLS)
-- Unified Healthcare Management Ecosystem (SvasthNexis)
-- Enforces defense-in-depth isolation matching ADR-002 and CAT-08.

-- 1. Enable RLS on Tenant-Scoped Tables
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_slots ENABLE ROW LEVEL SECURITY;

-- 2. Tenant Isolation Policies for Appointments
CREATE POLICY tenant_isolation_appointments ON appointments
    FOR ALL
    USING (
        facility_id = NULLIF(current_setting('app.current_tenant_id', true), '')
        OR patient_id = NULLIF(current_setting('app.current_user_id', true), '')
    );

-- 3. Tenant Isolation Policies for Invoices & Payments
CREATE POLICY tenant_isolation_invoices ON invoices
    FOR ALL
    USING (
        facility_id = NULLIF(current_setting('app.current_tenant_id', true), '')
        OR patient_id = NULLIF(current_setting('app.current_user_id', true), '')
    );

CREATE POLICY tenant_isolation_payments ON payment_transactions
    FOR ALL
    USING (
        facility_id = NULLIF(current_setting('app.current_tenant_id', true), '')
        OR patient_id = NULLIF(current_setting('app.current_user_id', true), '')
    );

-- 4. Clinical Encounters Tenant Policy
-- Platform Admin is explicitly blocked from clinical reads even if tenant is set
CREATE POLICY tenant_isolation_clinical ON clinical_encounters
    FOR ALL
    USING (
        (facility_id = NULLIF(current_setting('app.current_tenant_id', true), '')
         AND current_setting('app.current_user_role', true) != 'PLATFORM_ADMIN')
        OR patient_id = NULLIF(current_setting('app.current_user_id', true), '')
    );

-- 5. Lab Orders Tenant Policy
CREATE POLICY tenant_isolation_lab_orders ON lab_orders
    FOR ALL
    USING (
        facility_id = NULLIF(current_setting('app.current_tenant_id', true), '')
        OR patient_id = NULLIF(current_setting('app.current_user_id', true), '')
    );

