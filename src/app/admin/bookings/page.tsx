"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { getAdminBookings } from "../../../services/adminBookingService";
import { AdminBooking } from "../../../types/booking";
import BookingStats from "./BookingStats";
import BookingCalendar from "./BookingCalendar";
import BookingTable from "./BookingTable";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, [month]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminBookings(month);
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Booking Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track all bookings by month
            </p>
          </div>

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
            Loading bookings...
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500">
              There are no bookings for {month}.
            </p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && bookings.length > 0 && (
          <>
            <BookingStats bookings={bookings} />
            <BookingCalendar bookings={bookings} month={month} />
            <BookingTable bookings={bookings} />
          </>
        )}
      </div>
    </AdminLayout>
  );
}
