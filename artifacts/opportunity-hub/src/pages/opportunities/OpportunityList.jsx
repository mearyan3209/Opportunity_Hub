import { useEffect, useMemo, useState } from "react";
import { listOpportunities, toggleSave, getSaved } from "../../api/opportunityApi.js";
import OpportunityCard from "../../components/common/OpportunityCard.jsx";
import SearchBar from "../../components/common/SearchBar.jsx";
import Loader from "../../components/common/Loader.jsx";
import { CATEGORIES } from "../../utils/categories.js";

export default function OpportunityList() {
  const [items, setItems] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tab, setTab] = useState("upcoming"); // upcoming | past

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
  }, [items, search, category, tab]);

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Browse Opportunities</h2>
        <p className="text-sm text-gray-500">
          {items.length} opportunities · filter and apply before deadlines
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setCategory("")}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
              !category
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                category === c
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1 border-t border-gray-100 pt-3">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              tab === "upcoming"
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab("past")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              tab === "past"
                ? "bg-gray-200 text-gray-800"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
          No opportunities match your filters.
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
