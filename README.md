# SvasthNexis — Connected Healthcare Demo

SvasthNexis is a multi-workspace healthcare platform prototype based on the Unified Healthcare Management Ecosystem blueprint. It demonstrates a connected patient journey and role-separated workspaces for patients, doctors, hospital operations, employee operations, customer care and platform governance.

> **Important:** This repository is a development demonstration, not a production healthcare system. Seeded people and facilities are fictional. The current API uses an in-memory domain store, hard-coded demo sessions and simulated payment events. Do not enter real patient data, use it to make care decisions, or expose it to the public internet.

## What is included

- Redesigned responsive dashboard UI with a role-aware navigation shell and six workspaces.
- Patient provider discovery, demo slot reservation, appointment request, consent grant and personal timeline.
- Doctor appointment review, encounter signing and linked amendment demonstrations.
- Hospital overview for OPD flow, care teams, resources and sandbox payment summaries.
- Employee hub for verification work queues, service operations and audit activity.
- Customer care ticket view and an explicit RBAC denial demonstration for clinical chart access.
- Platform administrator lifecycle view and tamper-evident audit stream.
- Existing modular domain packages for shared types, policy evaluation, audit, database migration scaffolding and observability.

## Local setup

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm run build
npm start
```

Then open <http://localhost:3000>.

For local TypeScript development:

```bash
npm run dev
```

The demo API health endpoint is <http://localhost:3000/health/readiness>. It explicitly reports that persistence and object storage are not connected in this prototype.

## Demo workflow

1. Open the Patient workspace and choose a doctor availability slot. This creates a short-lived slot hold and an appointment request.
2. Switch to the Doctor workspace and accept the request.
3. Return to Patient and use the sandbox payment flow where shown, or inspect the state in the API.
4. Switch to Doctor, start a confirmed visit and create a fictional demo encounter note. Amendments are stored as linked records rather than silently replacing the original note.
5. Open Patient consent controls to create a time-limited demo grant.
6. Open Customer Care and run the clinical-chart access test. The expected result is HTTP 403.
7. Open Platform Admin to inspect the audit chain and demo administrator lifecycle.

All actions occur in process memory. Restarting the server resets the demo state.

## Environment and production gaps

The repository includes local PostgreSQL, Redis and MinIO Compose definitions and database migrations, but the currently running demo `DomainStore` is not wired to those services. `docker-compose.yml` therefore provisions development infrastructure only; it does not make the API persistent by itself.

Before any real clinical pilot, implement and independently validate at least:

- Real authentication, MFA, session management and server-derived identity. The current demo endpoints use simulated identities and must not be considered secure authentication.
- PostgreSQL-backed repositories, transactional slot holds, idempotent payment events and a transactional outbox.
- Private object storage, malware scanning, signed access URLs, retention and backup/restore controls.
- Fully enforced RBAC + ABAC and tenant isolation at API and data layers.
- Clinical governance and practitioner review for encounters, prescriptions, results and AI outputs.
- Real payment, video, messaging, map, lab/HIS and ABDM adapters, with credentials and partner approvals.
- India-specific privacy, telemedicine, medical-record, cybersecurity and other applicable legal reviews.
- Security testing, load/concurrency testing, disaster-recovery drills and operational ownership.

See `docs/architecture/`, `docs/requirements/`, `docs/risk/` and `docs/runbooks/` for the current engineering decisions and readiness material.

## Test commands

```bash
npm run test:unit
npm run test:integration
npm run test:concurrency
npm run test:security
```

The test commands require a clean platform-specific `npm install`. Do not copy a `node_modules` folder between macOS, Windows and Linux; native optional dependencies are platform-specific.
