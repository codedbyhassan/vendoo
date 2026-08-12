import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/products";
import { useProducts } from "@/context/ProductStore";
import { Search, SlidersHorizontal, X } from "lucide-react";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
  cat: fallback(z.string(), "All").default("All"),
  sort: fallback(z.enum(["featured", "priceAsc", "priceDesc", "nameAsc"]), "featured").default("featured"),
  min: fallback(z.number(), 0).default(0),
  max: fallback(z.number(), 1000).default(1000),
  color: fallback(z.string(), "").default(""),
  size: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Vendooo" },
      { name: "description", content: "Browse the full Vendooo collection of considered wardrobe essentials." },
    ],
  }),
  validateSearch: zodValidator(schema),
  component: Page,
});

function Page() {
  const { products } = useProducts();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const update = (patch: Partial<typeof search>) =>
    navigate({ search: (prev: typeof search) => ({ ...prev, ...patch }) });

  const allColors = useMemo(() => {
    const set = new Map<string, string>();
    products.forEach((p) => p.colors?.forEach((c) => set.set(c.name, c.hex)));
    return Array.from(set.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes?.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (search.cat !== "All" && p.category !== search.cat) return false;
      if (p.price < search.min || p.price > search.max) return false;
      if (search.q) {
        const s = search.q.toLowerCase();
        if (!p.name.toLowerCase().includes(s) &&
            !p.category.toLowerCase().includes(s) &&
            !p.description.toLowerCase().includes(s)) return false;
      }
      if (search.color && !p.colors?.some((c) => c.name === search.color)) return false;
      if (search.size && !p.sizes?.includes(search.size)) return false;
      return true;
    });
    if (search.sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (search.sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    if (search.sort === "nameAsc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, search]);

  const activeFilters =
    (search.q ? 1 : 0) + (search.cat !== "All" ? 1 : 0) + (search.color ? 1 : 0) +
    (search.size ? 1 : 0) + (search.min !== 0 || search.max !== 1000 ? 1 : 0);

  return (
    <Layout>
      <section className="gradient-hero">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Collection</p>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Shop all</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {products.length} considered pieces, curated by hand.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="glass-strong sticky top-20 z-20 mb-6 flex flex-col gap-4 rounded-2xl p-4 shadow-soft md:flex-row md:items-center">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Search the collection"
              className="h-11 w-full rounded-full border border-border/60 bg-background/60 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => update({ cat: c })}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs transition-smooth ${
                  search.cat === c ? "bg-foreground text-background" : "bg-secondary text-foreground/70 hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 text-xs font-medium hover:bg-secondary"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              {activeFilters > 0 && (
                <span className="ml-1 rounded-full bg-foreground px-1.5 py-0.5 text-[10px] text-background">{activeFilters}</span>
              )}
            </button>
            <select
              value={search.sort}
              onChange={(e) => update({ sort: e.target.value as typeof search.sort })}
              className="h-11 rounded-full border border-border/60 bg-background/60 px-4 text-xs outline-none"
            >
              <option value="featured">Featured</option>
              <option value="priceAsc">Price: Low to high</option>
              <option value="priceDesc">Price: High to low</option>
              <option value="nameAsc">Name A–Z</option>
            </select>
          </div>
        </div>

        {filtersOpen && (
          <div className="glass-strong mb-6 grid gap-6 rounded-2xl p-6 shadow-soft md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Price (${search.min}–${search.max})</p>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="number" value={search.min} min={0} max={search.max}
                  onChange={(e) => update({ min: Number(e.target.value) || 0 })}
                  className="h-9 w-24 rounded-full border border-border/60 bg-background/60 px-3 text-xs outline-none"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <input
                  type="number" value={search.max} min={search.min}
                  onChange={(e) => update({ max: Number(e.target.value) || 0 })}
                  className="h-9 w-24 rounded-full border border-border/60 bg-background/60 px-3 text-xs outline-none"
                />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Color</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {allColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => update({ color: search.color === c.name ? "" : c.name })}
                    title={c.name}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-smooth ${
                      search.color === c.name ? "border-foreground" : "border-transparent hover:border-border"
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full border border-border/60" style={{ backgroundColor: c.hex }} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {allSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => update({ size: search.size === s ? "" : s })}
                    className={`min-w-9 rounded-full border px-3 py-1.5 text-xs transition-smooth ${
                      search.size === s ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:border-foreground/40"
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>
            {activeFilters > 0 && (
              <button
                onClick={() => navigate({ search: { q: "", cat: "All", sort: "featured", min: 0, max: 1000, color: "", size: "" } })}
                className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground md:col-span-3"
              >
                <X className="h-3 w-3" /> Clear all filters
              </button>
            )}
          </div>
        )}

        <p className="mb-6 text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "result" : "results"}</p>

        {filtered.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">No pieces match your search.</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
