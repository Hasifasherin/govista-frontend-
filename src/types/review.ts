export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Tour {
  _id: string;
  title: string;
  location?: string;
  price?: number;
}

export interface Review {
  _id: string;
  tourId: Tour | null;
  userId: User | null;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;

  userId: {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  tourId: {
    _id?: string;
    title: string;
    location?: string;
    price?: number;
  };
}

export interface OperatorReviewStats {
  totalReviews: number;
  averageRating: string;
  complaintsCount: number;
}

// Export this for your service
export interface OperatorReviewResponse {
  stats: OperatorReviewStats;
  reviews: OperatorReview[];
}

// Optional: Admin
export interface AdminReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { _id: number; count: number }[];
}
