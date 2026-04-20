import DashboardLayout from '@/layouts/dasboard'
import type { ActivityItem, BarData, Order, StatCard } from '@/types/interfaces';
import { Head } from '@inertiajs/react'

const stats: StatCard[] = [
  { label: "Total Revenue", value: "$84.2k", change: "12.4%", up: true },
  { label: "Active Users", value: "3,481", change: "8.1%", up: true },
  { label: "New Orders", value: "247", change: "3.2%", up: false },
  { label: "Churn Rate", value: "2.4%", change: "0.6%", up: false },
];

const activities: ActivityItem[] = [
  { text: "New order #4821 placed", time: "2 min ago", color: "#5340c9" },
  { text: "Payment confirmed $1,240", time: "18 min ago", color: "#639922" },
  { text: "Refund request #3390", time: "1 hr ago", color: "#ba7517" },
  { text: "User Sari registered", time: "2 hr ago", color: "#5340c9" },
  { text: "Report exported by admin", time: "5 hr ago", color: "#639922" },
];

const orders: Order[] = [
  { customer: "Rina Putri", product: "Pro Plan", amount: "$49", date: "Apr 20", status: "Paid" },
  { customer: "Budi Santoso", product: "Starter", amount: "$12", date: "Apr 19", status: "Paid" },
  { customer: "Maya Dewi", product: "Enterprise", amount: "$299", date: "Apr 19", status: "Pending" },
  { customer: "Arif Wibowo", product: "Pro Plan", amount: "$49", date: "Apr 18", status: "Processing" },
  { customer: "Siti Rahayu", product: "Starter", amount: "$12", date: "Apr 17", status: "Paid" },
];

// --- Data ---
const barData: BarData[] = [
  { month: "Oct", value: 52 },
  { month: "Nov", value: 68 },
  { month: "Dec", value: 91 },
  { month: "Jan", value: 74 },
  { month: "Feb", value: 83 },
  { month: "Mar", value: 61 },
  { month: "Apr", value: 78 },
];

const BarChart = ({ data }: { data: BarData[] }) => {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-1.5 h-24 pt-2">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t transition-opacity hover:opacity-75 cursor-pointer"
            style={{
              height: `${Math.round((d.value / max) * 88)}px`,
              background: d.month === "Apr" ? "#5340c9" : "#c5bcf7",
              minHeight: "4px",
            }}
            title={`${d.month}: $${d.value}k`}
          />
          <span className="text-[10px] text-base-content/40">{d.month}</span>
        </div>
      ))}
    </div>
  );
};

const StatusPill = ({ status }: { status: Order["status"] }) => {
  const styles: Record<Order["status"], string> = {
    Paid: "bg-green-100 text-green-800",
    Pending: "bg-amber-100 text-amber-800",
    Processing: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function Dashboard() {
  return <>
    <Head title="Dashboard" />
    <DashboardLayout>
      {/* Stats */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-base-100 border border-base-300 rounded-xl p-3.5"
          >
            <div className="text-xs text-base-content/50 mb-1.5">{s.label}</div>
            <div
              className="text-[22px] font-semibold text-base-content leading-none mb-1.5"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {s.value}
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full font-medium ${s.up ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
            >
              {s.up ? "↑" : "↓"} {s.change}
            </span>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 280px" }}>
        {/* Chart */}
        <div className="bg-base-100 border border-base-300 rounded-xl p-4">
          <div className="flex items-center mb-4">
            <h2
              className="text-[14px] font-semibold text-base-content flex-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Monthly Revenue
            </h2>
            <span className="text-xs text-base-content/40">Last 7 months</span>
          </div>
          <BarChart data={barData} />
        </div>

        {/* Activity */}
        <div className="bg-base-100 border border-base-300 rounded-xl p-4">
          <h2
            className="text-[14px] font-semibold text-base-content mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Activity
          </h2>
          <div className="flex flex-col">
            {activities.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 py-2.5 border-b border-base-200 last:border-0"
              >
                <div
                  className="w-2 h-2 rounded-full mt-1 shrink-0"
                  style={{ background: a.color }}
                />
                <div>
                  <div className="text-[13px] text-base-content leading-snug">{a.text}</div>
                  <div className="text-[11px] text-base-content/40 mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-base-100 border border-base-300 rounded-xl p-4">
        <div className="flex items-center mb-4">
          <h2
            className="text-[14px] font-semibold text-base-content flex-1"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Recent orders
          </h2>
          <span className="text-xs text-base-content/40">Showing 5 of 247</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {["Customer", "Product", "Amount", "Date", "Status"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[11px] text-base-content/40 uppercase tracking-wider px-3 py-1.5 border-b border-base-200 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="hover:bg-base-200 transition-colors">
                  <td className="px-3 py-2.5 text-[13px] text-base-content border-b border-base-200">{o.customer}</td>
                  <td className="px-3 py-2.5 text-[13px] text-base-content border-b border-base-200">{o.product}</td>
                  <td className="px-3 py-2.5 text-[13px] text-base-content border-b border-base-200">{o.amount}</td>
                  <td className="px-3 py-2.5 text-[13px] text-base-content border-b border-base-200">{o.date}</td>
                  <td className="px-3 py-2.5 border-b border-base-200">
                    <StatusPill status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  </>
}