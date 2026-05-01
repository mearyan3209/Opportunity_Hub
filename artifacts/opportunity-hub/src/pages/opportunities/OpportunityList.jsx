import { useEffect, useMemo, useState } from "react";
import { listOpportunities, toggleSave, getSaved } from "../../api/opportunityApi.js";
import OpportunityCard from "../../components/common/OpportunityCard.jsx";
import SearchBar from "../../components/common/SearchBar.jsx";
import Loader from "../../components/common/Loader.jsx";
import { CATEGORIES, LEVELS } from "../../utils/categories.js";
import { useAuth } from "../../context/AuthContext.jsx";

/* Map education levels → filter labels */
const LEVEL_LABELS = LEVELS.filter((l) => l !== "All");

export default function OpportunityList() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tab, setTab] = useState("upcoming");
  /* Auto-seed level from user's profile (can be changed) */
  const [level, setLevel] = useState(user?.educationLevel || "");

  useEffect(() => {
    Promise.all([listOpportunities(), getSaved().catch(() => [])])
      .then(([list, saved]) => {
        setItems(list);
        setSavedIds(new Set(saved.map((s) => s._id)));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    return items
      .filter((o) =>
        tab === "upcoming"
          ? new Date(o.deadline).getTime() >= now
          : new Date(o.deadline).getTime() < now,
      )
      .filter((o) => !category || o.category === category)
      .filter((o) => !level || o.level === level)
      .filter((o) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      );
  }, [items, search, category, level, tab]);

  const handleToggleSave = async (id) => {
    const prev = new Set(savedIds);
    const next = new Set(savedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSavedIds(next);
    try {
      await toggleSave(id);
    } catch {
      setSavedIds(prev);
    }
  };

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Browse Opportunities</h2>
          <p className="text-sm text-gray-500">
            {items.length} total · {filtered.length} match your filters
          </p>
        </div>
        {user?.educationLevel && (
          <span className="inline-flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full font-semibold">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
            </svg>
            Showing for: {user.educationLevel}
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-4">
        <SearchBar value={search} onChange={setSearch} />

        {/* Level filter — auto-seeded from profile */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">My Level</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLevel("")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                !level
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Levels
            </button>
            {LEVEL_LABELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(level === l ? "" : l)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                  level === l
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {l}
                {l === user?.educationLevel && (
                  <span className="ml-1 opacity-70">• you</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                !category
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(category === c ? "" : c)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                  category === c
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming / Past tab */}
        <div className="flex gap-1 border-t border-gray-100 pt-3">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              tab === "upcoming"
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            ✅ Upcoming
          </button>
          <button
            onClick={() => setTab("past")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              tab === "past"
                ? "bg-gray-200 text-gray-800"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            📁 Past / Closed
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-semibold text-gray-700 mb-1">No results</h3>
          <p className="text-sm text-gray-500 mb-4">
            No opportunities match your current filters.
          </p>
          <button
            onClick={() => { setSearch(""); setCategory(""); setLevel(""); }}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((o) => (
            <OpportunityCard
              key={o._id}
              opportunity={o}
              saved={savedIds.has(o._id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
