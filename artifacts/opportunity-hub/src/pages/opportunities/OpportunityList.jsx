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
      .filter((o) => !level || o.level === level || o.level === "All")
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
    <div className="space-y-6 fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Explore Opportunities
          </h2>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filtered.length}</span> opportunities match your filters · <span className="text-gray-500">{items.length} total</span>
          </p>
        </div>
        {user?.educationLevel && (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 rounded-xl font-semibold text-sm shadow-sm">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
            </svg>
            Filtered for: <span className="font-bold ml-1">{user.educationLevel}</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
        <SearchBar value={search} onChange={setSearch} />

        {/* Tab filter */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Timeline</p>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("upcoming")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                tab === "upcoming"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📅 Upcoming
            </button>
            <button
              onClick={() => setTab("closed")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                tab === "closed"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ✓ Closed
            </button>
          </div>
        </div>

        {/* Level filter — auto-seeded from profile */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Education Level</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLevel("")}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                !level
                  ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🌐 All Levels
            </button>
            {LEVEL_LABELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(level === l ? "" : l)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  level === l
                    ? `bg-gradient-to-r ${level === "School" ? "from-rose-600 to-pink-600" : level === "Class 11-12" ? "from-blue-600 to-cyan-600" : level === "UG Aspirant" ? "from-teal-600 to-green-600" : "from-purple-600 to-indigo-600"} text-white shadow-lg`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {l}
                {l === user?.educationLevel && (
                  <span className="ml-1.5 font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
          {level && (
            <p className="text-xs text-indigo-600 mt-2 font-medium">
              💡 Showing opportunities for: <span className="font-bold">{level}</span>
            </p>
          )}
        </div>

        {/* Category filter */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Category</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("")}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                !category
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ✨ All Categories
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(category === c ? "" : c)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  category === c
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 font-medium">No opportunities match your filters</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((opp) => (
            <OpportunityCard
              key={opp._id}
              opportunity={opp}
              saved={savedIds.has(opp._id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
