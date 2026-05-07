import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  count: number;
};

const WishCtx = createContext<Ctx | null>(null);
const KEY = "vendoo-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const has = (id: string) => ids.includes(id);
  const toggle = (id: string) =>
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur]));
  const remove = (id: string) => setIds((cur) => cur.filter((x) => x !== id));

  return (
    <WishCtx.Provider value={{ ids, has, toggle, remove, count: ids.length }}>{children}</WishCtx.Provider>
  );
}

export const useWishlist = () => {
  const c = useContext(WishCtx);
  if (!c) throw new Error("useWishlist must be used inside WishlistProvider");
  return c;
};
