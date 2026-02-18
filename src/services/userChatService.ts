import API from "../utils/api";
import { Conversation } from "../types/conversation";
import { Message } from "../types/message";
/* =========================
   Get Conversations
========================= */
export const getUserConversations = async (): Promise<Conversation[]> => {
  const res = await API.get("/messages");
  return res.data.conversations;
};


/* =========================
   Get Messages with Operator
========================= */
export const getUserMessages = async (operatorId: string): Promise<Message[]> => {
  if (!operatorId) throw new Error("operatorId is required");
  const res = await API.get<{ success: boolean; messages: Message[] }>(
    `/messages/conversation/${operatorId}`
  );
  return res.data.messages;
};


/* =========================
   Send Message
========================= */
export const sendUserMessage = async (data: {
  receiverId: string;
  message: string;
}) => {
  const res = await API.post(
    "/messages",
    data
  );
  return res.data.data;
};

/* =========================
   Edit Message
========================= */
export const editUserMessage = async (
  messageId: string,
  message: string
) => {
  const res = await API.put(
    `/messages/${messageId}`,
    { message }
  );
  return res.data.data;
};

/* =========================
   Soft Delete Message
========================= */
export const deleteUserMessage = async (
  messageId: string
) => {
  const res = await API.delete(
    `/messages/${messageId}`
  );
  return res.data;
};
