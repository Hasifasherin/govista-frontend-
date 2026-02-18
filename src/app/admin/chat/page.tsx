"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../AdminLayout";
import { getOperators } from "../../../services/adminChatService";

interface Operator {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  unreadCount?: number;
}

export default function AdminChatPage() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      const data = await getOperators();
      setOperators(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load operators");
    } finally {
      setLoading(false);
    }
  };

  const filteredOperators = operators.filter((op) => {
    const fullName = `${op.firstName} ${op.lastName}`.toLowerCase();
    const text = search.toLowerCase();
    return fullName.includes(text) || op.email.toLowerCase().includes(text);
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Operator Chats</h1>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search operators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div>Loading operators...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : filteredOperators.length === 0 ? (
          <p className="text-gray-500">No operators found</p>
        ) : (
          <div className="grid gap-4">
            {filteredOperators.map((op) => (
              <Link
                key={op._id}
                href={`/admin/chat/${op._id}`}
                className="border p-4 rounded-xl hover:bg-gray-50 flex justify-between items-center transition"
              >
                <div>
                  <p className="font-semibold">
                    {op.firstName} {op.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{op.email}</p>
                </div>
                {op.unreadCount && op.unreadCount > 0 && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {op.unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
