"use client";

import React, { useEffect, useState } from "react";
import { Booking } from "../../../types/booking";
import { apiRequest } from "../../../utils/api";
import PayNowButton from "../../components/user/PayNowButton";

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH USER BOOKINGS ----------------
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiRequest<{ bookings: Booking[] }>(
          "GET",
          "/bookings/my-bookings" // ✅ Correct backend route
        );
        setBookings(res.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ---------------- HANDLE PAYMENT SUCCESS ----------------
  const handlePaymentSuccess = (updatedBooking: Booking) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === updatedBooking._id ? updatedBooking : b))
    );
  };

  // ---------------- LOADING / EMPTY STATES ----------------
  if (loading)
    return <p className="text-center mt-10">Loading your bookings...</p>;

  if (!bookings.length)
    return <p className="text-center mt-10">You have no bookings yet.</p>;

  // ---------------- STYLING ----------------
  const bookingStatusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
    cancelled: "bg-gray-100 text-gray-600",
    completed: "bg-blue-100 text-blue-700",
  };

  const paymentStatusColor = {
    unpaid: "bg-red-100 text-red-600",
    paid: "bg-green-100 text-green-700",
    refunded: "bg-purple-100 text-purple-700",
  };

  // ---------------- RENDER BOOKINGS ----------------
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
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                {booking.tourId?.title ?? "Tour"}
              </h2>
              <p className="text-gray-600">
                Date:{" "}
                {booking.travelDate
                  ? new Date(booking.travelDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-gray-600">
                Participants: {booking.participants}
              </p>
              <p className="text-gray-600">Price per person: ${pricePerPerson}</p>
              <p className="text-gray-800 font-semibold">Total: ${totalPrice}</p>

              {/* Booking Status */}
              <p className="text-gray-600">
                Booking Status:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${bookingStatusColor[booking.status]}`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </p>

              {/* Payment Status */}
              <p className="text-gray-600">
                Payment Status:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${paymentStatusColor[booking.paymentStatus]}`}
                >
                  {booking.paymentStatus.charAt(0).toUpperCase() +
                    booking.paymentStatus.slice(1)}
                </span>
              </p>
            </div>

            {/* Pay Now Button */}
            {booking.status === "accepted" && booking.paymentStatus === "unpaid" && (
              <PayNowButton
                booking={booking}
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
