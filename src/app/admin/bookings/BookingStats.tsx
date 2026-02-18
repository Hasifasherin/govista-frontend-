import { AdminBooking } from "../../../types/booking";

interface Props {
  bookings: AdminBooking[];
}

export default function BookingStats({ bookings }: Props) {
  const total = bookings.length;
  const accepted = bookings.filter(b => b.status === "accepted").length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const paidParticipants = bookings
    .filter(b => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (b.participants || 0), 0);

  const StatCard = ({
    title,
    value,
    color,
  }: {
    title: string;
    value: number;
    color: string;
  }) => (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <StatCard
        title="Total Bookings"
        value={total}
        color="text-gray-800"
      />
      <StatCard
        title="Accepted"
        value={accepted}
        color="text-green-600"
      />
      <StatCard
        title="Pending"
        value={pending}
        color="text-yellow-600"
      />
      <StatCard
        title="Paid Participants"
        value={paidParticipants}
        color="text-blue-600"
      />
    </div>
  );
}
