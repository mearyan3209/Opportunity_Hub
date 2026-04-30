import axios from "axios";

// All API requests go through the shared proxy at /api
const api = axios.create({
  baseURL: "/api",
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
        // Soft redirect (don't blow up app routing)
        window.dispatchEvent(new Event("oh:logout"));
      }
    }
    return Promise.reject(err);
  },
);

export default api;
