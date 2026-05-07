import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Lookbook — Vendoo" },
      { name: "description", content: "Editorial stories from the Vendoo studio — Tokyo Streetwear, Summer Essentials, Minimal Fits and Luxury Neutral." },
      { property: "og:title", content: "Lookbook — Vendoo" },
      { property: "og:image", content: p6 },
    ],
  }),
  component: Page,
});

const stories = [
  { title: "Tokyo Streetwear", body: "Boxy fits, technical weaves, and the rhythm of the city after dark.", img: p2, link: "streetwear" as const },
  { title: "Summer Essentials", body: "Linen, silk, and lightweight knits for long, slow afternoons.", img: p3, link: "summer-drop" as const },
  { title: "Minimal Fits", body: "Pared-back silhouettes in tonal neutrals — the wardrobe as architecture.", img: p1, link: "luxury" as const },
  { title: "Luxury Neutral", body: "Heirloom materials in considered tones, made to keep.", img: p4, link: "luxury" as const },
];

function Page() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={p6} alt="Lookbook hero" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12 text-white">
          <p className="text-[11px] uppercase tracking-[0.3em] opacity-80">Editorial</p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none md:text-8xl">Lookbook<span className="italic">.</span></h1>
          <p className="mt-4 max-w-lg text-sm opacity-90 md:text-base">Stories from the studio — moods, materials, and the worlds that shape each collection.</p>
        </div>
      </section>

      {stories.map((s, i) => (
        <section key={s.title} className={`mx-auto grid max-w-7xl gap-10 px-6 py-24 md:grid-cols-2 md:items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
          <img src={s.img} alt={s.title} className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-soft" />
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Story {String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-6xl">{s.title}</h2>
            <p className="mt-5 max-w-md text-muted-foreground">{s.body}</p>
            <Link to="/collections/$slug" params={{ slug: s.link }} className="group mt-6 inline-flex items-center gap-2 text-sm font-medium">
              Shop the edit <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[p1,p2,p3,p4,p5,p6,p7,p1].map((src, i) => (
            <img key={i} src={src} alt="" className="aspect-square w-full rounded-2xl object-cover" />
          ))}
        </div>
      </section>
    </Layout>
  );
}
