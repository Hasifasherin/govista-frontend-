"use client";

import { useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAdminRedux";
import {
  fetchAdminOperators,
  toggleBlockOperator,
  updateOperatorStatus,
} from "../../../redux/slices/adminOperatorsSlice";
import { User } from "../../../types/user";

export default function AdminOperatorsPage() {
  const dispatch = useAppDispatch();
  const { operators, loading, error } = useAppSelector(
    (state) => state.adminOperators
  );

  useEffect(() => {
    dispatch(fetchAdminOperators());
  }, [dispatch]);

  const handleToggleBlock = (operatorId: string) => {
    dispatch(toggleBlockOperator(operatorId));
  };

  const handleToggleApprove = (operatorId: string, currentStatus: boolean) => {
    dispatch(updateOperatorStatus({ operatorId, isApproved: !currentStatus }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Operators</h1>
          <p className="text-gray-500 mt-1">Manage all platform operators</p>
        </div>

        {loading && <p>Loading operators...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Approval</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {operators.map((operator: User) => (
                <tr key={operator._id} className="border-b">
                  <td className="py-2 px-4">{operator.firstName} {operator.lastName}</td>
                  <td className="py-2 px-4">{operator.email}</td>
                  <td className="py-2 px-4">
                    {operator.isBlocked ? (
                      <span className="text-red-500 font-semibold">Blocked</span>
                    ) : (
                      <span className="text-green-500 font-semibold">Active</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {operator.isApproved ? (
                      <span className="text-green-600 font-semibold">Approved</span>
                    ) : (
                      <span className="text-yellow-500 font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleToggleBlock(operator._id!)}
                      className={`px-3 py-1 rounded-md text-white ${
                        operator.isBlocked ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {operator.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <button
                      onClick={() => handleToggleApprove(operator._id!, operator.isApproved!)}
                      className={`px-3 py-1 rounded-md text-white ${
                        operator.isApproved ? "bg-yellow-500" : "bg-blue-500"
                      }`}
                    >
                      {operator.isApproved ? "Suspend" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
