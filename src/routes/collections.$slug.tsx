import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { COLLECTIONS, type Collection } from "@/lib/products";
import { useProducts } from "@/context/ProductStore";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const c = COLLECTIONS.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    return { collection: c };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.collection;
    return {
      meta: [
        { title: `${c?.name ?? "Collection"} — Vendooo` },
        { name: "description", content: c?.tagline ?? "Vendooo collection" },
        { property: "og:title", content: `${c?.name} — Vendooo` },
        { property: "og:description", content: c?.tagline ?? "" },
        ...(c?.hero ? [{ property: "og:image" as const, content: c.hero }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Collection not found</h1>
        <Link to="/collections" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">All collections</Link>
      </div>
    </Layout>
  ),
  component: Page,
});

function Page() {
  const { collection } = Route.useLoaderData();
  const { products } = useProducts();
  const list = products.filter((p) => p.collections?.includes(collection.slug as Collection));
  return (
    <Layout>
      <section className="relative h-[42vh] min-h-[320px] overflow-hidden">
        <img src={collection.hero} alt={collection.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-10 text-white">
          <Link to="/collections" className="inline-flex w-fit items-center gap-1 text-xs opacity-80 hover:opacity-100"><ChevronLeft className="h-3 w-3" /> All collections</Link>
          <h1 className="mt-3 font-display text-5xl font-semibold md:text-7xl">{collection.name}</h1>
          <p className="mt-2 max-w-xl text-sm opacity-90 md:text-base">{collection.tagline}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-6 text-xs text-muted-foreground">{list.length} pieces</p>
        {list.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No pieces in this edit yet.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
