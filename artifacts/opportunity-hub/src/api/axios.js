import axios from "axios";

// Resolve API base URL:
// - Prefer `VITE_API_BASE` if set (e.g. in .env)
// - Otherwise use the current host with port 5000 (backend default)
const envBase = import.meta.env.VITE_API_BASE;
const apiPort = import.meta.env.VITE_API_PORT ?? 5000;
const apiBase = envBase ?? `${window.location.protocol}//${window.location.hostname}:${apiPort}/api`;

const api = axios.create({
  baseURL: apiBase,
  headers: { "Content-Type": "application/json" },
});

// Inject Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("oh_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      const path = window.location.pathname;
      if (!path.includes("/login") && !path.includes("/register")) {
        localStorage.removeItem("oh_token");
        localStorage.removeItem("oh_user");
        window.dispatchEvent(new Event("oh:logout"));
      }
    }
    return Promise.reject(err);
  },
);

export default api;