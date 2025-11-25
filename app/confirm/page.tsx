// app/confirm/page.tsx
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
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { ProcessBar } from "../components/ProcessBar";
import { validateSelection } from "../lib/mandateRules";
import { formatCurrency } from "../lib/format";

// gleiche Struktur wie im Offer
type SkillNotes = Record<string, { need?: string; outcome?: string }>;

const BASE_DAY_RATE = 2000;

export default function ConfirmPage() {
  const { lang } = useLanguage();
  const L: Lang = (lang as Lang) || "de";

  const [brief, setBrief] = useState<Record<string, string>>({});
  const [behaviorId, setBehaviorId] = useState<string>("");
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [psychoId, setPsychoId] = useState<string>("");
  const [caringId, setCaringId] = useState<string>("");
  const [notes, setNotes] = useState<SkillNotes>({});
  const [days, setDays] = useState<number>(5);
  const [confirmed, setConfirmed] = useState(false);

  // Mandatslogik
  const validation = validateSelection(
    behaviorId as BehaviorId | "",
    psychoId as PsychoId | "",
    caringId as CaringId | ""
  );
  const isBlocked = validation.severity === "blocked";

  // Daten aus localStorage laden (gleiches Schema wie Offer)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const formRaw = window.localStorage.getItem(LOCAL_KEYS.form);
      const skillsRaw = window.localStorage.getItem(LOCAL_KEYS.skills);
      const notesRaw = window.localStorage.getItem(LOCAL_KEYS.notes);
      const daysRaw = window.localStorage.getItem("offer.days");

      setBrief(formRaw ? JSON.parse(formRaw) : {});
      setBehaviorId(window.localStorage.getItem(LOCAL_KEYS.behavior) || "");
      setSkillIds(skillsRaw ? (JSON.parse(skillsRaw) as string[]) : []);
      setPsychoId(window.localStorage.getItem(LOCAL_KEYS.psycho) || "");
      setCaringId(window.localStorage.getItem(LOCAL_KEYS.caring) || "");
      setNotes(notesRaw ? (JSON.parse(notesRaw) as SkillNotes) : {});
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
      setNotes({});
      setDays(5);
    }
  }, []);

  // Lookups
  const { behavior, selectedSkills, psych, caring } = useMemo(() => {
    const b: Behavior | null =
      BEHAVIORS.find((x) => x.id === behaviorId) ?? null;
    const s = SKILLS.filter((s) => skillIds.includes(s.id));
    const p: Level | null = PSYCH_LEVELS.find((x) => x.id === psychoId) ?? null;
    const c: Level | null =
      CARING_LEVELS.find((x) => x.id === caringId) ?? null;
    return { behavior: b, selectedSkills: s, psych: p, caring: c };
  }, [behaviorId, skillIds, psychoId, caringId]);

  // Preislogik (wie in Offer)
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

  const isEmpty =
    (!brief || Object.keys(brief).length === 0) &&
    !behaviorId &&
    skillIds.length === 0 &&
    !psychoId &&
    !caringId;

  const inputBase =
    "border border-slate-300 rounded px-2 py-1 text-sm text-slate-900 bg-white " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-50";

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6 bg-slate-50 text-slate-900 min-h-screen">
      <header className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {L === "en" ? "Release & confirmation" : "Freigabe & Bestätigung"}
        </h1>
        <LanguageSwitcher />
      </header>

      {/* Prozess: Schritt Freigabe */}
      <ProcessBar current="confirm" />

      {/* Hinweis auf Mandatslogik */}
      {validation.messages.length > 0 && !isEmpty && (
        <section
          className={
            validation.severity === "blocked"
              ? "mt-4 rounded-md border border-red-500 bg-red-50 p-3 text-xs text-red-800"
              : "mt-4 rounded-md border border-amber-500 bg-amber-50 p-3 text-xs text-amber-800"
          }
        >
          {validation.messages.map((m, idx) => (
            <p key={idx}>{L === "en" ? m.en : m.de}</p>
          ))}
          {isBlocked && (
            <p className="mt-2 font-semibold">
              {L === "en"
                ? "The current combination is not valid according to the mandate logic. Please go back to the briefing step and adjust the selection."
                : "Die aktuelle Kombination ist laut Mandatslogik nicht zulässig. Bitte gehen Sie zurück zum Projekt-Briefing und passen Sie die Auswahl an."}
            </p>
          )}
        </section>
      )}

      {/* Empty State, falls jemand direkt auf /confirm surft */}
      {isEmpty ? (
        <section className="rounded-xl border border-slate-300 bg-white p-8 text-sm flex flex-col items-start gap-4 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {L === "en" ? "No offer data yet" : "Noch kein Angebot vorhanden"}
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            {L === "en"
              ? "Start with briefing & offer draft"
              : "Starten Sie mit Briefing & Angebotsentwurf"}
          </h2>
          <p className="text-slate-700 max-w-xl">
            {L === "en"
              ? "This step becomes relevant after you have created a briefing and offer draft. Please go back to the earlier steps first."
              : "Dieser Schritt wird relevant, nachdem Sie ein Projekt-Briefing und einen Angebotsentwurf erstellt haben. Bitte gehen Sie zunächst zurück in die vorherigen Schritte."}
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/brief"
              className="rounded-full bg-slate-900 text-white px-4 py-2 text-xs hover:bg-slate-800 transition"
            >
              {L === "en" ? "Back to briefing" : "Zurück zum Briefing"}
            </Link>
          </div>
        </section>
      ) : (
        <>
          {/* 1. Zusammenfassung */}
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

              {/* Umfang + kaufmännisch */}
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
                    <label
                      className="font-semibold text-slate-900"
                      htmlFor="days"
                    >
                      {L === "en" ? "Days" : "Tage"}
                    </label>
                    <input
                      id="days"
                      type="number"
                      min={1}
                      max={60}
                      step={1}
                      className={inputBase + " w-20 text-right"}
                      value={days}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") return;
                        const parsed = Number(raw);
                        if (Number.isNaN(parsed) || parsed <= 0) {
                          setDays(1);
                        } else if (parsed > 60) {
                          setDays(60);
                        } else {
                          setDays(parsed);
                        }
                      }}
                    />
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
                  <div className="text-xs text-slate-700">
                    {label("inkl. USt:", "incl. VAT:")}{" "}
                    {gross.toLocaleString(locale, {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {currency}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Vertrag & Freigabe */}
          <section className="rounded-xl border border-slate-300 bg-white p-5 text-sm space-y-4 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              {L === "en"
                ? "Contract draft & confirmation"
                : "Vertragsentwurf & Freigabe"}
            </h2>

            <p className="text-slate-700">
              {L === "en"
                ? "Based on your briefing and this offer draft, a service contract (§ 611 BGB) will be generated. In a later step, this page will show the signable PDF or link to the eSign provider."
                : "Auf Basis Ihres Projekt-Briefings und dieses Angebotsentwurfs wird ein Dienstvertrag (§ 611 BGB) erzeugt. In einem späteren Ausbauschritt sehen Sie an dieser Stelle das signierfähige PDF bzw. den Link zum eSign-Anbieter."}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contract"
                className="rounded-full bg-slate-900 text-white px-4 py-2 text-xs hover:bg-slate-800 transition inline-flex items-center"
              >
                {L === "en"
                  ? "Open contract preview"
                  : "Vertragsvorschau öffnen"}
              </Link>

              <Link
                href="/offer"
                className="rounded-full border border-slate-400 px-4 py-2 text-xs bg-white text-slate-900 hover:bg-slate-100 transition"
              >
                {L === "en" ? "Back to offer draft" : "Zurück zum Angebot"}
              </Link>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4 space-y-3">
              <label className="flex items-start gap-2 text-xs text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-slate-800"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  disabled={isBlocked}
                />
                <span>
                  {L === "en"
                    ? "I have reviewed the offer draft and the described scope of work and would like to release this mandate in principle, subject to a final written contract."
                    : "Ich habe den Angebotsentwurf und den beschriebenen Leistungsumfang geprüft und möchte dieses Mandat grundsätzlich – vorbehaltlich eines finalen schriftlichen Vertrags – freigeben."}
                </span>
              </label>

              <button
                type="button"
                disabled={!confirmed || isBlocked}
                onClick={() =>
                  alert(
                    L === "en"
                      ? "In the full version this would trigger the eSign workflow or send a confirmation email."
                      : "In der Vollversion würde hier der eSign-Workflow gestartet oder eine Bestätigungs-E-Mail ausgelöst."
                  )
                }
                className={
                  "rounded-full px-4 py-2 text-xs font-medium transition " +
                  (confirmed && !isBlocked
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-300 text-slate-600 cursor-not-allowed")
                }
              >
                {L === "en"
                  ? "Issue non-binding release"
                  : "Unverbindliche Freigabe erteilen"}
              </button>

              {isBlocked && (
                <p className="text-[11px] text-red-700">
                  {L === "en"
                    ? "Release is currently blocked due to mandate logic. Please adjust the selection in the briefing step."
                    : "Die Freigabe ist derzeit aufgrund der Mandatslogik gesperrt. Bitte passen Sie die Auswahl im Projekt-Briefing an."}
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
