// types/chat.ts
// Backend raw message from DB
export interface BackendMessage {
  _id: string;
  sender: string;     // userId or operatorId
  receiver: string;   // userId or operatorId
  message: string;
  createdAt: string;
  isDeleted?: boolean;
  bookingId?: string | null;
  tourId?: string | null;
  read?: boolean;
}

// API Response types
export interface MessagesResponse {
  success: boolean;
  messages: BackendMessage[];
}

export interface ConversationResponse {
  success: boolean;
  conversations: Conversation[];
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    _id: string;
    message: string;
    createdAt: string;
    sender: string;
    receiver: string;
    read: boolean;
  };
}

// Normalized frontend message for chat UI
export interface Message {
  id: string;
  sender: "operator" | "customer" | "user";
  text: string;
  time: string;
  isMe: boolean;
  isDeleted?: boolean;
  read?: boolean;
}

// Conversation for operator view
export interface Conversation {
  userId: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Socket payload types - ADD THESE
export interface JoinChatPayload {
  operatorId?: string;
  userId?: string;
  bookingId?: string;
}

export interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  message: string;
  bookingId?: string;
  tourId?: string;
}

export interface MarkAsReadPayload {
  readerId: string;
  senderId: string;
  bookingId?: string;
}

export interface MessagesReadPayload {
  readerId: string;
  senderId: string;
  bookingId?: string;
  count: number;
}

// User chat specific types (if needed)
export interface UserConversation {
  operatorId: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}