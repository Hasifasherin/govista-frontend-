"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getOperatorConversations,
  getOperatorUserMessages,
  sendOperatorMessage,
  editOperatorMessage,
  deleteOperatorMessage,
} from "../../../services/operatorChatService";
import { getSocket } from "../../../lib/socket";
import type { Socket } from "socket.io-client";
import type {
  Conversation,
  BackendMessage,
  Message,
  SendMessagePayload,
} from "../../../types/chat";

export default function UserChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const operatorIdFromUrl = searchParams.get("operatorId");

  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeRoomRef = useRef<string | null>(null);

  // Get userId
  useEffect(() => {
    const id = localStorage.getItem("userId") || "testUser123";
    setUserId(id);
  }, []);

  // Connect socket
  useEffect(() => {
    if (!userId) return;
    const socket = getSocket();
    if (!socket) return;

    socketRef.current = socket;
    socket.connect();
    socket.emit("registerUser", { userId });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // Load conversations & auto-select operator
  useEffect(() => {
    if (!userId) return;

    const init = async () => {
      try {
        const convs: Conversation[] = await getOperatorConversations();
        setConversations(convs);

        if (operatorIdFromUrl) {
          const existing = convs.find(c => c.userId === operatorIdFromUrl);
          if (existing) handleSelectConversation(existing);
          else {
            const tempConv: Conversation = {
              userId: operatorIdFromUrl,
              firstName: "Operator",
              lastName: "",
              lastMessage: "",
              lastMessageTime: "",
              unreadCount: 0,
            };
            setConversations(prev => [tempConv, ...prev]);
            handleSelectConversation(tempConv);
          }
        } else if (convs.length > 0) {
          handleSelectConversation(convs[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [userId, operatorIdFromUrl]);

  // Load messages for a conversation
  const loadMessages = async (operatorId: string) => {
    if (!userId) return;

    try {
      const data: BackendMessage[] = await getOperatorUserMessages(operatorId);

      const normalized: Message[] = data.map(msg => ({
        id: msg._id,
        sender: msg.sender === userId ? "user" : "operator",
        text: msg.message,
        time: msg.createdAt,
        isMe: msg.sender === userId,
        isDeleted: msg.isDeleted || false,
      }));

      setMessages(normalized);
      scrollToBottom();

      setConversations(prev =>
        prev.map(c => (c.userId === operatorId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Select conversation
  const handleSelectConversation = (conv: Conversation) => {
    if (!userId || !socketRef.current) return;

    setSelectedOperator(conv);
    loadMessages(conv.userId);

    if (activeRoomRef.current) {
      socketRef.current.emit("leaveUserChat", { userId, operatorId: activeRoomRef.current });
    }

    socketRef.current.emit("joinUserChat", { userId, operatorId: conv.userId });
    activeRoomRef.current = conv.userId;

    router.push(`/user/chat?operatorId=${conv.userId}`);
  };

  // Socket listeners
  useEffect(() => {
    if (!userId || !socketRef.current) return;
    const socket = socketRef.current;

    const handleNewMessage = (msg: BackendMessage) => {
      const isMe = msg.sender === userId;
      const operatorFromMsg = isMe ? msg.receiver : msg.sender;
      const isCurrentChat = activeRoomRef.current === operatorFromMsg;

      const normalized: Message = {
        id: msg._id,
        sender: isMe ? "user" : "operator",
        text: msg.message,
        time: msg.createdAt,
        isMe,
        isDeleted: msg.isDeleted || false,
      };

      if (isCurrentChat) {
        setMessages(prev => (prev.some(m => m.id === normalized.id) ? prev : [...prev, normalized]));
        scrollToBottom();
      }

      setConversations(prev =>
        prev.map(c =>
          c.userId === operatorFromMsg
            ? {
                ...c,
                lastMessage: msg.message,
                lastMessageTime: msg.createdAt,
                unreadCount: isCurrentChat ? 0 : (c.unreadCount || 0) + 1,
              }
            : c
        )
      );
    };

    const handleEdited = (msg: BackendMessage) => {
      setMessages(prev => prev.map(m => (m.id === msg._id ? { ...m, text: msg.message } : m)));
    };

    const handleDeleted = (msgId: string) => {
      setMessages(prev => prev.map(m => (m.id === msgId ? { ...m, isDeleted: true } : m)));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageEdited", handleEdited);
    socket.on("messageDeleted", handleDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageEdited", handleEdited);
      socket.off("messageDeleted", handleDeleted);
    };
  }, [userId]);

  // Send message
  const handleSend = async () => {
    if (!text.trim() || !selectedOperator || !userId) return;

    if (editingMsgId) {
      try {
        const updated = await editOperatorMessage(editingMsgId, text);
        setMessages(prev =>
          prev.map(m => (m.id === editingMsgId ? { ...m, text: updated.message } : m))
        );
        setEditingMsgId(null);
        setText("");
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimistic: Message = {
      id: tempId,
      sender: "user",
      text,
      time: new Date().toISOString(),
      isMe: true,
    };

    setMessages(prev => [...prev, optimistic]);
    scrollToBottom();
    setText("");

    try {
      const saved = await sendOperatorMessage({
        userId: selectedOperator.userId,
        message: optimistic.text,
      });

      const savedNormalized: Message = {
        id: saved._id,
        sender: saved.sender === userId ? "user" : "operator",
        text: saved.message,
        time: saved.createdAt,
        isMe: saved.sender === userId,
        isDeleted:false,
        read: saved.read,
      };

      setMessages(prev => prev.map(m => (m.id === tempId ? savedNormalized : m)));
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const handleDelete = async (msgId: string) => {
    setMessages(prev => prev.map(m => (m.id === msgId ? { ...m, isDeleted: true } : m)));
    try {
      await deleteOperatorMessage(msgId);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (loading) return <div className="p-6 text-gray-500 pt-20">Loading conversations...</div>;

  return (
    <div className="flex flex-col h-screen pt-20 bg-gray-100">
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full max-w-xs bg-white rounded-xl shadow-sm border flex flex-col overflow-hidden">
          <div className="p-4 border-b font-semibold">Chats</div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {conversations.length === 0 && <div className="p-4 text-gray-500 text-center">No conversations yet</div>}
            {conversations.map(conv => (
              <div
                key={conv.userId}
                onClick={() => handleSelectConversation(conv)}
                className={`p-4 cursor-pointer flex justify-between items-center ${
                  selectedOperator?.userId === conv.userId
                    ? "bg-green-50 border-l-4 border-green-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div>
                  <div className="font-medium">{conv.firstName} {conv.lastName}</div>
                  <div className="text-sm text-gray-500 truncate max-w-[150px]">{conv.lastMessage}</div>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="bg-green-500 text-white text-xs rounded-full px-2 py-1">{conv.unreadCount}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center gap-3">
            {selectedOperator ? (
              <>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedOperator.firstName[0]}{selectedOperator.lastName[0]}
                </div>
                <h3 className="font-bold text-gray-800">{selectedOperator.firstName} {selectedOperator.lastName}</h3>
              </>
            ) : (
              <p className="text-gray-500">Select a conversation</p>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                <div className={`px-4 py-3 rounded-2xl max-w-[70%] ${msg.isMe ? "bg-green-600 text-white rounded-br-none" : "bg-white border rounded-bl-none"}`}>
                  {msg.isDeleted ? <i className="text-gray-300">Message deleted</i> : msg.text}
                  <p className={`text-xs mt-1 ${msg.isMe ? "text-green-100" : "text-gray-500"}`}>{formatTime(msg.time)}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {selectedOperator && (
            <div className="p-4 bg-white border-t flex gap-3">
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSend}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                {editingMsgId ? "Update" : "Send"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
