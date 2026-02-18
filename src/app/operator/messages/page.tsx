"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch, FiMessageSquare, FiSend } from "react-icons/fi";
import { useOperatorChat } from "../../../hooks/useOperatorChat";
import { Conversation, Message } from "../../../types/chat";
import { useSearchParams } from "next/navigation";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const userIdFromQuery = searchParams.get("user"); // Get ?user=xxx
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    messages,
    fetchMessages,
    sendMessage,
    loadingConversations,
    loadingMessages,
    fetchConversations,
    setConversations,
  } = useOperatorChat(userIdFromQuery || ""); // pass operatorId if needed in hook

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch all conversations initially
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle query param to auto-select conversation once
  useEffect(() => {
    if (selectedChat) return; // already selected, do nothing

    if (userIdFromQuery) {
      const existingConv = conversations.find(c => c.userId === userIdFromQuery);

      if (existingConv) setSelectedChat(existingConv.userId);
      else {
        // temporary conversation
        const tempConv: Conversation = {
          userId: userIdFromQuery,
          firstName: "Customer",
          lastName: "",
          lastMessage: "",
          lastMessageTime: "",
          unreadCount: 0,
        };
        setConversations(prev => [tempConv, ...prev]);
        setSelectedChat(userIdFromQuery);
      }
    } else if (conversations.length > 0) {
      setSelectedChat(conversations[0].userId);
    }
  }, [userIdFromQuery, conversations, selectedChat, setConversations]);

  // Fetch messages only when selectedChat changes
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat, fetchMessages]);

  // Send message handler
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    sendMessage(selectedChat, newMessage.trim());
    setNewMessage("");
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const getSelectedUser = () => conversations.find(c => c.userId === selectedChat);

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col md:flex-row gap-6">
      {/* SIDEBAR */}
      <div className="md:w-1/3 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <p className="text-gray-600 mt-1">Communicate with your customers</p>
        </div>

        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>

        <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200">
          {loadingConversations ? (
            <p className="p-4 text-center text-gray-500">Loading...</p>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiMessageSquare className="text-gray-400 mx-auto mb-3" size={32} />
              <p>No conversations found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map(conv => (
                <div
                  key={conv.userId}
                  onClick={() => setSelectedChat(conv.userId)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedChat === conv.userId ? "bg-green-50 border-l-4 border-l-green-500" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {conv.firstName?.[0] || ''}{conv.lastName?.[0] || ''}
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {conv.firstName} {conv.lastName}
                        </h4>
                        <span className="text-xs text-gray-500">{formatTime(conv.lastMessageTime)}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CHAT PANEL */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {selectedChat ? (
          <>
            {/* HEADER */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getSelectedUser()?.firstName?.[0] || ''}{getSelectedUser()?.lastName?.[0] || ''}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{getSelectedUser()?.firstName} {getSelectedUser()?.lastName}</h3>
                <p className="text-sm text-green-600 font-medium">Online now</p>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
              {loadingMessages ? (
                <p className="text-center text-gray-500">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
              ) : (
                messages.map((msg: Message) => (
                  <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[70%]">
                      <div className={`rounded-2xl px-4 py-3 ${msg.isMe ? "bg-green-600 text-white rounded-br-none" : "bg-white border border-gray-200 rounded-bl-none"}`}>
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-2 ${msg.isMe ? "text-green-100" : "text-gray-500"}`}>
                          {formatTime(msg.time)}
                          {msg.isMe && msg.read && <span className="ml-2">✓✓</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* INPUT */}
            <div className="border-t border-gray-200 p-4 bg-white flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              >
                <FiSend size={18} /> Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <FiMessageSquare className="text-green-600 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Choose a conversation from the list to start messaging with your customers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
