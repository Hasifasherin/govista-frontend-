"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: Props) {
  const router = useRouter();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-xl relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full text-xl">
            🔒
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-2">
          Please Login First
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Login to explore tour details, booking, reviews and
          message operators.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => router.push("/auth/login")}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
