import { useState, useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";
import { PgDialect } from "drizzle-orm/pg-core/dialect";
import { drizzle } from "drizzle-orm/pglite";
import migrations from "./migrations/export.json";
import * as schema from "./schema";
import { clearAllBrowserStorage } from "@/utils/browser-storage";

const useDb = () => {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDb = async () => {
      // await clearAllBrowserStorage();
      const isDev = process.env.NODE_ENV === "development";
      const dbName = isDev ? "Mega-PMS-dev" : "Mega-PMS";
      const MIGRATION_KEY = `db-migrated-${dbName}`;

      try {
        const client = await PGlite.create({
          dataDir: `idb://${dbName}`,
        });

        const _db = drizzle(client, {
          schema,
          logger: isDev,
        });

        const hasMigrated = localStorage.getItem(MIGRATION_KEY);

        // Only run migration if needed
        if (!hasMigrated) {
          const start = performance.now();
          const migrationDialect = new PgDialect();
          await migrationDialect.migrate(migrations, _db._.session, dbName);
          localStorage.setItem(MIGRATION_KEY, "true");
          console.info(`✅ Migration done in ${performance.now() - start}ms`);
        }

        // Only set DB after migration is guaranteed
        setDb(Object.assign(_db, { schema }));
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to initialize DB", err);
        setError(err);
        setLoading(false);
      }
    };

    initializeDb();
  }, []);

  return { db, loading, error };
};

export default useDb;
