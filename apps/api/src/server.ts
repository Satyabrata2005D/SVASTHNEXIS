/**
 * @file apps/api/src/server.ts
 * Server Entrypoint for SvasthNexis Modular Monolith
 */

import { DomainStore } from './store.js';
import { createApp } from './app.js';
import { StructuredLogger } from '@svasthnexis/observability';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const logger = new StructuredLogger('Server');

async function main() {
  const store = new DomainStore();
  const app = createApp(store);

  // Background worker: Periodically release expired slot holds every 10 seconds
  const holdReaperInterval = setInterval(() => {
    const released = store.releaseExpiredHolds();
    if (released > 0) {
      logger.info(`Slot hold expiration worker released ${released} stale hold(s)`);
    }
  }, 10000);

  const server = app.listen(PORT, () => {
    console.log('================================================================');
    console.log(`🏥 SvasthNexis - Unified Healthcare Management Ecosystem is LIVE`);
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📋 6 Workspaces & 4 Entry Points accessible in browser`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/health/readiness`);
    console.log(`🔒 Tamper-Evident Audit: http://localhost:${PORT}/api/v1/audit`);
    console.log('================================================================');
  });

  const shutdown = () => {
    logger.info('Graceful shutdown initiated...');
    clearInterval(holdReaperInterval);
    server.close(() => {
      logger.info('Server successfully terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((err) => {
  console.error('Fatal server boot failure:', err);
  process.exit(1);
});

