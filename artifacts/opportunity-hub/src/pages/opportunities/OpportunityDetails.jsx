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

export default function OpportunityDetails() {
  const { id } = useParams();
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl">
        {error}
      </div>
    );
  }
  if (!opp) return <Loader />;

  return (
    <div className="space-y-6 fade-in">
      <Link
        to="/opportunities"
        className="text-sm text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
      >
        ← Back to opportunities
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge category={opp.category}>{opp.category}</Badge>
          <Badge color="bg-gray-100 text-gray-700">{opp.level}</Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {opp.title}
        </h1>
        <p className="text-gray-600 leading-relaxed mb-5">{opp.description}</p>

        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          <Stat label="Deadline" value={formatDate(opp.deadline)} />
          <Stat label="Status" value={deadlineLabel(opp.deadline)} />
          <Stat label="Eligibility" value={opp.eligibility} small />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} variant={saved ? "success" : "primary"}>
            {saved ? "✓ Saved" : "Save Opportunity"}
          </Button>
          {opp.officialLink && (
            <a
              href={opp.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-xl"
            >
              Visit Official Site ↗
            </a>
          )}
          {opp.quiz && opp.quiz.length > 0 && (
            <Link
              to={`/quiz/${opp._id}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
            >
              Take Quiz ({opp.quiz.length} questions)
            </Link>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {opp.syllabus && opp.syllabus.length > 0 && (
          <Section title="Syllabus / Topics">
            <ul className="space-y-2">
              {opp.syllabus.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        )}
        {opp.resources && opp.resources.length > 0 && (
          <Section title="Resources">
            <ul className="space-y-2">
              {opp.resources.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    {r.title} ↗
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}
        {opp.pyqs && opp.pyqs.length > 0 && (
          <Section title="Previous Year Papers">
            <ul className="space-y-2">
              {opp.pyqs.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    {r.title} ↗
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
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`font-semibold text-gray-900 ${small ? "text-sm" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}
