// app/lib/pricing.ts — zentrale Preislogik (Variante C: Basis + ein Zuschlag)

import type { BehaviorId, CaringId, Lang, PsychoId } from "./catalog";

export const BASE_DAY_RATE = 1150;
export const INTENSIVE_SURCHARGE = 300;
export const VAT_RATE = 0.19;

/** Senior-Tag: Stunden im Tagessatz enthalten */
export const SENIOR_DAY_HOURS = 6;
/** Halbtag = 50 % des Tagessatzes (3 h Äquivalent) */
export const HALF_DAY_FACTOR = 0.5;
/** Obergrenze abrechenbarer Stunden pro Kalendertag */
export const MAX_BILLABLE_HOURS_PER_DAY = 8;

export type PricingInput = {
  behaviorId: BehaviorId | "";
  psychoId: PsychoId | "";
  caringId: CaringId | "";
  days: number;
};

export type SurchargeTrigger = "turnaround" | "political" | "psych-c" | "care-c";

export type PricingResult = {
  baseRate: number;
  surcharge: number;
  surchargeApplies: boolean;
  dayRate: number;
  hourlyRate: number;
  halfDayRate: number;
  seniorDayHours: number;
  maxBillableHoursPerDay: number;
  days: number;
  net: number;
  tax: number;
  gross: number;
  surchargeTriggers: SurchargeTrigger[];
  surchargeReason: Record<Lang, string>;
  tierLabel: Record<Lang, string>;
  timeModelNote: Record<Lang, string>;
};

const TRIGGER_REASON: Record<SurchargeTrigger, Record<Lang, string>> = {
  turnaround: {
    de: "Akute Krise: kurze Wege, schnelle Entscheidungen und oft Vor-Ort-Präsenz.",
    en: "Acute crisis: short lines, fast decisions, and often on-site presence.",
  },
  political: {
    de: "Hochpolitisches Umfeld: mehr Abstimmung mit Stakeholdern und behutsame Kommunikation.",
    en: "Highly political setting: more stakeholder alignment and careful communication.",
  },
  "psych-c": {
    de: "Tiefe Systemarbeit — das geht über reine Prozessbegleitung hinaus.",
    en: "Deep system work — this goes beyond standard process guidance.",
  },
  "care-c": {
    de: "Hohe persönliche Einbindung — ich gehe mit unternehmerischer Haltung in Vorleistung.",
    en: "High personal commitment — I take initiative with an entrepreneurial mindset.",
  },
};

const TIER_STANDARD: Record<Lang, string> = {
  de: "Standard-Mandat — reguläre Begleitung",
  en: "Standard engagement — regular support",
};

const TIER_INTENSIVE: Record<Lang, string> = {
  de: "Intensiv-Mandat",
  en: "Intensive engagement",
};

const COMBINED_SURCHARGE_REASON: Record<Lang, string> = {
  de: "Ihr Mandat erfordert erhöhte Verfügbarkeit und persönliche Vorleistung — deshalb der Intensiv-Zuschlag.",
  en: "Your mandate calls for higher availability and personal commitment — hence the intensive surcharge.",
};

export function computeHourlyRate(dayRate: number): number {
  return Math.round((dayRate / SENIOR_DAY_HOURS) * 100) / 100;
}

export function computeHalfDayRate(dayRate: number): number {
  return Math.round(dayRate * HALF_DAY_FACTOR * 100) / 100;
}

export function getTimeModelNote(
  lang: Lang,
  dayRate: number,
  hourlyRate: number,
  halfDayRate: number
): string {
  const locale = lang === "en" ? "en-US" : "de-DE";
  const fmt = (n: number, digits = 2) =>
    n.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const cur = lang === "en" ? " EUR" : " €";

  if (lang === "en") {
    return (
      `A project day (senior day) covers ${SENIOR_DAY_HOURS} billable hours at ${fmt(dayRate, 0)}${cur} net. ` +
      `Hourly rate: ${fmt(hourlyRate)}${cur}/h (day rate ÷ ${SENIOR_DAY_HOURS}). ` +
      `Half day: ${fmt(halfDayRate, 0)}${cur} net (50% of day rate, up to ${SENIOR_DAY_HOURS * HALF_DAY_FACTOR} hours). ` +
      `Maximum ${MAX_BILLABLE_HOURS_PER_DAY} hours may be billed per calendar day; hours beyond ${SENIOR_DAY_HOURS} are charged at the hourly rate.`
    );
  }

  return (
    `Ein Projekttag (Senior-Tag) umfasst ${SENIOR_DAY_HOURS} abrechenbare Stunden zum Tagessatz von ${fmt(dayRate, 0)}${cur} netto. ` +
    `Stundensatz: ${fmt(hourlyRate)}${cur}/h (Tagessatz ÷ ${SENIOR_DAY_HOURS}). ` +
    `Halbtag: ${fmt(halfDayRate, 0)}${cur} netto (50 % des Tagessatzes, bis ${SENIOR_DAY_HOURS * HALF_DAY_FACTOR} Stunden). ` +
    `Pro Kalendertag höchstens ${MAX_BILLABLE_HOURS_PER_DAY} Stunden abrechenbar; Stunden über ${SENIOR_DAY_HOURS} werden zum Stundensatz berechnet.`
  );
}

