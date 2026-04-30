import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getDashboard, updateProgress } from "../../api/opportunityApi.js";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import { formatDate } from "../../utils/formatDate.js";

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDashboard().then((d) => {
      setData(d);
      setProgress(d.progress);
    });
  }, []);

  const handleProgressSave = async () => {
    setSaving(true);
    try {
      await updateProgress(progress);
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <Loader />;

  return (
    <div className="space-y-6 fade-in">
      <h2 className="text-2xl font-bold text-gray-900">Profile</h2>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 text-white text-2xl font-bold flex items-center justify-center">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">
              {user?.role} · {user?.educationLevel}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <Stat label="Saved" value={data.savedCount} />
          <Stat label="Quizzes Taken" value={data.quizScores?.length || 0} />
          <Stat label="Avg Score" value={`${data.avgScore}%`} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-2">Profile Completion</h3>
        <p className="text-sm text-gray-500 mb-4">
          Track how much of your preparation profile you've completed.
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{progress}% complete</span>
            <span className="text-gray-400">{100 - progress}% to go</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <Button onClick={handleProgressSave} disabled={saving} variant="success">
            {saving ? "Saving..." : "Save progress"}
          </Button>
        </div>
      </div>

      {data.quizScores && data.quizScores.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Quiz History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="py-2 pr-4 font-medium text-gray-500">Date</th>
                  <th className="py-2 pr-4 font-medium text-gray-500">Score</th>
                  <th className="py-2 pr-4 font-medium text-gray-500">%</th>
                </tr>
              </thead>
              <tbody>
                {data.quizScores
                  .slice()
                  .reverse()
                  .map((q, i) => {
                    const pct = q.total > 0 ? Math.round((q.score / q.total) * 100) : 0;
                    return (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-2 pr-4 text-gray-700">
                          {formatDate(q.takenAt)}
                        </td>
                        <td className="py-2 pr-4 text-gray-900 font-medium">
                          {q.score} / {q.total}
                        </td>
                        <td className="py-2 pr-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              pct >= 70
                                ? "bg-emerald-100 text-emerald-700"
                                : pct >= 40
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
