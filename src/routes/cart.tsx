import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductStore";
import { Minus, Plus, Trash2, ShoppingBag, AlertTriangle, Truck, Tag, Shield, RotateCcw, Lock, Check } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { toast } from "sonner";
import { applyCoupon, COUPONS } from "@/lib/coupons";
import { formatPrice, formatCedis, toCedis } from "@/lib/format";

const FREE_SHIP = 200; // base units (~ GH₵ 2,400)
const COUPON_KEY = "vendoo-coupon";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your bag — Vendooo" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();
  const { get, products } = useProducts();
  const navigate = useNavigate();
  const baseShipping = subtotal > FREE_SHIP || subtotal === 0 ? 0 : 15;
  const [code, setCode] = useState<string>("");
  const [draft, setDraft] = useState("");

  // Read the persisted coupon after mount to keep SSR and client markup identical.
  useEffect(() => {
    try { setCode(localStorage.getItem(COUPON_KEY) || ""); } catch {}
  }, []);


  const applied = useMemo(() => applyCoupon(subtotal, baseShipping, code || null), [subtotal, baseShipping, code]);
  const discount = applied.discount;
  const shipping = applied.shipping;
  const total = Math.max(0, subtotal - discount + shipping);

  const tryCoupon = () => {
    const next = draft.trim().toUpperCase();
    if (!next) return;
    const test = applyCoupon(subtotal, baseShipping, next);
    if (test.error) { haptic("error"); toast.error(test.error); return; }
    haptic("success"); setCode(next); setDraft("");
    localStorage.setItem(COUPON_KEY, next);
    toast.success(`Coupon ${next} applied`, { description: test.coupon?.label });
  };
  const removeCoupon = () => { setCode(""); localStorage.removeItem(COUPON_KEY); };

  const issues = items
    .map((i) => {
      const live = get(i.product.id);
      const stock = live?.stock ?? 0;
      if (!live) return { id: i.product.id, msg: "No longer available" };
      if (stock === 0) return { id: i.product.id, msg: "Out of stock" };
      if (i.qty > stock) return { id: i.product.id, msg: `Only ${stock} in stock` };
      return null;
    })
    .filter(Boolean) as { id: string; msg: string }[];
  const blocked = issues.length > 0;

  const handleCheckout = () => {
    if (blocked) { haptic("error"); toast.error("Please fix items in your bag first"); return; }
    haptic("success"); navigate({ to: "/checkout" });
  };

  const remaining = Math.max(0, FREE_SHIP - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);

  const youMayLike = useMemo(() => {
    const inBag = new Set(items.map((i) => i.product.id));
    return products.filter((p) => !inBag.has(p.id)).slice(0, 4);
  }, [items, products]);

  const eta = useMemo(() => {
    const start = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
    const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 6);
    const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Bag</p>
        <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Your bag</h1>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border/60 p-16 text-center">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
            <Link to="/shop" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Shop the collection</Link>
          </motion.div>
        ) : (
          <>
            {/* Free-ship progress */}
            <div className="mt-8 rounded-3xl border border-border/60 bg-secondary/40 p-4">
              <div className="flex items-center gap-2 text-xs">
                <Truck className="h-4 w-4 text-accent" />
                {remaining > 0 ? (
                  <span><span className="font-medium text-foreground">${remaining}</span> away from free shipping</span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-foreground"><Check className="h-3.5 w-3.5 text-accent" /> You've unlocked free shipping</span>
                )}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ type: "spring", damping: 24 }} className="h-full bg-foreground" />
              </div>
            </div>

            <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px]">
              <ul className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((i) => {
                    const live = get(i.product.id);
                    const stock = live?.stock ?? 0;
                    const issue = issues.find((x) => x.id === i.product.id);
                    return (
                      <motion.li
                        key={i.product.id + (i.size ?? "") + (i.color ?? "")}
                        layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -12, height: 0, marginBottom: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className="glass-strong flex gap-4 rounded-3xl p-4 shadow-soft"
                      >
                        <Link to="/product/$id" params={{ id: i.product.id }}>
                          <img src={i.product.image} alt="" className="h-28 w-24 rounded-2xl object-cover" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Link to="/product/$id" params={{ id: i.product.id }} className="text-sm font-medium hover:underline">{i.product.name}</Link>
                              <p className="mt-1 text-xs text-muted-foreground">{[i.size && `Size ${i.size}`, i.color].filter(Boolean).join(" · ") || "—"}</p>
                            </div>
                            <p className="text-sm font-medium">{formatPrice(i.product.price * i.qty)}</p>
                          </div>
                          {issue && (
                            <div className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive">
                              <AlertTriangle className="h-3 w-3" /> {issue.msg}
                            </div>
                          )}
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-2 py-1">
                              <button onClick={() => { haptic(); setQty(i.product.id, i.size, i.color, i.qty - 1); }} className="rounded-full p-1 hover:bg-secondary" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                              <span className="w-6 text-center text-xs font-medium">{i.qty}</span>
                              <button
                                onClick={() => {
                                  if (i.qty + 1 > stock) { haptic("warning"); toast.warning(`Only ${stock} in stock`); return; }
                                  haptic(); setQty(i.product.id, i.size, i.color, i.qty + 1);
                                }}
                                className="rounded-full p-1 hover:bg-secondary disabled:opacity-40" disabled={stock === 0} aria-label="Increase"
                              ><Plus className="h-3 w-3" /></button>
                            </div>
                            <button onClick={() => { haptic("medium"); remove(i.product.id, i.size, i.color); toast("Removed from bag"); }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>

              <motion.aside layout className="glass-strong h-fit rounded-3xl p-6 shadow-soft">
                <h3 className="font-display text-lg font-semibold">Summary</h3>

                {/* Coupon */}
                <div className="mt-4">
                  {applied.coupon ? (
                    <div className="flex items-center justify-between rounded-full bg-accent/15 px-4 py-2 text-xs">
                      <span className="inline-flex items-center gap-2"><Tag className="h-3 w-3" /><strong>{applied.coupon.code}</strong> · {applied.coupon.label}</span>
                      <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Promo code" className="h-9 flex-1 rounded-full border border-border bg-background/60 px-3 text-xs outline-none focus:ring-2 focus:ring-accent/40" />
                      <button onClick={tryCoupon} className="rounded-full bg-foreground px-4 text-xs font-medium text-background">Apply</button>
                    </div>
                  )}
                  <p className="mt-2 text-[11px] text-muted-foreground">Try <button onClick={() => setDraft(COUPONS[0].code)} className="underline">{COUPONS[0].code}</button> or <button onClick={() => setDraft("FREESHIP")} className="underline">FREESHIP</button></p>
                </div>

                <dl className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                  {discount > 0 && <div className="flex justify-between text-accent-foreground"><dt className="text-accent-foreground/80">Discount</dt><dd>-{formatPrice(discount)}</dd></div>}
                  <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
                  <div className="flex justify-between border-t border-border/60 pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
                </dl>

                <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Truck className="h-3 w-3" /> Est. delivery {eta}</p>

                <button onClick={handleCheckout} disabled={blocked} className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background shadow-glow transition-smooth hover:opacity-90 disabled:opacity-50">Checkout</button>
                <Link to="/shop" className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground">Continue shopping</Link>

                {/* Trust badges */}
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border/60 pt-4 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <div className="flex flex-col items-center gap-1"><Lock className="h-3.5 w-3.5 text-accent" /><span>Secure</span></div>
                  <div className="flex flex-col items-center gap-1"><RotateCcw className="h-3.5 w-3.5 text-accent" /><span>30d returns</span></div>
                  <div className="flex flex-col items-center gap-1"><Shield className="h-3.5 w-3.5 text-accent" /><span>Lifetime</span></div>
                </div>
              </motion.aside>
            </div>

            {youMayLike.length > 0 && (
              <section className="mt-20">
                <h2 className="mb-8 font-display text-2xl font-semibold">You may also like</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {youMayLike.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
