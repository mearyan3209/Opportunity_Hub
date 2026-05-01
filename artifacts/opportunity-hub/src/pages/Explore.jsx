import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listOpportunities } from "../api/opportunityApi.js";
import { CATEGORIES, CATEGORY_COLORS } from "../utils/categories.js";
import { deadlineLabel, daysUntil } from "../utils/formatDate.js";
import Logo from "../components/common/Logo.jsx";

function ExploreCard({ opp }) {
  const days = daysUntil(opp.deadline);
  const urgency =
    days === null ? "text-gray-500"
    : days < 0   ? "text-gray-400"
    : days <= 7  ? "text-red-600 font-semibold"
    : days <= 30 ? "text-amber-600"
    : "text-emerald-600";

  const colorClass = CATEGORY_COLORS[opp.category] || "bg-gray-100 text-gray-700";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 p-5 flex flex-col h-full group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {opp.category}
        </span>
        <span className={`text-xs ${urgency} flex-shrink-0`}>
          {deadlineLabel(opp.deadline)}
        </span>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1.5 leading-snug group-hover:text-indigo-700 transition">
        {opp.title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
        {opp.description}
      </p>
      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">{opp.level}</span>
        <Link
          to="/register"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
        >
          Sign up to apply →
        </Link>
      </div>
    </div>
  );
}

export default function Explore() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    listOpportunities()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return items
      .filter((o) => new Date(o.deadline).getTime() >= now)
      .filter((o) => !category || o.category === category)
      .filter((o) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [items, search, category]);

  const counts = useMemo(() => {
    const map = {};
    items.forEach((o) => { map[o.category] = (map[o.category] || 0) + 1; });
    return map;
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── TOPBAR ─────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/">
            <Logo size={32} showText />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO STRIP ─────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white py-12 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Explore Opportunities
          </h1>
          <p className="text-indigo-100 text-base mb-7">
            {items.length} real opportunities — competitive exams, scholarships, olympiads and internships.
            <br className="hidden md:block" />
            Create a free account to save, track deadlines and take practice quizzes.
          </p>
          <div className="flex justify-center gap-3 flex-wrap text-sm font-semibold">
            {CATEGORIES.map((c) => (
              <span key={c} className="px-3 py-1.5 bg-white/20 rounded-full">
                {c} ({counts[c] || 0})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FILTERS ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search JEE, NEET, GATE, scholarship…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${!category ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(category === c ? "" : c)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${category === c ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GRID ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 pb-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500">No upcoming opportunities match your filters.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing <span className="font-semibold text-gray-900">{upcoming.length}</span> upcoming opportunities
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {upcoming.map((o) => (
                <ExploreCard key={o._id} opp={o} />
              ))}
            </div>
          </>
        )}

        {/* CTA banner at bottom */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-extrabold mb-2">Want to save deadlines, take quizzes & track progress?</h3>
          <p className="text-indigo-100 mb-6 text-sm">
            Free account — takes 30 seconds. No card required.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-2xl hover:shadow-xl hover:scale-105 transition-all text-sm"
            >
              Create free account →
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-white/50 text-white font-semibold rounded-2xl hover:bg-white/10 transition text-sm"
            >
              Sign in
            </Link>
          </div>
          <p className="text-indigo-300 text-xs mt-5 font-mono">
            Demo: student@opportunityhub.com / student123
          </p>
        </div>
      </div>
    </div>
  );
}
