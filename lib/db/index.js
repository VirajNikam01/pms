// lib/db/index.js
"use client";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../schema";

let dbInstance = null;

export function getDb() {
  if (!dbInstance) {
    const client = new PGlite("idb://my-app-db");
    dbInstance = drizzle({ client, schema });
  }
  return dbInstance;
}
