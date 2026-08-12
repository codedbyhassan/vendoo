import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { COLLECTIONS } from "@/lib/products";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — Vendooo" },
      { name: "description", content: "Curated edits — luxury, streetwear, sneakers, summer drops and more." },
      { property: "og:title", content: "Collections — Vendooo" },
      { property: "og:description", content: "Curated edits across the Vendooo wardrobe." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Edits</p>
        <h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Collections</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">A considered shortcut into the wardrobe — curated by season, mood and material.</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }}
              className="group relative overflow-hidden rounded-3xl shadow-soft">
              <img src={c.hero} alt={c.name} className="h-80 w-full object-cover transition-smooth group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h2 className="font-display text-2xl font-semibold">{c.name}</h2>
                <p className="mt-1 text-sm opacity-90">{c.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium">Shop <ArrowRight className="h-3.5 w-3.5 transition-smooth group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
