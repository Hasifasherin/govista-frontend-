"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSliders } from "../../../services/slider";
import { Slider } from "../../../types/slider";
import HeroSearch from "./HeroSearch";
import { useAuth } from "../../context/AuthContext";

const HomeSlider = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // Fetch sliders
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data = await getSliders();
        setSliders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load sliders", error);
        setSliders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!sliders.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliders]);

  if (loading || !sliders.length) return null;

  return (
    <div className="relative w-full h-[90vh] md:h-[80vh] overflow-hidden">
      {/* Slides */}
      {sliders.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.imageUrl}
            alt="Hero slider"
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center text-white">
        {user?.firstName ? (
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Hi {user.firstName}!
          </h1>
        ) : (
          <h1 className="text-3xl md:text-5xl font-bold mb-6 max-w-3xl">
            Explore unforgettable experiences around the world
          </h1>
        )}

        <p className="text-md md:text-lg mb-8 max-w-2xl">
          Book tours, activities, and adventures with trusted providers.
        </p>

        <HeroSearch />
      </div>

      {/* 🔘 DOT INDICATORS */}
      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
        {sliders.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSlider;
