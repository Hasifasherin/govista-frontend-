import { apiRequest } from "../utils/api";
import { Customer } from "../types/customer";
import { Booking } from "../types/booking";

/**
 * Get all customers who booked operator's tours
 */
export const getOperatorCustomers = async (): Promise<Customer[]> => {
  try {
    const data = await apiRequest<{
      success: boolean;
      count: number;
      customers: Customer[];
    }>("GET", "/operator/customers");

    return data.customers || [];
  } catch (error: any) {
    console.error("Error fetching operator customers:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch customers");
  }
};

/**
 * Get booking history of a specific customer
 */
export const getCustomerBookingHistory = async (
  userId: string
): Promise<Booking[]> => {
  try {
    const data = await apiRequest<{
      success: boolean;
      count: number;
      bookings: Booking[];
    }>("GET", `/operator/customers/${userId}/bookings`);

    return data.bookings || [];
  } catch (error: any) {
    console.error(`Error fetching booking history for user ${userId}:`, error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch customer booking history"
    );
  }
};
