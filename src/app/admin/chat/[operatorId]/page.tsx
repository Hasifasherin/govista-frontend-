"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "../../AdminLayout";
import { getOperatorConversations } from "../../../../services/adminChatService";

interface UserConversation {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  lastMessage: string;
}

export default function OperatorConversationsPage() {
  const params = useParams();
  const operatorId = Array.isArray(params.operatorId) ? params.operatorId[0] : params.operatorId;

  const [users, setUsers] = useState<UserConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (operatorId) fetchUsers();
  }, [operatorId]);

  const fetchUsers = async () => {
    try {
      const data = await getOperatorConversations(operatorId!);
      setUsers(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const text = search.toLowerCase();
    return (
      fullName.includes(text) ||
      user.email.toLowerCase().includes(text) ||
      user.lastMessage?.toLowerCase().includes(text)
    );
  });

  return (
    <AdminLayout>
      <div className="h-[85vh] flex bg-white rounded-xl shadow overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 border-r flex flex-col bg-white">
          <div className="p-4 border-b bg-gray-100">
            <h1 className="font-semibold text-lg">Operator Chats</h1>
            <p className="text-xs text-gray-500">Operator ID: {operatorId}</p>
          </div>

          <div className="p-3 border-b">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-sm text-gray-500">Loading...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No conversations found</p>
            ) : (
              filteredUsers.map((user) => (
                <Link
                  key={user.userId}
                  href={`/admin/chat/${operatorId}/${user.userId}`}
                  className="flex items-center gap-3 p-4 border-b hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                    {user.firstName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right placeholder */}
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-400 text-sm">
            Select a conversation to view messages
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
