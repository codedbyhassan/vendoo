import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useOrders, type OrderStatus } from "@/context/OrderContext";
import { Package } from "lucide-react";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My orders — Vendoo" }] }),
  component: Page,
});

const STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "Processing",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function StatusPill({ s }: { s: OrderStatus }) {
  const tone =
    s === "delivered" ? "bg-accent/30 text-cocoa dark:text-accent" :
    s === "shipped" ? "bg-foreground/10 text-foreground" :
    s === "paid" ? "bg-secondary text-foreground" :
    s === "cancelled" ? "bg-destructive/15 text-destructive" :
    "bg-secondary text-muted-foreground";
  const live = s === "processing" || s === "paid" || s === "shipped";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current ${live ? "animate-pulse" : ""}`} />
      {STATUS_LABEL[s]}
    </span>
  );
}

function Page() {
  const { user } = useAuth();
  const { myOrders } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/signin", search: { redirect: "/orders" } });
  }, [user, navigate]);

  if (!user) return null;
  const orders = myOrders(user.email);

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account</p>
        <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">My orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">Live status updates as your order is processed.</p>

        {orders.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border/60 p-16 text-center">
            <Package className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No orders yet.</p>
            <Link to="/shop" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-4">
            {orders.map((o, idx) => (
              <motion.li
                key={o.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
              >
                <Link
                  to="/order/$id"
                  params={{ id: o.id }}
                  className="glass-strong block rounded-3xl p-6 shadow-soft transition-smooth hover:scale-[1.01]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Order</p>
                      <p className="mt-0.5 font-display text-lg font-semibold">{o.id}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-semibold">${o.total}</p>
                      <div className="mt-2"><StatusPill s={o.status} /></div>
                    </div>
                  </div>
                  <div className="mt-4 flex -space-x-3">
                    {o.items.slice(0, 5).map((it, idx) => (
                      <img key={idx} src={it.image} alt="" className="h-14 w-12 rounded-xl border-2 border-background object-cover" />
                    ))}
                    {o.items.length > 5 && (
                      <div className="flex h-14 w-12 items-center justify-center rounded-xl border-2 border-background bg-secondary text-xs">
                        +{o.items.length - 5}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
