"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tour } from "../../../../types/tour";
import { apiRequest } from "../../../../utils/api";
import { FiCalendar, FiUsers, FiMapPin } from "react-icons/fi";

export default function CreateBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tourId = searchParams.get("tourId") || "";
  const selectedDate = searchParams.get("date") || "";
  const people = Number(searchParams.get("people")) || 1;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [dateError, setDateError] = useState("");

  // ---------------- FETCH TOUR ----------------
  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) return;

      try {
        const res = await apiRequest<{ tour: Tour }>(
          "GET",
          `/tours/${tourId}`
        );
        setTour(res.tour);
      } catch (err) {
        console.error("Failed to fetch tour:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  const totalPrice = (tour?.price ?? 0) * people;

  // ---------------- CREATE BOOKING ONLY ----------------
  const handleBooking = async () => {
    if (!tour) return;

    if (!selectedDate) {
      setDateError("Please select a date before booking");
      return;
    } else {
      setDateError("");
    }

    try {
      setBookingLoading(true);

      // 1️⃣ Create booking (status = pending)
      const bookingRes = await apiRequest<{ booking: { _id: string } }>(
        "POST",
        "/bookings",
        {
          tourId: tour._id,
          travelDate: selectedDate,
          participants: people,
        }
      );

      const newBookingId = bookingRes.booking._id;

      alert("Booking request sent! Waiting for operator approval.");

      // 2️⃣ Redirect to booking details page
      router.push(`/user/bookings/${newBookingId}`);
    } catch (err: any) {
      console.error("Booking failed:", err);
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // ---------------- UI ----------------
  if (loading)
    return <p className="text-center mt-10">Loading booking details...</p>;

  if (!tour)
    return <p className="text-center mt-10">Tour not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 space-y-12 font-sans">
      <h1 className="text-3xl font-bold mb-6">Confirm Your Booking</h1>

      <div className="border rounded-xl p-6 shadow-lg space-y-4">
        <h2 className="text-xl font-semibold">{tour.title}</h2>

        <div className="flex items-center gap-4 text-gray-600">
          <span className="flex items-center gap-1">
            <FiCalendar />
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString()
              : "No date selected"}
          </span>

          <span className="flex items-center gap-1">
            <FiUsers />
            {people} {people > 1 ? "people" : "person"}
          </span>

          <span className="flex items-center gap-1">
            <FiMapPin />
            {tour.location}
          </span>
        </div>

        <p className="text-gray-600">
          Price per person: ${tour.price}
        </p>

        <p className="text-gray-800 font-semibold">
          Total: ${totalPrice}
        </p>

        {dateError && (
          <p className="text-red-500 text-sm">{dateError}</p>
        )}

        <button
          onClick={handleBooking}
          disabled={bookingLoading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {bookingLoading ? "Processing..." : "Request Booking"}
        </button>
      </div>
    </div>
  );
}
