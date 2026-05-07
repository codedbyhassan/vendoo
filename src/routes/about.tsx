import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Vendoo" },
      { name: "description", content: "The Vendoo studio: a small team designing essentials made to keep." },
    ],
  }),
  component: () => (
    <Layout>
      <section className="gradient-hero">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Our story</p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">
            Made slowly,<br /><span className="italic text-cocoa">to be kept.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Vendoo is a small studio designing the wardrobe essentials we wished existed —
            cut from honest materials, in fits that age beautifully, with nothing extra.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-3">
        {[
          { t: "Considered materials", b: "Italian wool, Mongolian cashmere, vegetable-tanned leather. Sourced with intention." },
          { t: "Artisan craft", b: "Made in small batches by family-run ateliers in Italy, Portugal and France." },
          { t: "Built to last", b: "Every piece comes with a lifetime craftsmanship promise — repaired or replaced." },
        ].map((c) => (
          <div key={c.t} className="glass-strong rounded-3xl p-8 shadow-soft">
            <h3 className="font-display text-lg font-semibold">{c.t}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{c.b}</p>
          </div>
        ))}
      </section>
    </Layout>
  ),
});
