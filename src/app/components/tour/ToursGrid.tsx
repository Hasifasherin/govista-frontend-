"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { tourAPI } from "../../../services/tour";
import { Tour } from "../../../types/tour";
import UserTourCard from "./UserTourCard";

interface Category {
  _id: string;
  name: string;
}

export default function CategoryTours() {
  const { user } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [toursByCategory, setToursByCategory] = useState<Record<string, Tour[]>>({});
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await tourAPI.getCategories();
      if (res.data && Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // Fetch tours for each category
  const fetchToursByCategory = async () => {
    setLoading(true);
    try {
      const newToursByCat: Record<string, Tour[]> = {};
      for (const category of categories) {
        const res = await tourAPI.searchTours({
          category: category._id,
          limit: 6,
        });
        if (res.data && Array.isArray(res.data.tours)) {
          newToursByCat[category._id] = res.data.tours;
        } else {
          newToursByCat[category._id] = [];
        }
      }
      setToursByCategory(newToursByCat);
    } catch (err) {
      console.error("Failed to fetch tours:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchToursByCategory();
    }
  }, [categories]);

  const handleView = (id: string) => {
    if (user) {
      router.push(`/tours/${id}`);
    } else {
      router.push("/login");
    }
  };

  const handleWishlist = (id: string) => {
    console.log("Add to wishlist:", id);
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-6">Loading tours...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {categories.map((category) => {
        const tours = toursByCategory[category._id] || [];
        if (tours.length === 0) return null;

        return (
          <div key={category._id} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tours.map((tour) => (
                <UserTourCard
                  key={tour._id}
                  tour={tour}
                  onView={handleView}
                  onWishlist={handleWishlist}
                  small={true} 
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
