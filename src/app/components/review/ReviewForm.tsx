"use client";

import React, { useState } from "react";
import { createReview } from "../../../services/reviewService";

interface Props {
  tourId: string;
  onReviewCreated?: () => void;
}

export default function ReviewForm({ tourId, onReviewCreated }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const stars = [1, 2, 3, 4, 5];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars");
      return;
    }
    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await createReview({ tourId, rating, comment });
      setSuccess("Review submitted successfully!");
      setRating(0);
      setHoverRating(0);
      setComment("");
      if (onReviewCreated) onReviewCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-6 rounded-lg shadow-sm bg-white space-y-4"
    >
      <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      {/* ⭐ Star Rating */}
      <div className="flex items-center space-x-1">
        {stars.map((star) => (
          <svg
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`w-8 h-8 cursor-pointer transition-colors ${
              star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.95a1 1 0 00-.364-1.118L2.025 9.377c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.95z" />
          </svg>
        ))}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Write your review..."
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
