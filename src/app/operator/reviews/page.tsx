"use client";

import { useEffect, useState } from "react";
import { getOperatorReviews } from "../../../services/reviewService";
import { OperatorReview } from "../../../types/review";
import {
  FiStar,
  FiMessageCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function OperatorReviewsPage() {
  const [reviews, setReviews] = useState<OperatorReview[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getOperatorReviews();
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading reviews...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600">
          Customer feedback & service quality
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={<FiMessageCircle />}
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          icon={<FiStar />}
        />
        <StatCard
          title="Complaints"
          value={stats.complaintsCount}
          icon={<FiAlertCircle />}
        />
      </div>

      {/* Reviews list */}
      <div className="bg-white border rounded-xl">
        <div className="px-6 py-4 border-b font-semibold">
          Customer Reviews
        </div>

        {reviews.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No reviews yet.  
            <br />
            Reviews will appear once customers complete tours and submit feedback.
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review._id} className="p-6 space-y-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">
                      {review.userId.firstName} {review.userId.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {review.tourId.title} · {review.tourId.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-yellow-500">
                    <FiStar />
                    <span>{review.rating}</span>
                  </div>
                </div>

                <p className="text-gray-700">
                  {review.comment}
                </p>

                {review.rating <= 2 && (
                  <div className="text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle />
                    Marked as complaint
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center gap-2 text-gray-600">
        {icon}
        <span className="font-medium">{title}</span>
      </div>
      <div className="mt-3 text-2xl font-bold">
        {value}
      </div>
    </div>
  );
}
