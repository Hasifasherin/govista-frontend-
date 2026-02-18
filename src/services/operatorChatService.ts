// services/operatorChatService.ts
import API from "../utils/api";
import { Conversation, BackendMessage, MessagesResponse, ConversationResponse, SendMessageResponse } from "../types/chat";

export const getOperatorConversations = async (): Promise<Conversation[]> => {
  const res = await API.get<ConversationResponse>("/messages");
  return res.data.conversations || [];
};

export const getOperatorUserMessages = async (userId: string): Promise<BackendMessage[]> => {
  if (!userId) throw new Error("userId is required");

  const res = await API.get<MessagesResponse>(`/messages/conversation/${userId}`);
  return res.data.messages || [];
};

export const sendOperatorMessage = async (data: { userId: string; message: string; bookingId?: string; tourId?: string }) => {
  const res = await API.post<SendMessageResponse>("/messages", {
    receiverId: data.userId,
    message: data.message,
    bookingId: data.bookingId || undefined,
    tourId: data.tourId || undefined
  });
  return res.data.data;
};


export const editOperatorMessage = async (messageId: string, message: string) => {
  const res = await API.put<SendMessageResponse>(`/messages/${messageId}`, { message });
  return res.data.data;
};

export const deleteOperatorMessage = async (messageId: string): Promise<void> => {
  await API.delete(`/messages/${messageId}`);
};