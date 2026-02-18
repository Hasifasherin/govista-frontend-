"use client";

import { AdminBooking } from "../../../types/booking";

interface Props {
  bookings: AdminBooking[];
  month: string; // format YYYY-MM
}

export default function BookingCalendar({ bookings, month }: Props) {
  // Filter bookings by selected month
  const monthBookings = bookings.filter((booking) => {
    const rawDate = booking.travelDate || booking.bookingDate;
    if (!rawDate) return false;

    const bookingMonth = new Date(rawDate)
      .toISOString()
      .slice(0, 7);

    return bookingMonth === month;
  });

  // Group by date
  const grouped = monthBookings.reduce<Record<string, AdminBooking[]>>(
    (acc, booking) => {
      const rawDate = booking.travelDate || booking.bookingDate;
      if (!rawDate) return acc;

      const dateKey = new Date(rawDate).toISOString().slice(0, 10);

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(booking);

      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  if (sortedDates.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow text-center">
        <h3 className="text-lg font-semibold mb-2">
          No bookings this month
        </h3>
        <p className="text-gray-500">
          There are no bookings for {month}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Monthly Booking Overview
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {sortedDates.map((date) => {
          const formattedDate = new Date(date).toLocaleDateString(
            undefined,
            { day: "numeric", month: "short" }
          );

          return (
            <div
              key={date}
              className="rounded-xl border bg-gray-50 hover:bg-gray-100 transition p-4 text-center"
            >
              <p className="text-sm font-semibold text-gray-800">
                {formattedDate}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {grouped[date].length} bookings
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
