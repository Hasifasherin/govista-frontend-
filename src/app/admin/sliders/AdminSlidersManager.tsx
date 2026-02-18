"use client";

import { useEffect, useState } from "react";
import { Slider } from "../../../types/slider";
import {
  getSliders,
  createSlider,
  deleteSlider,
} from "../../../services/slider";
import SlidersGrid from "./SlidersGrid";
import SliderPreviewPanel from "./SliderPreviewPanel";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import ToastModal from "../../components/common/Toast"; // New modal for success/fail messages

export default function AdminSlidersManager() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState<Slider | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  /* ================= DELETE MODAL STATE ================= */
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* ================= UPLOAD TOAST MODAL STATE ================= */
  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastSuccess, setToastSuccess] = useState(true);

  /* ================= FETCH SLIDERS ================= */
  const fetchSliders = async () => {
    setLoading(true);
    try {
      const data = await getSliders();
      setSliders(data);
      if (!activeSlide && data.length) setActiveSlide(data[0]);
    } catch (err) {
      console.error("Failed to fetch sliders", err);
      setToastTitle("Error");
      setToastMessage("Failed to load sliders.");
      setToastSuccess(false);
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  /* ================= ADD SLIDER ================= */
  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    const maxSizeMB = 6;

    // ✅ File size check
    if (file.size > maxSizeMB * 1024 * 1024) {
      setToastTitle("Upload Failed");
      setToastMessage(`Please select an image smaller than ${maxSizeMB}MB.`);
      setToastSuccess(false);
      setToastOpen(true);
      e.target.value = "";
      return;
    }

    const fd = new FormData();
    fd.append("image", file); // backend expects key "image"

    try {
      setLoading(true);
      setUploadProgress(0);

      const newSlider = await createSlider(fd, (percent) => {
        setUploadProgress(percent);
      });

      // Refresh sliders and select newly added slider
      const data = await getSliders();
      setSliders(data);
      setActiveSlide(newSlider);

      // ✅ Show professional success modal
      setToastTitle("Upload Successful");
      setToastMessage("Slider uploaded successfully.");
      setToastSuccess(true);
      setToastOpen(true);
    } catch (err: any) {
      console.error(err);

      setToastTitle("Upload Failed");
      if (err?.response?.status === 400) {
        setToastMessage("Please select a valid image smaller than 6MB.");
      } else if (err?.code === "ECONNABORTED") {
        setToastMessage(
          "Upload timed out. Try a smaller image or check your connection."
        );
      } else {
        setToastMessage("Upload failed. Please try again.");
      }
      setToastSuccess(false);
      setToastOpen(true);
    } finally {
      setLoading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
  };

  /* ================= OPEN/CLOSE DELETE MODAL ================= */
  const openDeleteModal = (id: string) => setDeleteId(id);
  const closeDeleteModal = () => setDeleteId(null);

  /* ================= CONFIRM DELETE ================= */
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      await deleteSlider(deleteId);

      if (activeSlide?._id === deleteId) setActiveSlide(null);

      await fetchSliders();
    } catch (err) {
      console.error(err);
      setToastTitle("Delete Failed");
      setToastMessage("Failed to delete slider.");
      setToastSuccess(false);
      setToastOpen(true);
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* ================= SLIDERS GRID ================= */}
      <SlidersGrid
        sliders={sliders}
        loading={loading}
        onSelect={setActiveSlide}
        onDelete={openDeleteModal}
        onAdd={() =>
          !loading && document.getElementById("add-slider-input")?.click()
        }
        selectedSlide={activeSlide}
      />

      {/* ================= FILE INPUT ================= */}
      <input
        type="file"
        id="add-slider-input"
        accept="image/*"
        className="hidden"
        onChange={handleAdd}
        disabled={loading}
      />

      {/* ================= UPLOAD PROGRESS ================= */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-blue-500 h-2 rounded transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{uploadProgress}%</span>
        </div>
      )}

      {/* ================= SLIDER PREVIEW ================= */}
      {activeSlide && <SliderPreviewPanel slide={activeSlide} />}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <ConfirmationModal
        title="Delete Slider"
        description="Are you sure you want to delete this slider?"
        isOpen={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />

      {/* ================= UPLOAD TOAST MODAL ================= */}
      <ToastModal
        isOpen={toastOpen}
        title={toastTitle}
        description={toastMessage}
        success={toastSuccess}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}
