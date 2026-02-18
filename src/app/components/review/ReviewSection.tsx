"use client";

import React, { useState } from "react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

interface Props {
  tourId: string;
}

export default function ReviewSection({ tourId }: Props) {
  const [refresh, setRefresh] = useState(false);

  const handleReviewCreated = () => {
    // trigger refresh of ReviewList
    setRefresh((prev) => !prev);
  };

  return (
    <div className="space-y-8">
      {/* Review Form */}
      <ReviewForm tourId={tourId} onReviewCreated={handleReviewCreated} />

      {/* Existing Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Reviews</h3>
        <ReviewList key={refresh ? "r1" : "r0"} tourId={tourId} />
      </div>
    </div>
  );
}
