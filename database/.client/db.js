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

      try {
        // Create the new local db if not already created
        const client = await PGlite.create({
          dataDir: `idb://${dbName}`,
        });

        const _db = drizzle(client, {
          schema,
          logger: isDev,
        });

        // prevent multiple schema migrations to be run
        let isLocalDBSchemaSynced = false;

        if (!isLocalDBSchemaSynced) {
          const start = performance.now();
          const migrationDialect = new PgDialect();

          // Ensure the session is created and passed correctly
          await migrationDialect.migrate(migrations, _db._.session, dbName);

          // Set flag once migrations are successful
          isLocalDBSchemaSynced = true;

          console.info(
            `✅ Local database ready in ${performance.now() - start}ms`
          );
        }

        // After migration, set db
        setDb(Object.assign(_db, { schema }));
        setLoading(false); // Set loading to false after db is set
      } catch (err) {
        console.error("❌ Local database schema migration failed", err);
        setError(err); // Set error state
        setLoading(false); // Set loading to false in case of error
      }
    };

    initializeDb();
  }, []); // Empty dependency array ensures this runs only once on mount

  return { db, loading, error };
};

export default useDb;
