/**
 * This is the configuration for the client-side database.
 */

import { defineConfig } from "drizzle-kit";

const base = "./database/.client";
const migrationsFolder = `${base}/migrations`;

export default defineConfig({
  dialect: "postgresql",
  schema: `${base}/schema.js`,
  out: migrationsFolder,
  verbose: false,
  migrations: { prefix: "timestamp" },
});

export { migrationsFolder };