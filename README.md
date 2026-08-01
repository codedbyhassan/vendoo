# Vendoo — Considered Essentials, Made in Ghana

> A production-grade fashion e-commerce front end: full catalog, cart, coupons, checkout, order lifecycle and an admin console — built with TanStack Start, React 19, Tailwind v4 and TypeScript.

<p align="center">
  <img src="docs/screenshots/home-light.png" alt="Vendoo home page" width="900" />
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#screenshots">Screenshots</a> ·
  <a href="#tech-stack">Tech stack</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#production-readiness-audit">Audit</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

---

## Overview

Vendoo is a luxury-minimal fashion storefront designed in and for **Accra, Ghana**. It ships a complete
shopping journey — discovery, product detail, wishlist, bag, coupons, checkout with Mobile Money, order
confirmation and order tracking — plus an admin catalog manager. Prices are rendered in **Ghana Cedis
(GH₵)** through a single formatting layer, and the whole interface supports a first-class dark mode.

The app is server-rendered (SSR) via TanStack Start on a Cloudflare Worker runtime, with per-route SEO
metadata, hydration-safe client state and an accessible, motion-aware design system.

## Features

### Storefront
- **Home** — cinematic hero, collection grid, limited-drop countdown, editorial sections, trust bar.
- **Shop** — search, category filters, gender filter (men / women / unisex), sorting, URL-synced search
  params (shareable, back-button safe) via Zod-validated route search.
- **Collections** — curated edits with dedicated landing pages per collection slug.
- **Product detail** — image gallery with zoom, size/colour selection, size chart, stock awareness,
  wishlist toggle, recently-viewed tracking and related products.
- **Product card quick-add** — hover "Add to bag" that auto-selects sensible defaults; no dead-end
  "configure" step.
- **Command-palette search** (⌘K / Ctrl-K) with recent searches.
- **Wishlist** — persisted, syncable with the bag.
- **Lookbook** and **About** — brand storytelling pages.

### Commerce
- **Bag** — quantity control, per-line stock validation, live shipping-threshold progress, coupon engine.
- **Coupons** — percentage, fixed-amount and free-shipping codes (`VENDOO10`, `WELCOME20`, `SAVE50`,
  `FREESHIP`), validated in both bag and checkout.
- **Checkout** — two-step contact/shipping → payment flow, Ghana-first payment options (Card, MTN MoMo,
  Vodafone Cash, AirtelTigo Money), stock re-validation before payment, simulated settlement.
- **Orders** — order confirmation page, customer order history, per-order tracking with status timeline.
- **Currency** — every price flows through `src/lib/format.ts` (`GH₵`, locale-aware grouping).

### Admin
- Catalog table with search, create/edit/delete products, stock and pricing management, order status
  transitions (`processing → paid → shipped → delivered → cancelled`), seed reset.
- Access is gated by an allow-listed admin identity in `src/context/AuthContext.tsx`.

### Experience & platform
- **Dark mode** with a no-flash inline theme script, system-preference default and persisted choice.
- **Custom scrollbar** — thin, brand-tinted, hover-accented, with a `.no-scrollbar` utility for panes.
- **Motion** — Framer Motion page and list transitions that respect `prefers-reduced-motion`.
- **Haptics** — subtle vibration feedback on supported devices for add/remove/error events.
- **SEO** — unique `<title>`, description, Open Graph and Twitter metadata per route; product routes emit
  product-specific OG titles, descriptions and images.
- **Accessibility** — semantic landmarks, visible focus rings, keyboard-reachable controls, alt text.

## Screenshots

Every page is captured in both themes at 1280px.

### Home
| Light | Dark |
| --- | --- |
| ![Home light](docs/screenshots/home-light.png) | ![Home dark](docs/screenshots/home-dark.png) |

### Shop
| Light | Dark |
| --- | --- |
| ![Shop light](docs/screenshots/shop-light.png) | ![Shop dark](docs/screenshots/shop-dark.png) |

