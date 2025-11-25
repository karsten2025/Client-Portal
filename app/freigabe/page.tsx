// app/freigabe/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  BEHAVIORS,
  SKILLS,
  PSYCH_LEVELS,
  CARING_LEVELS,
  LOCAL_KEYS,
  type Lang,
  type Behavior,
  type Level,
  type BehaviorId,
  type PsychoId,
  type CaringId,
} from "../lib/catalog";
import { useLanguage } from "../lang/LanguageContext";
import { ProcessBar } from "../components/ProcessBar";
import { formatCurrency } from "../lib/format";

const BASE_DAY_RATE = 2000;

export default function FreigabePage() {
  const { lang } = useLanguage();
  const L: Lang = (lang as Lang) || "de";

  const [brief, setBrief] = useState<Record<string, string>>({});
  const [behaviorId, setBehaviorId] = useState<string>("");
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [psychoId, setPsychoId] = useState<string>("");
  const [caringId, setCaringId] = useState<string>("");
  const [days, setDays] = useState<number>(5);

  // Freigabe-Checkbox
  const [accepted, setAccepted] = useState(false);

  // --- localStorage laden (nur lesen, nichts editierbar) ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const formRaw = window.localStorage.getItem(LOCAL_KEYS.form);
      const skillsRaw = window.localStorage.getItem(LOCAL_KEYS.skills);
      const daysRaw = window.localStorage.getItem("offer.days");

      setBrief(formRaw ? JSON.parse(formRaw) : {});
      setBehaviorId(window.localStorage.getItem(LOCAL_KEYS.behavior) || "");
      setSkillIds(skillsRaw ? (JSON.parse(skillsRaw) as string[]) : []);
      setPsychoId(window.localStorage.getItem(LOCAL_KEYS.psycho) || "");
      setCaringId(window.localStorage.getItem(LOCAL_KEYS.caring) || "");

      if (daysRaw) {
        const parsed = Number(daysRaw);
        if (!Number.isNaN(parsed) && parsed > 0) {
          setDays(parsed);
        }
      }
    } catch {
      setBrief({});
      setBehaviorId("");
      setSkillIds([]);
      setPsychoId("");
      setCaringId("");
      setDays(5);
    }
  }, []);

  // --- Lookups für Anzeige ---
  const { behavior, selectedSkills, psych, caring } = useMemo(() => {
    const b: Behavior | null =
      BEHAVIORS.find((x) => x.id === behaviorId) ?? null;
    const s = SKILLS.filter((s) => skillIds.includes(s.id));
    const p: Level | null = PSYCH_LEVELS.find((x) => x.id === psychoId) ?? null;
    const c: Level | null =
      CARING_LEVELS.find((x) => x.id === caringId) ?? null;
    return { behavior: b, selectedSkills: s, psych: p, caring: c };
  }, [behaviorId, skillIds, psychoId, caringId]);

  // Preis-Logik (gleich wie in /offer)
  const priceFactor =
    (psych?.priceFactor ?? 1) * (caring?.priceFactor ?? 1) || 1;
  const dayRate = Math.round(BASE_DAY_RATE * priceFactor);
  const net = dayRate * days;
  const tax = Math.round(net * 0.19 * 100) / 100;
  const gross = Math.round((net + tax) * 100) / 100;

  const behaviorSummary = behavior
    ? `${behavior.ctx[L]} – ${behavior.pkg[L]}`
    : "–";
  const psychSummary = psych ? psych.name[L] : "–";
  const caringSummary = caring ? caring.name[L] : "–";
  const skillsSummary =
    selectedSkills.length > 0
      ? selectedSkills.map((s) => s.title[L]).join(", ")
      : L === "en"
      ? "No skills selected."
      : "Keine Skills ausgewählt.";

  const currency = L === "en" ? "EUR" : "€";
  const locale = L === "en" ? "en-US" : "de-DE";

  const label = (de: string, en: string) => (L === "en" ? en : de);

  const inputBase =
    "border border-slate-300 rounded px-2 py-1 text-sm text-slate-900 bg-white " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-50";

  // Freigabe-Handler
  function handleSoftRelease() {
    if (!accepted) return;

    const now = new Date().toISOString();

    if (typeof window !== "undefined") {
      window.localStorage.setItem("release.confirmedAt", now);
    }

    alert(
      L === "en"
        ? "Thank you for your confirmation. In the next step you will see the mandate in the client portal. Digital signature will follow in a later expansion stage."
        : "Vielen Dank für Ihre Freigabe. Im nächsten Schritt sehen Sie das Mandat im Client-Portal. Die digitale Signatur folgt in einem späteren Ausbau."
    );

    // weiche Weiterleitung ins Portal
    window.location.href = "/portal?intent=offer";
  }

  const isEmpty =
    (!brief || Object.keys(brief).length === 0) &&
    !behaviorId &&
    skillIds.length === 0 &&
    !psychoId &&
    !caringId;

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6 bg-slate-50 text-slate-900 min-h-screen">
      <header className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {L === "en" ? "Release & confirmation" : "Freigabe & Bestätigung"}
        </h1>
      </header>

      {/* Prozess: Schritt Freigabe */}
      <ProcessBar current="confirm" />

      {/* Wenn nichts da ist, freundlicher Hinweis */}
      {isEmpty ? (
        <section className="rounded-xl border border-slate-300 bg-white p-6 text-sm shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-2">
            {L === "en"
              ? "No offer data yet"
              : "Noch keine Angebotsdaten vorhanden"}
          </h2>
          <p className="text-slate-700 mb-3">
            {L === "en"
              ? "There is currently no offer draft to confirm. Please complete the project briefing and the offer draft first."
              : "Aktuell liegt kein Angebotsentwurf zur Freigabe vor. Bitte füllen Sie zunächst das Projekt-Briefing aus und erstellen Sie einen Angebotsentwurf."}
          </p>
          <Link
            href="/offer"
            className="inline-flex rounded-full bg-slate-900 text-white px-4 py-2 text-xs hover:bg-slate-800 transition"
          >
            {L === "en" ? "Go to offer draft" : "Zum Angebots-Entwurf wechseln"}
          </Link>
        </section>
      ) : (
        <>
          {/* Zusammenfassung wie im Angebots-Entwurf, nur read-only */}
          <section className="rounded-xl border border-slate-300 bg-white p-5 text-sm space-y-4 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              {L === "en"
                ? "Summary of your selection"
                : "Zusammenfassung Ihrer Auswahl"}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Mandats-Kontext */}
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {L === "en" ? "🧭 Mandate context" : "🧭 Mandats-Kontext"}
                  </div>

                  <div className="mt-2">
                    <div className="text-[13px] font-semibold text-slate-900">
                      {L === "en"
                        ? "Context & behaviour"
                        : "Kontext & Verhalten"}
                    </div>
                    <div className="text-slate-800">{behaviorSummary}</div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="text-[13px] font-semibold text-slate-900">
                      {L === "en"
                        ? "Psychosocial depth"
                        : "Psychosoziale Tiefe"}
                    </div>
                    <div className="text-slate-800">{psychSummary}</div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="text-[13px] font-semibold text-slate-900">
                      {L === "en"
                        ? "Emotional investment (caring)"
                        : "Emotionale Investition (Caring)"}
                    </div>
                    <div className="text-slate-800">{caringSummary}</div>
                  </div>
                </div>
              </div>

              {/* Umfang + kaufmännische Parameter */}
              <div className="space-y-5">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {L === "en"
                      ? "🧩 Professional scope"
                      : "🧩 Fachlicher Umfang"}
                  </div>
                  <div className="mt-2">
                    <div className="text-[13px] font-semibold text-slate-900">
                      {L === "en" ? "Professional skills" : "Fachliche Skills"}
                    </div>
                    <div className="text-slate-800">{skillsSummary}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {L === "en"
                      ? "💶 Commercial parameters"
                      : "💶 Kaufmännische Parameter"}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-slate-900">
                      {L === "en" ? "Days:" : "Tage:"}
                    </span>
                    <span
                      className={inputBase + " w-20 text-right bg-slate-100"}
                    >
                      {days}
                    </span>
                    <span className="text-xs text-slate-700">
                      {L === "en" ? "Rate/day:" : "Satz/Tag:"}{" "}
                      {formatCurrency(dayRate, L, 0)} {currency}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700">
                    {L === "en" ? "Base rate" : "Basis-Tagessatz"}:{" "}
                    {BASE_DAY_RATE.toLocaleString(locale, {
                      minimumFractionDigits: 0,
                    })}{" "}
                    {currency} · {L === "en" ? "factor" : "Faktor"}{" "}
                    {priceFactor.toFixed(2)}
                  </div>

                  <div className="pt-1 text-sm font-semibold text-slate-900">
                    {L === "en" ? "Total (net)" : "Summe (netto)"}:{" "}
                    {net.toLocaleString(locale, {
                      minimumFractionDigits: 0,
                    })}{" "}
                    {currency}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vertragsentwurf & Freigabe */}
          <section className="rounded-xl border border-slate-300 bg-white p-5 text-sm space-y-4 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              {L === "en"
                ? "Contract draft & approval"
                : "Vertragsentwurf & Freigabe"}
            </h2>

            <p className="text-slate-700">
              {L === "en"
                ? "Based on your project briefing and this offer draft, a service contract (§ 611 BGB) is created. In a later expansion stage you will see the sign-ready PDF or the link to an eSign provider at this step."
                : "Auf Basis Ihres Projekt-Briefings und dieses Angebotsentwurfs wird ein Dienstvertrag (§ 611 BGB) erzeugt. In einem späteren Ausbau sehen Sie an dieser Stelle die signierfähige PDF bzw. den Link zum eSign-Anbieter."}
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <button
                type="button"
                onClick={() =>
                  (window.location.href = "/freigabe/vertragsvorschau")
                }
                className="rounded-full bg-slate-900 text-white px-4 py-2 text-xs hover:bg-slate-800 transition"
              >
                {L === "en"
                  ? "Open contract preview (excerpt)"
                  : "Vertragsvorschau öffnen (Auszug)"}
              </button>

              <Link
                href="/offer"
                className="rounded-full border border-slate-400 px-4 py-2 text-xs bg-white text-slate-900 hover:bg-slate-100 transition"
              >
                {L === "en" ? "Back to offer" : "Zurück zum Angebot"}
              </Link>
            </div>

            {/* Checkbox */}
            <div className="mt-4 flex items-center gap-2">
              <input
                id="release-accept"
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="accent-slate-800"
              />
              <label
                htmlFor="release-accept"
                className="text-xs text-slate-800"
              >
                {L === "en"
                  ? "I have reviewed the offer draft and the described scope of services and would like to generally approve this mandate – subject to a final written contract."
                  : "Ich habe den Angebotsentwurf und den beschriebenen Leistungsumfang geprüft und möchte dieses Mandat grundsätzlich – vorbehaltlich eines finalen schriftlichen Vertrags – freigeben."}
              </label>
            </div>

            {/* Freigabe-Button */}
            <button
              type="button"
              onClick={handleSoftRelease}
              disabled={!accepted}
              className={`mt-3 rounded-full px-4 py-2 text-sm font-medium transition ${
                accepted
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-400 text-white opacity-60 cursor-not-allowed"
              }`}
            >
              {L === "en"
                ? "Grant non-binding approval"
                : "Unverbindliche Freigabe erteilen"}
            </button>

            <p className="mt-3 text-[11px] text-slate-600">
              {L === "en"
                ? "Note: This view is a non-binding contract preview only. The mandate becomes binding exclusively through the final written and signed contract version agreed between both parties."
                : "Hinweis: Diese Ansicht stellt einen nicht-bindenden Vertragsentwurf dar. Verbindlich ist ausschließlich die final abgestimmte und von beiden Parteien unterzeichnete Vertragsversion."}
            </p>
          </section>
        </>
      )}
    </main>
  );
}
