"use client";

import { useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAdminRedux";
import { fetchDashboardStats } from "../../../redux/slices/adminSlice";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";

import { Pie, Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

/* ---------------- Stat Card ---------------- */
const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

/* ---------------- Mini Bar Card ---------------- */
const MiniBarCard = ({
  title,
  data,
}: {
  title: string;
  data: any;
}) => (
  <div className="bg-white rounded-lg shadow p-5 h-[200px]">
    <h3 className="font-semibold mb-3 text-sm">{title}</h3>
    <Bar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { stepSize: 1 },
          },
        },
        elements: {
          bar: {
            borderRadius: 4,
            backgroundColor: "rgba(53,57,243,0.45)",
          },
        },
      }}
    />
  </div>
);

/* ---------------- Mini Line Card ---------------- */
const MiniLineCard = ({
  title,
  data,
}: {
  title: string;
  data: any;
}) => (
  <div className="bg-white rounded-lg shadow p-5 h-[240px]">
    <h3 className="font-semibold mb-3 text-sm">{title}</h3>
    <Line
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { usePointStyle: true, boxWidth: 6 } },
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "rgba(0,0,0,0.05)" } },
        },
        elements: { point: { radius: 4 }, line: { tension: 0.4 } },
      }}
    />
  </div>
);

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { dashboardStats, loading, error } = useAppSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  /* -------- Pie: Users vs Operators -------- */
  const usersOperatorsPie = {
    labels: ["Users", "Operators"],
    datasets: [
      {
        data: [
          dashboardStats?.totals.totalUsers ?? 0,
          dashboardStats?.totals.totalOperators ?? 0,
        ],
        backgroundColor: ["#6366F1", "#22C55E"],
        borderWidth: 0,
      },
    ],
  };

  /* -------- Donut: Tours -------- */
  const toursDonut = {
    labels: ["Active Tours", "Featured Tours"],
    datasets: [
      {
        data: [
          dashboardStats?.totals.totalActiveTours ?? 0,
          dashboardStats?.totals.totalFeaturedTours ?? 0,
        ],
        backgroundColor: ["#0EA5E9", "#F59E0B"],
        borderWidth: 0,
      },
    ],
  };

  /* -------- Daily Booking Trend (Bar) -------- */
  const bookingTrendBar = {
    labels: dashboardStats?.bookingTrends.map((b: any) => b._id) ?? [],
    datasets: [
      {
        data: dashboardStats?.bookingTrends.map((b: any) => b.count) ?? [],
        backgroundColor: "rgba(53,57,243,0.3)", // transparent & professional
        borderRadius: 4,
        barThickness: 20, // smaller width
      },
    ],
  };

  /* -------- User & Operator Growth (Multi Line) -------- */
  const growthMultiLine = {
    labels: ["30 days ago", "Now"],
    datasets: [
      {
        label: "Users",
        data: [
          (dashboardStats?.totals.totalUsers ?? 0) -
            (dashboardStats?.totals.newUsers ?? 0),
          dashboardStats?.totals.totalUsers ?? 0,
        ],
        borderColor: "#6366F1",
        backgroundColor: "#7578f7",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Operators",
        data: [
          (dashboardStats?.totals.totalOperators ?? 0) -
            (dashboardStats?.totals.newOperators ?? 0),
          dashboardStats?.totals.totalOperators ?? 0,
        ],
        borderColor: "#22C55E",
        backgroundColor: "#51f98e",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Platform overview & growth insights
          </p>
        </div>

        {loading && <p>Loading dashboard...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* -------- Stats -------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Users" value={dashboardStats?.totals.totalUsers ?? 0} />
          <StatCard
            title="Operators"
            value={dashboardStats?.totals.totalOperators ?? 0}
          />
          <StatCard title="Tours" value={dashboardStats?.totals.totalTours ?? 0} />
          <StatCard
            title="Bookings"
            value={dashboardStats?.totals.totalBookings ?? 0}
          />
        </div>

        {/* -------- Charts -------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold mb-3">Users vs Operators</h3>
            <Pie data={usersOperatorsPie} />
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold mb-3">Tours Status</h3>
            <Doughnut data={toursDonut} />
          </div>

          <MiniBarCard title="Daily Bookings" data={bookingTrendBar} />
        </div>

        {/* -------- Growth (Multi Line Chart) -------- */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <MiniLineCard title="User & Operator Growth (30 days)" data={growthMultiLine} />
        </div>
      </div>
    </AdminLayout>
  );
}
