"use client";
import React from "react";
import { useRouter } from "next/navigation";

const LoginCTA = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/auth/login"); // existing login page
  };

  return (
    <div className="flex justify-center py-12 bg-purple-50">
      <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">
          Log in to manage bookings & Govista Rewards
        </h2>
        <p className="text-gray-600 mb-6">
          Don't have an account yet?{" "}
          <span
            onClick={() => router.push("/auth/register")}
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
        <button
          onClick={handleLoginClick}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default LoginCTA;
