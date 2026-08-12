// Vendooo prices are stored as base units; we display in Ghana Cedis (GH₵).
// Multiplier converts the base catalog values into realistic local prices.
export const PRICE_MULTIPLIER = 12;
export const CURRENCY_SYMBOL = "GH₵";

export function toCedis(base: number): number {
  return Math.round(base * PRICE_MULTIPLIER);
}

export function formatPrice(base: number, opts: { decimals?: boolean } = {}): string {
  const value = toCedis(base);
  const formatted = value.toLocaleString("en-GH", {
    minimumFractionDigits: opts.decimals ? 2 : 0,
    maximumFractionDigits: opts.decimals ? 2 : 0,
  });
  return `${CURRENCY_SYMBOL} ${formatted}`;
}

// For values already converted (e.g. order totals stored in cedis)
export function formatCedis(value: number): string {
  return `${CURRENCY_SYMBOL} ${value.toLocaleString("en-GH")}`;
}
