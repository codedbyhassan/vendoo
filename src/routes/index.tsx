import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, COLLECTIONS } from "@/lib/products";
import hero from "@/assets/hero.jpg";
import { ArrowRight, Sparkles, Truck, Shield, Quote } from "lucide-react";
import { Countdown } from "@/components/Countdown";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vendoo — Considered Essentials" },
      { name: "description", content: "Heirloom-quality wardrobe essentials, considered and crafted to keep." },
      { property: "og:title", content: "Vendoo — Considered Essentials" },
      { property: "og:description", content: "Considered wardrobe essentials, made to keep." },
      { property: "og:image", content: hero },
    ],
  }),
  component: Page,
});

const TESTIMONIALS = [
  { q: "The cashmere crew is the softest thing I own. Genuinely heirloom quality.", a: "Maya — Brooklyn" },
  { q: "I waited months for this trench. Worth every day.", a: "Lukas — Berlin" },
  { q: "Vendoo's quiet aesthetic is exactly what my wardrobe needed.", a: "Aiko — Tokyo" },
];

function Page() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.collections?.includes("new-arrivals")).slice(0, 4);
  const dropEnd = Date.now() + 1000 * 60 * 60 * 47 + 1000 * 30; // ~47h teaser

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="animate-fade-up">
            <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-muted-foreground">Autumn Edit · 2026</span>
            </div>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              Quiet luxury,<br />
              <span className="italic text-cocoa">considered.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
              A curated wardrobe of heirloom essentials — soft cashmere, sculpted tailoring, and quiet leather, made to keep.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/shop" className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background shadow-glow transition-smooth hover:opacity-90">
                Shop the edit <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
              </Link>
              <Link to="/lookbook" className="glass inline-flex items-center rounded-full px-7 py-3.5 text-sm font-medium transition-smooth hover:bg-secondary">View lookbook</Link>
            </div>
          </div>
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="absolute -inset-6 rounded-[2.5rem] gradient-warm blur-2xl opacity-60" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-glow">
              <img src={hero} alt="Model wearing camel wool coat" width={1536} height={1536} className="h-[560px] w-full object-cover md:h-[640px]" />
            </div>
            <div className="glass-strong absolute -bottom-6 -left-6 hidden rounded-2xl p-4 shadow-soft md:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Featured</p>
              <p className="mt-1 font-display text-sm font-semibold">Camel Wool Coat</p>
              <p className="text-xs text-muted-foreground">GH₵ 6,240</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:grid-cols-3">
          {[
            { i: Truck, t: "Free nationwide delivery", s: "On orders over GH₵ 2,000" },
            { i: Shield, t: "Lifetime craftsmanship", s: "Repaired or replaced" },
            { i: Sparkles, t: "Made for Ghana", s: "Designed in Accra · Worn worldwide" },
          ].map(({ i: Icon, t, s }) => (
            <div key={t} className="flex items-center gap-4">
              <div className="glass flex h-11 w-11 items-center justify-center rounded-full"><Icon className="h-4 w-4 text-accent" /></div>
              <div><p className="text-sm font-medium">{t}</p><p className="text-xs text-muted-foreground">{s}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections strip */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Edits</p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Shop by collection</h2>
          </div>
          <Link to="/collections" className="group hidden items-center gap-2 text-sm font-medium md:inline-flex">
            All collections <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.slice(0, 4).map((c) => (
            <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }}
              className="group relative aspect-[3/4] overflow-hidden rounded-3xl shadow-soft">
              <img src={c.hero} alt={c.name} className="h-full w-full object-cover transition-smooth group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="font-display text-xl font-semibold">{c.name}</h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs opacity-90">Shop <ArrowRight className="h-3 w-3" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Drop countdown */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-[2.5rem] bg-foreground p-10 text-background md:grid-cols-2 md:p-14">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] opacity-70">Limited drop</p>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Summer Drop 03</h2>
            <p className="mt-3 max-w-md text-sm opacity-80">A capsule of linen and silk — limited quantities, leaving the studio this weekend.</p>
            <Link to="/collections/$slug" params={{ slug: "summer-drop" }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground">
              Shop the drop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="md:justify-self-end"><Countdown to={dropEnd} /></div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Featured</p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">The Autumn Edit</h2>
          </div>
          <Link to="/shop" className="group hidden items-center gap-2 text-sm font-medium md:inline-flex">View all <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" /></Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Just landed</p>
              <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">New arrivals</h2>
            </div>
            <Link to="/collections/$slug" params={{ slug: "new-arrivals" }} className="group hidden items-center gap-2 text-sm font-medium md:inline-flex">Shop all new <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" /></Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Lookbook teaser */}
      <section className="px-6 pb-20">
        <Link to="/lookbook" className="group relative mx-auto block max-w-7xl overflow-hidden rounded-[2.5rem] shadow-soft">
          <img src={hero} alt="Lookbook" className="h-[420px] w-full object-cover transition-smooth group-hover:scale-105 md:h-[560px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white md:p-14">
            <p className="text-[11px] uppercase tracking-[0.3em] opacity-80">Editorial</p>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-6xl">The Lookbook</h2>
            <p className="mt-3 max-w-md text-sm opacity-90">Tokyo Streetwear · Summer Essentials · Minimal Fits · Luxury Neutral.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">Step inside <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" /></span>
          </div>
        </Link>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">In their words</p>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Loved by people who keep their pieces.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.a} className="glass-strong rounded-3xl p-6 shadow-soft">
              <Quote className="h-5 w-5 text-accent" />
              <blockquote className="mt-3 font-display text-lg leading-snug">"{t.q}"</blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.a}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] gradient-warm p-10 shadow-soft md:p-20">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cocoa/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Be the first to know.</h2>
            <p className="mt-4 text-muted-foreground">New arrivals, private events, and the occasional letter from the studio.</p>
            <form className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" className="glass-strong h-12 flex-1 rounded-full px-5 text-sm outline-none focus:ring-2 focus:ring-accent/50" />
              <button className="h-12 rounded-full bg-foreground px-7 text-sm font-medium text-background transition-smooth hover:opacity-90">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
