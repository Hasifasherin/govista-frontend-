// src/types/earnings.ts

export interface MonthlyEarning {
  month: string;
  amount: number;
}

export interface EarningsStats {
  totalRevenue: number;
  totalBookings: number;
  acceptedBookings: number;
  pendingBookings: number;
  rejectedBookings: number;
  averageRating: number;
  monthlyRevenue: MonthlyEarning[];
}
