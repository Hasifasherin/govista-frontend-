import { apiRequest } from "../utils/api";
import { AdminBooking, Booking } from "../types/booking";

// ================== ADMIN BOOKINGS ==================

// Get all admin bookings for a specific month
export const getAdminBookings = async (month: string): Promise<AdminBooking[]> => {
  const data = await apiRequest<{ bookings: AdminBooking[] }>(
    "GET",
    `/admin/bookings?month=${month}`
  );
  return data.bookings;
};

// ================== OPERATOR BOOKINGS ==================

// Get operator bookings
export const getOperatorBookings = async (): Promise<Booking[]> => {
  const data = await apiRequest<{ bookings: Booking[] }>(
    "GET",
    "/operator/bookings"
  );
  return data.bookings;
};


// Update booking status (Accept / Reject / Cancel)
export const updateBookingStatus = async (
  bookingId: string,
  status: "pending" | "accepted" | "rejected" | "cancelled"
): Promise<Booking> => {
  const data = await apiRequest<{ booking: Booking }>(
    "PUT",
    `/operator/bookings/${bookingId}/status`,
    { status }
  );
  return data.booking;
};

// Get specific booking details
export const getBookingById = async (bookingId: string): Promise<Booking> => {
  const data = await apiRequest<{ booking: Booking }>(
    "GET",
    `/operator/bookings/${bookingId}`
  );
  return data.booking;
};

// ================== PAYMENT ==================

// Update payment status for a booking
export const updateBookingPaymentStatus = async (
  bookingId: string,
  paymentStatus: "unpaid" | "paid" | "refunded"
): Promise<Booking> => {
  const data = await apiRequest<{ booking: Booking }>(
    "PUT",
    `/operator/bookings/${bookingId}/payment-status`,
    { paymentStatus }
  );
  return data.booking;
};

// Confirm payment for a booking (calls backend API route)
export const confirmBookingPayment = async (bookingId: string): Promise<Booking> => {
  const data = await apiRequest<{ booking: Booking }>(
    "POST",
    `/api/payments/confirm/${bookingId}` // frontend API route
  );
  return data.booking;
};
