import fs from "node:fs/promises";

import { readMigrationFiles } from "drizzle-orm/migrator";

import { migrationsFolder } from "../../drizzle.client.config.js";

const file = "database/.client/migrations/export.json";

await fs.writeFile(
  `${file}`,
  JSON.stringify(
    readMigrationFiles({
      migrationsFolder,
    }),
    null,
    0
  ),
  {
    flag: "w",
  }
);
