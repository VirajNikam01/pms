"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { clearAllBrowserStorage } from "@/utils/browser-storage";
import useDb from "@/database/.client/db";
import { motion, AnimatePresence } from "framer-motion";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { db, loading: dbLoading, error: dbError } = useDb();
  const router = useRouter();

  const clearWebStorage = async () => {
    setLoading(true);
    try {
      await clearAllBrowserStorage();
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to clear storage or reinitialize database.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShowConfirmation = () => setShowConfirmation(true);
  const handleConfirmClearStorage = () => {
    setShowConfirmation(false);
    clearWebStorage();
  };
  const handleCancelClearStorage = () => setShowConfirmation(false);
  const handleCloseSuccess = () => setShowSuccess(false);
  const handleCloseError = () => setShowError(false);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Settings
        </h2>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-600 mb-3">
              Web Storage
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Clear your browser's storage for a fresh start. This will remove all saved data.
            </p>
            <button
              onClick={handleShowConfirmation}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 flex items-center justify-center"
              disabled={loading || dbLoading}
              aria-label="Clear web storage"
            >
              {loading || dbLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
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
                  Processing...
                </>
              ) : (
                "Clear Web Storage"
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-lg p-6 max-w-sm w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirmation-title"
            >
              <h3
                id="confirmation-title"
                className="text-xl font-semibold text-gray-800 mb-4"
              >
                Are you sure?
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                This will clear all browser storage and reinitialize the database. This cannot be undone.
              </p>
              <div className="flex justify-between gap-4">
                <button
                  onClick={handleCancelClearStorage}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-300"
                  aria-label="Cancel clear storage"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClearStorage}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
                  aria-label="Confirm clear storage"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg max-w-sm w-full z-50"
            role="alert"
            aria-live="polite"
          >
            <h3 className="text-lg font-semibold mb-2">Success!</h3>
            <p className="text-sm">
              Storage cleared and database reinitialized.
            </p>
            <button
              onClick={handleCloseSuccess}
              className="mt-3 w-full px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition duration-300"
              aria-label="Close success message"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-sm w-full z-50"
            role="alert"
            aria-live="assertive"
          >
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-sm">{errorMessage}</p>
            <button
              onClick={handleCloseError}
              className="mt-3 w-full px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-700 transition duration-300"
              aria-label="Close error message"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;