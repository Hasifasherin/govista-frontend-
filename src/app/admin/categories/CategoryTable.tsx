"use client";

import React from "react";
import { Category } from "../../../types/category";

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryTable: React.FC<Props> = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full bg-white rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 border-b text-left text-gray-700 font-medium">#</th>
            <th className="py-3 px-4 border-b text-left text-gray-700 font-medium">Name</th>
            <th className="py-3 px-4 border-b text-left text-gray-700 font-medium">Active</th>
            <th className="py-3 px-4 border-b text-center text-gray-700 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <tr
                key={cat._id}
                className={`transition hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="py-3 px-4 border-b">{index + 1}</td>
                <td className="py-3 px-4 border-b">{cat.name}</td>
                <td className="py-3 px-4 border-b">{cat.isActive ? "Yes" : "No"}</td>
                <td className="py-3 px-4 border-b text-center flex justify-center gap-2">
                  <button
                    className="bg-yellow-400 text-white px-4 py-1 rounded-lg hover:bg-yellow-500 transition"
                    onClick={() => onEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                    onClick={() => onDelete(cat)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
