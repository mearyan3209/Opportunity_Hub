import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAuth } from "../../context/AuthContext.jsx";
import { getDashboard } from "../../api/opportunityApi.js";
import OpportunityCard from "../../components/common/OpportunityCard.jsx";
import Loader from "../../components/common/Loader.jsx";
import { CATEGORIES } from "../../utils/categories.js";

const PIE_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#8B5CF6", "#0EA5E9"];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) =>
        setError(e?.response?.data?.message || "Failed to load dashboard"),
      );
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl">
        {error}
      </div>
    );
  }
  if (!data) return <Loader label="Loading your dashboard..." />;

  const quizChartData = (data.quizScores || []).slice(-6).map((q, i) => ({
    name: `Quiz ${i + 1}`,
    score: q.total > 0 ? Math.round((q.score / q.total) * 100) : 0,
  }));

  // Build category pie from recommended + recent
  const all = [...(data.recommended || []), ...(data.recent || [])];
  const counts = {};
  all.forEach((o) => {
    counts[o.category] = (counts[o.category] || 0) + 1;
  });
  const pieData = CATEGORIES.map((c) => ({ name: c, value: counts[c] || 0 })).filter(
    (d) => d.value > 0,
  );

  return (
    <div className="space-y-6 fade-in">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-indigo-50">
          You're a {user?.educationLevel}. Here's what's happening today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Saved"
          value={data.savedCount}
          color="bg-indigo-50 text-indigo-700"
          icon="bookmark"
        />
        <StatCard
          label="Upcoming Deadlines"
          value={data.upcomingDeadlines}
          color="bg-amber-50 text-amber-700"
          icon="clock"
        />
        <StatCard
          label="Avg Quiz Score"
          value={`${data.avgScore}%`}
          color="bg-emerald-50 text-emerald-700"
          icon="trophy"
        />
        <StatCard
          label="Profile Progress"
          value={`${data.progress}%`}
          color="bg-violet-50 text-violet-700"
          icon="chart"
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Quiz Scores</h3>
          {quizChartData.length === 0 ? (
            <div className="text-sm text-gray-500 py-12 text-center">
              No quiz attempts yet. Take a quiz from any opportunity to see scores here.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={quizChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Opportunities by Category</h3>
          {pieData.length === 0 ? (
            <div className="text-sm text-gray-500 py-12 text-center">
              No data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(e) => e.name}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recommended */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Recommended for you</h3>
          <Link
            to="/opportunities"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            See all →
          </Link>
        </div>
        {data.recommended.length === 0 ? (
          <p className="text-sm text-gray-500 bg-white border border-gray-100 rounded-2xl p-8 text-center">
            No upcoming opportunities for your level right now.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recommended.slice(0, 6).map((o) => (
              <OpportunityCard key={o._id} opportunity={o} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  const icons = {
    bookmark: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z",
    clock: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    trophy: "M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0",
    chart: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <span className={`p-1.5 rounded-lg ${color}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={icons[icon]} />
          </svg>
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
