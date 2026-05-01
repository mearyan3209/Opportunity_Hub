import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="px-4 md:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-gray-800">
            {title || "Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === "admin" && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
              Admin
            </span>
          )}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.name?.split(" ")[0]}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
