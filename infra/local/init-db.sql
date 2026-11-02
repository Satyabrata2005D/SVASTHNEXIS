-- PostgreSQL Initialization Script
-- Unified Healthcare Management Ecosystem (SvasthNexis)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant schema creation permissions
GRANT ALL ON SCHEMA public TO postgres;

-- Verification log notice
DO $$
BEGIN
  RAISE NOTICE 'SvasthNexis Database Initialized with UUID and pgcrypto extensions.';
END $$;

