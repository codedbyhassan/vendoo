import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { email: string; name: string };
type Ctx = {
  user: User | null;
  isAdmin: boolean;
  signIn: (email: string, name?: string) => User;
  signOut: () => void;
};

const AuthCtx = createContext<Ctx | null>(null);
const KEY = "vendoo-user";
export const ADMIN_EMAILS = ["poundsghst@gmail.com"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const signIn = (email: string, name?: string) => {
    const u: User = { email: email.trim().toLowerCase(), name: name?.trim() || email.split("@")[0] };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return u;
  };
  const signOut = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email);

  return <AuthCtx.Provider value={{ user, isAdmin, signIn, signOut }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};
