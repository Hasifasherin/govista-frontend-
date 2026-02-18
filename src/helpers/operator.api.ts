import api from "../utils/api";

// Fetch operator's tours
export const getOperatorTours = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/operator/tours", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // array of tours
};

// Fetch operator's booking requests
export const getOperatorBookings = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/operator/bookings", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // array of bookings
};
// Fetch operator dashboard stats
export const getDashboardStats = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/operator/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.stats;
};

// Update booking status
export const updateBookingStatus = async (bookingId: string, status: "accepted" | "rejected") => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/operator/bookings/${bookingId}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get single booking details
export const getBookingDetails = async (bookingId: string) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/operator/bookings/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.booking;
};
