"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [activeTab, setActiveTab] = useState("myTasks");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 relative">
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div className="text-gray-800 font-semibold text-lg sm:text-xl">Home</div>
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          <button
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-sm sm:text-base whitespace-nowrap ${
              activeTab === "myTasks" ? "bg-white shadow-md text-gray-800" : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveTab("myTasks")}
          >
            My Tasks
          </button>
          <button
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-sm sm:text-base whitespace-nowrap ${
              activeTab === "inProgress" ? "bg-white shadow-md text-gray-800" : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveTab("inProgress")}
          >
            In-progress
          </button>
          <button
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-sm sm:text-base whitespace-nowrap ${
              activeTab === "completed" ? "bg-white shadow-md text-gray-800" : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>
        <div className="text-gray-800 font-semibold text-lg sm:text-xl">👤</div>
      </header>

      <main className="w-full max-w-6xl bg-white rounded-lg shadow-md p-6 flex-grow">
        <h1 className="text-4xl font-bold text-indigo-900 mb-4">
          Hello Rohan!
        </h1>
        <p className="text-gray-700 mb-6">Have a nice day.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-indigo-700 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Project 1</h2>
            <p className="text-lg">Front-End Development</p>
            <p className="text-sm text-indigo-100 mt-2">October 20, 2020</p>
          </div>
          <div className="bg-indigo-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Project 2</h2>
            <p className="text-lg">Back-End Development</p>
            <p className="text-sm text-indigo-100 mt-2">October 24, 2020</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">
            Progress
          </h2>
          <div className="space-y-4">
            <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="mr-4 text-gray-700">📋</div>
              <div>
                <p className="font-medium text-gray-800">Design Changes</p>
                <p className="text-gray-600 text-sm">2 Days ago</p>
              </div>
            </div>
            <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="mr-4 text-gray-700">📋</div>
              <div>
                <p className="font-medium text-gray-800">Design Changes</p>
                <p className="text-gray-600 text-sm">2 Days ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-6xl fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white p-4 flex justify-around items-center shadow-md z-10">
        <div
          className="text-gray-700 cursor-pointer hover:text-indigo-600"
          onClick={() => router.push("/home")}
        >
          🏠
        </div>
        <div
          className="text-gray-700 cursor-pointer hover:text-indigo-600"
          onClick={() => router.push("/calendar")}
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