"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAdminRedux";
import { fetchDashboardStats } from "../../../redux/slices/operatorDashboardSlice";
import {
  FiMap,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiStar,
} from "react-icons/fi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function OperatorDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.operatorDashboard);

  // Load dashboard stats
  useEffect(() => {
    if (!authLoading && token && user?.role === "operator") {
      dispatch(fetchDashboardStats(token));
    }
  }, [authLoading, token, user, dispatch]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full" />
      </div>
    );
  }

  if (!user || user.role !== "operator") {
    return (
      <div className="text-center py-20 text-gray-500">
        Unauthorized Access
      </div>
    );
  }

  /* ================= CHART DATA ================= */
  const revenueLineData = {
    labels: stats?.monthlyRevenue.map((m) => m.month) || [],
    datasets: [
      {
        label: "Revenue",
        data: stats?.monthlyRevenue.map((m) => m.amount) || [],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const bookingBarData = {
    labels: stats?.monthlyBookings.map((m) => m.month) || [],
    datasets: [
      {
        label: "Bookings",
        data: stats?.monthlyBookings.map((m) => m.count) || [],
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };

 const categoryDonutData = {
  labels: stats?.tourCategories.map(c => c.category),
  datasets: [
    {
      data: stats?.tourCategories.map(c => c.count),
      backgroundColor: [
        "#10B981",
        "#3B82F6",
        "#F59E0B",
        "#EF4444",
        "#8B5CF6",
        "#06B6D4",
      ],
    },
  ],
};


  const bookingStatusPie = {
    labels: ["Pending", "Accepted", "Rejected"],
    datasets: [
      {
        data: [
          stats?.pendingBookings || 0,
          stats?.acceptedBookings || 0,
          stats?.rejectedBookings || 0,
        ],
        backgroundColor: ["#F59E0B", "#22C55E", "#EF4444"],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* ===== TOP STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Tours" value={stats?.totalTours} icon={<FiMap />} />
        <StatCard title="Total Bookings" value={stats?.totalBookings} icon={<FiCalendar />} />
        <StatCard title="Revenue" value={`$${stats?.totalRevenue || 0}`} icon={<FiDollarSign />} />
        <StatCard title="Active Tours" value={stats?.activeTours} icon={<FiTrendingUp />} />
      </div>

      {/* ===== SECOND ROW ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard title="Pending Requests" value={stats?.pendingBookings} icon={<FiClock />} highlight />
        <StatCard title="Customers" value={stats?.totalCustomers} icon={<FiUsers />} />
        <StatCard title="Avg Rating" value={stats?.averageRating.toFixed(1)} icon={<FiStar />} />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Revenue Overview">
          <Line data={revenueLineData} />
        </ChartCard>

        <ChartCard title="Monthly Bookings">
          <Bar data={bookingBarData} />
        </ChartCard>

        <ChartCard title="Tour Categories">
          <Doughnut data={categoryDonutData} />
        </ChartCard>

        <ChartCard title="Booking Status">
          <Pie data={bookingStatusPie} />
        </ChartCard>
      </div>

      {/* ===== UPCOMING BOOKINGS ===== */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
          <Link href="/operator/bookings" className="text-sm text-green-600">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Tour</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">People</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.upcomingBookings?.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-3">{b.tourId?.title}</td>
                  <td className="p-3">{b.userId.firstName} {b.userId.lastName}</td>
                  <td className="p-3 text-center">{new Date(b.bookingDate).toLocaleDateString()}</td>
                  <td className="p-3 text-center">{b.participants}</td>
                  <td className="p-3 text-center"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */
function StatCard({ title, value, icon, highlight }: any) {
  return (
    <div className={`bg-white rounded-2xl shadow p-5 flex justify-between items-center ${highlight ? "border-l-4 border-red-500" : ""}`}>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value || 0}</h3>
      </div>
      <div className="text-2xl text-green-600">{icon}</div>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}
