"use client";

import React, { useState, useEffect } from "react";
import { Category } from "../../../types/category";

interface Props {
  category: Category | null;
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
}

const CategoryForm: React.FC<Props> = ({ category, onSave, onCancel }) => {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSave(name.trim());
    setName("");
  };

  return (
    <div className="bg-white p-6 rounded shadow-md border border-gray-200 mb-4">
      <h2 className="text-xl font-semibold mb-4">
        {category ? "Edit Category" : "Add New Category"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter category name"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            {category ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
