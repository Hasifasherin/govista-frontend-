"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Booking } from "../../../types/booking";
import { getOperatorPayments, createPaymentIntent, confirmPayment } from "../../../services/paymentService";
import { apiRequest } from "../../../utils/api";

export default function UserBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);

  // ---------------- FETCH USER BOOKINGS ----------------
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiRequest<{ bookings: Booking[] }>("GET", "/user/bookings");
        setBookings(res.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ---------------- HANDLE PAYMENT ----------------
  const handlePayment = async (bookingId: string) => {
    try {
      setPaymentLoadingId(bookingId);

      // 1️⃣ Create payment intent
      await createPaymentIntent(bookingId);

      // 2️⃣ Confirm payment
      const paymentRes = await confirmPayment(bookingId);

      if (paymentRes.status === "paid") {
        alert("Payment successful!");
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, paymentStatus: "paid" } : b
          )
        );
      } else {
        alert("Payment pending. Please check again later.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setPaymentLoadingId(null);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading your bookings...</p>;

  if (!bookings.length)
    return <p className="text-center mt-10">You have no bookings yet.</p>;

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>

      {bookings.map((booking) => {
        const pricePerPerson = booking.tourId?.price ?? 0;
        const totalPrice = pricePerPerson * booking.participants;

        return (
          <div
            key={booking._id}
            className="border rounded-xl p-6 shadow-lg flex flex-col lg:flex-row justify-between items-start gap-4"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">{booking.tourId?.title ?? "Tour"}</h2>
              <p className="text-gray-600 mb-1">
                Date: {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-gray-600 mb-1">Participants: {booking.participants}</p>
              <p className="text-gray-600 mb-1">Price per person: ${pricePerPerson}</p>
              <p className="text-gray-800 font-semibold mb-2">Total: ${totalPrice}</p>
              <p className="text-gray-600 mb-1">
                Booking Status:{" "}
                <span className={`font-semibold ${
                  booking.status === "accepted"
                    ? "text-green-600"
                    : booking.status === "rejected"
                    ? "text-red-600"
                    : booking.status === "pending"
                    ? "text-yellow-600"
                    : booking.status === "cancelled"
                    ? "text-gray-500"
                    : "text-blue-600"
                }`}>
                  {booking.status.toUpperCase()}
                </span>
              </p>
              <p className="text-gray-600 mb-1">
                Payment Status:{" "}
                <span className={`font-semibold ${
                  booking.paymentStatus === "paid"
                    ? "text-blue-600"
                    : booking.paymentStatus === "refunded"
                    ? "text-purple-600"
                    : "text-red-600"
                }`}>
                  {booking.paymentStatus.toUpperCase()}
                </span>
              </p>
            </div>

            {/* Pay Now Button */}
            {booking.status === "accepted" && booking.paymentStatus === "unpaid" && (
              <button
                onClick={() => handlePayment(booking._id)}
                disabled={paymentLoadingId === booking._id}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 self-start"
              >
                {paymentLoadingId === booking._id ? "Processing..." : "Pay Now"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
