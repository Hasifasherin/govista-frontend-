// lib/socket.ts
import { io, Socket } from "socket.io-client";
import { BackendMessage, JoinChatPayload, SendMessagePayload } from "../types/chat";

// Add type for messagesRead event
interface MessagesReadPayload {
  readerId: string;
  senderId: string;
  bookingId?: string;
  count: number;
}

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      {
        withCredentials: true,
        autoConnect: false,
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      }
    );

    // Add default error handler
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Add reconnect handlers
    socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
    });

    socket.on("reconnect_error", (error) => {
      console.error("Socket reconnect error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Reconnect manually if server disconnected
        socket?.connect();
      }
    });
  }

  return socket;
};

// Socket event emitters with better typing
export const socketEvents = {
  joinChat: (payload: JoinChatPayload) => {
    if (socket?.connected) {
      socket.emit("joinChat", payload);
    } else {
      console.warn("Socket not connected, cannot join chat");
    }
  },
  
  leaveChat: (payload: JoinChatPayload) => {
    if (socket?.connected) {
      socket.emit("leaveChat", payload);
    }
  },
  
  sendMessage: (payload: SendMessagePayload) => {
    if (socket?.connected) {
      socket.emit("sendMessage", payload);
    } else {
      console.warn("Socket not connected, message not sent");
    }
  },
  
  markAsRead: (payload: { readerId: string; senderId: string; bookingId?: string }) => {
    if (socket?.connected) {
      socket.emit("markRead", payload);
    }
  },
  
  // Event listeners with proper return types for cleanup
  onNewMessage: (callback: (msg: BackendMessage) => void): (() => void) => {
    if (!socket) return () => {};
    
    socket.on("newMessage", callback);
    return () => {
      socket?.off("newMessage", callback);
    };
  },
  
  onMessagesRead: (callback: (data: MessagesReadPayload) => void): (() => void) => {
    if (!socket) return () => {};
    
    socket.on("messagesRead", callback);
    return () => {
      socket?.off("messagesRead", callback);
    };
  },
  
  // Connection management
  connect: () => {
    if (socket && !socket.connected) {
      socket.connect();
    }
  },
  
  disconnect: () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
  },
  
  isConnected: (): boolean => {
    return socket?.connected || false;
  }
};