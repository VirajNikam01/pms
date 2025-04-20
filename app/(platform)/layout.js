"use client";
import useDb from "@/database/.client/db.js";
import { PGliteProvider } from "@electric-sql/pglite-react";
import React from "react";
import Loader from "../components/Loader";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const { db, loading } = useDb();

  const router = useRouter();

  if (!db) return <Loader />;
  return (
    <div>
      <main>
        <PGliteProvider db={db}>{children}</PGliteProvider>
      </main>

      <footer className="w-full max-w-6xl fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white p-4 flex justify-around items-center shadow-md z-10">
        <div
          className="text-gray-700 cursor-pointer hover:text-indigo-600"
          onClick={() => router.push("/dashboard")}
        >
          🏠
        </div>
        <div
          className="text-gray-700 cursor-pointer hover:text-indigo-600"
          onClick={() => router.push("/dashboard/user")}
        >
          📅
        </div>
        <div
          className="text-gray-700 cursor-pointer hover:text-indigo-600"
          onClick={() => router.push("/studio")}
        >
          🔔
        </div>
        <div
          className="text-gray-700 cursor-pointer hover:text-indigo-600"
          onClick={() => router.push("/settings")}
        >
          🔍
        </div>
      </footer>
    </div>
  );
}
