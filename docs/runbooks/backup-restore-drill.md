# Disaster Recovery & Backup Restore Drill Runbook
## Unified Healthcare Management Ecosystem (SvasthNexis)
**Document Status:** Operational Runbook  
**Target SLOs:**
- Recovery Point Objective (RPO): <= 15 minutes for transactional data.
- Recovery Time Objective (RTO): <= 4 hours for core patient & booking workflows.
- Verification Frequency: Mandatory Quarterly Restore Drill (Test CAT-14).

---

### 1. Architecture of Backup Systems
1. **PostgreSQL Database:**
   - Base backup generated daily at 01:00 UTC using `pg_basebackup` with gzip compression and AES-256 encryption.
   - Continuous WAL (Write-Ahead Log) archiving transmitted every 5 minutes to an isolated, immutable S3-compatible cloud storage bucket (`archive_mode=on`, `archive_command`).
   - Enables Point-In-Time Recovery (PITR) to any second within the retention window (30 days).
2. **Encrypted Object Storage:**
   - Multi-versioning enabled on `svasthnexis-records` bucket.
   - Cross-region asynchronous replication to secondary disaster-recovery bucket with lifecycle lock.
3. **Configuration & Secrets:**
   - Infrastructure-as-code (Terraform/Docker) managed under version control.
   - Secrets stored in HashiCorp Vault / Cloud Secret Manager with scheduled key rotation.

---

### 2. Step-by-Step Restoration Procedure (PITR Drill)

#### Phase 1: Environment Preparation (T+0 to T+30 min)
1. Provision isolated recovery test environment (prevent routing production DNS to test instance):
   ```bash
   export RESTORE_ENV=dr-drill-$(date +%Y%m%d)
   docker compose -f infra/local/docker-compose.dr-drill.yml up -d
   ```
2. Verify secondary storage network connectivity and retrieve latest encrypted base backup:
   ```bash
   aws s3 cp s3://svasthnexis-backup-vault/base-backups/latest-base.tar.gz /var/restore/
   ```

#### Phase 2: PostgreSQL Point-in-Time Recovery (T+30 min to T+90 min)
1. Stop PostgreSQL service in target recovery node.
2. Unpack base backup into `$PGDATA`:
   ```bash
   tar -xzf /var/restore/latest-base.tar.gz -C $PGDATA
   ```
3. Create `recovery.signal` and configure `postgresql.conf`:
   ```ini
   restore_command = 'aws s3 cp s3://svasthnexis-backup-vault/wal-archives/%f %p'
   recovery_target_time = '2026-11-02 23:00:00 UTC'
   recovery_target_action = 'promote'
   ```
4. Start PostgreSQL service and monitor recovery replay progress:
   ```bash
   tail -f $PGDATA/log/postgresql.log
   ```

#### Phase 3: Data Integrity & Consistency Validation (T+90 min to T+150 min)
1. Execute automated data integrity verification script:
   ```bash
   npm run cli -- verify:db-integrity --target=recovery-node
   ```
2. Validate consistency invariants:
   - Check slot reservation constraints (no overlapping active holds).
   - Verify financial ledger balance matches total captured payment transactions.
   - Confirm patient document checksums match storage records.
   - Validate immutable audit event sequence hash continuity.

#### Phase 4: Drill Sign-off & Audit Log (T+150 min to T+180 min)
1. Calculate actual drill metrics:
   - **Measured RPO:** Time delta between specified target time and latest replayed WAL commit. (Must be <= 15 minutes).
   - **Measured RTO:** Wall-clock time elapsed from drill initiation to successful integrity verification. (Must be <= 4 hours).
2. File formal drill report in `docs/runbooks/dr-drill-reports/YYYY-MM-DD.md` signed by Lead DevOps Engineer and CISO.

