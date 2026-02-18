import api, { apiRequest } from '../utils/api';
import {
  Tour,
  Booking,
  Notification,
  OperatorStats,
  User,
} from '../types';

export const authService = {
  login: (email: string, password: string) =>
    apiRequest('POST', '/auth/login', { email, password }),
  
  register: (data: any) =>
    apiRequest('POST', '/auth/register', data),
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
    }
  },
  
  getProfile: () =>
    apiRequest('GET', '/auth/profile'),
};

export const tourService = {
  createTour: (data: FormData) =>
    api.post('/tours', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updateTour: (id: string, data: FormData) =>
    api.put(`/tours/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  deleteTour: (id: string) =>
    apiRequest('DELETE', `/tours/${id}`),
  
  getTours: (page = 1, limit = 12) =>
    apiRequest('GET', `/tours?page=${page}&limit=${limit}`),
  
  getTourById: (id: string) =>
    apiRequest('GET', `/tours/${id}`),
  
  searchTours: (filters: {
    title?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    date?: string;
    category?: string;
  }) =>
    apiRequest('GET', '/tours/search', null, { params: filters }),
  
  checkAvailability: (tourId: string, date: string) =>
    apiRequest('GET', `/tours/${tourId}/availability?date=${date}`),
};

export const bookingService = {
  createBooking: (tourId: string, bookingDate: string, participants: number) =>
    apiRequest('POST', '/bookings', { tourId, bookingDate, participants }),
  
  getUserBookings: () =>
    apiRequest('GET', '/bookings/my-bookings'),
  
  getOperatorBookings: () =>
    apiRequest('GET', '/bookings/operator'),
  
  updateBookingStatus: (bookingId: string, status: 'accepted' | 'rejected') =>
    apiRequest('PUT', `/bookings/${bookingId}/status`, { status }),
  
  cancelBooking: (bookingId: string) =>
    apiRequest('PUT', `/bookings/${bookingId}/cancel`),
};

export const operatorService = {
  getMyTours: () =>
    apiRequest('GET', '/operator/tours'),
  
  getMyBookings: () =>
    apiRequest('GET', '/operator/bookings'),
  
  getDashboardStats: async (): Promise<OperatorStats> => {
    try {
      const [toursResponse, bookingsResponse] = await Promise.all([
        operatorService.getMyTours(),
        operatorService.getMyBookings(),
      ]);
      
      const tours = toursResponse.data || [];
      const bookings = bookingsResponse.data || [];
      
      const totalTours = tours.length;
      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(
        (b: Booking) => b.status === 'pending'
      ).length;
      const activeTours = tours.filter(
        (t: Tour) => t.isActive && t.status === 'approved'
      ).length;
      const cancelledBookings = bookings.filter(
        (b: Booking) => b.status === 'cancelled'
      ).length;
      
      let totalRevenue = 0;
      bookings.forEach((booking: Booking) => {
        if (booking.status === 'accepted' && typeof booking.tourId !== 'string') {
          const tour = booking.tourId as Tour;
          totalRevenue += tour.price * booking.participants;
        }
      });
      
      return {
        totalTours,
        totalBookings,
        pendingBookings,
        totalRevenue,
        activeTours,
        cancelledBookings,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalTours: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0,
        activeTours: 0,
        cancelledBookings: 0,
      };
    }
  },
  
  updateBookingStatus: (bookingId: string, status: 'accepted' | 'rejected') =>
    bookingService.updateBookingStatus(bookingId, status),
};

export const notificationService = {
  getMyNotifications: () =>
    apiRequest('GET', '/notifications'),
  
  markAsRead: (notificationId: string) =>
    apiRequest('PUT', `/notifications/${notificationId}/read`),
};

export const userService = {
  updateProfile: (data: Partial<User>) =>
    apiRequest('PUT', '/users/profile', data),
  
  addToWishlist: (tourId: string) =>
    apiRequest('POST', '/users/wishlist', { tourId }),
  
  removeFromWishlist: (tourId: string) =>
    apiRequest('DELETE', `/users/wishlist/${tourId}`),
  
  getWishlist: () =>
    apiRequest('GET', '/users/wishlist'),
  
  getBookingHistory: () =>
    apiRequest('GET', '/users/bookings'),
};

export { api, apiRequest };