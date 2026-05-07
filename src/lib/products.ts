import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

export type ProductColor = { name: string; hex: string };
export type Gender = "men" | "women" | "unisex";
export type Collection =
  | "new-arrivals"
  | "sale"
  | "summer-drop"
  | "luxury"
  | "streetwear"
  | "sneakers"
  | "best-sellers";

export type Product = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: "Outerwear" | "Knitwear" | "Tops" | "Bottoms" | "Bags" | "Shoes" | "Accessories";
  image: string;
  images?: string[];
  description: string;
  details: string[];
  sizes?: string[];
  colors?: ProductColor[];
  stock?: number;
  featured?: boolean;
  gender?: Gender;
  collections?: Collection[];
  material?: string;
  care?: string[];
};

const baseCare = ["Dry clean preferred", "Reshape and lay flat to dry", "Cool iron if needed"];

export const PRODUCTS: Product[] = [
  { id: "cashmere-crew", name: "Cashmere Crew Sweater", price: 280, category: "Knitwear", image: p1, images: [p1, p3],
    description: "Spun from Grade-A Mongolian cashmere, an heirloom piece designed to soften with every wear.",
    details: ["100% Mongolian cashmere", "Ribbed crew neckline", "Dry clean only"],
    sizes: ["XS","S","M","L","XL"],
    colors: [{ name: "Oat", hex: "#d6c4a8" },{ name: "Cocoa", hex: "#5a4636" },{ name: "Charcoal", hex: "#2f2f31" }],
    stock: 24, featured: true, gender: "unisex", collections: ["new-arrivals", "luxury", "best-sellers"], material: "Cashmere", care: baseCare },
  { id: "wool-trousers", name: "Pleated Wool Trousers", price: 240, category: "Bottoms", image: p2, images: [p2],
    description: "A modern take on the tailored trouser, cut from Italian virgin wool with a fluid drape.",
    details: ["Italian virgin wool", "Hidden hook closure", "Tailored fit"],
    sizes: ["24","26","28","30","32"],
    colors: [{ name: "Black", hex: "#111" },{ name: "Stone", hex: "#9a8f7d" }],
    stock: 18, featured: true, gender: "women", collections: ["new-arrivals", "luxury"], material: "Virgin wool", care: baseCare },
  { id: "silk-blouse", name: "Silk Charmeuse Blouse", price: 195, category: "Tops", image: p3, images: [p3, p1],
    description: "Liquid silk in a relaxed silhouette, finished with mother-of-pearl buttons.",
    details: ["100% silk charmeuse", "Mother-of-pearl buttons"],
    sizes: ["XS","S","M","L"],
    colors: [{ name: "Ivory", hex: "#f3ece1" },{ name: "Sage", hex: "#a8b39b" }],
    stock: 14, featured: true, gender: "women", collections: ["luxury", "summer-drop"], material: "Silk", care: baseCare },
  { id: "leather-tote", name: "Saddle Leather Tote", price: 420, compareAtPrice: 520, category: "Bags", image: p4, images: [p4],
    description: "Vegetable-tanned full-grain leather, hand-finished by artisans in Florence.",
    details: ["Full-grain Italian leather","Cotton twill lining","Detachable shoulder strap"],
    colors: [{ name: "Saddle", hex: "#8b5a3c" },{ name: "Black", hex: "#111" }],
    stock: 9, featured: true, gender: "unisex", collections: ["sale", "luxury", "best-sellers"], material: "Leather", care: ["Wipe with soft cloth","Condition every 6 months"] },
  { id: "chelsea-boots", name: "Chelsea Ankle Boots", price: 360, category: "Shoes", image: p5, images: [p5],
    description: "A lifetime boot. Goodyear-welted construction on a modest leather heel.",
    details: ["Calfskin upper", "Goodyear-welted sole", "35mm stacked heel"],
    sizes: ["36","37","38","39","40","41"],
    colors: [{ name: "Black", hex: "#111" },{ name: "Cognac", hex: "#9a5a2c" }],
    stock: 12, gender: "unisex", collections: ["sneakers", "best-sellers"], material: "Calfskin", care: ["Clean with damp cloth","Polish monthly"] },
  { id: "trench-coat", name: "Belted Trench Coat", price: 520, category: "Outerwear", image: p6, images: [p6],
    description: "Our archetypal trench, re-cut for a relaxed silhouette in water-resistant gabardine.",
    details: ["Cotton gabardine","Storm flap & throat latch","Belted waist"],
    sizes: ["XS","S","M","L"],
    colors: [{ name: "Camel", hex: "#c4a273" },{ name: "Sand", hex: "#d8c8ac" }],
    stock: 7, featured: true, gender: "women", collections: ["new-arrivals", "luxury"], material: "Cotton gabardine", care: baseCare },
  { id: "silk-scarf", name: "Hand-Rolled Silk Scarf", price: 110, category: "Accessories", image: p7, images: [p7],
    description: "A weightless square of twill silk, hand-rolled and finished in France.",
    details: ["100% silk twill","Hand-rolled hem","90 × 90 cm"],
    colors: [{ name: "Saffron", hex: "#d29347" },{ name: "Ink", hex: "#1f2237" }],
    stock: 30, gender: "women", collections: ["summer-drop"], material: "Silk", care: baseCare },
  { id: "gold-hoops", name: "Petite Gold Hoops", price: 145, category: "Accessories", image: p8, images: [p8],
    description: "Everyday hoops in 14k gold vermeil, polished to a soft warm shine.",
    details: ["14k gold vermeil","Hypoallergenic posts","25mm diameter"],
    stock: 50, gender: "women", collections: ["best-sellers", "luxury"], material: "14k gold vermeil", care: ["Store in pouch","Avoid water"] },
  { id: "linen-shirt", name: "Relaxed Linen Shirt", price: 165, category: "Tops", image: p3, images: [p3],
    description: "Garment-washed European linen with a soft, lived-in hand and an easy fit.",
    details: ["100% European linen","Mother-of-pearl buttons","Machine wash cold"],
    sizes: ["XS","S","M","L","XL"],
    colors: [{ name: "White", hex: "#f6f3ec" },{ name: "Olive", hex: "#6c6b3f" }],
    stock: 22, gender: "men", collections: ["summer-drop", "new-arrivals"], material: "Linen", care: ["Machine wash cold","Tumble dry low"] },
  { id: "merino-cardigan", name: "Fine Merino Cardigan", price: 245, category: "Knitwear", image: p1, images: [p1],
    description: "Featherweight merino, knit at low gauge for a quiet drape.",
    details: ["Extra-fine merino wool","Horn buttons","Hand wash"],
    sizes: ["XS","S","M","L"],
    colors: [{ name: "Bone", hex: "#e6dfce" },{ name: "Navy", hex: "#1c2438" }],
    stock: 16, gender: "men", collections: ["luxury"], material: "Merino wool", care: baseCare },
  { id: "wide-leg-jeans", name: "High-Rise Wide Jeans", price: 195, compareAtPrice: 240, category: "Bottoms", image: p2, images: [p2],
    description: "Rigid Japanese selvedge denim cut to a clean, fluid wide leg.",
    details: ["13.5oz Japanese selvedge","Cotton lining at waistband","Made in Portugal"],
    sizes: ["24","26","28","30","32","34"],
    colors: [{ name: "Indigo", hex: "#2a3a55" },{ name: "Ecru", hex: "#dfd4bd" }],
    stock: 20, gender: "women", collections: ["sale", "streetwear"], material: "Selvedge denim", care: ["Cold wash inside out","Air dry"] },
  { id: "wool-overshirt", name: "Boiled Wool Overshirt", price: 340, category: "Outerwear", image: p6, images: [p6],
    description: "A hybrid jacket-shirt in dense Italian boiled wool. Layers without bulk.",
    details: ["Boiled Italian wool","Patch pockets","Horn buttons"],
    sizes: ["S","M","L","XL"],
    colors: [{ name: "Forest", hex: "#33473b" },{ name: "Charcoal", hex: "#2c2d31" }],
    stock: 11, gender: "men", collections: ["new-arrivals", "streetwear"], material: "Boiled wool", care: baseCare },
  { id: "loafers", name: "Hand-Stitched Loafers", price: 320, category: "Shoes", image: p5, images: [p5],
    description: "Classic penny loafers in supple calfskin with a leather sole.",
    details: ["Calfskin upper","Blake-stitched sole","Made in Italy"],
    sizes: ["36","37","38","39","40","41","42"],
    colors: [{ name: "Black", hex: "#111" },{ name: "Burgundy", hex: "#5a1f24" }],
    stock: 14, gender: "men", collections: ["luxury", "best-sellers"], material: "Calfskin", care: ["Polish monthly"] },
  { id: "card-wallet", name: "Slim Card Wallet", price: 95, category: "Accessories", image: p4, images: [p4],
    description: "Six card slots in vegetable-tanned leather. Patinas beautifully.",
    details: ["Vegetable-tanned leather","6 card slots","Made in Italy"],
    colors: [{ name: "Saddle", hex: "#8b5a3c" },{ name: "Black", hex: "#111" }],
    stock: 40, gender: "men", collections: ["best-sellers"], material: "Leather", care: ["Wipe with soft cloth"] },
  { id: "crossbody-bag", name: "Mini Crossbody Bag", price: 285, category: "Bags", image: p4, images: [p4],
    description: "A compact everyday silhouette in soft pebbled leather.",
    details: ["Pebbled Italian leather","Adjustable strap","Magnetic closure"],
    colors: [{ name: "Cream", hex: "#ece3d2" },{ name: "Black", hex: "#111" }],
    stock: 13, gender: "women", collections: ["new-arrivals", "luxury"], material: "Pebbled leather", care: ["Wipe with soft cloth"] },
  { id: "pearl-earrings", name: "Single Pearl Studs", price: 125, category: "Accessories", image: p8, images: [p8],
    description: "Freshwater pearls set on 14k gold-fill posts.",
    details: ["Freshwater pearl","14k gold fill","8mm pearl"],
    stock: 35, gender: "women", collections: ["luxury", "best-sellers"], material: "Pearl + 14k gold fill", care: ["Avoid perfume","Store flat"] },
  { id: "court-sneakers", name: "Court Leather Sneakers", price: 220, category: "Shoes", image: p5, images: [p5],
    description: "Minimal court silhouette in butter-soft white leather.",
    details: ["Italian leather","Cupsole","Cotton laces"],
    sizes: ["38","39","40","41","42","43","44"],
    colors: [{ name: "White", hex: "#f6f3ec" },{ name: "Bone", hex: "#e6dfce" }],
    stock: 26, gender: "unisex", collections: ["sneakers", "new-arrivals", "streetwear"], material: "Leather", care: ["Spot clean only"] },
  { id: "tech-runner", name: "Tech Runner — Sand", price: 260, category: "Shoes", image: p5, images: [p5],
    description: "Cushioned trainer with a sculpted midsole — built for everyday miles.",
    details: ["Recycled mesh upper","EVA midsole","Reflective heel"],
    sizes: ["38","39","40","41","42","43","44"],
    colors: [{ name: "Sand", hex: "#d8c8ac" },{ name: "Onyx", hex: "#1a1a1a" }],
    stock: 19, gender: "unisex", collections: ["sneakers", "streetwear", "new-arrivals"], material: "Recycled mesh", care: ["Spot clean"] },
  { id: "oversized-tee", name: "Heavyweight Box Tee", price: 75, compareAtPrice: 95, category: "Tops", image: p3, images: [p3],
    description: "240gsm cotton with a boxy, dropped-shoulder fit.",
    details: ["240gsm combed cotton","Dropped shoulder","Garment dyed"],
    sizes: ["S","M","L","XL"],
    colors: [{ name: "Vintage Black", hex: "#1a1a1a" },{ name: "Bone", hex: "#e6dfce" }],
    stock: 50, gender: "unisex", collections: ["streetwear", "sale", "summer-drop"], material: "Cotton", care: ["Cold wash"] },
  { id: "cargo-pants", name: "Tech Cargo Pants", price: 215, category: "Bottoms", image: p2, images: [p2],
    description: "Utility cargos in a water-repellent technical weave.",
    details: ["DWR finish","Tapered leg","Bellowed pockets"],
    sizes: ["S","M","L","XL"],
    colors: [{ name: "Olive", hex: "#5b6238" },{ name: "Black", hex: "#111" }],
    stock: 17, gender: "men", collections: ["streetwear", "new-arrivals"], material: "Technical nylon", care: ["Cold wash"] },
];

export const CATEGORIES = ["All","Outerwear","Knitwear","Tops","Bottoms","Bags","Shoes","Accessories"] as const;

export type CollectionMeta = {
  slug: Collection;
  name: string;
  tagline: string;
  hero: string;
};

export const COLLECTIONS: CollectionMeta[] = [
  { slug: "new-arrivals", name: "New Arrivals", tagline: "Fresh in this week — the latest considered drops.", hero: p6 },
  { slug: "best-sellers", name: "Best Sellers", tagline: "The pieces our community keeps coming back to.", hero: p1 },
  { slug: "summer-drop", name: "Summer Drop", tagline: "Linen, silk and lightweight knits for warmer days.", hero: p3 },
  { slug: "luxury", name: "Luxury Neutral", tagline: "Quiet luxury — heirloom essentials in considered tones.", hero: p4 },
  { slug: "streetwear", name: "Streetwear", tagline: "Boxy fits, technical weaves and contemporary edge.", hero: p2 },
  { slug: "sneakers", name: "Sneakers", tagline: "From court classics to cushioned everyday runners.", hero: p5 },
  { slug: "sale", name: "Sale", tagline: "Considered pieces, considered prices. While stocks last.", hero: p7 },
];

export const SEED_VERSION = 3;
