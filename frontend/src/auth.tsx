import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";
import type { Admin } from "./types";

interface AuthContextValue {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setAdmin: (admin: Admin | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await api.me();
      setAdmin(data.admin);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      admin,
      loading,
      refresh,
      login: async (email, password) => {
        const data = await api.login(email, password);
        setAdmin(data.admin);
      },
      logout: async () => {
        await api.logout();
        setAdmin(null);
      },
      setAdmin,
    }),
    [admin, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
