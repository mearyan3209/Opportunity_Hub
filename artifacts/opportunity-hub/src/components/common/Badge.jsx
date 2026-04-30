import { CATEGORY_COLORS } from "../../utils/categories.js";

export default function Badge({ children, color, category }) {
  const cls =
    color ||
    (category && CATEGORY_COLORS[category]) ||
    "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {children}
    </span>
  );
}
