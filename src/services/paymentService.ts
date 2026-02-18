// frontend/services/paymentService.ts
import { apiRequest } from "../utils/api";
import { Booking } from "../types/booking";

// =========================
// TYPES
// =========================

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret: string;
  paymentIntentId: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  status: string;
  booking: Booking;
}

// =========================
// USER PAYMENT FUNCTIONS
// =========================

// Create Payment Intent (Stripe)
export const createPaymentIntent = async (
  bookingId: string
): Promise<PaymentIntentResponse> => {
  try {
    const response = await apiRequest<PaymentIntentResponse>(
      "POST",
      "/payments/create-intent",
      { bookingId }
    );

    return response;
  } catch (err: any) {
    console.error("Error creating payment intent:", err);
    throw new Error(
      err.response?.data?.message || "Failed to create payment intent"
    );
  }
};

// Confirm Payment
export const confirmPayment = async (
  bookingId: string
): Promise<ConfirmPaymentResponse> => {
  try {
    const response = await apiRequest<ConfirmPaymentResponse>(
      "POST",
      `/payments/confirm/${bookingId}`
    );

    return response;
  } catch (err: any) {
    console.error("Error confirming payment:", err);
    throw new Error(
      err.response?.data?.message || "Failed to confirm payment"
    );
  }
};

// Check Payment Status
export const checkPaymentStatus = async (
  bookingId: string
): Promise<ConfirmPaymentResponse> => {
  try {
    const response = await apiRequest<ConfirmPaymentResponse>(
      "GET",
      `/payments/status/${bookingId}`
    );

    return response;
  } catch (err: any) {
    console.error("Error checking payment status:", err);
    throw new Error(
      err.response?.data?.message || "Failed to check payment status"
    );
  }
};

// =========================
// OPERATOR / ADMIN FUNCTIONS
// =========================

export const getOperatorPayments = async (): Promise<Booking[]> => {
  try {
    const data = await apiRequest<{ bookings: Booking[] }>(
      "GET",
      "/operator/bookings"
    );
    return data.bookings;
  } catch (err: any) {
    console.error("Error fetching operator payments:", err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch operator payments"
    );
  }
};

export const refundPayment = async (
  bookingId: string,
  reason?: string
) => {
  try {
    const data = await apiRequest("POST", "/payments/refund", {
      bookingId,
      reason,
    });
    return data;
  } catch (err: any) {
    console.error("Error creating refund:", err);
    throw new Error(err.response?.data?.message || "Failed to refund payment");
  }
};
