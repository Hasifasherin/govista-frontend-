export interface Tour {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  duration: number;
  maxGroupSize: number;
  category: { _id: string; name: string } | null;
  availableDates: string[];
  image: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  averageRating: number;
  reviewsCount: number;
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface TourFilters {
  title?: string;
  location?: string;
  destination?: string;
  category?: string;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
  // Pagination
  page?: number;
  limit?: number;

  // Extra (future-safe)
  duration?: number;
  isFeatured?: boolean;
}

export interface OperatorTour extends Tour {
  bookingsCount: number;
}