# ADR-006: Encrypted Object Storage & Zero Public Bucket Access

## Status
Accepted (Mandatory Security Baseline)

## Context
Medical documents (prescriptions, diagnostic lab PDFs, DICOM radiology studies, teleconsultation recordings) represent sensitive personal data (SPI). Accidental exposure via misconfigured public S3 buckets or guessable static URLs constitutes an catastrophic data leak.

## Decision
1. **Zero Public Object Storage:**
   - All object storage buckets (MinIO locally, AWS S3 / GCS in cloud) are strictly private with public access blocks enforced at the bucket policy level.
   - Medical document URLs are never publicly accessible or guessable.
2. **Short-Lived Ephemeral Signed URLs:**
   - Any document retrieval generates a cryptographic pre-signed URL with a short TTL (maximum 15 minutes).
   - Pre-signed URLs are generated only AFTER the API verifies the requesting user's identity, role, active session, and patient consent grant.
3. **Server-Side Encryption:**
   - All uploaded objects are encrypted at rest using AES-256-GCM / AWS KMS / Cloud KMS with customer-managed keys.
4. **Malware and MIME Validation Pipeline:**
   - Uploads are directed to a quarantined staging area (`/quarantine/`).
   - The file undergoes MIME type magic-byte inspection and antivirus/malware scanning.
   - Only validated, clean files are promoted to `/clean/` and indexed in PostgreSQL.
5. **Teleconsultation Recordings Policy:**
   - Recorded meetings are disabled by default. If separately consented, recording files are saved with dedicated KMS encryption keys and restricted access controls.

## Consequences
- Prevents public data leaks and unauthorized direct download links.
- Strictly satisfies blueprint Sections 09, 10, 19, and critical acceptance test CAT-05 / CAT-13.

