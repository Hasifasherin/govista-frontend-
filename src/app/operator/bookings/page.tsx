"use client";

import { useState, useEffect } from "react";
import {
  getOperatorBookings,
  updateBookingStatus,
} from "../../../services/adminBookingService";
import { tourAPI } from "../../../services/tour";
import { Booking } from "../../../types/booking";
import {
  FiEye,
  FiCheck,
  FiX,
  FiUsers,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiCalendar,
} from "react-icons/fi";

export default function OperatorBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ---------------- FETCH TOUR IF NOT POPULATED ---------------- */
  const getTourById = async (id: string) => {
    try {
      const res = await tourAPI.getTour(id);
      return res.data;
    } catch (err) {
      console.error("Error fetching tour:", err);
      return null;
    }
  };

  /* ---------------- FETCH BOOKINGS ---------------- */
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getOperatorBookings();

      const bookingsWithTours = await Promise.all(
        (data || []).map(async (b: Booking) => {
          if (typeof b.tourId === "string") {
            const tour = await getTourById(b.tourId);
            return { ...b, tourId: tour };
          }
          return b;
        })
      );

      setBookings(bookingsWithTours);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const handleUpdateStatus = async (
    bookingId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      const updated = await updateBookingStatus(
        bookingId,
        status
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, status: updated.status }
            : b
        )
      );

      setStatusMessage({
        type: "success",
        text: `Booking ${status} successfully`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Failed to update booking",
      });
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredBookings = bookings.filter((b) => {
    if (filter !== "all" && b.status !== filter)
      return false;

    if (search) {
      const tourTitle =
        b.tourId?.title?.toLowerCase() || "";
      const userName = `${b.userId?.firstName || ""} ${
        b.userId?.lastName || ""
      }`.toLowerCase();

      return (
        tourTitle.includes(search.toLowerCase()) ||
        userName.includes(search.toLowerCase())
      );
    }

    return true;
  });

  /* ---------------- HELPERS ---------------- */
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString()
      : "-";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* ---------------- STATS ---------------- */
  const stats = {
    total: bookings.length,
    pending: bookings.filter(
      (b) => b.status === "pending"
    ).length,
    accepted: bookings.filter(
      (b) => b.status === "accepted"
    ).length,
    revenue: bookings
      .filter((b) => b.status === "accepted")
      .reduce((sum, b) => {
        const price =
          typeof b.tourId === "object"
            ? b.tourId?.price || 0
            : 0;

        return sum + price * (b.participants || 0);
      }, 0),
  };

  /* ========================================================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Booking Management
          </h1>
          <p className="text-gray-600">
            Manage and respond to booking requests
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* STATUS MESSAGE */}
      {statusMessage && (
        <div className="p-3 rounded-lg bg-gray-100 text-center">
          {statusMessage.text}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Bookings"
          value={stats.total}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
        />
        <StatCard
          label="Accepted"
          value={stats.accepted}
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(stats.revenue)}
        />
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 border rounded-xl flex gap-4">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">
                Tour & Customer
              </th>
              <th className="p-3">
                Date
              </th>
              <th className="p-3">
                Participants
              </th>
              <th className="p-3">
                Price
              </th>
              <th className="p-3">
                Status
              </th>
              <th className="p-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((b) => {
              const tour =
                typeof b.tourId === "object"
                  ? b.tourId
                  : null;

              const total =
                (tour?.price || 0) *
                (b.participants || 0);

              return (
                <tr
                  key={b._id}
                  className="border-t"
                >
                  <td className="p-3">
                    <p className="font-medium">
                      {tour?.title ||
                        "Unknown Tour"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {b.userId?.firstName}{" "}
                      {b.userId?.lastName}
                    </p>
                  </td>

                  <td className="p-3 text-center">
                    {formatDate(
                      b.bookingDate
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {b.participants}
                  </td>

                  {/* PRICE */}
                  <td className="p-3">
                    <p className="font-semibold text-green-700">
                      {formatCurrency(total)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(
                        tour?.price || 0
                      )}{" "}
                      / person
                    </p>
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex gap-2">
                    {b.status ===
                      "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              b._id,
                              "accepted"
                            )
                          }
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              b._id,
                              "rejected"
                            )
                          }
                          className="px-3 py-1 bg-red-100 text-red-700 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() =>
                        setSelectedBooking(
                          b
                        )
                      }
                      className="p-2 bg-gray-100 rounded"
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[500px]">
            <h2 className="text-xl font-bold mb-4">
              Booking Details
            </h2>

            <p>
              Tour:{" "}
              {
                selectedBooking
                  .tourId?.title
              }
            </p>
            <p>
              Participants:{" "}
              {
                selectedBooking.participants
              }
            </p>

            <p>
              Total:{" "}
              {formatCurrency(
                (selectedBooking
                  .tourId?.price ||
                  0) *
                  selectedBooking.participants
              )}
            </p>

            <button
              onClick={() =>
                setSelectedBooking(
                  null
                )
              }
              className="mt-4 px-4 py-2 border rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */
function StatCard({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="bg-white p-4 border rounded-xl">
      <p className="text-sm text-gray-500">
        {label}
      </p>
      <p className="text-xl font-bold">
        {value}
      </p>
    </div>
  );
}
