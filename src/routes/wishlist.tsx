import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductStore";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Vendooo" }] }),
  component: Page,
});

function Page() {
  const { ids } = useWishlist();
  const { products } = useProducts();
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Saved</p>
        <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Wishlist</h1>
        <p className="mt-2 text-sm text-muted-foreground">{items.length} pieces saved.</p>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border/60 p-16 text-center">
            <Heart className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No saved pieces yet.</p>
            <Link to="/shop" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
              Discover the collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
