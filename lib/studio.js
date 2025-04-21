"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import useDb from "@/database/.client/db";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, AlertCircle, ArrowUpDown } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const DbInspector = () => {
  const { db } = useDb();
  const router = useRouter();
  const [data, setData] = useState({});
  const [selectedTable, setSelectedTable] = useState("");
  const [loading, setLoading] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState(null);
  const correctPasscode = process.env.NEXT_PUBLIC_DB_PASSCODE || "123456";

  const fetchTables = useCallback(async () => {
    if (!db || !db.schema) return;
    setLoading(true);
    const result = {};

    try {
      for (const [tableName, table] of Object.entries(db.schema)) {
        try {
          const rows = await db.select().from(table);
          result[tableName] = rows;
        } catch (err) {
          console.error(`Failed to fetch ${tableName}`, err);
          result[tableName] = [{ error: "Fetch failed" }];
        }
      }
      setData(result);
      if (Object.keys(result).length > 0) {
        setSelectedTable(Object.keys(result)[0]);
      }
    } catch (err) {
      setError("Failed to load database tables.");
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    if (authorized && db && db.schema) {
      fetchTables();
    }
  }, [authorized, db, fetchTables]);

  const handleLogin = () => {
    if (passcode === correctPasscode) {
      setAuthorized(true);
    } else {
      setError("Incorrect passcode. Please try again or return to dashboard.");
    }
  };

  const handleRedirect = () => {
    router.push("/dashboard");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setError("Copied to clipboard!");
    setTimeout(() => setError(null), 2000);
  };

  const rows = data[selectedTable] || [];

  const columns = useMemo(() => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]).map((key) => ({
      accessorKey: key,
      header: () => <span className="capitalize">{key}</span>,
      cell: ({ getValue }) => {
        const value = getValue();
        const displayValue = typeof value === "object" ? JSON.stringify(value) : String(value);
        return (
          <div className="flex items-center gap-2">
            <span className="truncate max-w-[200px]">{displayValue}</span>
            <button
              onClick={() => handleCopy(displayValue)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Copy cell content"
            >
              <Copy className="h-4 w-4 text-gray-400 hover:text-indigo-400" />
            </button>
          </div>
        );
      },
    }));
  }, [rows]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const toastVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  if (!authorized) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-900 min-h-screen flex items-center justify-center p-4"
      >
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-bold text-indigo-400 mb-6 text-center">
            Database Inspector 🔒
          </h2>
          <input
            type="password"
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 text-sm md:text-base"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            aria-label="Passcode input"
          />
          <button
            onClick={handleLogin}
            className="w-full px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
            aria-label="Submit passcode"
          >
            Submit
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-4 left-4 right-4 md:max-w-sm bg-red-600 text-white p-4 rounded-lg shadow-lg z-50"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5" />
                <p className="text-xs md:text-sm">{error}</p>
              </div>
              {error.includes("Incorrect passcode") && (
                <button
                  onClick={handleRedirect}
                  className="mt-3 w-full px-3 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors text-xs md:text-sm"
                  aria-label="Go to dashboard"
                >
                  Go to Dashboard
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (!db || !db.schema) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="animate-spin h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm md:text-base">Loading database...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-900 min-h-screen p-4 pb-20"
    >
      <div className="max-w-7xl mx-auto space-y-4">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-indigo-400">
          🧪 Drizzle DB Inspector
        </h1>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-300 text-sm md:text-base" htmlFor="table-select">
            Select Table:
          </label>
          <select
            id="table-select"
            className="border border-gray-700 bg-gray-800 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm md:text-base"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            aria-label="Select database table"
          >
            {Object.keys(data).map((tableName) => (
              <option key={tableName} value={tableName}>
                {tableName}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl p-4">
          <h2 className="text-lg md:text-xl font-semibold text-indigo-400 mb-4 capitalize">
            {selectedTable}
          </h2>

          {loading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="animate-spin h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm md:text-base">Loading data...</span>
            </div>
          ) : rows.length === 0 ? (
            <p className="text-gray-500 text-sm md:text-base">No data in this table</p>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto max-h-[600px] rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-200">
                  <thead className="sticky top-0 bg-gray-700 border-b border-gray-600">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-3 font-semibold text-gray-300 border-r last:border-r-0"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div className="flex items-center gap-2">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              <ArrowUpDown
                                className={`h-4 w-4 ${
                                  header.column.getIsSorted()
                                    ? header.column.getIsSorted() === "asc"
                                      ? "text-indigo-400"
                                      : "text-indigo-400 rotate-180"
                                    : "text-gray-400"
                                }`}
                              />
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-gray-600 hover:bg-gray-700 transition-colors group"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-3 whitespace-nowrap border-r last:border-r-0 relative"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4">
                {table.getRowModel().rows.map((row) => (
                  <div
                    key={row.id}
                    className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <div
                        key={cell.id}
                        className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-600"
                      >
                        <span className="font-semibold text-gray-300 text-xs truncate max-w-[120px]">
                          {cell.column.columnDef.accessorKey}
                        </span>
                        <div className="flex items-center gap-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-2 bg-gray-700 rounded-lg text-gray-200 disabled:opacity-50 text-sm"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-2 bg-gray-700 rounded-lg text-gray-200 disabled:opacity-50 text-sm"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
                <span className="text-gray-400 text-sm">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="border border-gray-700 bg-gray-800 rounded-lg px-2 py-1 text-gray-200 text-sm"
                  aria-label="Rows per page"
                >
                  {[10, 20, 30].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize} rows
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DbInspector;