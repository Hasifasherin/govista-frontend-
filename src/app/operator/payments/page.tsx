"use client";

import { useEffect, useState } from "react";
import {
  getOperatorPayments,
  refundPayment
} from "../../../services/paymentService";
import { Booking } from "../../../types/booking";
import { Payment } from "../../../types/payment";
import { FiRefreshCw, FiXCircle } from "react-icons/fi";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] =
    useState<"all" | "paid" | "unpaid" | "refunded">("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const bookings: Booking[] = await getOperatorPayments();

      const mapped: Payment[] = bookings.map((b) => ({
        bookingId: b._id,
        customerName: `${b.userId?.firstName || ""} ${
          b.userId?.lastName || ""
        }`.trim(),
        tourTitle: b.tourId?.title || "Unknown Tour",

        // INR — backend already stores correct price
        amount: (b.tourId?.price || 0) * (b.participants || 1),

        paymentStatus: b.paymentStatus ?? "unpaid",
        bookingStatus: b.status,
        paidAt: b.updatedAt
      }));

      setPayments(mapped);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to refund this payment?")) return;

    try {
      await refundPayment(bookingId, "requested_by_operator");
      await fetchPayments();
      alert("Refund initiated successfully");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Refund failed");
    }
  };

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((p) => p.paymentStatus === filter);

  const statusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "refunded":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-gray-600">Track booking payments</p>
        </div>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg"
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {["all", "paid", "unpaid", "refunded"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === f
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading payments...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No payments found
          </div>
        ) : (
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Tour</th>
                <th className="px-6 py-3 text-left">Amount (₹)</th>
                <th className="px-6 py-3 text-left">Payment</th>
                <th className="px-6 py-3 text-left">Booking</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPayments.map((p) => (
                <tr key={p.bookingId}>
                  <td className="px-6 py-4">{p.customerName}</td>
                  <td className="px-6 py-4">{p.tourTitle}</td>
                  <td className="px-6 py-4 font-semibold text-green-700">
                    ₹{p.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${statusBadge(
                        p.paymentStatus
                      )}`}
                    >
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {p.bookingStatus}
                  </td>
                  <td className="px-6 py-4">
                    {p.paymentStatus === "paid" && (
                      <button
                        onClick={() => handleRefund(p.bookingId)}
                        className="flex items-center gap-1 text-red-600 hover:underline text-sm"
                      >
                        <FiXCircle />
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
