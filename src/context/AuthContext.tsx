import { createContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Role, User } from "@/interfaces/user";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, _password: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  register: (name: string, email: string, _password: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_ORGANIZATION_ID = "org-demo";

function buildUser(name: string, email: string, role: Role = "diseñador"): User {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    organizationId: DEMO_ORGANIZATION_ID,
    name,
    email,
    role,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * No hay backend todavia: esta implementacion simula la sesion en localStorage.
 * Cuando exista una API real, solo debe cambiar el cuerpo de estas funciones
 * (login/register/requestPasswordReset) para llamar a services/auth via src/api.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>("sfv-auth-user", null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login: async (email) => {
        setUser(buildUser(email.split("@")[0] ?? "Usuario", email));
      },
      loginAsDemo: async () => {
        setUser(buildUser("Ingeniero Demo", "demo@sfv.app"));
      },
      register: async (name, email) => {
        setUser(buildUser(name, email));
      },
      requestPasswordReset: async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
      },
      logout: () => setUser(null)
    }),
    [user, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
