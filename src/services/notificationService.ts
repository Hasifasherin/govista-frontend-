// app/services/notificationService.ts
import axios from "axios";

export interface Notification {
  id: string;
  type: "booking" | "payment" | "system" | "tour";
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  action?: { label: string; href: string };
}

// Fetch notifications with optional pagination
export const getMyNotifications = async (page = 1, limit = 50) => {
  const res = await axios.get(`/api/notifications?page=${page}&limit=${limit}`);
  return res.data;
};

// Mark a single notification as read
export const markAsRead = async (id: string) => {
  const res = await axios.put(`/api/notifications/${id}/read`);
  return res.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const res = await axios.put(`/api/notifications/mark-all-read`);
  return res.data;
};

// Delete a notification
export const deleteNotification = async (id: string) => {
  const res = await axios.delete(`/api/notifications/${id}`);
  return res.data;
};

// Optional: get unread count
export const getUnreadCount = async () => {
  const res = await axios.get(`/api/notifications/unread-count`);
  return res.data;
};

// Optional: get latest 5 notifications (for topbar)
export const getLatestNotifications = async () => {
  const res = await axios.get(`/api/notifications/latest`);
  return res.data;
};
