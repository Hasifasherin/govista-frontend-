// services/adminChatService.ts
import API from "../utils/api";

export interface Operator {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  unreadCount?: number;
}

export interface UserConversation {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  lastMessage: string;
  unreadCount?: number;
}

export interface Message {
  _id: string;
  sender: "operator" | "customer";
  message: string;
  createdAt: string;
  read?: boolean;
}

// =================== OPERATORS ===================

// Get all operators
export const getOperators = async (): Promise<Operator[]> => {
  const res = await API.get("/admin/chat/operators");
  return res.data.operators || [];
};

// =================== CONVERSATIONS ===================

// Get conversations for a specific operator
export const getOperatorConversations = async (
  operatorId: string
): Promise<UserConversation[]> => {
  const res = await API.get(`/admin/chat/${operatorId}`);
  return res.data.conversations || [];
};

// =================== MESSAGES ===================

// Get messages between operator and user
export const getOperatorUserMessages = async (
  operatorId: string,
  userId: string
): Promise<Message[]> => {
  const res = await API.get(`/admin/chat/${operatorId}/${userId}`);
  return res.data.messages || [];
};

// =================== SEND MESSAGE ===================

// Send a message as an operator/admin to a user
export const sendOperatorMessage = async (payload: {
  userId: string;
  message: string;
}): Promise<Message> => {
  const res = await API.post("/admin/chat/send", payload);
  return res.data.message; // Should include at least _id, message, createdAt
};
