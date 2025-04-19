// lib/db/migrate.js
"use client";

import { migrate } from "drizzle-orm/pglite/migrator";
import { getDb } from "./index";

export async function runMigrations() {
  const db = getDb();
  try {
    const client = db.client;
    const migrationCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = '__drizzle_migrations'
      ) as table_exists;
    `);
    const migrationsTableExists = migrationCheck.rows[0].table_exists;

    if (!migrationsTableExists) {
      console.log("Applying migrations...");
      await migrate(db, { migrationsFolder: "/drizzle" });
      console.log("Migrations applied successfully!");
    } else {
      console.log("Migrations already applied, skipping...");
    }
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
