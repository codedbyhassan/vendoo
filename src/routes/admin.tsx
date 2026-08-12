import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { useProducts } from "@/context/ProductStore";
import { useAuth } from "@/context/AuthContext";
import { useOrders, type OrderStatus } from "@/context/OrderContext";
import { Package, DollarSign, ShoppingBag, TrendingUp, Plus, Search, Edit, Trash2, ShieldOff, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { haptic } from "@/lib/haptics";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Vendooo" }] }),
  component: Page,
});

const STATUS_OPTIONS: OrderStatus[] = ["processing", "paid", "shipped", "delivered", "cancelled"];

function Page() {
  const { user, isAdmin } = useAuth();
  const { products, remove } = useProducts();
  const { orders, setStatus } = useOrders();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"overview" | "products" | "orders">("overview");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!user) navigate({ to: "/signin", search: { redirect: "/admin" } });
  }, [user, navigate]);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())),
    [products, q]
  );

  if (!user) return null;
  if (!isAdmin) {
    return (
      <Layout>
        <div className="mx-auto max-w-md px-6 py-32 text-center">
          <ShieldOff className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-6 font-display text-3xl">Admin only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as {user.email}. This area requires admin access.
          </p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
            Back home
          </Link>
        </div>
      </Layout>
    );
  }

  const revenue = orders.reduce((s, o) => s + (o.status !== "cancelled" ? o.total : 0), 0);
  const stats = [
    { i: DollarSign, l: "Revenue", v: `GH₵ ${(revenue * 12).toLocaleString()}`, d: `${orders.length} orders` },
    { i: ShoppingBag, l: "Orders", v: orders.length, d: "All time" },
    { i: Package, l: "Products", v: products.length, d: "Live" },
    { i: TrendingUp, l: "Pending", v: orders.filter((o) => o.status === "processing" || o.status === "paid").length, d: "Need action" },
  ];

  // 14-day revenue chart
  const chartData = useMemo(() => {
    const days: { label: string; v: number }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i); d.setHours(0,0,0,0);
      const next = d.getTime() + 86400000;
      const v = orders.filter((o) => o.status !== "cancelled" && o.createdAt >= d.getTime() && o.createdAt < next).reduce((s, o) => s + o.total, 0);
      days.push({ label: d.toLocaleDateString(undefined, { day: "numeric" }), v });
    }
    return days;
  }, [orders]);
  const chartMax = Math.max(1, ...chartData.map((d) => d.v));
  const last14Total = chartData.reduce((s, d) => s + d.v, 0);

  // best sellers
  const bestSellers = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => o.status !== "cancelled" && o.items.forEach((i) => map.set(i.productId, (map.get(i.productId) ?? 0) + i.qty)));
    return Array.from(map.entries())
      .map(([id, qty]) => ({ product: products.find((p) => p.id === id)!, qty }))
      .filter((x) => x.product)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders, products]);

  const lowStock = useMemo(() => products.filter((p) => typeof p.stock === "number" && p.stock <= 5).slice(0, 8), [products]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This can't be undone.`)) {
      remove(id);
      toast.success("Product deleted");
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Studio</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">Dashboard</h1>
          </div>
          <div className="glass-strong inline-flex rounded-full p-1">
            {(["overview","products","orders"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 text-xs font-medium capitalize transition-smooth ${
                  tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === "overview" && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(({ i: Icon, l, v, d }) => (
                <div key={l} className="glass-strong rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{l}</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary"><Icon className="h-4 w-4 text-accent" /></div>
                  </div>
                  <p className="mt-3 font-display text-3xl font-semibold">{v}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>

            {/* Sales chart */}
            <div className="mt-8 glass-strong rounded-2xl p-6 shadow-soft">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">Revenue · last 14 days</h3>
                  <p className="text-xs text-muted-foreground">Live from order data</p>
                </div>
                <p className="font-display text-2xl font-semibold">${last14Total.toLocaleString()}</p>
              </div>
              <div className="mt-6 flex h-40 items-end gap-1.5">
                {chartData.map((d, i) => (
                  <div key={i} className="group relative flex flex-1 flex-col items-center gap-1">
                    <div className="relative w-full overflow-hidden rounded-md bg-secondary">
                      <div className="bg-foreground transition-all" style={{ height: `${Math.max(2, (d.v / chartMax) * 140)}px` }} />
                    </div>
                    <span className="text-[9px] text-muted-foreground">{d.label}</span>
                    <span className="pointer-events-none absolute -top-7 hidden rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background group-hover:block">${d.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="glass-strong rounded-2xl p-6 shadow-soft">
                <h3 className="font-display text-lg font-semibold">Recent orders</h3>
                {orders.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">No orders yet.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-border/60">
                    {orders.slice(0, 5).map((o) => (
                      <li key={o.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium">{o.customerName}</p>
                          <p className="text-xs text-muted-foreground">{o.id} · {new Date(o.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${o.total}</p>
                          <Badge s={o.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="glass-strong rounded-2xl p-6 shadow-soft">
                <h3 className="font-display text-lg font-semibold">Best sellers</h3>
                {bestSellers.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">No sales yet.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {bestSellers.map((b, idx) => (
                      <li key={b.product.id} className="flex items-center gap-3">
                        <span className="w-5 text-xs text-muted-foreground">{idx + 1}</span>
                        <img src={b.product.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <div className="flex-1 text-sm">{b.product.name}</div>
                        <div className="text-xs text-muted-foreground">{b.qty} sold</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {lowStock.length > 0 && (
              <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold text-destructive">
                  <AlertTriangle className="h-4 w-4" /> Low stock alerts
                </h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {lowStock.map((p) => (
                    <li key={p.id} className="flex items-center justify-between rounded-xl bg-background/60 px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <img src={p.image} alt="" className="h-8 w-8 rounded-md object-cover" />
                        <span>{p.name}</span>
                      </div>
                      <span className="text-xs font-medium text-destructive">{p.stock} left</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {tab === "products" && (
          <div className="mt-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search products"
                  className="h-11 w-72 rounded-full border border-border bg-background pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <Link to="/admin/product/$id" params={{ id: "new" }} className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background">
                <Plus className="h-4 w-4" />New product
              </Link>
            </div>
            <div className="glass-strong overflow-hidden rounded-2xl shadow-soft">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-t border-border/60">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{p.category}</td>
                      <td className="p-4">GH₵ {(p.price * 12).toLocaleString()}</td>
                      <td className="p-4 text-muted-foreground">{p.stock ?? "—"}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link to="/product/$id" params={{ id: p.id }} className="rounded-full p-2 hover:bg-secondary" title="View">
                            <Search className="h-4 w-4" />
                          </Link>
                          <Link to="/admin/product/$id" params={{ id: p.id }} className="rounded-full p-2 hover:bg-secondary" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button onClick={() => handleDelete(p.id, p.name)} className="rounded-full p-2 text-destructive hover:bg-destructive/10" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">No products match.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="mt-8 glass-strong overflow-hidden rounded-2xl shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">No orders yet. Place a test order to see it here.</td></tr>
                )}
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border/60">
                    <td className="p-4 font-medium">
                      <Link to="/order/$id" params={{ id: o.id }} className="hover:underline">{o.id}</Link>
                    </td>
                    <td className="p-4">
                      <p>{o.customerName}</p>
                      <p className="text-xs text-muted-foreground">{o.userEmail}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">${o.total}</td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => { setStatus(o.id, e.target.value as OrderStatus); haptic("success"); toast.success(`Order ${o.id} → ${e.target.value}`, { description: "Customer will see the update live." }); }}
                        className="h-9 rounded-full border border-border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-accent/40"
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

function Badge({ s }: { s: OrderStatus }) {
  const tone =
    s === "delivered" ? "bg-accent/30 text-cocoa dark:text-accent" :
    s === "shipped" ? "bg-foreground/10 text-foreground" :
    s === "paid" ? "bg-secondary text-foreground" :
    s === "cancelled" ? "bg-destructive/15 text-destructive" :
    "bg-secondary text-muted-foreground";
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${tone}`}>{s}</span>;
}
