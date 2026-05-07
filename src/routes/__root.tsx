import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ProductStoreProvider } from "@/context/ProductStore";
import { OrderProvider } from "@/context/OrderContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold">404</h1>
        <p className="mt-3 text-muted-foreground">This page wandered off.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
          Back home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vendoo — Considered Essentials" },
      { name: "description", content: "Vendoo crafts considered wardrobe essentials — heirloom-quality knitwear, outerwear, and accessories." },
      { property: "og:title", content: "Vendoo — Considered Essentials" },
      { property: "og:description", content: "Considered wardrobe essentials, made to keep." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        children: `(function(){try{var t=localStorage.getItem('vendoo-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}document.documentElement.style.colorScheme=t;}catch(e){}})();`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: () => (
    <ThemeProvider>
      <AuthProvider>
        <ProductStoreProvider>
          <WishlistProvider>
            <CartProvider>
              <OrderProvider>
                <RecentlyViewedProvider>
                  <Outlet />
                  <Toaster />
                </RecentlyViewedProvider>
              </OrderProvider>
            </CartProvider>
          </WishlistProvider>
        </ProductStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  ),
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}
