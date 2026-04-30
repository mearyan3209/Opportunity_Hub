import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            {title || "OpportunityHub"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-gray-600">
            Hi, <span className="font-medium text-gray-900">{user?.name?.split(" ")[0]}</span>
          </span>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
