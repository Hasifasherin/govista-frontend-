"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Booking } from "../../../../types/booking";
import { apiRequest } from "../../../../utils/api";
import PayNowButton from "../../../components/user/PayNowButton";
import { FiCalendar, FiUsers, FiMapPin } from "react-icons/fi";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const [existsModal, setExistsModal] = useState<{
    show: boolean;
    bookingId?: string;
  }>({ show: false });

  // ---------------- FETCH BOOKING ----------------
  const fetchBooking = async () => {
    try {
      const res = await apiRequest<{ booking: Booking }>(
        "GET",
        `/user/bookings/${id}`
      );

      setBooking(res.booking);

      // Show modal only if still pending
      if (
        res.booking.status === "pending" &&
        res.booking.paymentStatus === "unpaid"
      ) {
        setShowPendingModal(true);
      }
    } catch (err: any) {
      if (err?.response?.data?.booking) {
        setExistsModal({
          show: true,
          bookingId: err.response.data.booking._id,
        });
      } else {
        console.error("Error fetching booking:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchBooking();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading booking details...
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Booking not found
      </div>
    );

  const pricePerPerson = booking.tourId?.price ?? 0;
  const totalPrice = pricePerPerson * booking.participants;

  // ---------------- STATUS COLORS ----------------
  const bookingStatusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
    confirmed: "bg-blue-100 text-blue-700",
  };

  const paymentStatusColor = {
    unpaid: "bg-red-100 text-red-600",
    paid: "bg-green-100 text-green-700",
    refunded: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Booking Details
        </h1>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* HEADER */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900">
              {booking.tourId?.title ?? "Tour"}
            </h2>

            <div className="flex flex-wrap gap-6 mt-5 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <FiCalendar />
                {booking.travelDate
                  ? new Date(booking.travelDate).toLocaleDateString()
                  : "N/A"}
              </div>

              <div className="flex items-center gap-2">
                <FiUsers />
                {booking.participants}{" "}
                {booking.participants > 1 ? "people" : "person"}
              </div>

              <div className="flex items-center gap-2">
                <FiMapPin />
                {booking.tourId?.location ?? "Unknown"}
              </div>
            </div>
          </div>

          {/* PRICING */}
          <div className="bg-gray-50 px-8 py-6 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Price per person</span>
              <span>${pricePerPerson}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          {/* STATUS + PAYMENT */}
          <div className="p-8 space-y-6">

            {/* Booking Status */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Booking Status</span>
              <span
                className={`px-4 py-1.5 text-xs font-semibold rounded-full ${
                  bookingStatusColor[
                    booking.status as keyof typeof bookingStatusColor
                  ] || "bg-gray-100 text-gray-600"
                }`}
              >
                {booking.status.toUpperCase()}
              </span>
            </div>

            {/* Payment Status */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Payment Status</span>
              <span
                className={`px-4 py-1.5 text-xs font-semibold rounded-full ${
                  paymentStatusColor[
                    booking.paymentStatus as keyof typeof paymentStatusColor
                  ] || "bg-gray-100 text-gray-600"
                }`}
              >
                {booking.paymentStatus.toUpperCase()}
              </span>
            </div>

            {/* PAY BUTTON */}
            {booking.status === "accepted" &&
              booking.paymentStatus === "unpaid" && (
                <div className="pt-6">
                  <PayNowButton
                    booking={booking}
                    onPaymentSuccess={(updatedBooking) => {
                      setBooking(updatedBooking);
                      fetchBooking(); // refresh after payment
                    }}
                  />
                </div>
              )}
          </div>
        </div>

        {/* -------- Pending Modal -------- */}
        {showPendingModal && (
          <ProfessionalModal
            title="Booking Request Sent"
            message="Your booking request has been sent to the operator. Please wait for approval before making the payment."
            primaryText="Continue"
            onPrimary={() => setShowPendingModal(false)}
          />
        )}

        {/* -------- Booking Exists Modal -------- */}
        {existsModal.show && (
          <ProfessionalModal
            title="Booking Already Exists"
            message="You have already booked this tour for the selected date."
            primaryText="View Booking"
            secondaryText="Close"
            onPrimary={() =>
              router.push(`/user/bookings/${existsModal.bookingId}`)
            }
            onSecondary={() => setExistsModal({ show: false })}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- PROFESSIONAL MODAL ---------------- */

function ProfessionalModal({
  title,
  message,
  primaryText,
  secondaryText,
  onPrimary,
  onSecondary,
}: {
  title: string;
  message: string;
  primaryText: string;
  secondaryText?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-8">

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-3">
          {title}
        </h2>

        <p className="text-gray-600 text-center mb-6 text-sm">
          {message}
        </p>

        <div className="flex gap-3">
          {secondaryText && (
            <button
              onClick={onSecondary}
              className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl transition"
            >
              {secondaryText}
            </button>
          )}

          <button
            onClick={onPrimary}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl transition"
          >
            {primaryText}
          </button>
        </div>
      </div>
    </div>
  );
}
