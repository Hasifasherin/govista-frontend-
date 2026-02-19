// frontend/services/paymentService.ts

import { apiRequest } from "../utils/api";
import { Booking } from "../types/booking";

/* =========================
   TYPES
========================= */

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

export interface RefundResponse {
  success: boolean;
  refund?: any;
}

/* =========================
   USER PAYMENT FUNCTIONS
========================= */

/**
 * Create Stripe Payment Intent
 */
export const createPaymentIntent = async (
  bookingId: string
): Promise<PaymentIntentResponse> => {
  const data = await apiRequest<PaymentIntentResponse>(
    "POST",
    "/payments/create-intent",
    { bookingId }
  );

  if (!data?.clientSecret) {
    throw new Error("Failed to create payment intent");
  }

  return data;
};

/**
 * Confirm Payment After Stripe Success
 */
export const confirmPayment = async (
  bookingId: string
): Promise<ConfirmPaymentResponse> => {
  return await apiRequest<ConfirmPaymentResponse>(
    "POST",
    `/payments/confirm/${bookingId}`
  );
};

/**
 * Check Payment Status
 */
export const checkPaymentStatus = async (
  bookingId: string
): Promise<ConfirmPaymentResponse> => {
  return await apiRequest<ConfirmPaymentResponse>(
    "GET",
    `/payments/status/${bookingId}`
  );
};

/* =========================
   OPERATOR / ADMIN
========================= */

/**
 * Get Operator Payments
 */
export const getOperatorPayments = async (): Promise<Booking[]> => {
  const data = await apiRequest<{ bookings: Booking[] }>(
    "GET",
    "/bookings/operator"
  );

  return data?.bookings || [];
};

/**
 * Refund Payment
 */
export const refundPayment = async (
  bookingId: string,
  reason?: string
): Promise<RefundResponse> => {
  return await apiRequest<RefundResponse>(
    "POST",
    "/payments/refund",
    { bookingId, reason }
  );
};
