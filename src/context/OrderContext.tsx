import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type OrderStatus = "processing" | "paid" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
};

export type Order = {
  id: string;
  userEmail: string;
  customerName: string;
  shippingAddress: { line1: string; city: string; postal: string };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: "pending" | "succeeded";
  createdAt: number;
  updatedAt: number;
};

type Ctx = {
  orders: Order[];
  myOrders: (email: string) => Order[];
  get: (id: string) => Order | undefined;
  create: (o: Omit<Order, "id" | "status" | "paymentStatus" | "createdAt" | "updatedAt">) => Order;
  setStatus: (id: string, status: OrderStatus) => void;
};

const OrderCtx = createContext<Ctx | null>(null);
const KEY = "vendoo-orders";

function id() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `VND-${Date.now().toString().slice(-5)}${n}`.slice(0, 12);
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setOrders(JSON.parse(raw));
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try { setOrders(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (next: Order[]) => {
    setOrders(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const create: Ctx["create"] = (o) => {
    const now = Date.now();
    const order: Order = {
      ...o,
      id: id(),
      status: "processing",
      paymentStatus: "succeeded",
      createdAt: now,
      updatedAt: now,
    };
    persist([order, ...orders]);
    return order;
  };

  const setStatus = (id: string, status: OrderStatus) => {
    persist(orders.map((o) => (o.id === id ? { ...o, status, updatedAt: Date.now() } : o)));
  };

  const myOrders = (email: string) =>
    orders.filter((o) => o.userEmail.toLowerCase() === email.toLowerCase()).sort((a, b) => b.createdAt - a.createdAt);
  const get = (id: string) => orders.find((o) => o.id === id);

  return (
    <OrderCtx.Provider value={{ orders, myOrders, get, create, setStatus }}>{children}</OrderCtx.Provider>
  );
}

export const useOrders = () => {
  const c = useContext(OrderCtx);
  if (!c) throw new Error("useOrders must be used inside OrderProvider");
  return c;
};
