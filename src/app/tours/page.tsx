"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import UserTourCard from "../components/tour/UserTourCard";
import { Tour } from "../../types/tour";

const ToursPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const location = searchParams.get("location") ?? "";
  const category = searchParams.get("category") ?? "";
  const date = searchParams.get("date") ?? "";

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (location) params.append("location", location);
        if (category) params.append("category", category);
        if (date) params.append("date", date);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tours/search?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Search failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data?.success && Array.isArray(data.tours)) {
          setTours(data.tours);
        } else {
          setTours([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch tours:", err.message);
        setError("Something went wrong while loading tours.");
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [location, category, date]);

  const handleNavigate = (id: string) => {
     router.push(`/user/tours/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Available Tours</h1>

      {loading && <p className="text-gray-500">Loading tours...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && tours.length === 0 && (
        <p className="text-gray-500">No tours found.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <UserTourCard
            key={tour._id}
            tour={tour}
            onView={handleNavigate}
            onCardClick={handleNavigate}
            onWishlist={(id) => console.log("Wishlist clicked:", id)}
            isWishlisted={false}
          />
        ))}
      </div>
    </div>
  );
};

export default ToursPage;