### Collections
| Light | Dark |
| --- | --- |
| ![Collections light](docs/screenshots/collections-light.png) | ![Collections dark](docs/screenshots/collections-dark.png) |

### Product detail
| Light | Dark |
| --- | --- |
| ![Product light](docs/screenshots/product-light.png) | ![Product dark](docs/screenshots/product-dark.png) |

### Bag
| Light | Dark |
| --- | --- |
| ![Cart light](docs/screenshots/cart-light.png) | ![Cart dark](docs/screenshots/cart-dark.png) |

### Checkout
| Light | Dark |
| --- | --- |
| ![Checkout light](docs/screenshots/checkout-light.png) | ![Checkout dark](docs/screenshots/checkout-dark.png) |

### Orders
| Light | Dark |
| --- | --- |
| ![Orders light](docs/screenshots/orders-light.png) | ![Orders dark](docs/screenshots/orders-dark.png) |

### Wishlist
| Light | Dark |
| --- | --- |
| ![Wishlist light](docs/screenshots/wishlist-light.png) | ![Wishlist dark](docs/screenshots/wishlist-dark.png) |

### Lookbook
| Light | Dark |
| --- | --- |
| ![Lookbook light](docs/screenshots/lookbook-light.png) | ![Lookbook dark](docs/screenshots/lookbook-dark.png) |

### About
| Light | Dark |
| --- | --- |
| ![About light](docs/screenshots/about-light.png) | ![About dark](docs/screenshots/about-dark.png) |

### Sign in
| Light | Dark |
| --- | --- |
| ![Sign in light](docs/screenshots/signin-light.png) | ![Sign in dark](docs/screenshots/signin-dark.png) |

### Admin
| Light | Dark |
| --- | --- |
| ![Admin light](docs/screenshots/admin-light.png) | ![Admin dark](docs/screenshots/admin-dark.png) |

### Not found
| Light | Dark |
| --- | --- |
| ![404 light](docs/screenshots/notfound-light.png) | ![404 dark](docs/screenshots/notfound-dark.png) |

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | TanStack Start v1 (SSR) + TanStack Router (file-based routing) |
| UI | React 19, TypeScript (strict), Tailwind CSS v4 (CSS-first `@theme`), shadcn/ui, Radix primitives |
| Motion | Framer Motion |
| Icons | lucide-react |
| Notifications | Sonner |
| Validation | Zod (route search params, forms) |
| Build | Vite 7, Lightning CSS |
| Runtime | Cloudflare Worker (edge SSR) |
| Tooling | ESLint, Prettier, tsgo typecheck |

## Getting started

```bash
# install
bun install          # or: npm install

# develop (http://localhost:8080)
bun run dev

# typecheck / lint / format
npx tsgo --noEmit
bun run lint
bun run format

# production build + local preview
bun run build
bun run preview
```

### Demo credentials & codes

| Purpose | Value |
| --- | --- |
| Admin sign-in | `poundsghst@gmail.com` (any name) |
| Coupons | `VENDOO10`, `WELCOME20`, `SAVE50`, `FREESHIP` |
| Payment | Any values — checkout is simulated (no real charge) |

## Architecture

```text
src/
├── routes/                  file-based routes (SSR + per-route head/SEO)
│   ├── __root.tsx           shell, fonts, no-flash theme script, providers
│   ├── index.tsx            home
│   ├── shop.tsx             catalog + Zod-validated search params
│   ├── collections.*.tsx    collection index and slug pages
│   ├── product.$id.tsx      PDP with product-aware OG metadata
│   ├── cart.tsx             bag, coupons, stock validation
│   ├── checkout.tsx         two-step checkout, MoMo/card, stock re-check
│   ├── order*.tsx           confirmation, history, tracking
│   ├── admin*.tsx           catalog + order management
│   └── signin.tsx / wishlist.tsx / about.tsx / lookbook.tsx
├── context/                 Cart, Orders, Wishlist, Products, Auth, Theme, RecentlyViewed
├── components/              Layout, Navbar, Footer, ProductCard, SearchPalette, Countdown, ui/*
├── lib/                     products (seed catalog), format (GH₵), coupons, haptics, image, utils
└── styles.css               design tokens, dark theme, scrollbar, a11y & motion base layer
```

