"use client";

import React, { useState } from "react";
// import MainLayout from "@/components/MainLayout";

export default function Home() {
  const [activeTab, setActiveTab] = useState("myTasks");

  return (
    <div>
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div className="text-gray-800 font-semibold text-lg sm:text-xl">
          Home
        </div>
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {["myTasks", "inProgress", "completed"].map((tab) => (
            <button
              key={tab}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-sm sm:text-base whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white shadow-md text-gray-800"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "myTasks"
                ? "My Tasks"
                : tab === "inProgress"
                ? "In-progress"
                : "Completed"}
            </button>
          ))}
        </div>
        <div className="text-gray-800 font-semibold text-lg sm:text-xl">👤</div>
      </header>

      <main className="w-full max-w-6xl bg-white rounded-lg shadow-md p-6 flex-grow">
        <h1 className="text-4xl font-bold text-indigo-900 mb-4">
          Hello Viraj!
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
            {[1, 2].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <div className="mr-4 text-gray-700">📋</div>
                <div>
                  <p className="font-medium text-gray-800">Design Changes</p>
                  <p className="text-gray-600 text-sm">2 Days ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
