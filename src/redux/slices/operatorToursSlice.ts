import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { OperatorTour } from "../../types/operator";
import { operatorAPI } from "../../services/operator";

// ================= HELPER: Map Tour to OperatorTour =================
const mapTourToOperatorTour = (tour: any): OperatorTour => ({
  ...tour,
  bookingsCount: tour.bookingsCount || 0, // default to 0 if missing
});

// ================= ASYNC THUNKS =================

// Fetch operator's tours
export const fetchMyTours = createAsyncThunk(
  "operatorTours/fetchMyTours",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await operatorAPI.getMyTours(token);
      return res.data.tours.map(mapTourToOperatorTour);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create a new tour
export const createTour = createAsyncThunk(
  "operatorTours/createTour",
  async (
    { formData, token }: { formData: FormData; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await operatorAPI.createTour(formData, token);
      return mapTourToOperatorTour(res.data.tour);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update an existing tour
export const updateTour = createAsyncThunk(
  "operatorTours/updateTour",
  async (
    { id, formData, token }: { id: string; formData: FormData; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await operatorAPI.updateTour(id, formData, token);
      return mapTourToOperatorTour(res.data.tour);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete a tour
export const deleteTour = createAsyncThunk(
  "operatorTours/deleteTour",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      await operatorAPI.deleteTour(id, token);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ================= SLICE =================
interface OperatorToursState {
  tours: OperatorTour[];
  loading: boolean;
  error: string | null;
}

const initialState: OperatorToursState = {
  tours: [],
  loading: false,
  error: null,
};

const operatorToursSlice = createSlice({
  name: "operatorTours",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchMyTours.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyTours.fulfilled, (state, action: PayloadAction<OperatorTour[]>) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchMyTours.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createTour.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTour.fulfilled, (state, action: PayloadAction<OperatorTour>) => {
        state.loading = false;
        state.tours.unshift(action.payload);
      })
      .addCase(createTour.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateTour.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTour.fulfilled, (state, action: PayloadAction<OperatorTour>) => {
        state.loading = false;
        const index = state.tours.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.tours[index] = action.payload;
      })
      .addCase(updateTour.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteTour.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTour.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tours = state.tours.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTour.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = operatorToursSlice.actions;
export default operatorToursSlice.reducer;
