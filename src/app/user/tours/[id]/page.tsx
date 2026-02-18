"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { tourAPI } from "../../../../services/tour";
import { Tour } from "../../../../types/tour";
import { FiMapPin, FiCalendar, FiUsers, FiMessageCircle } from "react-icons/fi";

// ✅ Import the review components
import ReviewSection from "../../../components/review/ReviewSection";

export default function TourDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Ensure tourId is always a string
  const tourId = Array.isArray(id) ? id[0] : id;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateError, setDateError] = useState("");

  const [people, setPeople] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");

  // Availability state
  const [availability, setAvailability] = useState<{ available: boolean; availableSlots: number } | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Fetch Tour
  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) return;
      try {
        const res = await tourAPI.getTour(tourId);
        setTour(res.data.tour);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [tourId]);

  // Check availability whenever date changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!selectedDate || !tourId) return;

      try {
        setCheckingAvailability(true);
        const res = await tourAPI.checkAvailability(tourId, selectedDate);
        setAvailability(res.data);
      } catch (err) {
        console.error(err);
        setAvailability({ available: false, availableSlots: 0 });
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [selectedDate, tourId]);

  // Navigate to chat with operator
  const handleMessage = () => {
    if (!tour?.createdBy?._id) return;

    // Use query param to match UserChatPage
    router.push(`/user/chat?operatorId=${tour.createdBy._id}`);
  };

  // Navigate to Booking Page
  const handleBooking = () => {
    if (!selectedDate) {
      setDateError("Please select a date");
      return;
    }

    if (availability && people > availability.availableSlots) {
      setDateError("Selected people exceeds available slots");
      return;
    }

    // Clear error before navigating
    setDateError("");
    router.push(`/user/bookings/create?tourId=${tour?._id}&date=${selectedDate}&people=${people}`);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!tour) return <p className="text-center mt-10">Tour not found</p>;

  const maxPeople = availability
    ? Math.min(tour.maxGroupSize, availability.availableSlots)
    : tour.maxGroupSize;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Top Image */}
      <div className="w-full h-[420px] rounded-2xl overflow-hidden mb-10">
        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
      </div>

      {/* Layout */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* LEFT — Tour Info */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{tour.title}</h1>

          {tour.category?.name && (
            <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mb-3">
              {tour.category.name}
            </span>
          )}

          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <FiMapPin /> {tour.location}
          </div>

          {/* Operator Card */}
          <div className="border rounded-xl p-5 mb-8 bg-gray-50">
            <h3 className="font-semibold mb-1">Your tour operator</h3>
            <p className="text-sm text-gray-600 mb-3">
              {tour.createdBy?.firstName} {tour.createdBy?.lastName}
            </p>
            <button
              onClick={handleMessage}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <FiMessageCircle /> Send Message
            </button>
          </div>

          {/* Overview */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p className="text-gray-600 leading-relaxed">{tour.description}</p>
          </div>

          {/* Itinerary */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Tour Itinerary</h2>
            <div className="border rounded-xl p-4 text-gray-600">Detailed itinerary will be shown here.</div>
          </div>

          {/* Inclusion / Exclusion */}
          <div className="mb-10 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Inclusions</h3>
              <ul className="list-disc ml-5 text-gray-600">
                <li>Guide</li>
                <li>Transport</li>
                <li>Entry tickets</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Exclusions</h3>
              <ul className="list-disc ml-5 text-gray-600">
                <li>Food</li>
                <li>Personal expenses</li>
              </ul>
            </div>
          </div>

          {/* ✅ Reviews Section */}
          <div className="mb-10">
            <ReviewSection tourId={tour._id} />
          </div>
        </div>

        {/* RIGHT — Booking */}
        <div>
          <div className="border rounded-2xl p-6 shadow-lg sticky top-24">
            <h2 className="text-2xl font-bold mb-4">
              ${tour.price}
              <span className="text-gray-500 text-base"> / person</span>
            </h2>

            <div className="space-y-3 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <FiUsers /> Up to {tour.maxGroupSize} people
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar /> {tour.duration} days
              </div>
            </div>

            {/* Party Size */}
            <div className="mb-4">
              <label className="text-sm font-medium">Party size</label>
              <input
                type="number"
                min={1}
                max={maxPeople}
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
              {availability && <p className="text-xs text-gray-500 mt-1">{availability.availableSlots} slots left</p>}
            </div>

            {/* Date */}
            <div className="mb-6">
              <label className="text-sm font-medium">Select tour date</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              >
                <option value="">Choose date</option>
                {tour.availableDates?.map((d, i) => (
                  <option key={i} value={d}>
                    {new Date(d).toLocaleDateString()}
                  </option>
                ))}
              </select>

              {checkingAvailability && <p className="text-xs text-gray-500 mt-1">Checking availability...</p>}
              {availability && !availability.available && (
                <p className="text-xs text-red-500 mt-1">Fully booked on this date</p>
              )}

              {/* Error message if no date selected */}
              {dateError && <p className="text-xs text-red-500 mt-1">{dateError}</p>}
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
            >
              Request Booking
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">Free cancellation available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
