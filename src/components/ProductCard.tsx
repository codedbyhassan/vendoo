import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { haptic } from "@/lib/haptics";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const { add } = useCart();
  const wished = has(product.id);
  const outOfStock = (product.stock ?? 0) <= 0;

  const onWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    haptic("light");
    toggle(product.id);
    toast(wished ? "Removed from wishlist" : "Added to wishlist", { description: product.name });
  };

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (requiresConfig) return;
    if (outOfStock) {
      haptic("warning");
      toast.warning("Out of stock", { description: product.name });
      return;
    }
    haptic("success");
    add(product, { color: product.colors?.[0]?.name });
    toast.success("Added to bag", { description: product.name });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary shadow-soft">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-smooth group-hover:scale-[1.04]"
          />

          {outOfStock && (
            <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-background">
              Sold out
            </span>
          )}

          {/* Wishlist heart */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onWish}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md transition-smooth hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 transition-smooth ${wished ? "fill-accent text-accent" : "text-foreground"}`}
            />
          </motion.button>

          {/* Bottom action */}
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-smooth group-hover:translate-y-0 group-hover:opacity-100">
            {requiresConfig ? (
              <div className="glass-strong flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Configure
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onAdd}
                disabled={outOfStock}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-medium text-background transition-smooth hover:opacity-90 disabled:opacity-50"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                {outOfStock ? "Sold out" : "Add to bag"}
              </motion.button>
            )}
          </div>
        </div>
      </Link>

      <Link to="/product/$id" params={{ id: product.id }} className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{product.category}</p>
          <h3 className="mt-1 text-sm font-medium">{product.name}</h3>
          {product.colors && product.colors.length > 0 && (
            <div className="mt-2 flex gap-1">
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-3 w-3 rounded-full border border-border/60"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-sm font-medium">${product.price}</p>
      </Link>
    </motion.div>
  );
}
