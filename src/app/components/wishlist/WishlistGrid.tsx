"use client";

import { Tour } from "../../../types/tour";
import WishlistCard from "./WishlistCard";

interface Props {
  tours: Tour[];
}

export default function WishlistGrid({ tours }: Props) {
  if (tours.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No tours in wishlist ❤️
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <WishlistCard key={tour._id} tour={tour} />
      ))}
    </div>
  );
}
