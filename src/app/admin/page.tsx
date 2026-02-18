"use client";

import { useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { useAppDispatch, useAppSelector } from "../../hooks/useAdminRedux";
import { fetchUsers } from "../../redux/slices/adminSlice";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome, Admin! Here's an overview.</p>

        {loading && <p>Loading stats...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">Users</h2>
            <p className="text-2xl font-bold mt-2">{users.length}</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">Tours</h2>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">Bookings</h2>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">Operators</h2>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
