import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/products";

export type CartItem = { product: Product; size?: string; color?: string; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (p: Product, opts?: { size?: string; color?: string; qty?: number }) => void;
  remove: (id: string, size?: string, color?: string) => void;
  setQty: (id: string, size: string | undefined, color: string | undefined, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);

const key = (id: string, size?: string, color?: string) => `${id}::${size ?? ""}::${color ?? ""}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vendoo-cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("vendoo-cart", JSON.stringify(items));
  }, [items]);

  const add: CartCtx["add"] = (product, opts = {}) => {
    const { size, color, qty = 1 } = opts;
    setItems((cur) => {
      const k = key(product.id, size, color);
      const found = cur.find((i) => key(i.product.id, i.size, i.color) === k);
      if (found) return cur.map((i) => (key(i.product.id, i.size, i.color) === k ? { ...i, qty: i.qty + qty } : i));
      return [...cur, { product, size, color, qty }];
    });
  };
  const remove: CartCtx["remove"] = (id, size, color) =>
    setItems((cur) => cur.filter((i) => key(i.product.id, i.size, i.color) !== key(id, size, color)));
  const setQty: CartCtx["setQty"] = (id, size, color, qty) =>
    setItems((cur) =>
      qty <= 0
        ? cur.filter((i) => key(i.product.id, i.size, i.color) !== key(id, size, color))
        : cur.map((i) => (key(i.product.id, i.size, i.color) === key(id, size, color) ? { ...i, qty } : i))
    );
  const clear = () => setItems([]);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.product.price, 0),
    }),
    [items]
  );

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, count, subtotal }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};
