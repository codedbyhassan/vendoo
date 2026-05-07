import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useOrders } from "@/context/OrderContext";
import { Check, Package, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/order/confirmation/$id")({
  head: () => ({ meta: [{ title: "Order confirmed — Vendoo" }] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const { get } = useOrders();
  const order = get(id);

  if (!order) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <h1 className="font-display text-3xl">Order not found</h1>
          <Link to="/shop" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
            Continue shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-center">
          <div className="glass-strong mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-glow">
            <Check className="h-9 w-9 text-accent" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold md:text-5xl">Thank you{order.customerName ? `, ${order.customerName.split(" ")[0]}` : ""}.</h1>
          <p className="mt-3 text-muted-foreground">Your order has been received and payment confirmed.</p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs">
            Order ID: <span className="font-mono font-semibold">{order.id}</span>
          </p>
        </div>

        <div className="glass-strong mt-10 rounded-3xl p-6 shadow-soft">
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
          <dl className="mt-6 space-y-2 border-t border-border/60 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd></div>
            <div className="flex justify-between border-t border-border/60 pt-2 text-base font-semibold"><dt>Total paid</dt><dd>{formatPrice(order.total)}</dd></div>
          </dl>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/order/$id" params={{ id: order.id }} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background shadow-glow transition-smooth hover:opacity-90">
            <Package className="h-4 w-4" /> Track this order
          </Link>
          <Link to="/shop" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-medium hover:bg-secondary">
            Continue shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
