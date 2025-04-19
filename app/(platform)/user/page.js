"use client";

import { useEffect, useState } from "react";
import { usePGlite } from "@electric-sql/pglite-react";

export default function Page() {
  const [data, setData] = useState(null);
  const db = usePGlite();

  useEffect(() => {
    if (!db) return;

    const load = async () => {
      const [user] = await db
        .insert(db.schema.contact)
        .values({
          first: "John",
          last: "Doe",
          avatar: "https://example.com/avatar/johndoe.jpg",
          twitter: "@johndoe",
          notes: "Met at the developer conference. Works at OpenAI.",
          favorite: true,
        })
        .returning();

      setData(user);
    };

    load();
  }, [db]);

  if (!db) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        User Details
      </h1>

      {data ? (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={data.avatar}
              alt={`${data.first} ${data.last}`}
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {data.first} {data.last}
              </h2>
              <p className="text-sm text-gray-500">{data.twitter}</p>
            </div>
          </div>
          <p className="text-gray-700">{data.notes}</p>
          <p className="text-sm text-blue-600">
            {data.favorite ? "★ Favorite Contact" : ""}
          </p>
        </div>
      ) : (
        <div className="text-center text-gray-500">No user data available.</div>
      )}
    </div>
  );
}
