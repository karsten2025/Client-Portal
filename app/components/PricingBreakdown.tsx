"use client";

import type { Lang } from "../lib/catalog";
import {
  BASE_DAY_RATE,
  INTENSIVE_SURCHARGE,
  SENIOR_DAY_HOURS,
  type PricingResult,
} from "../lib/pricing";
import { formatCurrency } from "../lib/format";

type Props = {
  lang: Lang;
  pricing: PricingResult;
  currency: string;
  /** Netto-Gesamtsumme unter der Aufschlüsselung anzeigen */
  showProjectTotal?: boolean;
  className?: string;
};

export function PricingBreakdown({
  lang,
  pricing,
  currency,
  showProjectTotal = false,
  className = "",
}: Props) {
  const L = lang;
  const label = (de: string, en: string) => (L === "en" ? en : de);

  return (
    <div className={`text-xs text-slate-700 space-y-1.5 ${className}`}>
      <div className="font-medium text-slate-900">
        {label("Ihr Tagessatz:", "Your day rate:")}{" "}
        {formatCurrency(pricing.dayRate, L, 0)} {currency}{" "}
        <span className="font-normal text-slate-600">
          ({label("netto", "net")} — {pricing.tierLabel[L]} ·{" "}
          {label("Senior-Tag", "Senior day")} {SENIOR_DAY_HOURS}{" "}
          {label("h", "h")})
        </span>
      </div>

      <div>
        {label("Stundensatz:", "Hourly rate:")}{" "}
        {formatCurrency(pricing.hourlyRate, L, 2)} {currency}/h{" "}
        <span className="text-slate-600">
          ({label("Tagessatz ÷ 6", "day rate ÷ 6")})
        </span>
      </div>

      <div>
        {label("Halbtag:", "Half day:")}{" "}
        {formatCurrency(pricing.halfDayRate, L, 0)} {currency}{" "}
        <span className="text-slate-600">
          ({label("50 % des Tagessatzes", "50% of day rate")})
        </span>
      </div>

      <div>
        {label("Basis:", "Base:")} {formatCurrency(BASE_DAY_RATE, L, 0)}{" "}
        {currency}
        {pricing.surchargeApplies && (
          <>
            {" "}
            · {label("Intensiv-Zuschlag:", "Intensive surcharge:")} +
            {formatCurrency(INTENSIVE_SURCHARGE, L, 0)} {currency}
          </>
        )}
      </div>

      {pricing.surchargeApplies && (
        <p className="text-slate-600 leading-snug">
          {pricing.surchargeReason[L]}
        </p>
      )}

      <p className="text-slate-600 leading-snug border-t border-slate-200 pt-1.5">
        {pricing.timeModelNote[L]}
      </p>

      {showProjectTotal && (
        <div className="pt-1 text-sm font-semibold text-slate-900">
          {label("Projekthonorar (netto):", "Project fee (net):")}{" "}
          {formatCurrency(pricing.net, L, 0)} {currency}
        </div>
      )}
    </div>
  );
}

/** Kompakte Zeilen für PDF-Vorschau und OfferPdf */
export function PricingOverviewLines({
  lang,
  pricing,
  currency,
}: {
  lang: Lang;
  pricing: PricingResult;
  currency: string;
}) {
  const L = lang;
  const locale = L === "en" ? "en-US" : "de-DE";
  const label = (de: string, en: string) => (L === "en" ? en : de);

  const fmt = (n: number, digits = 0) =>
    n.toLocaleString(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });

  return (
    <div className="space-y-1">
      {pricing.surchargeApplies ? (
        <>
          <div>
            {label("Basis:", "Base:")} {fmt(BASE_DAY_RATE)}{" "}
            {currency} · {label("Intensiv-Zuschlag:", "Intensive surcharge:")}{" "}
            +{fmt(INTENSIVE_SURCHARGE)} {currency}
          </div>
          <div className="text-slate-600">{pricing.surchargeReason[L]}</div>
        </>
      ) : null}
      <div>
        {label("Tagessatz:", "Day rate:")} {fmt(pricing.dayRate)} {currency}{" "}
        ({label("Senior-Tag", "Senior day")} {SENIOR_DAY_HOURS}{" "}
        {label("h", "h")}, {label("netto", "net")})
      </div>
      <div>
        {label("Stundensatz:", "Hourly rate:")} {fmt(pricing.hourlyRate, 2)}{" "}
        {currency}/h
      </div>
      <div>
        {label("Halbtag:", "Half day:")} {fmt(pricing.halfDayRate)} {currency}
      </div>
      <div className="text-slate-600 text-[10px] leading-snug">
        {pricing.timeModelNote[L]}
      </div>
      <div>
        {label("Tage:", "Days:")} {fmt(pricing.days)} ·{" "}
        {label("Projekthonorar (netto):", "Project fee (net):")}{" "}
        {fmt(pricing.net, 2)} {currency}
      </div>
      <div>
        {label("Umsatzsteuer 19%:", "VAT 19%:")} {fmt(pricing.tax, 2)}{" "}
        {currency}
      </div>
      <div className="font-semibold">
        {label("Endbetrag:", "Total amount:")} {fmt(pricing.gross, 2)}{" "}
        {currency}
      </div>
    </div>
  );
}
