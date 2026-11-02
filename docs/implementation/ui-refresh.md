# SvasthNexis UI refresh

## Goals

Replace the original plain, table-heavy portal page with a polished, responsive healthcare SaaS workspace that communicates trust, patient control, operational clarity and role separation.

## Design system

- Warm Ivory `#F8F7F3` as the dominant canvas, Pure White `#FFFFFF` for cards and navigation surfaces, and Warm Light Grey `#F1F0EC` for secondary surfaces and form controls.
- Coral `#FF5B47` for brand highlights and active navigation; accessible deep coral `#C94132` for primary actions with white labels.
- Midnight Navy `#171C2C` for headings and primary text; Slate Grey `#6B7280` for secondary text.
- Emerald `#10B981` for positive operational states and Golden Amber `#FBC024` for attention / warning data; Muted Blue Grey `#93A2B9` and Pale Mint `#EAF8F1` are supporting tones.
- The patient hero uses the subtle three-stop gradient `#F9EBE8 → #F4EEF0 → #EEF0F4`.
- Recommended composition: 55% Warm Ivory, 25% White, 10% Midnight Navy, 6% Coral, 2% Emerald and 2% Amber. These are design targets, not measured pixel percentages.
- Consistent card radii, spacing, borders, subtle shadows, focus states and typographic hierarchy.
- Responsive fixed sidebar on desktop and slide-in navigation on smaller screens.
- Role-aware navigation for Patient, Doctor, Hospital, Employee Hub, Customer Care and Platform Admin.
- Shared status pills, KPI cards, timeline rows, data tables, empty states, toast feedback and modal dialogs.
- System font stack and inline SVG icons; no third-party font or icon runtime is required.
- Colour tokens are centralized in `packages/design-system/src/tokens.ts` and semantic CSS variables are applied to the shared six-workspace page.

## Workspace coverage

| Workspace | Primary UI areas |
|---|---|
| Patient | Care discovery, verified provider cards, slot reservation, appointment state, personal timeline, document vault, scoped consent and support |
| Doctor | Appointment inbox, accept / decline actions, confirmed-visit encounter signing, amendment history, prescription register and practice snapshot |
| Hospital | Facility identity, appointment flow, illustrative OPD metrics, resource overview, practitioner roster and sandbox finance summary |
| Employee Hub | Verification queue, operations queues, security-operation guidance and audit activity |
| Customer Care | Ticket queue, non-clinical support principles and explicit clinical-chart access-denial test |
| Platform Admin | Five-admin policy visibility, seven-day removal request, audit-chain view and demo service posture |

## API connections retained

- `GET /api/v1/state` loads the current in-memory demo state.
- `POST /api/v1/slots/hold` and `POST /api/v1/appointments` demonstrate slot reservation and booking requests.
- `POST /api/v1/appointments/:id/transition` demonstrates provider acceptance / rejection.
- `POST /api/v1/webhooks/payment` demonstrates sandbox payment event handling.
- `POST /api/v1/consents` creates a time-limited demo consent grant.
- `POST /api/v1/encounters/sign` and `POST /api/v1/encounters/amend` demonstrate signed notes and linked amendments.
- `GET /api/v1/clinical/chart?role=CUSTOMER_CARE` demonstrates a forbidden clinical-chart access attempt.
- `POST /api/v1/admin/removal/initiate` and `GET /api/v1/audit` demonstrate governance and audit workflows.

## Explicit prototype boundaries

The redesigned interface improves the website experience; it does not, by itself, make the backend production-ready. The running API still uses an in-memory store and simulated sessions. The current `DomainStore` is not wired to PostgreSQL, Redis or MinIO. Payments, credentials, notifications, video consultation, hospital integrations and ABDM exchange are not live. Some operational figures are illustrative UI examples and are labelled as such. The project must complete the authentication, persistence, authorization, clinical validation, privacy, security, integration and operational release gates described in the main blueprint before real patient use.
