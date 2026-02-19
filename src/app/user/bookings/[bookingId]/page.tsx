"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Booking } from "../../../../types/booking";
import { getBookingById } from "../../../../services/adminBookingService";
import PayNowButton from "../../../components/user/PayNowButton";
import { FiCalendar, FiUsers, FiMapPin } from "react-icons/fi";
import { apiRequest } from "../../../../utils/api";

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params?.bookingId as string; // ✅ Must match folder name

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    // ---------------- FETCH BOOKING ----------------
    const fetchBooking = async () => {
        if (!bookingId) return;
        setLoading(true);
        try {
            const data = await getBookingById(bookingId);
            setBooking(data);
        } catch (err: any) {
            console.error("Error fetching booking:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [bookingId]);

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

    // ---------------- CANCEL BOOKING ----------------
    const handleCancel = async () => {
        if (!booking) return;

        try {
            await apiRequest(
                "PUT",
                `/bookings/${bookingId}/cancel`
            );

            await fetchBooking();
            alert("Booking has been cancelled successfully.");
        } catch (err: any) {
            console.error("Error cancelling booking:", err);
            alert(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to cancel booking"
            );
        }
    };

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-semibold text-gray-800 mb-8">
                    Booking Details
                </h1>

                {/* CARD */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                    {/* HEADER */}
                    <div className="p-8 border-b border-gray-100">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {booking.tourId?.title ?? "Tour"}
                        </h2>

                        <div className="flex flex-wrap gap-6 mt-3 text-gray-500 text-sm">
                            <div className="flex items-center gap-2">
                                <FiCalendar />
                                {booking.travelDate
                                    ? new Date(booking.travelDate).toLocaleDateString()
                                    : "N/A"}
                            </div>

                            <div className="flex items-center gap-2">
                                <FiUsers />
                                {booking.participants} {booking.participants > 1 ? "people" : "person"}
                            </div>

                            <div className="flex items-center gap-2">
                                <FiMapPin />
                                {booking.tourId?.location ?? "Unknown"}
                            </div>
                        </div>

                        {/* STATUS BADGES */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${bookingStatusColor[booking.status]}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColor[booking.paymentStatus]}`}>
                                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                            </span>
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

                    {/* ACTIONS */}
                    <div className="p-8 space-y-4">
                        {/* Cancel Booking */}
                        {booking.status === "pending" && (
                            <button
                                onClick={handleCancel}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl transition"
                            >
                                Cancel Booking
                            </button>
                        )}

                        {/* Pay Now */}
                        {booking.status === "accepted" &&
                            booking.paymentStatus === "unpaid" && (
                                <PayNowButton
                                    booking={booking}
                                    onPaymentSuccess={(updatedBooking) => {
                                        setBooking(updatedBooking);
                                        fetchBooking();
                                    }}
                                />
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
