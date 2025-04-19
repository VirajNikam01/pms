"use client"

export default function Loader() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0f0f0f] text-white">
        <div className="relative w-12 h-12 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin" />
        </div>
        <h1 className="text-2xl font-semibold tracking-widest animate-fade-in text-gray-200">
          Mega PMS
        </h1>
      </div>
    );
  }
  
  
  