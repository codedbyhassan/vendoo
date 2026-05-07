import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = { ids: string[]; push: (id: string) => void; clear: () => void };
const C = createContext<Ctx | null>(null);
const KEY = "vendoo-recent";

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setIds(JSON.parse(raw)); } catch {}
  }, []);
  const persist = (next: string[]) => { setIds(next); localStorage.setItem(KEY, JSON.stringify(next)); };
  const push = useCallback((id: string) => {
    setIds((cur) => {
      const next = [id, ...cur.filter((x) => x !== id)].slice(0, 8);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const clear = () => persist([]);
  return <C.Provider value={{ ids, push, clear }}>{children}</C.Provider>;
}
export const useRecentlyViewed = () => {
  const c = useContext(C);
  if (!c) throw new Error("useRecentlyViewed must be used inside RecentlyViewedProvider");
  return c;
};
