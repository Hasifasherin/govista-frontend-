"use client";

import React from "react";

interface ToastModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  success?: boolean; // optional: true for success, false for error
}

const ToastModal: React.FC<ToastModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
  success = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full p-6 border border-gray-300">
        <h2
          className={`text-xl font-bold mb-2 ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {title}
        </h2>
        <p className="text-gray-600 mb-4">{description}</p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              success
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600"
            } transition`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastModal;
