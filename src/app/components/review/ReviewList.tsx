"use client";

import React, { useEffect, useState } from "react";
import { getTourReviews } from "../../../services/reviewService";
import { Review } from "../../../types/review";

interface Props {
  tourId: string;
}

export default function ReviewList({ tourId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getTourReviews(tourId);
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tourId) fetchReviews();
  }, [tourId]);

  if (loading) return <p className="text-center mt-4">Loading reviews...</p>;
  if (reviews.length === 0) return <p className="text-center mt-4">No reviews yet</p>;

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r._id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">
              {r.userId?.firstName} {r.userId?.lastName}
            </p>
            <div className="flex space-x-1">
              {stars.map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= r.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.95a1 1 0 00-.364-1.118L2.025 9.377c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.95z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-gray-700">{r.comment}</p>
          <p className="text-gray-400 text-xs mt-1">
            {new Date(r.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
