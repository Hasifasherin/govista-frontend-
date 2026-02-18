export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;

  phone?: string;
  createdAt?: string;

totalBookings?: number;      // optional, for dashboard/stats
  lastBookingDate?: string; 
}
