"use client";

import { useEffect, useState } from "react";
import { getOperatorEarnings } from "../../../services/earningsService";
import { EarningsStats } from "../../../types/earnings";
import {
  FiDollarSign,
  FiTrendingUp,
  FiBarChart2,
  FiStar
} from "react-icons/fi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function EarningsPage() {
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const data = await getOperatorEarnings();
      setStats(data);
    } catch (err) {
      console.error("Failed to load earnings", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading earnings...</div>;
  }

  if (!stats) {
    return <div className="p-10 text-center">No earnings data available</div>;
  }

  const chartData = {
    labels: stats.monthlyRevenue.map((m) => m.month),
    datasets: [
      {
        label: "Monthly Revenue (₹)",
        data: stats.monthlyRevenue.map((m) => m.amount),
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            `₹${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
      },
      legend: { display: false },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-600">
          Revenue, performance & financial insights
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Earnings"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          icon={<FiDollarSign />}
          color="text-green-600"
        />

        <SummaryCard
          title="Accepted Bookings"
          value={stats.acceptedBookings}
          icon={<FiTrendingUp />}
          color="text-blue-600"
        />

        <SummaryCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<FiBarChart2 />}
          color="text-purple-600"
        />

        <SummaryCard
          title="Average Rating"
          value={
            stats.averageRating > 0
              ? stats.averageRating.toFixed(1)
              : "No reviews"
          }
          icon={<FiStar />}
          color="text-yellow-600"
        />
      </div>

      {/* Earnings chart */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">
          Monthly Earnings Growth
        </h2>

        {stats.monthlyRevenue.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No monthly revenue available
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Monthly table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b font-semibold">
          Monthly Revenue Breakdown
        </div>

        {stats.monthlyRevenue.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No monthly revenue available
          </div>
        ) : (
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-600">
                  Month
                </th>
                <th className="px-6 py-3 text-right text-sm text-gray-600">
                  Revenue (₹)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.monthlyRevenue.map((m) => (
                <tr key={m.month}>
                  <td className="px-6 py-4">{m.month}</td>
                  <td className="px-6 py-4 text-right font-semibold text-green-700">
                    ₹{m.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------- UI helper ---------- */
function SummaryCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <div className={`flex items-center gap-3 ${color}`}>
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <div className="mt-4 text-2xl font-bold text-gray-900">
        {value}
      </div>
    </div>
  );
}
