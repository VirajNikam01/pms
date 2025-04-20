import { useState, useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";
import { PgDialect } from "drizzle-orm/pg-core/dialect";
import { drizzle } from "drizzle-orm/pglite";
import migrations from "./migrations/export.json";
import * as schema from "./schema";

const useDb = () => {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDb = async () => {
      const isDev = process.env.NODE_ENV === "development";
      const dbName = isDev ? "remix-contacts-dev" : "remix-contacts";
      const MIGRATION_KEY = `db-migrated-${dbName}`;

      try {
        // Create the new local db if not already created
        const client = await PGlite.create({
          dataDir: `idb://${dbName}`,
        });

        const _db = drizzle(client, {
          schema,
          logger: isDev,
        });

        // Only run migration if not already done
        const hasMigrated = localStorage.getItem(MIGRATION_KEY);
        if (!hasMigrated) {
          const start = performance.now();
          const migrationDialect = new PgDialect();
          await migrationDialect.migrate(migrations, _db._.session, dbName);
          localStorage.setItem(MIGRATION_KEY, "true");
          console.info(
            `✅ Local database ready in ${performance.now() - start}ms`
          );
        }

        // After migration, set db
        setDb(Object.assign(_db, { schema }));
        setLoading(false);
      } catch (err) {
        console.error("❌ Local database schema migration failed", err);
        setError(err);
        setLoading(false);
      }
    };

    initializeDb();
  }, []);

  return { db, loading, error };
};

export default useDb;
