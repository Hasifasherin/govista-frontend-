"use client";

import { useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAdminRedux";
import { fetchAdminUsers, toggleBlockUser } from "../../../redux/slices/adminUsersSlice";
import { User } from "../../../types/user";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.adminUsers);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleToggleBlock = (userId: string) => {
    dispatch(toggleBlockUser(userId));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-500 mt-1">Manage all platform users</p>
        </div>

        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user._id} className="border-b">
                  <td className="py-2 px-4">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">
                    {user.isBlocked ? (
                      <span className="text-red-500 font-semibold">Blocked</span>
                    ) : (
                      <span className="text-green-500 font-semibold">Active</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleToggleBlock(user._id!)}
                      className={`px-3 py-1 rounded-md text-white ${
                        user.isBlocked ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
