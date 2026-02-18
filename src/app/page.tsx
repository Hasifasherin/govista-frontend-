"use client";

import HomeSlider from "./components/slider/HomeSlider";
import WhyBookWithUs from "./components/homepage/WhyBookWithUs";
import LoginCTA from "./components/homepage/LoginCTA";
import { useAuth } from "./context/AuthContext";
import FeaturedTours from "./components/tour/FeaturedTours";
import CategoryTours from "./components/tour/CategoryTours";
import Destinations from "./components/homepage/Destinations";
export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <main className="space-y-12">
      <HomeSlider />
      <WhyBookWithUs />
      {!user && <LoginCTA />}

      {/* Featured Tours */}
      <FeaturedTours />
       {/* Destinations */}
      <Destinations /> 
      {/* Category-wise Tours */}
      <CategoryTours />
    </main>
  );
}
