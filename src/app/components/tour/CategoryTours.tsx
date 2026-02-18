"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { tourAPI } from "../../../services/tour";
import { Tour } from "../../../types/tour";
import UserTourCard from "./UserTourCard";
import LoginModal from "../common/LoginModal";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../../services/wishlistService";

interface Category {
  _id: string;
  name: string;
}

export default function CategoryTours() {
  const { user } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [toursByCategory, setToursByCategory] =
    useState<Record<string, Tour[]>>({});
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      const res = await tourAPI.getCategories();
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
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

  // ---------------- FETCH TOURS ----------------
  const fetchToursByCategory = async () => {
    setLoading(true);
    try {
      const newToursByCat: Record<string, Tour[]> = {};

      for (const category of categories) {
        const res = await tourAPI.searchTours({
          category: category._id,
          limit: 6,
        });

        newToursByCat[category._id] = res.data.tours || [];
      }

      setToursByCategory(newToursByCat);
    } catch (err) {
      console.error("Failed to fetch tours:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    fetchCategories();

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchToursByCategory();
    }
  }, [categories]);

  // ---------------- CARD CLICK ----------------
  const handleCardClick = (id: string) => {
    if (user) {
      router.push(`/user/tours/${id}`);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleView = (id: string) => {
    handleCardClick(id);
  };

  // ---------------- WISHLIST TOGGLE ----------------
  const handleWishlist = async (id: string) => {
    try {
      if (!user) {
        setShowLoginModal(true);
        return;
      }

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
        Loading tours...
      </p>
    );

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {categories.map((category) => {
          const tours = toursByCategory[category._id] || [];
          if (tours.length === 0) return null;

          return (
            <div key={category._id} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">
                {category.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <UserTourCard
                    key={tour._id}
                    tour={tour}
                    onView={handleView}
                    onWishlist={handleWishlist}
                    onCardClick={handleCardClick}
                    isWishlisted={wishlistIds.includes(
                      tour._id
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
