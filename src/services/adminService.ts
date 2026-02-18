import api from "../utils/api";

// ================= USERS =================


export const fetchAdminUsers = async () => {
  const { data } = await api.get("/admin/users");
  return data.users;
};

export const toggleUserBlock = async (id: string) => {
  const { data } = await api.put(`/admin/users/${id}/block`);
  return data.user; // returns the updated user
};


// ================= OPERATORS =================

// Fetch all operators
export const fetchAdminOperators = async () => {
  const res = await api.get("/admin/operators");
  return res.data.operators;
};

// Block / Unblock operator
export const toggleOperatorBlock = async (id: string) => {
  const res = await api.put(`/admin/operators/${id}/block`);
  return res.data.operator;
};

// Approve / Suspend operator
export const updateOperatorStatus = async (id: string, isApproved: boolean) => {
  const res = await api.put(`/admin/operators/${id}/status`, { isApproved });
  return res.data.operator;
};

// ================= TOURS =================

// Fetch all tours
export const fetchAdminTours = async () => {
  const res = await api.get("/admin/tours");
  return res.data.tours;
};
