"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../AdminLayout";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAdminRedux";
import {
  fetchAdminTours,
  updateTourStatus,
  toggleTourActive,
  toggleTourFeatured,
} from "../../../redux/slices/adminToursSlice";

type TabType = "pending" | "approved" | "rejected" | "featured";

export default function AdminToursPage() {
  const dispatch = useAppDispatch();
  const { tours, loading, error, actionLoading } = useAppSelector(
    (state) => state.adminTours
  );

  const [activeTab, setActiveTab] = useState<TabType>("pending");

  // Fetch tours on mount
  useEffect(() => {
    dispatch(fetchAdminTours());
  }, [dispatch]);

  // Group tours by status / featured
  const grouped = useMemo(() => ({
    pending: tours.filter((t) => t.status === "pending"),
    approved: tours.filter((t) => t.status === "approved"),
    rejected: tours.filter((t) => t.status === "rejected"),
    featured: tours.filter((t) => t.isFeatured),
  }), [tours]);

  const visibleTours = grouped[activeTab];

  // Toggle Approve / Reject
  const handleToggleApproval = (tourId: string, currentStatus: "pending" | "approved" | "rejected") => {
    const newStatus = currentStatus === "approved" ? "rejected" : "approved";
    dispatch(updateTourStatus({ id: tourId, status: newStatus }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tours Management</h1>
          <p className="text-gray-500 mt-1">Review, approve and manage all tours</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {([
            ["pending", "Pending"],
            ["approved", "Approved"],
            ["rejected", "Rejected"],
            ["featured", "Featured"],
          ] as [TabType, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-[var(--green-primary)] text-white shadow-md hover:bg-[var(--green-dark)]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label} ({grouped[key].length})
            </button>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-gray-500">Loading tours...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && visibleTours.length === 0 && (
          <div className="text-center py-16 text-gray-500">No tours found.</div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
              <img src={tour.image} alt={tour.title} className="h-48 w-full object-cover" />
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{tour.title}</h3>
                  <p className="text-gray-500 text-sm">{tour.location}</p>
                  <p className="mt-1 font-bold text-gray-900">
                    ₹{tour.price.toLocaleString("en-IN")}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                      tour.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : tour.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {tour.status.toUpperCase()}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggleApproval(tour._id, tour.status)}
                    disabled={actionLoading === tour._id}
                    className={`flex-1 px-3 py-2 rounded-lg text-white text-sm font-semibold transition ${
                      tour.status === "approved"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {actionLoading === tour._id
                      ? "Processing..."
                      : tour.status === "approved"
                      ? "Reject"
                      : "Approve"}
                  </button>

                  <button
                    onClick={() => dispatch(toggleTourActive(tour._id))}
                    disabled={actionLoading === tour._id}
                    className={`px-3 py-2 rounded-lg text-white text-sm font-semibold ${
                      tour.isActive ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    {tour.isActive ? "Active" : "Inactive"}
                  </button>

                  <button
                    onClick={() => dispatch(toggleTourFeatured(tour._id))}
                    disabled={actionLoading === tour._id}
                    className={`px-3 py-2 rounded-lg text-white text-sm font-semibold ${
                      tour.isFeatured ? "bg-purple-600 hover:bg-purple-700" : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {tour.isFeatured ? "Featured" : "Feature"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
