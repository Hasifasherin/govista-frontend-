"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

interface Category {
  _id: string;
  name: string;
}

const HeroSearch = () => {
  const router = useRouter();

  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tours/categories`
        );

        if (!res.ok) {
          console.error("Category fetch failed:", res.status);
          return;
        }

        const data = await res.json();

        if (data?.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* ================= FETCH LOCATION SUGGESTIONS ================= */

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!destination.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tours/locations?search=${destination}`
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data?.success && Array.isArray(data.locations)) {
          setSuggestions(data.locations);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Suggestion fetch failed");
      }
    }, 400); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [destination]);

  /* ================= HANDLE SEARCH ================= */

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();

    const trimmedLocation = destination.trim();

    if (trimmedLocation) params.append("location", trimmedLocation);
    if (category) params.append("category", category);
    if (date) params.append("date", date);

    const queryString = params.toString();

    router.push(queryString ? `/tours?${queryString}` : "/tours");
  };

  /* ================= UI ================= */

  return (
    <form
      onSubmit={handleSearch}
      className="relative bg-white rounded-full shadow-xl flex flex-col md:flex-row items-center w-full max-w-4xl mx-auto overflow-visible"
    >
      {/* Destination with Suggestions */}
      <div className="relative flex-1 w-full">
        <input
          type="text"
          placeholder="Where to?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="w-full px-6 py-4 text-gray-700 outline-none text-sm md:text-base placeholder-gray-400"
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 bg-white border mt-2 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {suggestions.map((place, index) => (
              <div
                key={index}
                onClick={() => {
                  setDestination(place);
                  setShowSuggestions(false);
                }}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {place}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={loadingCategories}
        className="flex-1 px-4 py-4 text-gray-700 outline-none text-sm md:text-base border-t md:border-t-0 md:border-l border-gray-200"
      >
        <option value="">
          {loadingCategories ? "Loading categories..." : "All Categories"}
        </option>

        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="flex-1 px-4 py-4 text-gray-700 outline-none text-sm md:text-base border-t md:border-t-0 md:border-l border-gray-200"
      />

      {/* Search Button */}
      <button
        type="submit"
        className="bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white flex items-center justify-center px-6 py-4 md:rounded-r-full transition-all duration-200"
      >
        <FiSearch className="w-5 h-5" />
      </button>
    </form>
  );
};

export default HeroSearch;
