/**
 * @file packages/database/src/pool.ts
 * PostgreSQL Connection Pool Manager
 */

import pg from 'pg';
import { StructuredLogger } from '@svasthnexis/observability';

const { Pool } = pg;
const logger = new StructuredLogger('DatabasePool');

export interface DatabaseConfig {
  connectionString?: string;
  minPool?: number;
  maxPool?: number;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: pg.Pool;

  private constructor(config?: DatabaseConfig) {
    const connectionString =
      config?.connectionString ||
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres_dev_password@localhost:5432/svasthnexis_dev';

    this.pool = new Pool({
      connectionString,
      min: config?.minPool || 2,
      max: config?.maxPool || 10,
      idleTimeoutMillis: 30000,
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected idle PostgreSQL client error', { error: err.message });
    });
  }

  public static getInstance(config?: DatabaseConfig): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(config);
    }
    return DatabaseService.instance;
  }

  public getPool(): pg.Pool {
    return this.pool;
  }

  public async query<T extends pg.QueryResultRow = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}
