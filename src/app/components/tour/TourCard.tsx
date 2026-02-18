"use client";

import { FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { OperatorTour } from "../../../types/operator";

interface TourCardProps {
  tour: OperatorTour;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TourCard({ tour, onView, onEdit, onDelete }: TourCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      
      {/* Tour Image Section */}
      <div className="relative h-64 overflow-hidden">
        {tour.image ? (
          <img 
            src={tour.image} 
            alt={tour.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <FiMapPin className="text-gray-400 mx-auto mb-3" size={48} />
              <p className="text-gray-500 font-medium">Tour Image</p>
            </div>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg">
          <div className="flex items-center gap-1">
            <FiDollarSign className="text-green-600" size={16} />
            <span className="text-lg font-bold text-gray-900">{tour.price}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">per person</p>
        </div>
        
        {/* Duration Badge */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-lg">
          <div className="flex items-center gap-2">
            <FiCalendar size={14} />
            <span className="text-sm font-medium">{tour.duration} Days</span>
          </div>
        </div>
      </div>

      {/* Tour Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{tour.title}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <FiMapPin size={16} className="text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium truncate">{tour.location}</span>
          </div>
        </div>

        {/* Description */}
        {tour.description && (
          <div className="mb-5">
            <p className="text-gray-600 text-sm line-clamp-2">{tour.description}</p>
          </div>
        )}

        {/* Tour Details */}
        <div className="mb-6">
          {tour.maxGroupSize && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FiUsers className="text-blue-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Max Group Size</p>
                <p className="font-semibold text-gray-900">{tour.maxGroupSize} Travelers</p>
              </div>
            </div>
          )}

          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
            <div className={`w-2 h-2 rounded-full ${tour.isActive && tour.status === "approved" ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {tour.isActive && tour.status === "approved" ? "Active" : "Pending"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-5 border-t border-gray-100">
          <button
            onClick={() => onView(tour._id)}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FiEye size={16} />
            View
          </button>
          
          <button
            onClick={() => onEdit(tour._id)}
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FiEdit size={16} />
            Edit
          </button>
          
          <button
            onClick={() => onDelete(tour._id)}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FiTrash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}