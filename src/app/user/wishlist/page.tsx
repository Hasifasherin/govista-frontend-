"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchWishlist, removeFromWishlist } from "../../../redux/slices/wishlistSlice";
import UserTourCard from "../../components/tour/UserTourCard";

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { items, loading } = useAppSelector((state) => state.wishlist);

  // 🔐 Check if user is logged in
  const isLoggedIn =
    typeof window !== "undefined" &&
    !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    dispatch(fetchWishlist());
  }, [dispatch, isLoggedIn, router]);

  // ---------------- HANDLERS ----------------
  const handleCardClick = (id: string) => {
    router.push(`/user/tours/${id}`);
  };

  const handleWishlistToggle = (id: string) => {
    dispatch(removeFromWishlist(id));
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading your wishlist...
      </div>
    );
  }

  // ---------------- EMPTY STATE ----------------
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
        <h2 className="text-2xl font-bold">
          Your wishlist is empty!
        </h2>
        <p className="text-gray-600 max-w-md">
          Start exploring tours and add your favorite ones to your wishlist.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Explore Tours
        </button>
      </div>
    );
  }

  // ---------------- WISHLIST GRID ----------------
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 space-y-12 font-sans">
      <h1 className="text-3xl font-bold mb-8">
        My Wishlist 
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((tour) => (
          <UserTourCard
            key={tour._id}
            tour={tour}
            onView={handleCardClick}
            onWishlist={handleWishlistToggle} // removes the tour from wishlist
            isWishlisted={true} // always true in wishlist
          />
        ))}
      </div>
    </div>
  );
}
