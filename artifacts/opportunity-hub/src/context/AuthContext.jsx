import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../api/authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("oh_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const data = await authApi.login(email, password);
        localStorage.setItem("oh_token", data.token);
        localStorage.setItem("oh_user", JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const data = await authApi.register(payload);
      localStorage.setItem("oh_token", data.token);
      localStorage.setItem("oh_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("oh_token");
    localStorage.removeItem("oh_user");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // Listen for forced logout from axios interceptor
  useEffect(() => {
    const handler = () => {
      setUser(null);
      navigate("/login");
    };
    window.addEventListener("oh:logout", handler);
    return () => window.removeEventListener("oh:logout", handler);
  }, [navigate]);

  // Re-validate user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("oh_token");
    if (token && !user) {
      authApi
        .me()
        .then((u) => {
          setUser(u);
          localStorage.setItem("oh_user", JSON.stringify(u));
        })
        .catch(() => {
          localStorage.removeItem("oh_token");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = { user, loading, login, register, logout, setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
