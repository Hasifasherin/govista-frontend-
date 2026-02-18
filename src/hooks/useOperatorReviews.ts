"use client";

import { useEffect, useState } from "react";
import { getOperatorReviews } from "../services/reviewService";
import { OperatorReviewResponse } from "../types/review";

export const useOperatorReviews = () => {
  const [data, setData] = useState<OperatorReviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getOperatorReviews();
      setData(res);
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error };
};
