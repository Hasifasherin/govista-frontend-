"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Map, Calendar, ImageIcon, Users, Star, MessageSquare } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../hooks/useAdminRedux";
import { logout } from "../../redux/slices/adminSlice";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.admin.user);

  const [mounted, setMounted] = useState(false);

  /* ================= HYDRATION SAFE ================= */
  useEffect(() => setMounted(true), []);

  /* ================= ADMIN GUARD ================= */
  useEffect(() => {
    if (mounted && (!user || user.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [mounted, user, router]);

  if (!mounted) return null;

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("adminToken");
    sessionStorage.clear();
    window.location.href = "/";
  };

  /* ================= MENU ================= */
  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Tours", href: "/admin/tours", icon: Map },
    { label: "Bookings", href: "/admin/bookings", icon: Calendar },
    { label: "Sliders", href: "/admin/sliders", icon: ImageIcon },
    { label: "Categories", href: "/admin/categories", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Operators", href: "/admin/operators", icon: Users },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Chat", href: "/admin/chat", icon: MessageSquare },
  ];

  const getUserName = () =>
    user?.name || user?.email || "Admin";

  const getUserInitials = () =>
    getUserName().substring(0, 2).toUpperCase();

  
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg flex flex-col z-50">
        
        {/* ===== LOGO SECTION (SAME AS OPERATOR) ===== */}
        <div className="p-6 border-b flex flex-col items-center">
          <div className="relative w-28 h-12 mb-2">
            <Image
              src="/logo/logos.png"
              alt="GoVista"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xs text-gray-500 font-semibold tracking-wide">
            ADMIN PANEL
          </span>
        </div>

        {/* ===== NAVIGATION ===== */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  active
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ===== USER FOOTER ===== */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                {getUserInitials()}
              </div>

              <div className="text-sm">
                <p className="font-semibold leading-none">
                  {getUserName()}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-500 transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
