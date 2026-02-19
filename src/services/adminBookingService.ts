// frontend/src/services/adminBookingService.ts
import { apiRequest } from "../utils/api";
import { AdminBooking, Booking } from "../types/booking";

/* ---------------- COMMON TYPES ---------------- */
interface BookingsResponse<T> {
  bookings: T[];
}

interface BookingResponse {
  success: boolean;
  message: string;
  booking: Booking;
}

/* ---------------- ADMIN BOOKINGS ---------------- */
export const getAdminBookings = async (month: string): Promise<AdminBooking[]> => {
  const data = await apiRequest<BookingsResponse<AdminBooking>>(
    "GET",
    "/admin/bookings",
    { month }
  );
  return data.bookings || [];
};

/* ---------------- OPERATOR BOOKINGS ---------------- */
export const getOperatorBookings = async (): Promise<Booking[]> => {
  const data = await apiRequest<BookingsResponse<Booking>>(
    "GET",
    "/bookings/operator"
  );
  return data.bookings || [];
};

/* ---------------- UPDATE BOOKING STATUS ---------------- */
export const updateBookingStatus = async (
  bookingId: string,
  status: "accepted" | "rejected"
): Promise<Booking> => {
  const data = await apiRequest<BookingResponse>(
    "PUT",
    `/bookings/${bookingId}/status`,
    { status }
  );
  return data.booking;
};

/* ---------------- GET BOOKING BY ID ---------------- */
export const getBookingById = async (bookingId: string): Promise<Booking> => {
  const data = await apiRequest<BookingResponse>(
    "GET",
    `/bookings/${bookingId}`
  );
  return data.booking;
};

/* ---------------- CONFIRM PAYMENT (ONE-CLICK) ---------------- */
export const confirmBookingPayment = async (bookingId: string): Promise<Booking> => {
  const data = await apiRequest<BookingResponse>(
    "PUT", // Must be PUT to match backend
    `/bookings/${bookingId}/confirm-payment`
  );

  if (!data.success) {
    throw new Error(data.message || "Payment failed");
  }

  return data.booking;
};
