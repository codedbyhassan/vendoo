import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductStore";
import { haptic } from "@/lib/haptics";
import { toast } from "sonner";
import { Lock, CreditCard, Check, Tag } from "lucide-react";
import { applyCoupon } from "@/lib/coupons";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Vendoo" }] }),
  component: Page,
});

function Page() {
  const { items, subtotal, clear } = useCart();
  const { user, signIn } = useAuth();
  const { create } = useOrders();
  const { get, decrementStock } = useProducts();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: user?.email ?? "",
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
    address: "",
    city: "",
    postal: "",
  });

  const baseShipping = subtotal > 200 || subtotal === 0 ? 0 : 15;
  const couponCode = typeof localStorage !== "undefined" ? localStorage.getItem("vendoo-coupon") : null;
  const applied = applyCoupon(subtotal, baseShipping, couponCode);
  const discount = applied.discount;
  const shipping = applied.shipping;
  const total = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <h1 className="font-display text-3xl">Your bag is empty</h1>
          <Link to="/shop" className="mt-6 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background">Shop the collection</Link>
        </div>
      </Layout>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }

    // Stock guard
    for (const i of items) {
      const live = get(i.product.id);
      const stock = live?.stock ?? 0;
      if (!live || stock < i.qty) {
        haptic("error");
        toast.error(`${i.product.name} ${stock === 0 ? "is out of stock" : `has only ${stock} left`}`);
        navigate({ to: "/cart" });
        return;
      }
    }

    setSubmitting(true);
    haptic("medium");
    setTimeout(() => {
      const u = user ?? signIn(form.email, `${form.firstName} ${form.lastName}`.trim());
      const order = create({
        userEmail: u.email,
        customerName: `${form.firstName} ${form.lastName}`.trim() || u.name,
        shippingAddress: { line1: form.address, city: form.city, postal: form.postal },
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          image: i.product.image,
          price: i.product.price,
          qty: i.qty,
          size: i.size,
          color: i.color,
        })),
        subtotal,
        shipping,
        total,
      });
      decrementStock(items.map((i) => ({ productId: i.product.id, qty: i.qty })));
      clear();
      try { localStorage.removeItem("vendoo-coupon"); } catch {}
      haptic("success");
      toast.success("Payment confirmed", { description: `Order ${order.id}` });
      navigate({ to: "/order/confirmation/$id", params: { id: order.id } });
    }, 800);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold md:text-4xl">Checkout</h1>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" /> Secure checkout · simulated payment
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          <form onSubmit={submit} className="space-y-8">
            <div className="glass-strong rounded-3xl p-6 shadow-soft">
              <div className="mb-4 flex items-center gap-3">
                <Step n={1} active={step >= 1} done={step > 1} /> <h2 className="font-display text-lg font-semibold">Contact & shipping</h2>
              </div>
              {step === 1 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Email" type="email" required className="sm:col-span-2"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <Input label="First name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                  <Input label="Last name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  <Input label="Address" required className="sm:col-span-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  <Input label="City" required placeholder="Accra" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  <Input label="Region / Postal" required placeholder="Greater Accra" value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} />
                </div>
              ) : (
                <button type="button" onClick={() => setStep(1)} className="text-xs text-muted-foreground underline">Edit</button>
              )}
            </div>

            <div className="glass-strong rounded-3xl p-6 shadow-soft">
              <div className="mb-4 flex items-center gap-3">
                <Step n={2} active={step >= 2} /> <h2 className="font-display text-lg font-semibold">Payment</h2>
              </div>
              {step === 2 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2 relative">
                    <Input label="Card number" placeholder="4242 4242 4242 4242" required defaultValue="4242 4242 4242 4242" />
                    <CreditCard className="absolute right-4 top-9 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input label="Expiry" placeholder="MM / YY" required defaultValue="12 / 28" />
                  <Input label="CVC" placeholder="123" required defaultValue="123" />
                  <p className="sm:col-span-2 text-xs text-muted-foreground">Demo mode — any card details accepted.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">← Continue shopping</Link>
              <button disabled={submitting} className="inline-flex h-12 items-center rounded-full bg-foreground px-8 text-sm font-medium text-background shadow-glow transition-smooth hover:opacity-90 disabled:opacity-60">
                {submitting ? "Processing..." : step === 1 ? "Continue to payment" : `Pay $${total}`}
              </button>
            </div>
          </form>

          <aside className="glass-strong h-fit rounded-3xl p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Order summary</h3>
            <ul className="mt-4 divide-y divide-border/60">
              {items.map((i) => (
                <li key={i.product.id + (i.size ?? "") + (i.color ?? "")} className="flex gap-3 py-3">
                  <img src={i.product.image} alt="" className="h-16 w-14 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col text-sm">
                    <span className="font-medium">{i.product.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {[i.size && `Size ${i.size}`, i.color, `Qty ${i.qty}`].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                  <span className="text-sm">${i.product.price * i.qty}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm">
              <Row label="Subtotal" v={`$${subtotal}`} />
              {discount > 0 && <Row label={`Discount${applied.coupon ? ` (${applied.coupon.code})` : ""}`} v={`-$${discount}`} />}
              <Row label="Shipping" v={shipping === 0 ? "Free" : `$${shipping}`} />
              <Row label="Total" v={`$${total}`} bold />
              {applied.coupon && (
                <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Tag className="h-3 w-3" /> {applied.coupon.label} applied</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

function Input({ label, className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <input {...rest} className="mt-1.5 h-11 w-full rounded-full border border-border bg-background/60 px-4 text-sm outline-none focus:ring-2 focus:ring-accent/40" />
    </label>
  );
}
function Row({ label, v, bold }: { label: string; v: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "text-base font-semibold" : "text-muted-foreground"}`}><span>{label}</span><span className={bold ? "text-foreground" : ""}>{v}</span></div>;
}
function Step({ n, active, done }: { n: number; active?: boolean; done?: boolean }) {
  return (
    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${active ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
      {done ? <Check className="h-3.5 w-3.5" /> : n}
    </span>
  );
}
