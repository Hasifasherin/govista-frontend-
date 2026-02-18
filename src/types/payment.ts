export interface Payment {
  bookingId: string;
  customerName: string;
  tourTitle: string;
  amount: number; // INR
  paymentStatus: "unpaid" | "paid" | "refunded";
  bookingStatus:
    | "pending"
    | "accepted"
    | "rejected"
    | "cancelled"
    | "completed";
  paidAt?: string;
}
