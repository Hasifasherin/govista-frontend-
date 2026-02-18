"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { tourAPI } from "../../../services/tour";
import { Tour } from "../../../types/tour";

import UserTourCard from "./UserTourCard";
import LoginModal from "../common/LoginModal";

// ✅ AUTH
import { useAuth } from "../../context/AuthContext";

// ✅ WISHLIST SERVICES
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../../services/wishlistService";

export default function FeaturedTours() {
  const router = useRouter();
  const { user } = useAuth(); // ✅ real auth

  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔐 login modal state
  const [loginOpen, setLoginOpen] = useState(false);

  const isLoggedIn = !!user;

  // ---------------- FETCH FEATURED TOURS ----------------
  const fetchFeaturedTours = async () => {
    setLoading(true);
    try {
      const res = await tourAPI.getFeaturedTours();
      setFeaturedTours(res.data.tours || []);
    } catch (err) {
      console.error("Failed to fetch featured tours:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH WISHLIST ----------------
  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();

      if (res?.wishlist) {
        const ids = res.wishlist.map((tour: any) =>
          typeof tour === "string" ? tour : tour._id
        );

        setWishlistIds(ids);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  useEffect(() => {
    fetchFeaturedTours();

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  // ---------------- CARD CLICK ----------------
  const handleCardClick = (id: string) => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }

    router.push(`/user/tours/${id}`); // ✅ fixed path
  };

  // ---------------- WISHLIST TOGGLE ----------------
  const handleWishlist = async (id: string) => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }

    try {
      if (wishlistIds.includes(id)) {
        await removeFromWishlist(id);
        setWishlistIds((prev) =>
          prev.filter((wid) => wid !== id)
        );
      } else {
        await addToWishlist(id);
        setWishlistIds((prev) => [...prev, id]);
      }
    } catch (err) {
      console.error("Wishlist action failed:", err);
    }
  };

  // ---------------- LOADING ----------------
  if (loading)
    return (
      <p className="text-center text-gray-500 mt-6">
        Loading featured tours...
      </p>
    );

  if (featuredTours.length === 0) return null;

  // ---------------- UI ----------------
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">
        Featured Tours
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTours.map((tour) => (
          <div
            key={tour._id}
            onClick={() => handleCardClick(tour._id)}
            className="cursor-pointer"
          >
            <UserTourCard
              tour={tour}
              isWishlisted={wishlistIds.includes(tour._id)} // ✅ pass state
              onView={handleCardClick}
              onWishlist={handleWishlist}
            />
          </div>
        ))}
      </div>

      {/* 🔐 LOGIN MODAL */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </div>
  );
}
