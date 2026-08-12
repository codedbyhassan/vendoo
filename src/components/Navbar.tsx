import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, Search, User as UserIcon, Heart, Sun, Moon, LogOut, Package, ShieldCheck, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";
import { COLLECTIONS } from "@/lib/products";
import { SearchPalette } from "./SearchPalette";

export function Navbar() {
  const { count } = useCart();
  const { theme, toggle } = useTheme();
  const { user, isAdmin, signOut } = useAuth();
  const { count: wishCount } = useWishlist();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [menu, setMenu] = useState(false);
  const [colMenu, setColMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const link = (to: string, label: string) => (
    <Link to={to} className={`text-sm transition-smooth hover:text-foreground ${path === to ? "text-foreground" : "text-muted-foreground"}`}>{label}</Link>
  );

  return (
    <>
      <header className="sticky top-0 z-40">
        <div className="glass-strong border-b border-border/40">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Link to="/" className="font-display text-xl font-semibold tracking-tight">
              Vendooo<span className="text-accent">.</span>
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              {link("/", "Home")}
              {link("/shop", "Shop")}
              <div className="relative" onMouseEnter={() => setColMenu(true)} onMouseLeave={() => setColMenu(false)}>
                <button className={`inline-flex items-center gap-1 text-sm transition-smooth hover:text-foreground ${path.startsWith("/collections") ? "text-foreground" : "text-muted-foreground"}`}>
                  Collections <ChevronDown className="h-3 w-3" />
                </button>
                {colMenu && (
                  <div className="glass-strong absolute left-1/2 mt-2 w-[420px] -translate-x-1/2 rounded-2xl border border-border/40 p-3 shadow-soft">
                    <div className="grid grid-cols-2 gap-1">
                      {COLLECTIONS.map((c) => (
                        <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-secondary">
                          <img src={c.hero} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-medium">{c.name}</p>
                            <p className="text-[11px] text-muted-foreground line-clamp-1">{c.tagline}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link to="/collections" className="mt-2 block rounded-xl bg-secondary px-3 py-2 text-center text-xs font-medium hover:bg-muted">View all collections</Link>
                  </div>
                )}
              </div>
              {link("/lookbook", "Lookbook")}
              {link("/about", "About")}
              {user && link("/orders", "Orders")}
              {isAdmin && link("/admin", "Admin")}
            </nav>
            <div className="flex items-center gap-1">
              <button onClick={toggle} aria-label="Toggle theme" className="rounded-full p-2 transition-smooth hover:bg-secondary">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button onClick={() => setSearchOpen(true)} aria-label="Search" className="rounded-full p-2 transition-smooth hover:bg-secondary">
                <Search className="h-4 w-4" />
              </button>
              <Link to="/wishlist" aria-label="Wishlist" className="relative rounded-full p-2 transition-smooth hover:bg-secondary">
                <Heart className="h-4 w-4" />
                {wishCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">{wishCount}</span>
                )}
              </Link>

              <div className="relative">
                <button onClick={() => setMenu((m) => !m)} onBlur={() => setTimeout(() => setMenu(false), 150)} aria-label="Account" className="rounded-full p-2 transition-smooth hover:bg-secondary">
                  <UserIcon className="h-4 w-4" />
                </button>
                {menu && (
                  <div className="glass-strong absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border/40 p-2 shadow-soft">
                    {user ? (
                      <>
                        <div className="px-3 py-2">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="my-1 border-t border-border/40" />
                        <Link to="/orders" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"><Package className="h-4 w-4" /> My orders</Link>
                        <Link to="/wishlist" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"><Heart className="h-4 w-4" /> Wishlist</Link>
                        {isAdmin && <Link to="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"><ShieldCheck className="h-4 w-4" /> Admin</Link>}
                        <button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"><LogOut className="h-4 w-4" /> Sign out</button>
                      </>
                    ) : (
                      <Link to="/signin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"><UserIcon className="h-4 w-4" /> Sign in</Link>
                    )}
                  </div>
                )}
              </div>

              <Link to="/cart" aria-label="Cart" className="relative rounded-full p-2 transition-smooth hover:bg-secondary">
                <ShoppingBag className="h-4 w-4" />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">{count}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
