"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { usePGlite } from "@electric-sql/pglite-react";
import Image from "next/image";

// Configuration for avatar base URL
const AVATAR_BASE_URL = "https://ui-avatars.com/api/";
const ALLOWED_AVATAR_DOMAINS = ["ui-avatars.com", "avatars.githubusercontent.com"];
const FALLBACK_AVATAR = "/fallback-avatar.png";

// Reusable Button component
function Button({ children, onClick, disabled, className, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-3 py-1.5 rounded-lg text-sm shadow text-white transition ${
        disabled || loading ? "bg-gray-300 cursor-not-allowed" : className
      }`}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}

export default function UserDirectory() {
  const db = usePGlite();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first: "",
    last: "",
    avatar: "",
    twitter: "",
    notes: "",
    favorite: false,
  });
  const modalRef = useRef(null);

  // Validate avatar URL
  const validateAvatarUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      return ALLOWED_AVATAR_DOMAINS.some((domain) => hostname.includes(domain));
    } catch {
      return false;
    }
  };

  // Generate avatar URL for dummy users
  const generateAvatarUrl = (first, last) => {
    const name = encodeURIComponent(`${first} ${last}`);
    return `${AVATAR_BASE_URL}?name=${name}&size=60&background=random`;
  };

  // Memoized fetchUsers
  const fetchUsers = useCallback(async () => {
    if (!db) return;
    try {
      setError(null);
      const allUsers = await db.select().from(db.schema.contact);
      setData(allUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  }, [db]);

  // Insert a single user
  const insertUser = async () => {
    setSubmitting(true);
    try {
      await db.insert(db.schema.contact).values(formData);
      await fetchUsers();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Insert failed:", err);
      setError("Failed to insert user.");
    } finally {
      setSubmitting(false);
    }
  };

  // Insert bulk users
  const insertBulkUsers = async () => {
    setSubmitting(true);
    try {
      const users = generateDummyUsers(50);
      await db.insert(db.schema.contact).values(users);
      await fetchUsers();
    } catch (err) {
      console.error("Bulk insert failed:", err);
      setError("Failed to insert bulk users.");
    } finally {
      setSubmitting(false);
    }
  };

  // Generate dummy users
  const generateDummyUsers = (count) => {
    const dummyUsers = [];
    for (let i = 0; i < count; i++) {
      const first = `User${i}`;
      const last = `Test${i}`;
      dummyUsers.push({
        first,
        last,
        avatar: generateAvatarUrl(first, last),
        twitter: `@user${i}`,
        notes: `Dummy note for user ${i}.`,
        favorite: i % 10 === 0,
      });
    }
    return dummyUsers;
  };

  // Delete all users
  const deleteAllEntries = async () => {
    if (!confirm("Are you sure you want to delete all users?")) return;
    setSubmitting(true);
    try {
      await db.delete(db.schema.contact);
      setData([]);
    } catch (err) {
      console.error("Error deleting users:", err);
      setError("Failed to delete data.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      first: "",
      last: "",
      avatar: "",
      twitter: "",
      notes: "",
      favorite: false,
    });
  };

  // Convert to CSV
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    const headers = ["id", "first", "last", "avatar", "twitter", "notes", "favorite"];
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((field) => {
            const value = row[field] ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];
    return csvRows.join("\n");
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first || !formData.last || !formData.avatar) {
      setError("First name, last name, and avatar are required.");
      return;
    }
    if (!validateAvatarUrl(formData.avatar)) {
      // Use escaped single quotes or avoid special characters
      setError(
        `Avatar URL must be from allowed domains: ${ALLOWED_AVATAR_DOMAINS.join(", ")}.`
      );
      return;
    }
    setError(null);
    await insertUser();
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        resetForm();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showModal]);

  // Focus modal when opened
  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showModal]);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading || !db) {
    return <LoadingScreen message={db ? "Fetching data..." : "Initializing database..."} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            User Directory <span className="text-blue-500">({data.length})</span>
          </h1>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
              Add User
            </Button>
            <Button
              onClick={deleteAllEntries}
              disabled={submitting}
              className="bg-red-500 hover:bg-red-600"
              loading={submitting}
            >
              Delete All
            </Button>
            <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
              Export CSV
            </Button>
            <Button
              onClick={insertBulkUsers}
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700"
              loading={submitting}
            >
              Add 50 Dummy Users
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
              aria-label="Dismiss error"
            >
              &times;
            </button>
          </div>
        )}

        {data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-base">No user data available.</div>
        )}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 w-full"
            autoComplete="off"
            aria-labelledby="add-user-form"
          >
            <h2 id="add-user-form" className="text-lg font-semibold text-gray-800">
              Add New User
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                required
                className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-500 text-sm"
                placeholder="First name"
                value={formData.first}
                onChange={(e) => setFormData({ ...formData, first: e.target.value })}
                aria-required="true"
              />
              <input
                required
                className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-500 text-sm"
                placeholder="Last name"
                value={formData.last}
                onChange={(e) => setFormData({ ...formData, last: e.target.value })}
                aria-required="true"
              />
            </div>
            <input
              required
              className="w-full p-2.5 border border-gray-/card rounded-md focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-500 text-sm"
              placeholder="Avatar URL (e.g., from ui-avatars.com)"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              aria-required="true"
            />
            <input
              className="w-full p-2.5 border border-gray-300 rounded-md bg-white text-black placeholder-gray-500 text-sm"
              placeholder="Twitter handle (optional)"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            />
            <textarea
              className="w-full p-2.5 border border-gray-300 rounded-md bg-white text-black placeholder-gray-500 text-sm"
              placeholder="Notes (optional)"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.favorite}
                onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
              />
              <span className="text-gray-700 text-sm">Mark as favorite</span>
            </label>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
                loading={submitting}
              >
                Save
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function UserCard({ user }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 space-y-4 border border-gray-100">
      <div className="flex items-center space-x-3">
        <Image
          src={user.avatar}
          alt={`${user.first} ${user.last}`}
          width={60}
          height={60}
          className="w-[60px] h-[60px] rounded-full object-cover border-2 border-blue-500"
          onError={(e) => (e.currentTarget.src = "/fallback-avatar.png")}
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {user.first} {user.last}
          </h2>
          {user.twitter && (
            <p className="text-xs text-blue-500">
              <a
                href={`https://twitter.com/${user.twitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.twitter}
              </a>
            </p>
          )}
        </div>
      </div>
      {user.notes && <p className="text-gray-700 text-sm">{user.notes}</p>}
      {user.favorite && (
        <div className="flex items-center text-yellow-500 text-xs font-medium space-x-1">
          <span>★</span>
          <span>Favorite Contact</span>
        </div>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-5 w-full max-w-[95%] sm:max-w-md shadow-xl relative"
        tabIndex={-1}
        ref={modalRef}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-3">
      <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-base text-gray-600 font-medium">{message}</p>
    </div>
  );
}