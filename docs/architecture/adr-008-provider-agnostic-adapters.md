# ADR-008: Provider-Agnostic Partner Adapters (Payment, Video, Telehealth, ABDM)

## Status
Accepted (Mandatory Integration Baseline)

## Context
Healthcare organizations rely on varied external vendors for payments (Razorpay, Cashfree, Pine Labs), video teleconsultations (Zoom, Google Meet, AWS Chime, WebRTC), SMS/notifications (Gupshup, Twilio), and national health initiatives (ABDM / ABHA). Hard-coding a single commercial provider into core clinical logic creates vendor lock-in, complicates sandbox testing, and causes catastrophic downtime during third-party outages.

## Decision
1. **Adapter Interface Pattern:**
   - All third-party interactions are abstracted behind strongly typed TypeScript interfaces in `services/integrations/`:
     - `PaymentGatewayAdapter`: `createOrder()`, `verifyWebhookSignature()`, `initiateRefund()`, `fetchStatus()`.
     - `VideoConferenceAdapter`: `createSession()`, `generateJoinCredentials()`, `endSession()`, `getRecordingMetadata()`.
     - `NotificationGatewayAdapter`: `sendSms()`, `sendEmail()`, `sendPush()`.
     - `AbdmIntegrationAdapter`: `verifyAbha()`, `discoverHpr()`, `discoverHfr()`, `pushConsentArtifact()`.
2. **Explicit Sandbox / Mock Implementations:**
   - Every integration adapter provides a verified local `SandboxAdapter` implementation enabled by default in non-production environments (`ADAPTER_MODE=sandbox`).
   - Mock adapters follow identical error codes, latency models, and signed webhook simulation to enable full end-to-end testing without external network dependencies.
3. **Webhook Verification & Idempotency:**
   - All inbound webhooks (e.g., payment success) must verify cryptographic HMAC signatures before deserializing.
   - Webhook processing uses unique event IDs and updates an immutable financial ledger; client callbacks are never trusted as proof of payment.
4. **Graceful Degradation & Fallback:**
   - If an external video provider fails, the platform surfaces an immediate fallback channel (audio or alternative link) and notifies the clinician.
   - If online payment fails, authorized staff can record at-facility collection with manual receipts.

## Consequences
- Clean separation between core domain logic and third-party vendor APIs.
- Unhindered local development and automated testing using robust sandbox adapters.
