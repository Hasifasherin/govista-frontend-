// src/redux/slices/adminUsersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { User } from "../../types/user";

// ================= ASYNC THUNKS =================
export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetchAdminUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/users");
      return data.users as User[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleBlockUser = createAsyncThunk(
  "adminUsers/toggleBlockUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/block`);
      return data.user as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ================= SLICE =================
interface AdminUsersState {
  users: User[];
  loading: boolean;
  error?: string | null;
}

const initialState: AdminUsersState = {
  users: [],
  loading: false,
  error: null,
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchAdminUsers
    builder.addCase(fetchAdminUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdminUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchAdminUsers.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // toggleBlockUser
    builder.addCase(toggleBlockUser.fulfilled, (state, action: PayloadAction<User>) => {
      const updatedUser = action.payload;
      const index = state.users.findIndex((u) => u._id === updatedUser._id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    });
  },
});

export default adminUsersSlice.reducer;
