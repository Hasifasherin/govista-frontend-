"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiBell,
  FiCheckCircle,
  FiX,
  FiCalendar,
  FiDollarSign,
  FiMap,
  FiInfo,
  FiAlertCircle,
} from "react-icons/fi";
import { getMyNotifications, markAsRead as apiMarkAsRead, markAllAsRead as apiMarkAllAsRead, deleteNotification as apiDeleteNotification } from "../../../services/notificationService"; // your API service

interface Notification {
  id: string;
  type: "booking" | "payment" | "system" | "tour";
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  action?: { label: string; href: string };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "booking" | "payment">("all");
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getMyNotifications();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.type === filter;
  });

  const markAsRead = async (id: string) => {
    try {
      await apiMarkAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiMarkAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiDeleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <FiCalendar className="text-blue-500" size={20} />;
      case "payment":
        return <FiDollarSign className="text-green-500" size={20} />;
      case "tour":
        return <FiMap className="text-purple-500" size={20} />;
      case "system":
        return <FiInfo className="text-gray-500" size={20} />;
      default:
        return <FiBell className="text-gray-500" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "booking":
        return "bg-blue-50 border-blue-100";
      case "payment":
        return "bg-green-50 border-green-100";
      case "tour":
        return "bg-purple-50 border-purple-100";
      case "system":
        return "bg-gray-50 border-gray-100";
      default:
        return "bg-gray-50 border-gray-100";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "booking":
        return "Booking";
      case "payment":
        return "Payment";
      case "tour":
        return "Tour";
      case "system":
        return "System";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-600">Stay updated with your business activities</p>
        </div>

        <div className="flex items-center gap-3">
          {/* FILTER BUTTONS */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["all", "unread", "booking", "payment"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                  filter === f ? "bg-white text-gray-800 shadow" : "text-gray-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={markAllAsRead}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBell className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No notifications</h3>
          <p className="text-gray-500">You're all caught up! New notifications will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl border ${getTypeColor(notification.type)} p-5 ${
                !notification.isRead ? "border-l-4 border-l-green-500" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      notification.type === "booking"
                        ? "bg-blue-100"
                        : notification.type === "payment"
                        ? "bg-green-100"
                        : notification.type === "tour"
                        ? "bg-purple-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {getIcon(notification.type)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{notification.title}</h4>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                          notification.type === "booking"
                            ? "bg-blue-100 text-blue-800"
                            : notification.type === "payment"
                            ? "bg-green-100 text-green-800"
                            : notification.type === "tour"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getTypeBadge(notification.type)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{notification.message}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                        >
                          <FiCheckCircle size={14} /> Mark as read
                        </button>
                      )}
                      {notification.action && (
                        <Link
                          href={notification.action.href}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {notification.action.label} →
                        </Link>
                      )}
                    </div>

                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove notification"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>

                {!notification.isRead && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
