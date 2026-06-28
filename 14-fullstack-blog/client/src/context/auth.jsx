import { createContext, useContext, useState, useCallback } from "react";
import { login as apiLogin, setAuthToken, getAuthToken } from "../api.js";

const AuthContext = createContext(null);

// Holds the single-admin auth state. The token itself lives in api.js
// (memory + sessionStorage); this mirrors it as React state for the UI.
export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken());

  const login = useCallback(async (password) => {
    const data = await apiLogin(password);
    setAuthToken(data.token);
    setToken(data.token);
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthed: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
