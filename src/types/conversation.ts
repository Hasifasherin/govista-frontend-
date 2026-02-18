export interface Conversation {
  userId: string;
  operatorId: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  lastSenderIsMe?: boolean;
}
