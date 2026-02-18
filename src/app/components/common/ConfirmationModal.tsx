"use client";

import React from "react";

interface ConfirmationModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  description,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full p-6 border border-gray-300">
        
        <h2 className="text-xl font-bold mb-2">
          {title}
        </h2>

        <p className="text-gray-600 mb-4">
          {description}
        </p>

        <div className="flex justify-end gap-3">
          
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
          >
            Confirm
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
