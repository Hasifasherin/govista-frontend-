"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiMap,
  FiCalendar,
  FiMessageSquare,
  FiBell,
  FiLogOut,
  FiMenu,
  FiTrendingUp,
  FiSettings,
  FiChevronRight,
  FiDollarSign,
  FiUsers
} from "react-icons/fi";
import styles from "./styles/OperatorLayout.module.css";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function OperatorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]); // fetch from API

  const notificationRef = useRef<HTMLDivElement>(null);

  // Protect route
  useEffect(() => {
    if (!loading && user?.role !== "operator") {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9f7ef] to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0f8a2d] border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== "operator") return null;

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/operator/dashboard", icon: FiHome },
    { label: "My Tours", href: "/operator/tours", icon: FiMap },
    { label: "Bookings", href: "/operator/bookings", icon: FiCalendar },
    { label: "Customers", href: "/operator/customers", icon: FiUsers },
    { label: "Payments", href: "/operator/payments", icon: FiDollarSign },
    { label: "Earnings", href: "/operator/earnings", icon: FiTrendingUp },
    { label: "Messages", href: "/operator/messages", icon: FiMessageSquare },
    { label: "Reviews", href: "/operator/reviews", icon: FiMessageSquare },
  ];

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const getUserInitials = () =>
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : "OP";

  const getUserName = () =>
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "Operator";

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  return (
    <div className={styles.operatorLayout}>
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        {/* LOGO */}
        <div className={styles.logoSection}>
          <Link href="/operator/dashboard" className={styles.logoContainer}>
            <div className={styles.logoImage}>
              <Image
                src="/logo/logos.png"
                alt="GoVista"
                fill
                className="object-contain"
              />
            </div>
            <div className={styles.logoSubtitle}>OPERATOR PANEL</div>
          </Link>
        </div>

        {/* NAV ITEMS */}
        <nav className={styles.navContainer}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${
                  active ? styles.navItemActive : ""
                }`}
              >
                <Icon className={styles.navIcon} />
                {item.label}
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
                {active && <FiChevronRight className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </nav>
        {/* USER INFO */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{getUserInitials()}</div>
            <div className={styles.userText}>
              <div className={styles.userName}>{getUserName()}</div>
              <div className={styles.userRole}>Tour Operator</div>
            </div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className={styles.mainContent}>
        {/* TOPBAR */}
        <header className={styles.topBar}>
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className={styles.menuButton}
            >
              <FiMenu />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* NOTIFICATIONS */}
            <div ref={notificationRef} className="relative">
              <button
                className={styles.notificationButton}
                onClick={() => setNotificationOpen((v) => !v)}
              >
                <FiBell className="text-xl" />
                {notifications.some((n) => !n.isRead) && (
                  <span className={styles.notificationDot} />
                )}
              </button>

              {notificationOpen && (
                <div className={styles.notificationDropdown}>
                  <div className={styles.notificationHeader}>
                    Notifications
                    <button
                      className="text-sm text-green-600 hover:underline"
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-gray-500">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.href || "#"}
                          className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${
                            !n.isRead ? "bg-green-50 font-medium" : ""
                          }`}
                        >
                          <p className="truncate">{n.title}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {n.message}
                          </p>
                        </Link>
                      ))
                    )}
                  </div>
                  <Link
                    href="/operator/notifications"
                    className="block text-center text-sm text-green-600 py-2 hover:underline border-t border-gray-200"
                  >
                    View all
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE AVATAR */}
            <div className={styles.mobileAvatar}>{getUserInitials()}</div>
          </div>
        </header>

        {/* MAIN CHILDREN */}
        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
}
