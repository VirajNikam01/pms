"use client";

import { useEffect, useState } from "react";
import { usePGlite } from "@electric-sql/pglite-react";
import Image from "next/image";

export default function Page() {
  const db = usePGlite();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const fetchUsers = async () => {
    if (!db) return;
    try {
      const allUsers = await db.select().from(db.schema.contact);
      setData(allUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

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

  const insertBulkUsers = async () => {
    setSubmitting(true);
    try {
      const users = generateDummyUsers(500);
      await db.insert(db.schema.contact).values(users);
      await fetchUsers();
    } catch (err) {
      console.error("Bulk insert failed:", err);
      setError("Failed to insert bulk users.");
    } finally {
      setSubmitting(false);
    }
  };

  const generateDummyUsers = (count = 100) => {
    const dummyUsers = [];
    for (let i = 0; i < count; i++) {
      dummyUsers.push({
        first: `Viraj`,
        last: `Nikam`,
        avatar: `https://avatars.githubusercontent.com/u/140100146?v=4`,
        twitter: `@virajnikam${i}`,
        notes: `This is a dummy note for Viraj Nikam ${i}.`,
        favorite: i % 10 === 0,
      });
    }
    return dummyUsers;
  };

  const deleteAllEntries = async () => {
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

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((field) => `"${String(row[field] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];
    return csvRows.join("\n");
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first || !formData.last || !formData.avatar) {
      setError("First name, last name, and avatar are required.");
      return;
    }
    await insertUser();
  };

  useEffect(() => {
    if (!db) return;
    fetchUsers();
  }, [db]);

  if (loading || !db) return <LoadingScreen message="Fetching data..." />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            User Directory{" "}
            <span className="text-blue-500">({data.length})</span>
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm shadow transition"
            >
              Add User
            </button>
            <button
              onClick={deleteAllEntries}
              disabled={submitting}
              className={`px-3 py-1.5 rounded-lg text-sm shadow text-white ${
                submitting
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {submitting ? "Deleting..." : "Delete All"}
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm shadow transition"
            >
              Export CSV
            </button>
            <button
              onClick={insertBulkUsers}
              disabled={submitting}
              className={`px-3 py-1.5 rounded-lg text-sm shadow text-white ${
                submitting
                  ? "bg-purple-300 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {submitting ? "Inserting..." : "Add 500 Dummy Users"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-base">
            No user data available.
          </div>
        )}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 w-full"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                required
                className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-500 text-sm"
                placeholder="First name"
                value={formData.first}
                onChange={(e) =>
                  setFormData({ ...formData, first: e.target.value })
                }
              />
              <input
                required
                className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-500 text-sm"
                placeholder="Last name"
                value={formData.last}
                onChange={(e) =>
                  setFormData({ ...formData, last: e.target.value })
                }
              />
            </div>
            <input
              required
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-500 text-sm"
              placeholder="Avatar URL"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
            />
            <input
              className="w-full p-2.5 border border-gray-300 rounded-md bg-white text-black placeholder-gray-500 text-sm"
              placeholder="Twitter handle"
              value={formData.twitter}
              onChange={(e) =>
                setFormData({ ...formData, twitter: e.target.value })
              }
            />
            <textarea
              className="w-full p-2.5 border border-gray-300 rounded-md bg-white text-black placeholder-gray-500 text-sm"
              placeholder="Notes"
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.favorite}
                onChange={(e) =>
                  setFormData({ ...formData, favorite: e.target.checked })
                }
              />
              <span className="text-gray-700 text-sm">Mark as favorite</span>
            </label>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                className="px-3 py-1.5 bg-gray-200 rounded text-gray-700 text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-3 py-1.5 rounded text-white text-sm ${
                  submitting
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
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
        />

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {user.first} {user.last}
          </h2>
          <p className="text-xs text-blue-500">{user.twitter}</p>
        </div>
      </div>
      <p className="text-gray-700 text-sm">{user.notes}</p>
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
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-5 w-full max-w-[95%] sm:max-w-md shadow-xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-3">
      <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-base text-gray-600 font-medium">{message}</p>
    </div>
  );
}
