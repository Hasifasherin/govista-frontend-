"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { operatorAPI } from "../../../services/operator";
import { OperatorTour } from "../../../types/operator";
import TourTopBar from "../../components/tour/TourTopBar";
import TourCard from "../../components/tour/TourCard";
import AddTourForm from "../../components/tour/AddTourForm";
import { FiAlertCircle, FiFolderPlus } from "react-icons/fi";

// ---------------------- Props for TourTopBar ----------------------
type FilterType = "all" | "active" | "pending" | "inactive";

export default function OperatorToursPage() {
  const router = useRouter();
  const [tours, setTours] = useState<OperatorTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTour, setEditingTour] = useState<OperatorTour | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Replace with actual token from auth context or session
  const token = localStorage.getItem("token") || "";

  /* ---------------- FETCH TOURS ---------------- */
  useEffect(() => {
    fetchTours();
  }, [token]);

  const fetchTours = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await operatorAPI.getMyTours(token); // ✅ pass token
      if (response.data.success) {
        setTours(response.data.tours || []); // ✅ use .data
      } else {
        setError("Failed to load tours. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load tours. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CREATE / EDIT ---------------- */
  const handleAddTourClick = () => {
    setEditingTour(null);
    setShowForm(true);
  };

  const handleTourAdded = async () => {
    setShowForm(false);
    await fetchTours();
  };

  const handleEditTour = (tour: OperatorTour) => {
    setEditingTour(tour);
    setShowForm(true);
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteTour = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this tour?")) return;

    try {
      const res = await operatorAPI.deleteTour(id, token); // ✅ pass token
      if (res.data.success) setTours(tours.filter((t) => t._id !== id));
      else setError("Failed to delete tour. Try again.");
    } catch (err: any) {
      setError(err.message || "Failed to delete tour.");
    }
  };

  /* ---------------- FILTER TOURS ---------------- */
  const filteredTours = tours.filter((tour) => {
    if (filter === "all") return true;
    if (filter === "active") return tour.isActive && tour.status === "approved";
    if (filter === "pending") return tour.status === "pending";
    if (filter === "inactive") return !tour.isActive;
    return true;
  });

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <TourTopBar
          filter={filter}
          setFilter={setFilter as (value: string) => void} // ✅ cast to match props
          onAddTourClick={handleAddTourClick}
        />

        {/* ADD / EDIT FORM */}
        {showForm && (
          <AddTourForm
            onClose={() => setShowForm(false)}
            onTourAdded={handleTourAdded}
            editingTour={editingTour} // ✅ should exist in AddTourForm props
          />
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-[var(--green-light)] 
              border-t-[var(--green-primary)] rounded-full animate-spin" />
            <p className="text-gray-600 font-inter">Loading your tours...</p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center 
                justify-center mx-auto mb-6">
                <FiFolderPlus size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">
                No tours found
              </h3>
              <p className="text-gray-600 mb-8 font-inter">
                {filter === "all"
                  ? "You haven't created any tours yet. Get started by creating your first tour!"
                  : `No tours match the "${filter}" filter.`}
              </p>
              {filter === "all" && (
                <button
                  onClick={handleAddTourClick}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--green-primary)] 
                    to-[var(--green-accent)] text-white font-semibold rounded-xl
                    hover:from-[var(--green-dark)] hover:to-[var(--green-primary)]
                    transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Create Your First Tour
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* STATS */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 font-inter">
                Showing <span className="font-semibold">{filteredTours.length}</span> tours
              </p>
              <p className="text-sm text-gray-600 font-inter">
                Total: <span className="font-semibold">{tours.length}</span> tours
              </p>
            </div>

            {/* TOUR GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <TourCard
                  key={tour._id}
                  tour={tour}
                  onView={() => router.push(`/tours/${tour._id}`)}
                  onEdit={() => handleEditTour(tour)}
                  onDelete={() => handleDeleteTour(tour._id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
