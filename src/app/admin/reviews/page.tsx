"use client";

import { useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAdminRedux";
import { fetchAdminReviews, removeReview } from "../../../redux/slices/adminReviewsSlice";
import { Review } from "../../../types/review";

export default function AdminReviewsPage() {
  const dispatch = useAppDispatch();
  const {
    reviews = [],
    loading,
    error,
    actionLoading,
    totalReviews = 0,
    averageRating = 0,
    ratingDistribution = [],
  } = useAppSelector((state) => state.adminReviews);

  // Fetch reviews on mount
  useEffect(() => {
    dispatch(fetchAdminReviews());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      dispatch(removeReview(id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold">Reviews Management</h1>
          <p className="text-gray-500 mt-1">View, analyze, and moderate all user reviews</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Total Reviews</h3>
            <p className="text-2xl font-bold">{totalReviews}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Average Rating</h3>
            <p className="text-2xl font-bold">{averageRating.toFixed(1)} ★</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">Rating Distribution</h3>
            <p className="text-gray-500 text-sm">
              {ratingDistribution.length > 0
                ? ratingDistribution.map((r) => `${r._id}★: ${r.count}`).join(" | ")
                : "No ratings yet"}
            </p>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-gray-500">Loading reviews...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Reviews table */}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-16 text-gray-500">No reviews found.</div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold">User</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Tour</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Rating</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Comment</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
           <tbody>
  {reviews.map((r) => (
    <tr key={r._id} className="border-b hover:bg-gray-50">
      <td className="py-2 px-4">
        {r.userId ? `${r.userId.firstName} ${r.userId.lastName}` : "Unknown"}
      </td>
      <td className="py-2 px-4">{r.tourId ? r.tourId.title : "Unknown"}</td>
      <td className="py-2 px-4">{r.rating} ★</td>
      <td className="py-2 px-4">{r.comment}</td>
      <td className="py-2 px-4">{new Date(r.createdAt).toLocaleDateString()}</td>
      <td className="py-2 px-4">
        <button
          onClick={() => handleDelete(r._id)}
          disabled={actionLoading === r._id}
          className={`px-3 py-1 rounded-lg text-white text-sm font-semibold transition ${
            actionLoading === r._id
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {actionLoading === r._id ? "Deleting..." : "Delete"}
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
