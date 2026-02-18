"use client";
import AdminLayout from "../AdminLayout";
import AdminSlidersManager from "./AdminSlidersManager";

export default function Page() {
  return (
    <AdminLayout>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Slider Management</h1>
      <AdminSlidersManager />
    </div>
     </AdminLayout>
  );
}
