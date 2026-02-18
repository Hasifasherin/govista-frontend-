"use client";

import { useState, useEffect } from "react";
import { getOperatorBookings, updateBookingStatus } from "../../../services/adminBookingService";
import { Booking } from "../../../types/booking";
import {
  FiEye,
  FiCheck,
  FiX,
  FiCalendar,
  FiUsers,
  FiSearch,
  FiDownload,
  FiRefreshCw
} from "react-icons/fi";

export default function OperatorBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getOperatorBookings();
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateStatus = async (
    bookingId: string,
    status: "accepted" | "rejected" | "cancelled"
  ) => {
    if (!bookingId) {
      setStatusMessage({ type: "error", text: "Invalid booking ID" });
      return;
    }

    try {
      const updatedBooking = await updateBookingStatus(bookingId,"accepted");

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: updatedBooking.status } : b
        )
      );

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: updatedBooking.status });
      }

      setStatusMessage({ type: "success", text: `Booking ${status} successfully! ✅` });
    } catch (error: any) {
      console.error("Error updating booking:", error);

      const msg =
        error.response?.data?.message ||
        `Booking not found or invalid request (ID: ${bookingId})`;
      setStatusMessage({ type: "error", text: msg });
    }
  };



  const filteredBookings = bookings.filter((booking) => {
    if (filter !== "all" && booking.status !== filter) return false;
    if (search) {
      const tourTitle = booking.tourId?.title?.toLowerCase() || "";
      const customerName = `${booking.userId?.firstName || ""} ${booking.userId?.lastName || ""}`.toLowerCase();
      return tourTitle.includes(search.toLowerCase()) || customerName.includes(search.toLowerCase());
    }
    return true;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = [
    { value: "all", label: "All Bookings" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    accepted: bookings.filter((b) => b.status === "accepted").length,
    revenue: bookings
      .filter((b) => b.status === "accepted")
      .reduce((sum, booking) => sum + (booking.tourId?.price || 0) * booking.participants, 0)
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Manage and respond to booking requests</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FiRefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>
      {/* STATUS MODAL */}
      {statusMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center">
            <h3 className={`text-lg font-semibold mb-2 ${statusMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {statusMessage.type === 'success' ? 'Success' : 'Error'}
            </h3>
            <p className="text-gray-700 mb-4">{statusMessage.text}</p>
            <button
              onClick={() => setStatusMessage(null)}
              className={`px-6 py-2 rounded-lg font-medium ${statusMessage.type === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiCalendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <FiUsers className="text-amber-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Accepted</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.accepted}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FiCheck className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.revenue)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <FiDownload className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by tour name or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${filter === option.value
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings found</h3>
              <p className="text-gray-500">
                {search || filter !== "all"
                  ? "Try changing your search or filter criteria"
                  : "You don't have any bookings yet"}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour & Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manage Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const tour = booking.tourId;
                  const user = booking.userId;

                  return (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      {/* Tour & Customer */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{tour.title || "Unknown Tour"}</p>
                          <div className="mt-1">
                            <p className="text-sm text-gray-600">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Date & Participants */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{formatDate(booking.bookingDate)}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {booking.participants} participant{booking.participants > 1 ? "s" : ""}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div className="text-lg font-semibold text-green-700">
                          {formatCurrency((tour.price || 0) * booking.participants)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(tour.price || 0)} per person
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>

                      {/* Manage Status */}
                      <td className="px-6 py-4">
                        {booking.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  await handleUpdateStatus(booking._id, "accepted");
                                } catch {
                                  alert("Failed to update status");
                                }
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await handleUpdateStatus(booking._id, "rejected");
                                } catch {
                                  alert("Failed to update status");
                                }
                              }}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${booking.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        )}
                      </td>




                      {/* Actions */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          <FiEye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* TOUR & CUSTOMER INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Tour Information</h4>
                    <p className="text-lg font-semibold text-gray-900">{selectedBooking.tourId.title}</p>
                    <p className="text-gray-600">{selectedBooking.tourId.location}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
                    <p className="text-lg font-semibold text-gray-900">{selectedBooking.userId.firstName} {selectedBooking.userId.lastName}</p>
                    <p className="text-gray-600">{selectedBooking.userId.email}</p>
                  </div>
                </div>

                {/* DATE, PARTICIPANTS, TOTAL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Booking Date</h4>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(selectedBooking.bookingDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Participants</h4>
                    <p className="text-lg font-semibold text-gray-900">{selectedBooking.participants} people</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Total Amount</h4>
                    <p className="text-lg font-semibold text-green-700">{formatCurrency((selectedBooking.tourId.price || 0) * selectedBooking.participants)}</p>
                  </div>
                </div>

                {/* STATUS & BOOKING ID */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Booking ID</h4>
                  <p className="text-gray-900 font-mono">{selectedBooking._id}</p>
                </div>

                {/* MODAL ACTIONS */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {selectedBooking.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedBooking._id, "accepted");
                          setSelectedBooking(null);
                        }}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Accept Booking
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedBooking._id, "rejected");
                          setSelectedBooking(null);
                        }}
                        className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        Reject Booking
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
