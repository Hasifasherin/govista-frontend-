"use client";

import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import adminUsersReducer from "./slices/adminUsersSlice";
import adminOperatorsReducer from "./slices/adminOperatorsSlice"; 
import adminToursReducer from "./slices/adminToursSlice";
import adminReviewsReducer from "./slices/adminReviewsSlice"
import operatorDashboardReducer from "./slices/operatorDashboardSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    adminUsers: adminUsersReducer, 
    adminOperators: adminOperatorsReducer, 
    adminTours: adminToursReducer, 
    adminReviews: adminReviewsReducer,
    operatorDashboard: operatorDashboardReducer,
    wishlist: wishlistReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
