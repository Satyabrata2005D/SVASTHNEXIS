# SVASTHNEXIS — Deployment & Production-Readiness Runbook
**Version:** 2.0.0  
**Target Environments:** Local Docker Development, Isolated Staging, Enterprise Production  
**Author:** DevOps & Systems Engineer

---

## 1. Local Development Quickstart

### Prerequisites
- Node.js 20.0.0 or later
- npm 10.0.0 or later
- Docker & Docker Compose (optional for local database container)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build All Monorepo Workspaces
```bash
npm run build
```

### Step 3: Run Full Automated Verification Suite
```bash
npm test
```
*Expected Output: 58 tests passed across 8 test files.*

### Step 4: Start the Ecosystem Server
```bash
npm start
```
The application server boots at `http://localhost:3000`:
- **Modern React Web Application:** `http://localhost:3000/` (routes to `/hospital`, `/doctor`, `/patient`, `/staff`, `/support`, `/admin`)
- **Health Readiness Probe:** `http://localhost:3000/health/readiness`
- **Tamper-Evident SHA-256 Audit Trail:** `http://localhost:3000/api/v1/audit`

---

## 2. Local Container Infrastructure (Docker Compose)

To spin up local PostgreSQL, Redis, and MinIO storage:

```bash
docker compose -f infra/local/docker-compose.yml up -d
```

### Services Provisioned:
- **PostgreSQL 16:** `localhost:5432` (Database: `svasthnexis_dev`, User: `postgres`)
- **Redis 7 Alpine:** `localhost:6379`
- **MinIO S3 Compatible Object Storage:** `localhost:9000` (Console: `localhost:9001`)

---

## 3. Production Readiness Gates & Prohibitions

> [!CAUTION]
> **MANDATORY LEGAL & CLINICAL NOTICE:**  
> This software is an enterprise architectural prototype. Do NOT expose this deployment to the public internet or connect it to real patient telemetry without completing:
> 1. Real OIDC / OAuth2 Identity Provider integration (e.g. Keycloak / Auth0 / Google Cloud Identity).
> 2. End-to-end ABDM (Ayushman Bharat Digital Mission) sandbox certification and M1/M2/M3 milestone audit.
> 3. Medical legal review by a certified Indian healthcare regulatory compliance team.
> 4. Schedule H/H1 e-prescription validation by a licensed clinical director.

