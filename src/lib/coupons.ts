export type Coupon = { code: string; type: "percent" | "fixed" | "freeship"; value: number; label: string };

export const COUPONS: Coupon[] = [
  { code: "VENDOO10", type: "percent", value: 10, label: "10% off" },
  { code: "WELCOME20", type: "percent", value: 20, label: "20% off your first order" },
  { code: "SAVE50", type: "fixed", value: 50, label: "$50 off" },
  { code: "FREESHIP", type: "freeship", value: 0, label: "Free shipping" },
];

export function applyCoupon(subtotal: number, shipping: number, code: string | null): { discount: number; shipping: number; coupon: Coupon | null; error?: string } {
  if (!code) return { discount: 0, shipping, coupon: null };
  const c = COUPONS.find((x) => x.code.toUpperCase() === code.toUpperCase());
  if (!c) return { discount: 0, shipping, coupon: null, error: "Invalid code" };
  if (c.type === "percent") return { discount: Math.round(subtotal * (c.value / 100)), shipping, coupon: c };
  if (c.type === "fixed") return { discount: Math.min(subtotal, c.value), shipping, coupon: c };
  return { discount: 0, shipping: 0, coupon: c };
}
