import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken } from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(Boolean(getToken()));
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api("/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => {
        localStorage.removeItem("nexa_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);
  const login = async (email, password) => {
    const d = await api("/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
    localStorage.setItem("nexa_token", d.token);
    setUser(d.user);
    return d.user;
  };
  const register = async (payload) => {
    await api("/auth/register", { method: "POST", auth: false, body: payload });
    return login(payload.email, payload.password);
  };
  const logout = () => {
    localStorage.removeItem("nexa_token");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
