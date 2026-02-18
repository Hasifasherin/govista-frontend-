"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiUser, FiChevronDown, FiHeart, FiHelpCircle, FiCalendar } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

// ✅ Redux
import { useAppSelector } from "../../../redux/hooks";

export default function Header() {
  const { user, logout } = useAuth();

  const [userOpen, setUserOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);
  const discoverRef = useRef<HTMLDivElement>(null);

  // ✅ Wishlist count
  const wishlistCount = useAppSelector(
    (state) => state.wishlist.items.length
  );

  // ---------------- CLOSE DROPDOWN ----------------
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userRef.current &&
        !userRef.current.contains(e.target as Node)
      ) {
        setUserOpen(false);
      }

      if (
        discoverRef.current &&
        !discoverRef.current.contains(e.target as Node)
      ) {
        setDiscoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    logout();
    setUserOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-16 max-w-screen-xl mx-auto px-6 flex items-center justify-between">

        {/* ---------------- LEFT ---------------- */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo/logos.png"
              alt="Logo"
              width={160}
              height={50}
              priority
            />
          </Link>

          {/* Discover Dropdown */}
          <div ref={discoverRef} className="relative">
            <button
              onClick={() =>
                setDiscoverOpen(!discoverOpen)
              }
              className="flex items-center gap-1 font-medium text-gray-800 hover:text-green-600 transition"
            >
              Discover <FiChevronDown />
            </button>

            {discoverOpen && (
              <div className="absolute top-10 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">

                <Link
                  href="/tours"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Tours
                </Link>

                <Link
                  href="/activities"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Activities
                </Link>

                <Link
                  href="/categories"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Categories
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- RIGHT ---------------- */}
        <div className="flex items-center gap-4 ml-auto">

          {/* 👤 User Dropdown */}
          <div ref={userRef} className="relative">
            <button
              onClick={() =>
                setUserOpen(!userOpen)
              }
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full bg-white hover:bg-gray-100 transition"
            >
              <FiUser size={20} />
            </button>

            {userOpen && (
              <div className="absolute top-12 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">

                {/* NOT LOGGED IN */}
                {!user ? (
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Log in / Sign up
                  </Link>
                ) : (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-600 truncate">
                      {user.email}
                    </div>

                    <div className="border-t border-gray-200" />

                    <div
                      onClick={handleLogout}
                      className="px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100"
                    >
                      Log out
                    </div>
                  </>
                )}

                <div className="border-t border-gray-200" />

                <Link
                  href="/user/wishlist"
                  className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <FiHeart /> Wishlists
                </Link>

                {/* ✅ My Bookings */}
                <Link
                  href="/user/bookings"
                  className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <FiCalendar /> My Bookings
                </Link>

                <Link
                  href="/help"
                  className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <FiHelpCircle /> Help
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
