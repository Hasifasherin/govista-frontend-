"use client";

import { useEffect, useState, useCallback } from "react";
import { getSocket, socketEvents } from "../lib/socket";
import {
  sendOperatorMessage,
  getOperatorConversations,
  getOperatorUserMessages,
} from "../services/operatorChatService";
import { Conversation, BackendMessage, Message } from "../types/chat";

/* ===================== HOOK ===================== */

export const useOperatorChat = (operatorId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const socket = getSocket();

  /* ===================== FETCH CONVERSATIONS ===================== */
  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const data = await getOperatorConversations();
      setConversations(data || []);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  /* ===================== FETCH MESSAGES ===================== */
  const fetchMessages = useCallback(
    async (userId: string) => {
      try {
        setLoadingMessages(true);
        setSelectedUserId(userId);

        const backendMessages = await getOperatorUserMessages(userId);

        const formatted: Message[] = backendMessages.map((msg: BackendMessage) => ({
          id: msg._id,
          sender: msg.sender === operatorId ? "operator" : "customer",
          text: msg.message,
          time: msg.createdAt,
          isMe: msg.sender === operatorId,
          read: msg.read || false,
          isDeleted: msg.isDeleted || false,
        }));

        setMessages(formatted);

        // Reset unread count in sidebar
        setConversations((prev) =>
          prev.map((conv) => (conv.userId === userId ? { ...conv, unreadCount: 0 } : conv))
        );

        // Mark messages as read via socket if needed
        if (formatted.some((msg) => !msg.isMe && !msg.read)) {
          socketEvents.markAsRead({ readerId: operatorId, senderId: userId });
        }

        // Join socket room for this conversation
        socket?.emit("joinOperatorChat", { operatorId, userId });
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    },
    [operatorId, socket]
  );

  /* ===================== SEND MESSAGE ===================== */
  const sendMessage = useCallback(
    async (userId: string, text: string, bookingId?: string, tourId?: string) => {
      const tempId = `temp_${Date.now()}`;
      const optimistic: Message = {
        id: tempId,
        sender: "operator",
        text,
        time: new Date().toISOString(),
        isMe: true,
        read: false,
      };
      setMessages((prev) => [...prev, optimistic]);

      try {
        const sent = await sendOperatorMessage({ userId, message: text, bookingId, tourId });

        const normalized: Message = {
          id: sent._id,
          sender: sent.sender === operatorId ? "operator" : "customer",
          text: sent.message,
          time: sent.createdAt,
          isMe: sent.sender === operatorId,
          read: sent.read,
        };

        setMessages((prev) => prev.map((msg) => (msg.id === tempId ? normalized : msg)));

        // Update sidebar conversation
        setConversations((prev) => {
          const existing = prev.find((c) => c.userId === userId);
          if (!existing) return prev;

          const updated: Conversation = {
            ...existing,
            lastMessage: text,
            lastMessageTime: normalized.time,
          };

          return [updated, ...prev.filter((c) => c.userId !== userId)];
        });

        // Emit via socket
        if (socket?.connected) {
          socketEvents.sendMessage({ senderId: operatorId, receiverId: userId, message: text, bookingId, tourId });
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      }
    },
    [operatorId, socket]
  );

  /* ===================== SOCKET LISTENERS ===================== */
  useEffect(() => {
    if (!operatorId || !socket) return;

    const handleNewMessage = (msg: BackendMessage) => {
      const otherUserId = msg.sender === operatorId ? msg.receiver : msg.sender;

      const formatted: Message = {
        id: msg._id,
        sender: msg.sender === operatorId ? "operator" : "customer",
        text: msg.message,
        time: msg.createdAt,
        isMe: msg.sender === operatorId,
        read: msg.read,
        isDeleted: msg.isDeleted || false,
      };

      // Only add if current conversation
      if (selectedUserId === otherUserId) {
        setMessages((prev) => (prev.some((m) => m.id === msg._id) ? prev : [...prev, formatted]));

        // Mark as read if operator received the message
        if (msg.receiver === operatorId && !formatted.isMe) {
          socketEvents.markAsRead({ readerId: operatorId, senderId: msg.sender });
        }
      }

      // Update conversation sidebar
      setConversations((prev) => {
        const existing = prev.find((c) => c.userId === otherUserId);
        if (!existing) {
          fetchConversations();
          return prev;
        }

        const updated: Conversation = {
          ...existing,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: msg.sender === operatorId ? existing.unreadCount : (existing.unreadCount || 0) + 1,
        };

        return [updated, ...prev.filter((c) => c.userId !== otherUserId)];
      });
    };

    const handleMessagesRead = (data: { readerId: string; senderId: string; count: number }) => {
      if (data.readerId === operatorId) {
        setMessages((prev) => prev.map((msg) => (!msg.isMe && !msg.read ? { ...msg, read: true } : msg)));
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [operatorId, selectedUserId, fetchConversations, socket]);

  /* ===================== INIT ===================== */
  useEffect(() => {
    if (operatorId) fetchConversations();
  }, [operatorId, fetchConversations]);

  /* ===================== RETURN ===================== */
  return {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    selectedUserId,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setMessages,
    setConversations,
  };
};
