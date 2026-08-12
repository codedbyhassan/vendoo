import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { StatusPill } from "./orders";
import { Check, Package, Truck, Sparkles, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/order/$id")({
  head: ({ params }) => ({ meta: [{ title: `Order ${params.id} — Vendooo` }] }),
  component: Page,
});

const STEPS = [
  { key: "processing", label: "Processing", desc: "Order received", Icon: Package },
  { key: "paid", label: "Paid", desc: "Payment confirmed", Icon: CreditCard },
  { key: "shipped", label: "Shipped", desc: "On the way", Icon: Truck },
  { key: "delivered", label: "Delivered", desc: "Enjoy your order", Icon: Sparkles },
] as const;

function Page() {
  const { id } = Route.useParams();
  const { get } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const order = get(id);

  // Re-render every 30s so "X ago" timestamps stay accurate; status itself is reactive via context
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!user) navigate({ to: "/signin", search: { redirect: `/order/${id}` } });
  }, [user, id, navigate]);

  if (!order) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <h1 className="font-display text-3xl">Order not found</h1>
          <Link to="/orders" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
            Back to orders
          </Link>
        </div>
      </Layout>
    );
  }

  const stepIndex = order.status === "cancelled" ? -1 : STEPS.findIndex((s) => s.key === order.status);

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link to="/orders" className="text-xs text-muted-foreground hover:text-foreground">← All orders</Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">{order.id}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusPill s={order.status} />
        </div>

        {/* Vertical timeline */}
        {order.status !== "cancelled" && (
          <div className="glass-strong mt-8 rounded-3xl p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-lg font-semibold">Order timeline</h2>
            <ol className="mt-6 relative">
              <span className="absolute left-[19px] top-2 bottom-2 w-px bg-border" aria-hidden />
              <motion.span
                initial={{ height: 0 }}
                animate={{ height: stepIndex < 0 ? 0 : `calc(${(stepIndex / (STEPS.length - 1)) * 100}% - 0px)` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute left-[19px] top-2 w-px bg-foreground"
                aria-hidden
              />
              {STEPS.map((s, i) => {
                const reached = i <= stepIndex;
                const current = i === stepIndex;
                const Icon = s.Icon;
                return (
                  <li key={s.key} className="relative flex items-start gap-4 pb-7 last:pb-0 pl-12">
                    <motion.div
                      initial={false}
                      animate={{ scale: current ? [1, 1.12, 1] : 1 }}
                      transition={{ duration: 0.5 }}
                      className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-background transition-smooth ${
                        reached ? "bg-foreground text-background shadow-glow" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {reached && !current ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </motion.div>
                    <div className="min-h-10 pt-1">
                      <p className={`text-sm font-medium ${reached ? "text-foreground" : "text-muted-foreground"}`}>
                        {s.label}
                        {current && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-foreground">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Current
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
                      {current && (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Updated {timeAgo(order.updatedAt)}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Live status — this page refreshes automatically when admin updates your order.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="glass-strong rounded-3xl p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold">Items</h2>
            <ul className="mt-4 divide-y divide-border/60">
              {order.items.map((it, idx) => (
                <li key={idx} className="flex gap-4 py-4">
                  <img src={it.image} alt="" className="h-20 w-16 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col text-sm">
                    <span className="font-medium">{it.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {[it.size && `Size ${it.size}`, it.color, `Qty ${it.qty}`].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="glass-strong h-fit rounded-3xl p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Summary</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd></div>
              <div className="flex justify-between border-t border-border/60 pt-2 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
              <div className="flex justify-between pt-2 text-xs">
                <dt className="text-muted-foreground">Payment</dt>
                <dd className="capitalize">{order.paymentStatus}</dd>
              </div>
            </dl>
            <div className="mt-6 border-t border-border/60 pt-4 text-sm">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-xs text-muted-foreground">{order.userEmail}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {order.shippingAddress.line1}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postal}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

function timeAgo(ts: number) {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} d ago`;
}
