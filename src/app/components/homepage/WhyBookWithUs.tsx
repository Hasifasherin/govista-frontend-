// src/app/components/slider/WhyBookWithUs.tsx
import React from "react";
import { FaPhoneAlt, FaStar, FaRegCalendarCheck, FaGift } from "react-icons/fa";

const WhyBookWithUs = () => {
  const features = [
    {
      icon: <FaPhoneAlt className="text-2xl text-pink-400" />,
      title: "24/7 customer support",
      desc: "No matter the time zone, we’re here to help.",
      bg: "bg-pink-100",
    },
    {
      icon: <FaGift className="text-2xl text-teal-400" />,
      title: "Earn rewards",
      desc: "Explore, earn, redeem, and repeat with our loyalty program.",
      bg: "bg-teal-100",
    },
    {
      icon: <FaStar className="text-2xl text-yellow-400" />,
      title: "Millions of reviews",
      desc: "Plan and book with confidence using reviews from fellow travelers.",
      bg: "bg-yellow-100",
    },
    {
      icon: <FaRegCalendarCheck className="text-2xl text-blue-400" />,
      title: "Plan your way",
      desc: "Stay flexible with free cancellation and pay later options.",
      bg: "bg-blue-100",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-poppins font-semibold mb-12">
          Why book with Govista?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 ${feature.bg}`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBookWithUs;
