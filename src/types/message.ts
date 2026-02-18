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
}

// Normalized frontend message for chat UI
export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe?: boolean;      // computed based on current user/operator
  isDeleted?: boolean; // optional
}
