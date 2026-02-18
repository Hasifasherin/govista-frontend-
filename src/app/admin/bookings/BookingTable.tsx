import { AdminBooking } from "../../../types/booking";

interface Props {
  bookings: AdminBooking[];
}

export default function BookingTable({ bookings }: Props) {
  const getStatusBadge = (status: string) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full";

    switch (status) {
      case "accepted":
        return `${base} bg-green-100 text-green-700`;
      case "rejected":
        return `${base} bg-red-100 text-red-700`;
      case "cancelled":
        return `${base} bg-gray-200 text-gray-700`;
      default:
        return `${base} bg-yellow-100 text-yellow-700`;
    }
  };

  const getPaymentBadge = (status: string) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full";

    switch (status) {
      case "paid":
        return `${base} bg-blue-100 text-blue-700`;
      case "failed":
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
        <p className="text-gray-500">
          There are no bookings available for the selected month.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-gray-600 uppercase text-xs tracking-wide">
            <th className="px-6 py-4 text-left">Date</th>
            <th className="px-6 py-4 text-left">Tour</th>
            <th className="px-6 py-4 text-left">People</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Payment</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {bookings.map((b) => {
            const displayDate = b.travelDate
              ? new Date(b.travelDate).toLocaleDateString()
              : b.bookingDate
              ? new Date(b.bookingDate).toLocaleDateString()
              : "N/A";

            return (
              <tr
                key={b._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-700">
                  {displayDate}
                </td>

                <td className="px-6 py-4 text-gray-800">
                  {b.tourId?.title || "N/A"}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {b.participants || 0}
                </td>

                <td className="px-6 py-4">
                  <span className={getStatusBadge(b.status)}>
                    {b.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className={getPaymentBadge(b.paymentStatus)}>
                    {b.paymentStatus}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
