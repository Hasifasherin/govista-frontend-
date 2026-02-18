import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Review, AdminReviewsResponse, getAdminReviews, deleteAdminReview } from "../../services/reviewService";

interface AdminReviewsState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  actionLoading: string | null;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { _id: number; count: number }[];
}

const initialState: AdminReviewsState = {
  reviews: [],
  loading: false,
  error: null,
  actionLoading: null,
  totalReviews: 0,
  averageRating: 0,
  ratingDistribution: [],
};

// Fetch all reviews with stats
export const fetchAdminReviews = createAsyncThunk(
  "adminReviews/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data: AdminReviewsResponse = await getAdminReviews();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete review
export const removeReview = createAsyncThunk(
  "adminReviews/remove",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAdminReview(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const adminReviewsSlice = createSlice({
  name: "adminReviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.totalReviews = action.payload.totalReviews;
        state.averageRating = action.payload.averageRating;
        state.ratingDistribution = action.payload.ratingDistribution;
      })
      .addCase(fetchAdminReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeReview.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(removeReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
        state.actionLoading = null;
      })
      .addCase(removeReview.rejected, (state) => {
        state.actionLoading = null;
      });
  },
});

export default adminReviewsSlice.reducer;
