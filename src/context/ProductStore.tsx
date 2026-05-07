import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { PRODUCTS, SEED_VERSION, type Product } from "@/lib/products";

type Ctx = {
  products: Product[];
  get: (id: string) => Product | undefined;
  upsert: (p: Product) => void;
  remove: (id: string) => void;
  resetSeed: () => void;
  decrementStock: (items: { productId: string; qty: number }[]) => void;
};

const ProductCtx = createContext<Ctx | null>(null);
const KEY = "vendoo-products";
const VERSION_KEY = "vendoo-products-version";

export function ProductStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(VERSION_KEY) ?? "0");
      const raw = localStorage.getItem(KEY);
      if (raw && v === SEED_VERSION) {
        setProducts(JSON.parse(raw));
      } else {
        localStorage.setItem(KEY, JSON.stringify(PRODUCTS));
        localStorage.setItem(VERSION_KEY, String(SEED_VERSION));
      }
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try { setProducts(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (next: Product[]) => {
    setProducts(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const get = useCallback((id: string) => products.find((p) => p.id === id), [products]);
  const upsert = (p: Product) => {
    const exists = products.some((x) => x.id === p.id);
    persist(exists ? products.map((x) => (x.id === p.id ? p : x)) : [p, ...products]);
  };
  const remove = (id: string) => persist(products.filter((p) => p.id !== id));
  const resetSeed = () => persist(PRODUCTS);
  const decrementStock: Ctx["decrementStock"] = (items) => {
    const map = new Map<string, number>();
    items.forEach((i) => map.set(i.productId, (map.get(i.productId) ?? 0) + i.qty));
    persist(
      products.map((p) =>
        map.has(p.id) ? { ...p, stock: Math.max(0, (p.stock ?? 0) - (map.get(p.id) ?? 0)) } : p
      )
    );
  };

  return (
    <ProductCtx.Provider value={{ products, get, upsert, remove, resetSeed, decrementStock }}>{children}</ProductCtx.Provider>
  );
}

export const useProducts = () => {
  const c = useContext(ProductCtx);
  if (!c) throw new Error("useProducts must be used inside ProductStoreProvider");
  return c;
};
