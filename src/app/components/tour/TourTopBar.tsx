"use client";

import { FiPlus, FiFilter } from "react-icons/fi";

interface TourTopBarProps {
  filter: string;
  setFilter: (value: string) => void;
  onAddTourClick: () => void;
}

const filters = [
  { key: "all", label: "All Tours" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "inactive", label: "Inactive" }
];

export default function TourTopBar({
  filter,
  setFilter,
  onAddTourClick,
}: TourTopBarProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
            Tour Management
          </h1>
          <p className="text-gray-600 mt-1 font-inter">
            Create, manage, and monitor your tour listings
          </p>
        </div>

        {/* Create Tour Button */}
        <button
          onClick={onAddTourClick}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
            bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-accent)]
            hover:from-[var(--green-dark)] hover:to-[var(--green-primary)]
            text-white font-semibold font-poppins shadow-lg
            transition-all duration-200 hover:shadow-xl
            hover:-translate-y-0.5 active:translate-y-0
            min-w-[160px] group"
        >
          <FiPlus size={20} className="transition-transform group-hover:scale-110" />
          <span>Create Tour</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-3">
          <FiFilter className="text-gray-500" size={18} />
          <span className="text-sm font-medium text-gray-700 font-inter">Filter by:</span>
        </div>
        
        <div className="inline-flex flex-wrap gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 font-inter
                ${filter === key
                  ? "bg-white text-[var(--green-primary)] shadow-md border border-[var(--green-light)]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }
                min-w-[100px]`}
            >
              <div className="flex flex-col items-center">
                <span>{label}</span>
                {filter === key && (
                  <div className="w-6 h-0.5 bg-[var(--green-primary)] rounded-full mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}