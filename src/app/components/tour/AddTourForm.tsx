"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { operatorAPI } from "../../../services/operator";
import { OperatorTour } from "../../../types/operator";
import {
  FiX,
  FiUpload,
} from "react-icons/fi";

interface AddTourFormProps {
  onClose: () => void;
  onTourAdded: () => Promise<void> | void;
  editingTour?: OperatorTour | null;
}

interface Category {
  _id: string;
  name: string;
}

export default function AddTourForm({
  onClose,
  onTourAdded,
  editingTour,
}: AddTourFormProps) {
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    duration: "",
    maxGroupSize: "",
    description: "",
    categoryId: "",
    startDate: "",
    endDate: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editingTour) return;

    setForm({
      title: editingTour.title || "",
      location: editingTour.location || "",
      price: editingTour.price?.toString() || "",
      duration: editingTour.duration?.toString() || "",
      maxGroupSize: editingTour.maxGroupSize?.toString() || "",
      description: editingTour.description || "",
      categoryId:
        typeof editingTour.category === "string"
          ? editingTour.category
          : editingTour.category?._id || "",
      startDate: editingTour.availableDates?.[0]?.slice(0, 10) || "",
      endDate:
        editingTour.availableDates?.[
          editingTour.availableDates.length - 1
        ]?.slice(0, 10) || "",
    });
  }, [editingTour]);

  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const res = await operatorAPI.getTourCategories(token);
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, [token]);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files?.[0]) {
      setImageFile(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const {
      title,
      location,
      price,
      duration,
      maxGroupSize,
      categoryId,
      startDate,
      endDate,
    } = form;

    if (
      !title ||
      !location ||
      !price ||
      !duration ||
      !maxGroupSize ||
      !categoryId ||
      (!imageFile && !editingTour)
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (
      Number(price) <= 0 ||
      Number(duration) <= 0 ||
      Number(maxGroupSize) <= 0
    ) {
      setError("Price, Duration and Max Group Size must be greater than 0");
      return;
    }

    let dates: string[] = [];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        setError("End Date cannot be before Start Date");
        return;
      }

      let current = new Date(start);
      while (current <= end) {
        dates.push(current.toISOString());
        current.setDate(current.getDate() + 1);
      }
    }

    if (!token) {
      setError("Unauthorized. Please login again.");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("title", title);
      fd.append("location", location);
      fd.append("price", price);
      fd.append("duration", duration);
      fd.append("maxGroupSize", maxGroupSize);
      fd.append("description", form.description);
      fd.append("category", categoryId);
      fd.append("availableDates", JSON.stringify(dates));

      if (imageFile) fd.append("image", imageFile);

      if (editingTour?._id) {
        const res = await operatorAPI.updateTour(editingTour._id, fd, token);
        if (res.data.success) {
          await onTourAdded();
          onClose();
        } else setError("Failed to update tour");
      } else {
        const res = await operatorAPI.createTour(fd, token);
        if (res.data.success) {
          await onTourAdded();
          onClose();
        } else setError("Failed to create tour");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Server error. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-100 to-green-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingTour ? "Edit Tour" : "Create New Tour"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {editingTour
                ? "Update your tour package details"
                : "Add a new tour package for customers"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-all duration-200">
            <FiX size={24} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={submit}
          className="p-6 grid grid-cols-2 gap-5 max-h-[75vh] overflow-y-auto"
        >
          {/* TITLE */}
          <div className="col-span-2">
            <label className="label">Tour Title *</label>
            <input
              name="title"
              placeholder="Maldives Island Paradise Tour"
              value={form.title}
              onChange={onChange}
              className="input shadow-sm hover:shadow-md transition-all"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="label">Location *</label>
            <div className="relative flex items-center">
              <div className="absolute left-0 h-full flex items-center pl-3"> 
              </div>
              <input
                name="location"
                placeholder="Maldives"
                value={form.location}
                onChange={onChange}
                className="input pl-14 shadow-sm hover:shadow-md transition-all"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="label">Category *</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={onChange}
              className="input shadow-sm hover:shadow-md transition-all">
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRICE */}
          <div>
            <label className="label">Price ($) *</label>
            <div className="relative flex items-center">
              <div className="absolute left-0 h-full flex items-center pl-3">
              </div>
              <input
                name="price"
                type="number"
                placeholder="1500"
                value={form.price}
                onChange={onChange}
                className="input pl-14 shadow-sm hover:shadow-md transition-all"
              />
            </div>
          </div>

          {/* DURATION */}
          <div>
            <label className="label">Duration (Days) *</label>
            <input
              name="duration"
              type="number"
              placeholder="5"
              value={form.duration}
              onChange={onChange}
              className="input shadow-sm hover:shadow-md transition-all"
            />
          </div>

          {/* MAX GROUP */}
          <div>
            <label className="label">Max Group *</label>
            <div className="relative flex items-center">
              <div className="absolute left-0 h-full flex items-center pl-3">
              </div>
              <input
                name="maxGroupSize"
                type="number"
                placeholder="10"
                value={form.maxGroupSize}
                onChange={onChange}
                className="input pl-14 shadow-sm hover:shadow-md transition-all"
              />
            </div>
          </div>

          {/* START DATE */}
          <div>
            <label className="label">Start Date</label>
            <div className="relative flex items-center">
              <div className="absolute left-0 h-full flex items-center pl-3">
              </div>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={onChange}
                className="input pl-14 shadow-sm hover:shadow-md transition-all"
              />
            </div>
          </div>

          {/* END DATE */}
          <div>
            <label className="label">End Date</label>
            <div className="relative flex items-center">
              <div className="absolute left-0 h-full flex items-center pl-3">
              </div>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={onChange}
                className="input pl-14 shadow-sm hover:shadow-md transition-all"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="col-span-2">
            <label className="label">Description</label>
            <textarea
              rows={4}
              name="description"
              placeholder="Experience crystal clear waters, luxury resorts, snorkeling..."
              value={form.description}
              onChange={onChange}
              className="input resize-none shadow-sm hover:shadow-md transition-all"
            />
          </div>

          {/* IMAGE */}
          <div className="col-span-2">
            <label className="label">
              Tour Image {editingTour ? "(optional)" : "*"}
            </label>
            <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all shadow-sm hover:shadow-md">
              <FiUpload size={28} className="text-green-600 mb-2" />
              <p className="text-sm mt-1 text-gray-600">
                {imageFile ? imageFile.name : "Upload tour image"}
              </p>
              <input type="file" name="image" onChange={onChange} className="hidden" />
            </label>
          </div>

          {error && (
            <div className="col-span-2 bg-red-50 text-red-700 p-3 rounded-md text-sm shadow-inner">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="col-span-2 flex gap-4 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
            >
              {saving
                ? editingTour
                  ? "Updating..."
                  : "Creating..."
                : editingTour
                ? "Update Tour"
                : "Create Tour"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-xl py-3 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
          display: block;
        }
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          outline: none;
          transition: all 0.3s;
          background-color: #fff;
        }
        .input:focus {
          border-color: #16a34a;
          box-shadow: 0 4px 10px rgba(22, 163, 74, 0.2);
        }
      `}</style>
    </div>
  );
}
