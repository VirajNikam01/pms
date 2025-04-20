"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function MainLayout({ children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 relative">
      {children}
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
          onClick={() => router.push("/notifications")}
        >
          🔔
        </div>
        <div
          className="text-gray-700 cursor-pointer hover:text-indigo-600"
          onClick={() => router.push("/search")}
        >
          🔍
        </div>
      </footer>
    </div>
  );
}
