"use client";

import React, { useState } from "react";
import { Booking } from "../../../types/booking";
import { createPaymentIntent, confirmPayment } from "../../../services/paymentService";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

interface PayNowButtonProps {
  booking: Booking;
  onPaymentSuccess: (updatedBooking: Booking) => void;
}

export default function PayNowButton({ booking, onPaymentSuccess }: PayNowButtonProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    try {
      setLoading(true);
      setMessage(null);

      // 1️⃣ Create Payment Intent
      const { clientSecret } = await createPaymentIntent(booking._id);

      // 2️⃣ Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setMessage(result.error.message || "Payment failed");
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        // 3️⃣ Confirm with backend
        const response = await confirmPayment(booking._id);

        if (response.booking?.paymentStatus === "paid") {
          setMessage("🎉 Payment successful!");
          onPaymentSuccess(response.booking);
        }
      }
    } catch (err: any) {
      setMessage("Payment error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <CardElement className="p-3 border rounded-lg" />

      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {message && <p className="text-red-600">{message}</p>}
    </div>
  );
}
