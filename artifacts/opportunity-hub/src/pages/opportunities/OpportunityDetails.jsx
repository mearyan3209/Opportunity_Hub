import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getOpportunity,
  toggleSave,
  getSaved,
} from "../../api/opportunityApi.js";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import { formatDate, deadlineLabel } from "../../utils/formatDate.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function OpportunityDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [opp, setOpp] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getOpportunity(id), getSaved().catch(() => [])])
      .then(([o, savedList]) => {
        setOpp(o);
        setSaved(savedList.some((s) => s._id === id));
      })
      .catch((e) =>
        setError(e?.response?.data?.message || "Failed to load opportunity"),
      );
  }, [id]);

  const handleSave = async () => {
    setSaved((s) => !s);
    try {
      await toggleSave(id);
    } catch {
      setSaved((s) => !s);
    }
  };

  // Check if opportunity is not suitable for user's education level
  const isEligibilityMismatch = user && opp && user.educationLevel && opp.level !== "All" && opp.level !== user.educationLevel;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
        {error}
      </div>
    );
  }
  if (!opp) return <Loader />;

  return (
    <div className="space-y-6 fade-in">
      <Link
        to="/opportunities"
        className="text-sm text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 font-semibold"
      >
        ← Back to Opportunities
      </Link>

      {/* Eligibility Warning */}
      {isEligibilityMismatch && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-amber-900">Eligibility Notice</p>
            <p className="text-sm text-amber-800 mt-0.5">
              This opportunity is for <span className="font-bold">{opp.level}</span> students, but your profile shows <span className="font-bold">{user.educationLevel}</span>. You may not be eligible.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge category={opp.category}>{opp.category}</Badge>
          <Badge color="bg-blue-100 text-blue-800 font-semibold">{opp.level}</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {opp.title}
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">{opp.description}</p>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <Stat label="📅 Deadline" value={formatDate(opp.deadline)} />
          <Stat label="⏱ Status" value={deadlineLabel(opp.deadline)} />
          <Stat label="✓ Eligibility" value={opp.eligibility} small />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSave} variant={saved ? "success" : "primary"}>
            {saved ? "✓ Saved" : "💾 Save Opportunity"}
          </Button>
          {opp.officialLink && (
            <a
              href={opp.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 bg-white border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 rounded-xl transition-all duration-200"
            >
              🔗 Official Website
            </a>
          )}
          {opp.quiz && opp.quiz.length > 0 && (
            <Link
              to={`/quiz/${opp._id}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105"
            >
              🎯 Take Quiz ({opp.quiz.length} Questions)
            </Link>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {opp.syllabus && opp.syllabus.length > 0 && (
          <Section title="📚 Syllabus / Topics">
            <ul className="space-y-2">
              {opp.syllabus.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="mt-1 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        )}
        {opp.resources && opp.resources.length > 0 && (
          <Section title="🎓 Resources">
            <ul className="space-y-2">
              {opp.resources.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline font-medium inline-flex items-center gap-1"
                  >
                    {r.title} <span>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}
        {opp.pyqs && opp.pyqs.length > 0 && (
          <Section title="📖 Previous Year Papers">
            <ul className="space-y-2">
              {opp.pyqs.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline font-medium inline-flex items-center gap-1"
                  >
                    {r.title} <span>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, small }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
      <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`font-semibold text-gray-900 ${small ? "text-sm" : "text-base"}`}>
        {value}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 text-lg">{title}</h3>
      {children}
    </div>
  );
}
