import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductStore";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { Check, ChevronLeft, Heart, Edit, ShoppingBag, Truck, RotateCcw, Ruler, X, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.id);
    const title = p ? `${p.name} — Vendooo` : "Product — Vendooo";
    const description = p
      ? `${p.name} · ${p.category} · ${formatPrice(p.price)}. ${p.description ?? "Considered essentials, made in and for Ghana."}`.slice(0, 155)
      : "Browse considered wardrobe essentials at Vendooo.";
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (p?.image?.startsWith("https://")) {
      meta.push({ property: "og:image", content: p.image }, { name: "twitter:image", content: p.image });
    }
    return { meta };
  },
  component: Page,
});


const SIZE_CHART = {
  letters: [
    { s: "XS", chest: "32-34", waist: "24-26", hip: "34-36" },
    { s: "S", chest: "34-36", waist: "26-28", hip: "36-38" },
    { s: "M", chest: "36-38", waist: "28-30", hip: "38-40" },
    { s: "L", chest: "38-40", waist: "30-32", hip: "40-42" },
    { s: "XL", chest: "40-42", waist: "32-34", hip: "42-44" },
  ],
};

function Page() {
  const { id } = Route.useParams();
  const { get, products } = useProducts();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { isAdmin } = useAuth();
  const { ids: recentIds, push } = useRecentlyViewed();
  const navigate = useNavigate();
  const product = get(id);

  useEffect(() => { if (product) push(product.id); }, [product, push]);

  if (!product) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <h1 className="font-display text-3xl">Product not found</h1>
          <Link to="/shop" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Back to shop</Link>
        </div>
      </Layout>
    );
  }

  const [size, setSize] = useState<string | undefined>(product.sizes?.[1] ?? product.sizes?.[0]);
  const [color, setColor] = useState<string | undefined>(product.colors?.[0]?.name);
  const [imgIdx, setImgIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [sizeGuide, setSizeGuide] = useState(false);
  const wished = has(product.id);

  const images = product.images?.length ? product.images : [product.image];
  const related = useMemo(
    () => products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4),
    [products, product]
  );
  const completeFit = useMemo(
    () => products.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 4),
    [products, product]
  );
  const recent = useMemo(() => recentIds.filter((rid) => rid !== product.id).map((rid) => products.find((p) => p.id === rid)).filter(Boolean).slice(0, 4) as typeof products, [recentIds, products, product.id]);

  const outOfStock = (product.stock ?? 0) <= 0;
  const handleAdd = () => {
    if (outOfStock) { import("@/lib/haptics").then(({ haptic }) => haptic("warning")); return toast.warning("Out of stock"); }
    if (product.sizes?.length && !size) { import("@/lib/haptics").then(({ haptic }) => haptic("warning")); return toast.error("Select a size"); }
    import("@/lib/haptics").then(({ haptic }) => haptic("success"));
    add(product, { size, color });
    toast.success("Added to bag", { description: product.name });
  };

  const eta = useMemo(() => {
    const start = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
    const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5);
    const fmt = (d: Date) => d.toLocaleDateString("en-GH", { month: "short", day: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        <div className="flex items-center justify-between">
          <Link to="/shop" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-3 w-3" /> Back to shop
          </Link>
          {isAdmin && (
            <button onClick={() => navigate({ to: "/admin/product/$id", params: { id: product.id } })} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-muted">
              <Edit className="h-3 w-3" /> Edit in admin
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-12 md:grid-cols-2">
          <div>
            <div
              className="relative overflow-hidden rounded-[2rem] bg-secondary shadow-soft"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={(e) => {
                const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                setZoomPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
            >
              <img
                src={images[imgIdx]} alt={product.name}
                className="h-[560px] w-full object-cover transition-transform duration-200 md:h-[640px]"
                style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
              />
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[10px] uppercase tracking-wider backdrop-blur-md">
                <ZoomIn className="h-3 w-3" /> Hover to zoom
              </div>
              <button onClick={() => toggle(product.id)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-background/80 backdrop-blur-md transition-smooth hover:scale-110" aria-label="Wishlist">
                <Heart className={`h-5 w-5 ${wished ? "fill-accent text-accent" : ""}`} />
              </button>
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`overflow-hidden rounded-xl border-2 transition-smooth ${imgIdx === i ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={src} alt="" className="aspect-square h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:py-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.category}</p>
            <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">{product.name}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-2xl">{formatPrice(product.price)}</p>
              {product.compareAtPrice && (
                <>
                  <p className="text-base text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</p>
                  <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-medium text-destructive">
                    -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
            <p className="mt-6 max-w-prose text-muted-foreground">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Color: <span className="text-foreground">{color}</span></p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button key={c.name} onClick={() => setColor(c.name)} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-smooth ${color === c.name ? "border-foreground" : "border-transparent hover:border-border"}`}>
                      <span className="h-7 w-7 rounded-full border border-border/60" style={{ backgroundColor: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Size</p>
                  <button onClick={() => setSizeGuide(true)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <Ruler className="h-3 w-3" /> Size guide
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`min-w-12 rounded-full border px-4 py-2 text-sm transition-smooth ${size === s ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:border-foreground/40"}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={handleAdd} disabled={outOfStock} className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background shadow-glow transition-smooth hover:opacity-90 disabled:opacity-50">
                <ShoppingBag className="h-4 w-4" /> {outOfStock ? "Sold out" : `Add to bag · ${formatPrice(product.price)}`}
              </button>
              <button onClick={() => toggle(product.id)} className={`inline-flex h-14 items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium transition-smooth ${wished ? "border-accent bg-accent/15 text-foreground" : "border-border hover:bg-secondary"}`}>
                <Heart className={`h-4 w-4 ${wished ? "fill-accent text-accent" : ""}`} />{wished ? "Saved" : "Wishlist"}
              </button>
            </div>

            {typeof product.stock === "number" && (
              <p className="mt-3 text-xs text-muted-foreground">{product.stock > 0 ? `In stock — ${product.stock} available` : "Currently out of stock"}</p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="glass rounded-2xl p-4">
                <Truck className="h-4 w-4 text-accent" />
                <p className="mt-2 text-xs font-medium">Free delivery over GH₵ 2,000</p>
                <p className="text-[11px] text-muted-foreground">Est. delivery {eta}</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <RotateCcw className="h-4 w-4 text-accent" />
                <p className="mt-2 text-xs font-medium">Free 30-day returns</p>
                <p className="text-[11px] text-muted-foreground">Lifetime craftsmanship</p>
              </div>
            </div>

            <Accordion title="Details" defaultOpen>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {product.details.map((d) => (
                  <li key={d} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-accent" />{d}</li>
                ))}
                {product.material && <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-accent" />Material: {product.material}</li>}
              </ul>
            </Accordion>
            {product.care && product.care.length > 0 && (
              <Accordion title="Care instructions">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.care.map((c) => <li key={c} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-accent" />{c}</li>)}
                </ul>
              </Accordion>
            )}
            <Accordion title="Shipping & returns">
              <p className="text-sm text-muted-foreground">Complimentary nationwide delivery on orders over GH₵ 2,000. Free returns within 30 days. Estimated delivery {eta} (Accra & Kumasi 1–2 days).</p>
            </Accordion>
          </div>
        </div>

        {completeFit.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-display text-2xl font-semibold">Complete the fit</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {completeFit.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-display text-2xl font-semibold">You may also like</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {recent.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-display text-2xl font-semibold">Recently viewed</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      {sizeGuide && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" onClick={() => setSizeGuide(false)}>
          <div onClick={(e) => e.stopPropagation()} className="glass-strong w-full max-w-lg rounded-3xl p-6 shadow-glow animate-fade-up">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold">Size guide</h3>
              <button onClick={() => setSizeGuide(false)} className="rounded-full p-1.5 hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">All measurements in inches. Garment measurements may vary slightly.</p>
            <table className="mt-4 w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="py-2">Size</th><th>Chest</th><th>Waist</th><th>Hip</th></tr>
              </thead>
              <tbody>
                {SIZE_CHART.letters.map((r) => (
                  <tr key={r.s} className="border-t border-border/40"><td className="py-2 font-medium">{r.s}</td><td>{r.chest}</td><td>{r.waist}</td><td>{r.hip}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}

function Accordion({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="mt-4 border-t border-border/60">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-4 text-left">
        <span className="text-sm font-medium">{title}</span>
        <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}
