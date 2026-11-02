/**
 * @file packages/database/src/migrator.ts
 * Database Migration Engine
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import pg from 'pg';
import { StructuredLogger } from '@svasthnexis/observability';

const logger = new StructuredLogger('DatabaseMigrator');

export class DatabaseMigrator {
  private pool: pg.Pool;
  private migrationsDir: string;

  constructor(pool: pg.Pool, migrationsDir?: string) {
    this.pool = pool;
    this.migrationsDir = migrationsDir || path.resolve(__dirname, '../migrations');
  }

  public async runMigrations(): Promise<{ applied: string[]; alreadyApplied: string[] }> {
    const client = await this.pool.connect();
    const applied: string[] = [];
    const alreadyApplied: string[] = [];

    try {
      await client.query('BEGIN');

      // Ensure migrations tracking table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version VARCHAR(255) PRIMARY KEY,
          checksum VARCHAR(64) NOT NULL,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      const appliedRes = await client.query('SELECT version FROM schema_migrations ORDER BY version ASC');
      const appliedSet = new Set(appliedRes.rows.map((r) => r.version));

      if (!fs.existsSync(this.migrationsDir)) {
        logger.warn(`Migrations directory does not exist: ${this.migrationsDir}`);
        await client.query('COMMIT');
        return { applied, alreadyApplied };
      }

      const files = fs
        .readdirSync(this.migrationsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();

      for (const file of files) {
        if (appliedSet.has(file)) {
          alreadyApplied.push(file);
          continue;
        }

        const filePath = path.join(this.migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        const checksum = crypto.createHash('sha256').update(sql).digest('hex');

        logger.info(`Applying migration: ${file}`);
        await client.query(sql);

        await client.query(
          'INSERT INTO schema_migrations (version, checksum) VALUES ($1, $2)',
          [file, checksum]
        );

        applied.push(file);
      }

      await client.query('COMMIT');
      logger.info(`Migration run complete: ${applied.length} applied, ${alreadyApplied.length} already up to date.`);
      return { applied, alreadyApplied };
    } catch (err: any) {
      await client.query('ROLLBACK');
      logger.error(`Migration failed on file: ${err.message}`, { error: err.stack });
      throw err;
    } finally {
      client.release();
    }
  }
}

