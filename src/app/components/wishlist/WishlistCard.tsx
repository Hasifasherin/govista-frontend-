"use client";

import { useRouter } from "next/navigation";
import { FiHeart, FiMapPin, FiDollarSign } from "react-icons/fi";
import { Tour } from "../../../types/tour";
import { useAppDispatch } from "../../../redux/hooks";
import { removeFromWishlist } from "../../../redux/slices/wishlistSlice";

interface Props {
  tour: Tour;
}

export default function WishlistCard({ tour }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Remove from wishlist
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent navigating
    dispatch(removeFromWishlist(tour._id));
  };

  // Navigate to tour detail
  const handleCardClick = () => {
    router.push(`/user/tours/${tour._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover"
        />

        {/* Remove ❤️ */}
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-red-50"
        >
          <FiHeart className="text-red-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">{tour.title}</h3>

        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <FiMapPin /> {tour.location}
        </div>

        <div className="flex items-center gap-1 text-green-600 font-semibold">
          <FiDollarSign /> {tour.price}
        </div>
      </div>
    </div>
  );
}
