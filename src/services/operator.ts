import api from "../utils/api";
import { OperatorTour, OperatorBooking, OperatorStats } from "../types/operator";
import { Tour } from "../types/tour";

export const operatorAPI = {
  // ================= TOURS =================
  getMyTours: (token: string) =>
    api.get<{ success: boolean; tours: OperatorTour[]; count?: number }>('/operator/tours', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createTour: (data: FormData, token: string) =>
    api.post<{ success: boolean; tour: Tour }>('/tours', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }),

  updateTour: (id: string, data: FormData, token: string) =>
    api.put<{ success: boolean; tour: Tour }>(`/tours/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }),

  deleteTour: (id: string, token: string) =>
    api.delete<{ success: boolean; message: string }>(`/tours/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ✅ GET TOUR CATEGORIES
getTourCategories: (token: string) =>
  api.get<{ success: boolean; categories: { _id: string; name: string }[] }>('/tours/categories', {
    headers: { Authorization: `Bearer ${token}` },
  }),


  // ================= BOOKINGS =================
  getMyBookings: (token: string) =>
    api.get<{ success: boolean; bookings: OperatorBooking[]; count?: number }>('/operator/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateBookingStatus: (bookingId: string, status: 'accepted' | 'rejected', token: string) =>
    api.put<{ success: boolean; booking: OperatorBooking }>(
      `/operator/bookings/${bookingId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    ),

  getBookingDetails: (bookingId: string, token: string) =>
    api.get<{ success: boolean; booking: OperatorBooking }>(`/operator/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ================= DASHBOARD STATS =================
  getDashboardStats: (token: string) =>
    api.get<{ success: boolean; stats: OperatorStats }>('/operator/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ================= OPTIONAL: CHART DATA =================
  getBookingStatistics: (token: string) =>
    api.get<{ success: boolean; stats: OperatorStats }>('/operator/statistics', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ================= PUBLIC TOURS (no token needed) =================
  getAllTours: (page = 1, limit = 10) =>
    api.get<{ success: boolean; tours: Tour[]; count: number; total: number; page: number }>(
      `/tours?page=${page}&limit=${limit}`
    ),

  getTour: (id: string) => api.get<{ success: boolean; tour: Tour }>(`/tours/${id}`),

  searchTours: (filters: any) => api.get<{ success: boolean; tours: Tour[]; count: number }>('/tours/search', { params: filters }),

  checkAvailability: (id: string, date: string) =>
    api.get<{ success: boolean; maxGroupSize: number; bookedSlots: number; availableSlots: number }>(
      `/tours/${id}/availability?date=${date}`
    ),
};
