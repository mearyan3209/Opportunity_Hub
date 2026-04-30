import { useEffect, useState } from "react";
import { getSaved, toggleSave } from "../../api/opportunityApi.js";
import OpportunityCard from "../../components/common/OpportunityCard.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Saved() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSaved()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleSave = async (id) => {
    const prev = items;
    setItems((arr) => arr.filter((i) => i._id !== id));
    try {
      await toggleSave(id);
    } catch {
      setItems(prev);
    }
  };

  if (loading) return <Loader label="Loading saved..." />;

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Saved Opportunities</h2>
        <p className="text-sm text-gray-500">
          {items.length} opportunit{items.length === 1 ? "y" : "ies"} bookmarked
        </p>
      </div>
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500 mb-3">You haven't saved any opportunities yet.</p>
          <a
            href="/opportunities"
            className="inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
          >
            Browse opportunities
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((o) => (
            <OpportunityCard
              key={o._id}
              opportunity={o}
              saved
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
