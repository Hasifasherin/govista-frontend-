import { Review, AdminReviewsResponse, OperatorReviewResponse } from "../types/review";
import api from "../utils/api";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// -------------------- ADMIN --------------------
export const getAdminReviews = async (): Promise<AdminReviewsResponse> => {
  const token = localStorage.getItem("adminToken");
  const { data } = await axios.get<AdminReviewsResponse>(`${API_URL}/admin/reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteAdminReview = async (id: string): Promise<void> => {
  const token = localStorage.getItem("adminToken");
  await axios.delete(`${API_URL}/admin/reviews/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// -------------------- OPERATOR --------------------
export const getOperatorReviews = async (): Promise<OperatorReviewResponse> => {
  const { data } = await api.get<OperatorReviewResponse>("/reviews/operator/reviews");
  return data;
};

// -------------------- USER --------------------
export const getTourReviews = async (tourId: string): Promise<Review[]> => {
  const { data } = await api.get<{ reviews: Review[] }>(`/reviews/tour/${tourId}`);
  return data.reviews;
};

export const createReview = async ({
  tourId,
  rating,
  comment,
}: {
  tourId: string;
  rating: number;
  comment: string;
}) => {
  const res = await api.post("/reviews", { tourId, rating, comment });
  return res.data;
};

export const updateReview = async (
  reviewId: string,
  rating?: number,
  comment?: string
): Promise<Review> => {
  const { data } = await api.put<{ review: Review }>(`/reviews/${reviewId}`, { rating, comment });
  return data.review;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await api.delete(`/reviews/${reviewId}`);
};
