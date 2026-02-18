export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  dob: string;
  password?: string;
  role: "user" | "operator" | "admin";
  wishlist?: string[];
  isBlocked?: boolean;
  isApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tour {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  duration: number;
  maxGroupSize: number;
  category: "adventure" | "cultural" | "nature" | "food" | "historical" | "sports" | "relaxation";
  availableDates: string[];
  image: string;
  createdBy: string | User;
  averageRating: number;
  reviewsCount: number;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  tourId: string | Tour;
  userId: string | User;
  bookingDate: string;
  participants: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  user: string | User;
  title: string;
  message: string;
  type: "booking" | "payment" | "system";
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  page?: number;
  total?: number;
}

export interface OperatorStats {
  totalTours: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  activeTours: number;
  cancelledBookings: number;
}