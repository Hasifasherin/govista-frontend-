import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { User } from "../../types/user";

// Fetch all operators
export const fetchAdminOperators = createAsyncThunk(
  "adminOperators/fetchAdminOperators",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/admin/operators");
      return res.data.operators as User[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Block / Unblock operator
export const toggleBlockOperator = createAsyncThunk(
  "adminOperators/toggleBlockOperator",
  async (operatorId: string, thunkAPI) => {
    try {
      const res = await api.put(`/admin/operators/${operatorId}/block`);
      return res.data.operator as User;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Approve / Suspend operator
export const updateOperatorStatus = createAsyncThunk(
  "adminOperators/updateOperatorStatus",
  async (
    { operatorId, isApproved }: { operatorId: string; isApproved: boolean },
    thunkAPI
  ) => {
    try {
      const res = await api.put(`/admin/operators/${operatorId}/status`, { isApproved });
      return res.data.operator as User;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

interface AdminOperatorsState {
  operators: User[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminOperatorsState = {
  operators: [],
  loading: false,
  error: null,
};

const adminOperatorsSlice = createSlice({
  name: "adminOperators",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAdminOperators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOperators.fulfilled, (state, action) => {
        state.loading = false;
        state.operators = action.payload;
      })
      .addCase(fetchAdminOperators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle block
      .addCase(toggleBlockOperator.fulfilled, (state, action) => {
        const updated = action.payload;
        state.operators = state.operators.map((op) =>
          op._id === updated._id ? updated : op
        );
      })

      // Approve/Suspend
      .addCase(updateOperatorStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.operators = state.operators.map((op) =>
          op._id === updated._id ? updated : op
        );
      });
  },
});

export default adminOperatorsSlice.reducer;
