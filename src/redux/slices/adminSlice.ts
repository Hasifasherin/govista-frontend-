import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { User as UserType } from "../../types/user";

// ---------------- Admin State ----------------
interface DashboardTotals {
  totalUsers: number;
  totalOperators: number;
  totalBookings: number;
  totalTours: number;
  totalActiveTours: number;
  totalFeaturedTours: number;
  newUsers: number;
  newOperators: number;
}

interface AdminState {
  user: UserType | null;           // currently logged-in admin
  users: UserType[];               // all users
  dashboardStats: {
    totals: DashboardTotals;
    bookingTrends: any[];
    topAgencies: any[];
    reviews: any;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  user: null,
  users: [],
  dashboardStats: null,
  loading: false,
  error: null,
};

// ---------------- Async Thunks ----------------

// Fetch all users
export const fetchUsers = createAsyncThunk<UserType[]>(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.users; // adjust if API wraps users in object
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);

// Fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // should match the API response
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch dashboard stats");
    }
  }
);

// ---------------- Slice ----------------
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.users = [];
      state.dashboardStats = null;
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UserType[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchDashboardStats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAdminUser, logout } = adminSlice.actions;
export default adminSlice.reducer;
