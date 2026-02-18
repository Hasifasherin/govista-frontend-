"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { FiSearch, FiEye, FiX, FiPhone, FiMessageSquare } from "react-icons/fi";
import { Customer } from "../../../types/customer";
import { Booking } from "../../../types/booking";
import { getOperatorCustomers, getCustomerBookingHistory } from "../../../services/customerService";

export default function OperatorCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getOperatorCustomers();
      setCustomers(data || []);
    } catch (error) {
      console.error("Failed to load customers", error);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerDetails = async (customer: Customer) => {
    try {
      setSelectedCustomer(customer);
      setLoadingBookings(true);
      const data = await getCustomerBookingHistory(customer._id);
      setBookings(data || []);
    } catch (error) {
      console.error("Failed to load booking history", error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const closeCustomerDetails = () => {
    setSelectedCustomer(null);
    setBookings([]);
  };

  const handleChatClick = (customerId: string) => {
    router.push(`/operator/messages?user=${customerId}`);
  };

  const callCustomer = (phone?: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
  });

  const formatDate = (date?: string | Date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "-";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Customers who booked your tours</p>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* CUSTOMER TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No customers found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{customer.firstName} {customer.lastName}</td>
                  <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => openCustomerDetails(customer)}
                      className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => callCustomer(customer.phone)}
                      className="px-3 py-2 bg-green-100 rounded-lg hover:bg-green-200"
                      title="Call Customer"
                    >
                      <FiPhone className="text-green-600" />
                    </button>
                    <button
                      onClick={() => handleChatClick(customer._id)}
                      className="px-3 py-2 bg-blue-100 rounded-lg hover:bg-blue-200"
                      title="Chat with Customer"
                    >
                      <FiMessageSquare className="text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SELECTED CUSTOMER DETAILS */}
      {selectedCustomer && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
            <button onClick={closeCustomerDetails}>
              <FiX className="text-gray-500 hover:text-gray-800" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">{selectedCustomer.email}</p>

          {/* BOOKING HISTORY */}
          <h4 className="font-semibold mb-2">Booking History</h4>
          {loadingBookings ? (
            <p className="text-gray-500">Loading booking history...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">No bookings found</p>
          ) : (
            <ul className="space-y-3">
              {bookings.map((b) => (
                <li key={b._id} className="p-4 border rounded-lg flex justify-between">
                  <div>
                    <p className="font-medium">{b.tourId?.title}</p>
                    <p className="text-sm text-gray-500">{formatDate(b.bookingDate)} • {b.participants || 1} people</p>
                  </div>
                  <span className="text-sm capitalize px-3 py-1 rounded-full bg-gray-100">{b.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
