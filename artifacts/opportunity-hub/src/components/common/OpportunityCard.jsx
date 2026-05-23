import { Link } from "react-router-dom";
import Badge from "./Badge.jsx";
import { deadlineLabel, daysUntil } from "../../utils/formatDate.js";
import { CATEGORY_GRADIENTS } from "../../utils/categories.js";

export default function OpportunityCard({ opportunity, saved, onToggleSave }) {
  const days = daysUntil(opportunity.deadline);
  const urgency =
    days === null
      ? "text-gray-500"
      : days < 0
        ? "text-gray-400"
        : days <= 7
          ? "text-red-600 font-semibold"
          : days <= 30
            ? "text-amber-600"
            : "text-emerald-600";

  const urgencyBg =
    days === null
      ? "bg-gray-50"
      : days < 0
        ? "bg-gray-50"
        : days <= 7
          ? "bg-red-50"
          : days <= 30
            ? "bg-amber-50"
            : "bg-emerald-50";

  const gradient = CATEGORY_GRADIENTS[opportunity.category] || "from-gray-400 to-gray-600";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-200 card-hover transition-all duration-300 p-0 flex flex-col h-full overflow-hidden fade-in group">
      {/* Gradient top bar */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge category={opportunity.category}>{opportunity.category}</Badge>
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleSave(opportunity._id);
              }}
              className={`transition-all duration-200 ${
                saved 
                  ? "text-indigo-600 scale-110" 
                  : "text-gray-300 hover:text-indigo-600"
              }`}
              aria-label="Save"
              title={saved ? "Unsave" : "Save"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={saved ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
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

        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:gradient-text transition-all duration-300">
          {opportunity.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
          {opportunity.description}
        </p>

        <div className={`rounded-lg p-2.5 mb-4 ${urgencyBg}`}>
          <span className={`text-xs font-medium ${urgency}`}>
            ⏱ {deadlineLabel(opportunity.deadline)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500">
            Level: <span className="text-indigo-600 font-semibold">{opportunity.level}</span>
          </span>
          <Link
            to={`/opportunities/${opportunity._id}`}
            className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-3 py-1.5 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Explore →
          </Link>
        </div>
      </div>
    </div>
  );
}
