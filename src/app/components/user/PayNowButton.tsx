// frontend/src/app/components/user/PayNowButton.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Booking } from "../../../types/booking";
import { confirmBookingPayment } from "../../../services/adminBookingService";

interface PayNowButtonProps {
  booking: Booking;
  onPaymentSuccess: (updatedBooking: Booking) => void;
}

export default function PayNowButton({ booking, onPaymentSuccess }: PayNowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handlePayment = async () => {
    // Guard checks
    if (booking.status !== "accepted") {
      setMessage({ type: "error", text: "Booking must be accepted before payment." });
      return;
    }

    if (booking.paymentStatus === "paid") {
      setMessage({ type: "success", text: "✅ Payment already completed." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      // Backend API call to mark as paid
      const updatedBooking = await confirmBookingPayment(booking._id);

      if (updatedBooking.paymentStatus === "paid") {
        setMessage({ type: "success", text: "✅ Payment successful!" });
        onPaymentSuccess(updatedBooking);
      } else {
        setMessage({ type: "error", text: "Payment failed. Please try again." });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Payment error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-clear message after 5s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="space-y-2">
      <button
        onClick={handlePayment}
        disabled={loading || booking.paymentStatus === "paid"}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading
          ? "Processing..."
          : booking.paymentStatus === "paid"
          ? "Paid"
          : "Pay Now"}
      </button>

      {message && (
        <p className={message.type === "error" ? "text-red-600" : "text-green-600"}>
          {message.text}
        </p>
      )}
    </div>
  );
}