export function getSurchargeTriggers(input: {
  behaviorId: BehaviorId | "";
  psychoId: PsychoId | "";
  caringId: CaringId | "";
}): SurchargeTrigger[] {
  const triggers: SurchargeTrigger[] = [];

  if (input.behaviorId === "turnaround") triggers.push("turnaround");
  if (input.behaviorId === "political") triggers.push("political");
  if (input.psychoId === "psych-c") triggers.push("psych-c");
  if (input.caringId === "care-c") triggers.push("care-c");

  return triggers;
}

export function qualifiesForIntensiveSurcharge(input: {
  behaviorId: BehaviorId | "";
  psychoId: PsychoId | "";
  caringId: CaringId | "";
}): boolean {
  return getSurchargeTriggers(input).length > 0;
}

export function getSurchargeReason(
  lang: Lang,
  triggers: SurchargeTrigger[]
): string {
  if (triggers.length === 0) return "";
  if (triggers.length === 1) return TRIGGER_REASON[triggers[0]][lang];
  return COMBINED_SURCHARGE_REASON[lang];
}

export function calculatePricing(input: PricingInput): PricingResult {
  const safeDays = Math.max(1, input.days);
  const triggers = getSurchargeTriggers(input);
  const surchargeApplies = triggers.length > 0;
  const surcharge = surchargeApplies ? INTENSIVE_SURCHARGE : 0;
  const dayRate = BASE_DAY_RATE + surcharge;
  const hourlyRate = computeHourlyRate(dayRate);
  const halfDayRate = computeHalfDayRate(dayRate);
  const net = dayRate * safeDays;
  const tax = Math.round(net * VAT_RATE * 100) / 100;
  const gross = Math.round((net + tax) * 100) / 100;

  const surchargeReason: Record<Lang, string> = {
    de: getSurchargeReason("de", triggers),
    en: getSurchargeReason("en", triggers),
  };

  const tierLabel = surchargeApplies ? TIER_INTENSIVE : TIER_STANDARD;

  const timeModelNote: Record<Lang, string> = {
    de: getTimeModelNote("de", dayRate, hourlyRate, halfDayRate),
    en: getTimeModelNote("en", dayRate, hourlyRate, halfDayRate),
  };

  return {
    baseRate: BASE_DAY_RATE,
    surcharge,
    surchargeApplies,
    dayRate,
    hourlyRate,
    halfDayRate,
    seniorDayHours: SENIOR_DAY_HOURS,
    maxBillableHoursPerDay: MAX_BILLABLE_HOURS_PER_DAY,
    days: safeDays,
    net,
    tax,
    gross,
    surchargeTriggers: triggers,
    surchargeReason,
    tierLabel,
    timeModelNote,
  };
}

/** Kurzer Hinweis fürs Briefing (erwarteter Tagessatz) */
export function getBriefingPricingHint(
  lang: Lang,
  input: Omit<PricingInput, "days">
): string {
  const pricing = calculatePricing({ ...input, days: 1 });
  const rate = formatAmount(pricing.dayRate, lang, 0);
  const hourly = formatAmount(pricing.hourlyRate, lang, 2);
  const timeNote = pricing.timeModelNote[lang];

  if (!pricing.surchargeApplies) {
    return lang === "en"
      ? `Based on your selections, I currently expect ${rate} net per senior day (${SENIOR_DAY_HOURS} h), hourly rate ${hourly}/h. ${timeNote}`
      : `Auf Basis Ihrer Auswahl rechne ich voraussichtlich mit ${rate} netto pro Senior-Tag (${SENIOR_DAY_HOURS} h), Stundensatz ${hourly}/h. ${timeNote}`;
  }

  const surcharge = formatAmount(INTENSIVE_SURCHARGE, lang, 0);
  return lang === "en"
    ? `Based on your selections, I currently expect ${rate} net per senior day — ${formatAmount(BASE_DAY_RATE, lang, 0)} base plus a ${surcharge} intensive surcharge. Hourly rate ${hourly}/h. ${pricing.surchargeReason.en}`
    : `Auf Basis Ihrer Auswahl rechne ich voraussichtlich mit ${rate} netto pro Senior-Tag — ${formatAmount(BASE_DAY_RATE, lang, 0)} Basis plus ${surcharge} Intensiv-Zuschlag. Stundensatz ${hourly}/h. ${pricing.surchargeReason.de}`;
}

function formatAmount(value: number, lang: Lang, fractionDigits = 0): string {
  const locale = lang === "en" ? "en-US" : "de-DE";
  const suffix = lang === "en" ? " EUR" : " €";
  return (
    value.toLocaleString(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }) + suffix
  );
}
