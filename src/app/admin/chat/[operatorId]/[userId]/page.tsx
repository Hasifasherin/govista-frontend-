"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "../../../AdminLayout";
import { getOperatorConversations, getOperatorUserMessages } from "../../../../../services/adminChatService";
import MessageBubble from "../../../../components/chat/MessageBubble";
import { Message as ChatMessage } from "../../../../../types/chat";

interface UserConversation {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  lastMessage: string;
}

export default function AdminOperatorUserChat() {
  // Safe extraction from useParams
  const params = useParams();
  const operatorId = Array.isArray(params.operatorId) ? params.operatorId[0] : params.operatorId;
  const initialUserId = Array.isArray(params.userId) ? params.userId[0] : params.userId;

  const [users, setUsers] = useState<UserConversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(initialUserId || "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Fetch users chatting with this operator
  const fetchUsers = async () => {
    if (!operatorId) return;
    try {
      setLoadingUsers(true);
      const data = await getOperatorConversations(operatorId);
      setUsers(data || []);
      if (!selectedUserId && data?.length) setSelectedUserId(data[0].userId);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch messages between operator & selected user
  const fetchMessages = async (uid: string) => {
    if (!operatorId || !uid) return;
    try {
      setLoadingMessages(true);
      const backendMessages = await getOperatorUserMessages(operatorId, uid);

      // Map backend messages to ChatMessage type
      const formatted: ChatMessage[] = backendMessages.map((msg) => {
        const senderType: "operator" | "customer" =
          msg.sender === operatorId ? "operator" : "customer";

        return {
          id: msg._id,
          sender: senderType,
          text: msg.message,
          time: msg.createdAt,
          read: msg.read ?? false,
          isMe: senderType === "operator", // Operator messages on right
        };
      });

      setMessages(formatted);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [operatorId]);

  useEffect(() => {
    if (selectedUserId) fetchMessages(selectedUserId);
  }, [selectedUserId]);

  return (
    <AdminLayout>
      <div className="h-[85vh] flex bg-white rounded-xl shadow overflow-hidden">

        {/* LEFT: Users list */}
        <div className="w-80 border-r flex flex-col bg-white">
          <div className="p-4 border-b bg-gray-100">
            <h2 className="font-semibold text-lg">Users</h2>
            <p className="text-xs text-gray-500">Operator: {operatorId}</p>
          </div>

          {loadingUsers ? (
            <p className="p-4 text-sm text-gray-500">Loading users...</p>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => setSelectedUserId(user.userId)}
                  className={`cursor-pointer p-4 border-b hover:bg-gray-50 transition ${
                    selectedUserId === user.userId ? "bg-gray-100" : ""
                  }`}
                >
                  <p className="font-medium text-sm truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.lastMessage || "No messages yet"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Chat messages */}
        <div className="flex-1 flex flex-col justify-start bg-gray-50 p-4 space-y-2 overflow-y-auto">
          {loadingMessages ? (
            <p className="text-sm text-gray-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                id={msg.id}
                sender={msg.sender as "operator" | "customer"}
                text={msg.text}
                time={msg.time}
                isMe={msg.isMe}
                read={msg.read}
              />
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
