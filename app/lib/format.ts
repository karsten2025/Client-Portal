// app/lib/format.ts
import type { Lang } from "./catalog";

/**
 * Hilfsfunktion, um Geldbeträge sauber zu formatieren.
 * Beispiel: 12345 -> "12.345" (DE) oder "12,345" (EN)
 */
export function formatCurrency(
  value: number,
  lang: Lang,
  fractionDigits: number = 0
): string {
  const locale = lang === "en" ? "en-US" : "de-DE";

  return value.toLocaleString(locale, {
    minimumFractionDigits: fractionDigits,
  });
}
