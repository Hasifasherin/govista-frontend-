"use client";

import { Slider } from "../../../types/slider";

interface Props {
  sliders: Slider[];
  loading: boolean;
  onSelect: (slide: Slider) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  selectedSlide: Slider | null;
}

export default function SlidersGrid({
  sliders,
  loading,
  onSelect,
  onDelete,
  onAdd,
  selectedSlide,
}: Props) {
  if (loading)
    return <p className="text-center py-6 text-gray-500">Loading sliders...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Add slider button */}
      <div
        onClick={onAdd}
        className="border-2 border-dashed rounded-lg flex items-center justify-center h-36 cursor-pointer hover:bg-gray-50 transition"
      >
        + Add Slider
      </div>

      {sliders.map((slide) => (
        <div
          key={slide._id}
          className={`relative rounded overflow-hidden shadow cursor-pointer transition-transform duration-200 hover:scale-105 ${
            selectedSlide?._id === slide._id ? "ring-2 ring-blue-500" : ""
          }`}
        >
          <img
            src={slide.imageUrl}
            alt={slide.title || "Slider"}
            className="w-full h-36 object-cover"
          />

          {/* Title overlay */}
          {slide.title && (
            <div className="absolute bottom-0 w-full bg-black/50 text-white text-sm px-2 py-1 truncate">
              {slide.title}
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex gap-2 items-center justify-center transition">
            <button
              onClick={() => onSelect(slide)}
              className="bg-white px-3 py-1 rounded"
            >
              View
            </button>
            <button
              onClick={() => onDelete(slide._id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
