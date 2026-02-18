"use client";

import { Slider } from "../../../types/slider";

export default function SliderPreviewPanel({ slide }: { slide: Slider }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-semibold mb-3">Preview</h2>

      {/* Image wrapper */}
      <div className="w-full max-h-[260px] flex items-center justify-center bg-gray-100 rounded overflow-hidden">
        <img
          src={slide.imageUrl}
          alt={slide.title || "Slider"}
          className="max-w-full max-h-[260px] object-contain"
        />
      </div>

      {slide.title && (
        <h3 className="mt-3 text-lg font-semibold">{slide.title}</h3>
      )}

      {slide.subtitle && (
        <p className="text-gray-600">{slide.subtitle}</p>
      )}
    </div>
  );
}
