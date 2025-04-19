"use client";
import useDb from "@/database/.client/db";
import { PGliteProvider } from "@electric-sql/pglite-react";
import React from "react";

export default function Layout({ children }) {
  const { db, loading } = useDb();

  if (!db) return <h>Loading...</h>;
  return (
    <div>
      <main>
        <PGliteProvider db={db}>{children}</PGliteProvider>
      </main>
    </div>
  );
}
