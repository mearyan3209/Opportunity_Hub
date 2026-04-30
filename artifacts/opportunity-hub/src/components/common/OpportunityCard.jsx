import { Link } from "react-router-dom";
import Badge from "./Badge.jsx";
import { deadlineLabel, daysUntil } from "../../utils/formatDate.js";

export default function OpportunityCard({ opportunity, saved, onToggleSave }) {
  const days = daysUntil(opportunity.deadline);
  const urgency =
    days === null
      ? "text-gray-500"
      : days < 0
        ? "text-gray-400"
        : days <= 7
          ? "text-red-600"
          : days <= 30
            ? "text-amber-600"
            : "text-emerald-600";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition p-5 flex flex-col h-full fade-in">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Badge category={opportunity.category}>{opportunity.category}</Badge>
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleSave(opportunity._id);
            }}
            className="text-gray-300 hover:text-indigo-600 transition"
            aria-label="Save"
            title={saved ? "Unsave" : "Save"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={saved ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className={`w-6 h-6 ${saved ? "text-indigo-600" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          </button>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1.5 leading-tight">
        {opportunity.title}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {opportunity.description}
      </p>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
        <span className={`text-xs font-medium ${urgency}`}>
          {deadlineLabel(opportunity.deadline)}
        </span>
        <Link
          to={`/opportunities/${opportunity._id}`}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View →
        </Link>
      </div>
    </div>
  );
}
