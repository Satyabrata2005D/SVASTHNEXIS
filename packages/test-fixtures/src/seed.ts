/**
 * @file packages/test-fixtures/src/seed.ts
 * Database & Fixture Seeder Script
 */

import { DEMO_FACILITY, DEMO_DOCTORS, DEMO_AFFILIATIONS, DEMO_SLOTS, DEMO_PATIENTS } from './demo-data.js';

export async function seedDemoData() {
  console.log('--- SEEDING SVASTHNEXIS DEMO FIXTURES (STAGE 0) ---');
  console.log(`[SEED] Facility loaded: ${DEMO_FACILITY.tradeName} (ID: ${DEMO_FACILITY.id})`);
  console.log(`[SEED] Doctors registered: ${DEMO_DOCTORS.map(d => d.fullName).join(', ')}`);
  console.log(`[SEED] Affiliations created: ${DEMO_AFFILIATIONS.length}`);
  console.log(`[SEED] Schedule slots initialized: ${DEMO_SLOTS.length}`);
  console.log(`[SEED] Patient & dependents seeded: ${DEMO_PATIENTS.map(p => p.fullName).join(', ')}`);
  console.log('--- SEED COMPLETED SUCCESSFULLY (DEMO FIXTURES ACTIVE) ---');
  return {
    facility: DEMO_FACILITY,
    doctors: DEMO_DOCTORS,
    affiliations: DEMO_AFFILIATIONS,
    slots: DEMO_SLOTS,
    patients: DEMO_PATIENTS,
  };
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDemoData().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}

