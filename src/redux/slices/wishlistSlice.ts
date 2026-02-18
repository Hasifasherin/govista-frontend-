import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getWishlist,
  addToWishlist as addAPI,
  removeFromWishlist as removeAPI,
} from "../../services/wishlistService";
import { Tour } from "../../types/tour";

// ================= STATE =================
interface WishlistState {
  items: Tour[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// ================= FETCH =================
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getWishlist();
      return res.wishlist;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

// ================= ADD =================
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (tour: Tour, { rejectWithValue }) => {
    try {
      await addAPI(tour._id);
      return tour; // return full tour (important)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Add failed");
    }
  }
);

// ================= REMOVE =================
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (tourId: string, { rejectWithValue }) => {
    try {
      await removeAPI(tourId);
      return tourId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Remove failed");
    }
  }
);

// ================= SLICE =================
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // ===== FETCH =====
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchWishlist.fulfilled,
        (state, action: PayloadAction<Tour[]>) => {
          state.items = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===== ADD =====
      .addCase(
        addToWishlist.fulfilled,
        (state, action: PayloadAction<Tour>) => {
          const exists = state.items.find(
            (t) => t._id === action.payload._id
          );
          if (!exists) {
            state.items.push(action.payload);
          }
        }
      )

      // ===== REMOVE =====
      .addCase(
        removeFromWishlist.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (t) => t._id !== action.payload
          );
        }
      );
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
