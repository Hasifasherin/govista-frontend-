import api from '../utils/api';
import { Tour, TourFilters } from '../types/tour';

export const tourAPI = {
  // Get all tours with pagination
  getTours: (page = 1, limit = 12) =>
    api.get(`/tours?page=${page}&limit=${limit}`),

  // Get single tour
  getTour: (id: string) =>
    api.get(`/tours/${id}`),

  // Search tours with filters
  searchTours: (filters: TourFilters) =>
    api.get('/tours/search', { params: filters }),

  // Check tour availability
  checkAvailability: (tourId: string, date: string) =>
    api.get(`/tours/${tourId}/availability?date=${date}`),

  // Get featured tours ✅ updated route
  getFeaturedTours: () =>
    api.get('/tours/featured'),

  // Get all active categories
  getCategories: () =>
    api.get('/tours/categories'),

   // ✅ Add to wishlist
  addToWishlist: (tourId: string) =>
    api.post("/user/wishlist", { tourId }),
};