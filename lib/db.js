import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { applyMigrations } from './applyMigrations.js';
import * as schema from './schema.js';

const db = new PGlite({ wasmUrl: '/wasm/pglite.wasm' });
await db.waitForReady();
await applyMigrations(db);
export const drizzleDb = drizzle(db, { schema });