### Design system
All colour, gradient and shadow values are OKLCH tokens in `src/styles.css` and consumed as semantic
Tailwind classes (`bg-background`, `text-muted-foreground`, `border-border`, `shadow-soft`,
`gradient-hero`, `glass`). No hardcoded hex or `text-white`/`bg-black` in components, so both themes stay
consistent by construction.

### State & persistence
Client state lives in focused React contexts and is persisted to `localStorage` (`vendoo-cart`,
`vendoo-orders`, `vendoo-products`, `vendoo-wishlist`, `vendoo-user`, `vendoo-theme`, `vendoo-coupon`),
with cross-tab sync via the `storage` event and a seed-version guard so catalog updates propagate. All
storage reads happen after mount, keeping SSR and client markup identical.

## Production readiness audit

Findings from a full pass over UI/UX, business logic, rendering and SEO, and what was done.

| Area | Finding | Status |
| --- | --- | --- |
| Hydration | `Date.now()` in the countdown's initial state produced a server/client mismatch (React #418) | Fixed — time reads moved into `useEffect` with a stable placeholder |
| Hydration | Coupon code read from `localStorage` during render in bag and checkout | Fixed — moved to post-mount effects |
| Hydration | Theme script mutates `<html>` before hydration | Fixed — `suppressHydrationWarning` on the shell element |
| Console | Preview console now reports zero errors across home, shop, PDP, bag, checkout, admin | Verified |
| Scrollbar | Default OS scrollbar broke the premium feel | Redesigned — thin, rounded, brand-tinted, accent on hover; `.no-scrollbar` utility for internal panes |
| Accessibility | Missing global focus treatment; motion could not be opted out of | Fixed — global `:focus-visible` ring and `prefers-reduced-motion` reset |
| SEO | Product pages emitted a generic "Product · Vendoo" title | Fixed — real product name, description, price, OG/Twitter image per product |
| SEO | All routes carry unique titles, descriptions and OG tags | Verified |
| Currency | Mixed dollar/cedi output | Fixed — single `formatPrice` source of truth in `src/lib/format.ts` |
| Commerce logic | Stock validated in the bag and re-validated at payment; stock decremented on order creation; coupon cleared after purchase | Verified |
| UX | Product card required a "configure" detour before adding | Fixed — direct "Add to bag" with default variant selection |
| Dark mode | Gradients and shadows washed out in dark theme | Fixed — dark-specific gradient/shadow tokens |
| Copy | Localisation to Ghana (Accra addresses, GH₵ thresholds, Mobile Money, Harmattan edit) | Done |
| Typecheck | `tsgo --noEmit` clean | Passing |

### Known limitations (by design, for the demo build)
- Data is seeded and persisted client-side; there is no database, real auth or payment processor yet.
- Admin access is allow-list based on the client; it is a demo gate, not a security boundary.
- Checkout settlement is simulated; no PCI or MoMo API integration.

## Roadmap

1. **Backend** — move catalog, orders and users to a hosted Postgres with row-level security; server
   functions for order creation and stock decrement (authoritative, race-safe).
2. **Real auth** — email/OTP plus Google sign-in, server-verified roles in a dedicated `user_roles` table.
3. **Payments** — Paystack / Flutterwave for Ghana (Card + MTN MoMo + Vodafone Cash) with webhooks.
4. **Transactional email** — order confirmation, shipping and delivery notifications.
5. **Newsletter** — double opt-in capture with segmentation for drops.
6. **Search** — server-side, typo-tolerant catalog search with facets.
7. **Analytics** — funnel instrumentation (view → add → checkout → purchase) and Core Web Vitals.
8. **Testing** — Vitest unit coverage for pricing/coupons and Playwright end-to-end for the buy flow.

## License

Released for portfolio and evaluation purposes. Product photography is placeholder imagery.

---

**Vendoo.** Considered essentials, designed in Accra — the wardrobe you keep forever.
