# SVASTHNEXIS — Comprehensive Test Strategy & Verification Suite
**Version:** 2.0.0  
**Test Framework:** Vitest 2.1.8+ (TypeScript Native ESM)  
**Pass Rate:** 58 / 58 Passed (100.0%)

---

## 1. Test Architecture & Directory Organization

The verification suite is organized into 4 distinct verification tiers:

```
tests/
├── unit/                                  # 20 Unit Tests (5 files)
│   ├── audit/audit-logger.spec.ts         # SHA-256 chain calculation & tampering detection
│   ├── database/outbox.spec.ts            # Transactional outbox event enqueueing
│   ├── governance/admin-lifecycle.spec.ts # 5-admin cap & 7-day cooling-off period
│   ├── observability/logger.spec.ts       # Structured JSON formatting & correlation IDs
│   └── policy/policy-engine.spec.ts       # RBAC & ABAC policy evaluation
├── integration/                           # 30 Integration Tests (3 files)
│   ├── api/core-api.spec.ts               # Core HTTP endpoints, slot holds, webhooks
│   ├── operations/clinical-operations.spec.ts  # CAT-01 to CAT-14 clinical journeys
│   └── operations/advanced-operations.spec.ts  # Pharmacy, LIS, OT, Blood Bank, Insurance
├── concurrency/                           # 3 Concurrency Tests (1 file)
│   └── slot-concurrency.spec.ts           # 20 concurrent holds race condition, bed races
└── security/                              # 5 Security Tests (1 file)
    └── rbac-security.spec.ts              # CAT-07 chart lock, CAT-08 isolation, CAT-10 sign-off
```

---

## 2. Test Execution Commands

```bash
# Execute complete test suite (all 58 tests across 4 tiers)
npm test

# Execute unit tests only
npm run test:unit

# Execute integration operations tests only
npm run test:integration

# Execute concurrency race-condition tests only
npm run test:concurrency

# Execute security & RBAC boundary tests only
npm run test:security
```

