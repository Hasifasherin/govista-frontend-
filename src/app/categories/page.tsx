"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tourAPI } from "../../services/tour";
import { Tour } from "../../types/tour";
import UserTourCard from "../components/tour/UserTourCard";

interface Category {
  _id: string;
  name: string;
}

function CategoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const [categories, setCategories] = useState<Category[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ---------------- FETCH CATEGORIES ----------------
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await tourAPI.getCategories();
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // ---------------- FETCH TOURS BY CATEGORY ----------------
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchTours = async () => {
      setLoadingTours(true);
      try {
        const res = await tourAPI.searchTours({
          category: selectedCategory,
        });
        setTours(res.data.tours || []);
      } catch (err) {
        console.error("Failed to fetch tours:", err);
        setTours([]);
      } finally {
        setLoadingTours(false);
      }
    };

    fetchTours();
  }, [selectedCategory]);

  const activeCategory = useMemo(
    () => categories.find((c) => c._id === selectedCategory),
    [categories, selectedCategory]
  );

  const handleCategoryClick = (id: string) => {
    router.push(`/categories?category=${id}`);
  };

  const handleTourClick = (id: string) => {
    router.push(`/user/tours/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      {!selectedCategory && (
        <>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-[var(--green-dark)]">
              Explore Categories
            </h1>
            <p className="text-gray-600 mt-3">
              Choose a category to discover curated experiences
            </p>
          </div>

          {loadingCategories ? (
            <p className="text-center text-gray-500">
              Loading categories...
            </p>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-500">
              No categories available.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center cursor-pointer border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedCategory && (
        <>
          <button
            onClick={() => router.push("/categories")}
            className="mb-8 text-sm text-[var(--green-primary)] hover:underline"
          >
            ← Back to Categories
          </button>

          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-[var(--green-dark)]">
              {activeCategory?.name || "Category"}
            </h2>
          </div>

          {loadingTours ? (
            <p className="text-center text-gray-500">
              Loading tours...
            </p>
          ) : tours.length === 0 ? (
            <p className="text-center text-gray-500">
              No tours found in this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour) => (
                <UserTourCard
                  key={tour._id}
                  tour={tour}
                  onView={handleTourClick}
                  onCardClick={handleTourClick}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}