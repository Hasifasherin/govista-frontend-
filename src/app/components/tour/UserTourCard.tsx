"use client";

import React from "react";
import {
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiHeart,
} from "react-icons/fi";
import { Tour } from "../../../types/tour";

interface Props {
  tour: Tour;
  onView: (id: string) => void;
  onWishlist?: (id: string) => void;
  isWishlisted?: boolean; // whether this tour is in wishlist
  small?: boolean;
  onCardClick?: (id: string) => void; // optional parent click
}

const UserTourCard: React.FC<Props> = ({
  tour,
  onView,
  onWishlist,
  isWishlisted = false,
  small = false,
  onCardClick,
}) => {
  // Determine tour status
  const isActive = tour.isActive && tour.status === "approved";

  const handleCardClick = () => {
    if (onCardClick) return onCardClick(tour._id);
    onView(tour._id);
  };

  // Wishlist toggle handler
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWishlist) onWishlist(tour._id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer
      ${small ? "max-w-xs mx-auto" : ""}`}
    >
      {/* ---------------- IMAGE ---------------- */}
      <div className={`relative overflow-hidden ${small ? "h-40" : "h-64"}`}>
        {tour.image ? (
          <img
            src={tour.image}
            alt={tour.title}
            onError={(e) =>
              (e.currentTarget.src = "/images/placeholder-tour.jpg")
            }
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center">
            <FiMapPin className="text-gray-400 mb-2" size={small ? 32 : 48} />
            <p className={`text-gray-500 font-medium ${small ? "text-sm" : "text-base"}`}>
              Tour Image
            </p>
          </div>
        )}

        {/* ❤️ WISHLIST ICON */}
        {onWishlist && (
          <button
            aria-label="Toggle Wishlist"
            onClick={handleWishlistClick}
            className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 transition"
          >
            <FiHeart
              size={small ? 14 : 18}
              className={isWishlisted ? "text-red-600 fill-red-600" : "text-gray-600"}
            />
          </button>
        )}

        {/* 💰 PRICE */}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-end">
          <div className="flex items-center gap-1">
            <FiDollarSign className="text-green-600" size={small ? 12 : 16} />
            <span className={`font-bold text-gray-900 ${small ? "text-sm" : "text-lg"}`}>
              {tour.price}
            </span>
          </div>
          <span className={`text-gray-500 ${small ? "text-xs" : "text-sm"}`}>per person</span>
        </div>

        {/* 📅 DURATION */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
          <FiCalendar size={small ? 10 : 14} />
          <span>{tour.duration} Days</span>
        </div>
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className={`${small ? "p-4 text-sm" : "p-6"}`}>
        {/* TITLE + LOCATION */}
        <div className="mb-2">
          <h3 className={`font-bold text-gray-900 line-clamp-1 ${small ? "text-sm" : "text-xl"}`}>
            {tour.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-600">
            <FiMapPin size={small ? 12 : 16} className="text-green-600 flex-shrink-0" />
            <span className="truncate">{tour.location}</span>
          </div>
        </div>

        {/* DESCRIPTION */}
        {tour.description && (
          <p className={`text-gray-600 line-clamp-2 ${small ? "text-xs mb-2" : "text-sm mb-5"}`}>
            {tour.description}
          </p>
        )}

        {/* GROUP SIZE + STATUS */}
        <div className="flex justify-between items-center mb-3">
          {tour.maxGroupSize && (
            <div className="flex items-center gap-2 text-sm">
              <FiUsers className="text-blue-600" size={small ? 14 : 18} />
              <span className="text-gray-900 font-semibold">{tour.maxGroupSize} Travelers</span>
            </div>
          )}
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {isActive ? "Active" : "Pending"}
          </span>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(tour._id);
            }}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-1.5 rounded-lg text-xs"
          >
            View
          </button>

          {onWishlist && (
            <button
              onClick={handleWishlistClick}
              className={`flex-1 font-medium py-1.5 rounded-lg transition text-xs flex items-center justify-center gap-1
                ${isWishlisted ? "bg-red-100 text-red-700" : "bg-red-50 hover:bg-red-100 text-red-700"}`}
            >
              <FiHeart size={12} className={isWishlisted ? "fill-red-600" : ""} />
              {isWishlisted ? "Saved" : "Wishlist"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTourCard;
