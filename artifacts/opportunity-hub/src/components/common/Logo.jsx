export default function Logo({ size = 36, showText = false, textClass = "" }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        style={{ width: size, height: size }}
        className="rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center shadow-md flex-shrink-0"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          style={{ width: size * 0.62, height: size * 0.62 }}
        >
          <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.4" strokeOpacity="0.45" />
          <circle cx="12" cy="12" r="5.5" stroke="white" strokeWidth="1.4" strokeOpacity="0.7" />
          <circle cx="12" cy="12" r="2.2" fill="white" />
          <path d="M19 5L14.5 9.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M19 5h-4M19 5v4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {showText && (
        <div>
          <p className={`font-extrabold leading-tight tracking-tight ${textClass || "text-gray-900"}`}>
            Opportunity<span className="text-indigo-600">Hub</span>
          </p>
          <p className="text-[10px] text-gray-400 font-medium tracking-wide">Discover. Apply. Win.</p>
        </div>
      )}
    </div>
  );
}
