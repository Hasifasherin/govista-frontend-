import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// -------------------- Types --------------------
export interface Tour {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  duration: number;
  maxGroupSize?: number;
  category?: string;
  availableDates?: string[];
  image: string; 
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  averageRating?: number;
  reviewsCount?: number;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminToursState {
  tours: Tour[];
  loading: boolean; // for fetch
  error?: string;
  actionLoading: string | null; // for approve/reject/active/feature buttons
}

// -------------------- Initial State --------------------
const initialState: AdminToursState = {
  tours: [],
  loading: false,
  error: undefined,
  actionLoading: null,
};

// -------------------- Async Thunks --------------------
export const fetchAdminTours = createAsyncThunk(
  "adminTours/fetchTours",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/admin/tours");
      return res.data.tours as Tour[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateTourStatus = createAsyncThunk(
  "adminTours/updateTourStatus",
  async ({ id, status }: { id: string; status: "approved" | "rejected" }, thunkAPI) => {
    try {
      const res = await api.put(`/admin/tours/${id}/approval`, { status });
      return res.data.tour as Tour;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleTourActive = createAsyncThunk(
  "adminTours/toggleTourActive",
  async (id: string, thunkAPI) => {
    try {
      const res = await api.put(`/admin/tours/${id}/active`);
      return res.data.tour as Tour;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleTourFeatured = createAsyncThunk(
  "adminTours/toggleTourFeatured",
  async (id: string, thunkAPI) => {
    try {
      const res = await api.put(`/admin/tours/${id}/feature`);
      return res.data.tour as Tour;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// -------------------- Slice --------------------
export const adminToursSlice = createSlice({
  name: "adminTours",
  initialState,
  reducers: {
    // optional reducers can go here
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH TOURS
      .addCase(fetchAdminTours.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchAdminTours.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchAdminTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE STATUS
      .addCase(updateTourStatus.pending, (state, action) => {
        state.actionLoading = action.meta.arg.id;
      })
      .addCase(updateTourStatus.fulfilled, (state, action) => {
        const index = state.tours.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tours[index] = action.payload;
        state.actionLoading = null;
      })
      .addCase(updateTourStatus.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload as string;
      })

      // TOGGLE ACTIVE
      .addCase(toggleTourActive.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(toggleTourActive.fulfilled, (state, action) => {
        const index = state.tours.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tours[index] = action.payload;
        state.actionLoading = null;
      })
      .addCase(toggleTourActive.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload as string;
      })

      // TOGGLE FEATURED
      .addCase(toggleTourFeatured.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(toggleTourFeatured.fulfilled, (state, action) => {
        const index = state.tours.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tours[index] = action.payload;
        state.actionLoading = null;
      })
      .addCase(toggleTourFeatured.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = adminToursSlice.actions;

export default adminToursSlice.reducer;
