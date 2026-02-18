import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { OperatorStats } from "../../types/operator";
import { operatorAPI } from "../../services/operator";

// ================= ASYNC THUNKS =================

// Fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  "operatorDashboard/fetchDashboardStats",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await operatorAPI.getDashboardStats(token);
      return res.data.stats as OperatorStats;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Optional: Fetch booking statistics for charts
export const fetchBookingStatistics = createAsyncThunk(
  "operatorDashboard/fetchBookingStatistics",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await operatorAPI.getBookingStatistics(token);
      return res.data.stats as OperatorStats;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ================= SLICE =================
interface OperatorDashboardState {
  stats: OperatorStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: OperatorDashboardState = {
  stats: null,
  loading: false,
  error: null,
};

const operatorDashboardSlice = createSlice({
  name: "operatorDashboard",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetStats(state) {
      state.stats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= DASHBOARD STATS =================
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<OperatorStats>) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= BOOKING STATISTICS =================
      .addCase(fetchBookingStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingStatistics.fulfilled, (state, action: PayloadAction<OperatorStats>) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchBookingStatistics.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetStats } = operatorDashboardSlice.actions;
export default operatorDashboardSlice.reducer;
