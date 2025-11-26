// app/offer/page.tsx
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
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { validateSelection } from "../lib/mandateRules";
import type { SkillNotes } from "../components/OfferPdf"; // nur Type, kein Runtime-Import
import { formatCurrency } from "../lib/format";
import type { ContractSection3Input } from "../lib/contractSection3";
import { ContractSection3Block } from "../components/ContractSection3Block";

const BASE_DAY_RATE = 2000;

// IDs wie in /explore
type RoleId = "sys" | "ops" | "res" | "coach";

export default function OfferPage() {
  const { lang } = useLanguage();
  const L: Lang = (lang as Lang) || "de";

  const [brief, setBrief] = useState<Record<string, string>>({});
  const [behaviorId, setBehaviorId] = useState<string>("");
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [psychoId, setPsychoId] = useState<string>("");
  const [caringId, setCaringId] = useState<string>("");
  const [notes, setNotes] = useState<SkillNotes>({});
  const [days, setDays] = useState<number>(5);
  const [roleIds, setRoleIds] = useState<RoleId[]>([]);
  const [isDownloading, setIsDownloading] = useState(false); // NEW: Download-Status

  // Mandatslogik-Validierung
  const validation = validateSelection(
    behaviorId as BehaviorId | "",
    psychoId as PsychoId | "",
    caringId as CaringId | ""
  );
  const isBlocked = validation.severity === "blocked";

  // Laden aus localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const formRaw = window.localStorage.getItem(LOCAL_KEYS.form);
      const skillsRaw = window.localStorage.getItem(LOCAL_KEYS.skills);
      const notesRaw = window.localStorage.getItem(LOCAL_KEYS.notes);
      const daysRaw = window.localStorage.getItem("offer.days");
      const rolesRaw = window.localStorage.getItem("brief.selected");

      setBrief(formRaw ? JSON.parse(formRaw) : {});
      setBehaviorId(window.localStorage.getItem(LOCAL_KEYS.behavior) || "");
      setSkillIds(skillsRaw ? (JSON.parse(skillsRaw) as string[]) : []);
      setPsychoId(window.localStorage.getItem(LOCAL_KEYS.psycho) || "");
      setCaringId(window.localStorage.getItem(LOCAL_KEYS.caring) || "");
      setNotes(notesRaw ? (JSON.parse(notesRaw) as SkillNotes) : {});
      setRoleIds(rolesRaw ? (JSON.parse(rolesRaw) as RoleId[]) : []);

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
      setRoleIds([]);
      setDays(5);
    }
  }, []);

  // Tage zurückschreiben
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("offer.days", String(days));
  }, [days]);

  // Reset
  const resetAll = () => {
    if (typeof window === "undefined") return;
    [
      LOCAL_KEYS.form,
      LOCAL_KEYS.behavior,
      LOCAL_KEYS.skills,
      LOCAL_KEYS.psycho,
      LOCAL_KEYS.caring,
      LOCAL_KEYS.notes,
      "offer.days",
      "brief.selected",
    ].forEach((k) => window.localStorage.removeItem(k));

    setBrief({});
    setBehaviorId("");
    setSkillIds([]);
    setPsychoId("");
    setCaringId("");
    setNotes({});
    setRoleIds([]);
    setDays(5);
  };

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

  // Preis-Logik an *einer* Stelle
  const priceFactor =
    (psych?.priceFactor ?? 1) * (caring?.priceFactor ?? 1) || 1;
  const dayRate = Math.round(BASE_DAY_RATE * priceFactor);
  const net = dayRate * days;
  const tax = Math.round(net * 0.19 * 100) / 100;
  const gross = Math.round((net + tax) * 100) / 100;

  // Strings für Summary / Vorschau
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

  // „Empty state“: kein Briefing / nach Neu-Start
  const isEmpty =
    (!brief || Object.keys(brief).length === 0) &&
    !behaviorId &&
    skillIds.length === 0 &&
    !psychoId &&
    !caringId;

  // 🔹 Input für § 3 Single Source
  const section3Input: ContractSection3Input = {
    behaviorId: behaviorId as BehaviorId | "",
    selectedRoles: roleIds,
    skillIds,
    psychoId: psychoId as PsychoId | "",
    caringId: caringId as CaringId | "",
  };

  const isSection3VeryEmpty =
    roleIds.length === 0 && selectedSkills.length === 0 && !psych && !caring;

  // 🔹 NEU: Handler für PDF-Download
  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);

      // Sicherheitscheck: wenn gar nichts da ist, lohnt PDF nicht
      if (isEmpty) {
        alert(
          L === "en"
            ? "No briefing/offer data available yet. Please complete the steps first."
            : "Es liegen noch keine Briefing-/Angebotsdaten vor. Bitte füllen Sie zuerst die Schritte aus."
        );
        return;
      }

      const res = await fetch("/api/offer-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lang: L,
          brief,
          behaviorSummary,
          selectedSkills: selectedSkills.map((s) => ({
            id: s.id,
            title: s.title,
          })),
          psychLabel: psychSummary,
          caringLabel: caringSummary,
          notes,
          days,
          dayRate,
          net,
          tax,
          gross,
          currency,
          section3Input,
        }),
      });

      if (!res.ok) {
        console.error("PDF-API-Fehler", res.status, await res.text());
        alert(
          L === "en"
            ? "Error while generating the PDF. Please try again."
            : "Fehler beim Erzeugen der PDF. Bitte versuchen Sie es erneut."
        );
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        L === "en" ? "offer-contract-draft.pdf" : "angebot-vertrag-entwurf.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF-Download-Fehler", err);
      alert(
        L === "en"
          ? "Unexpected error while generating the PDF."
          : "Unerwarteter Fehler beim Erzeugen der PDF."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6 bg-slate-50 text-slate-900 min-h-screen">
      <header className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {L === "en" ? "Offer draft" : "Angebots-Entwurf"}
        </h1>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={resetAll}
            className="rounded-full border border-slate-400 px-3 py-1 text-xs bg-white text-slate-900 hover:bg-slate-100 transition"
          >
            {L === "en"
              ? "Start new (clear data)"
              : "Neu starten (Daten löschen)"}
          </button>
        </div>
      </header>

      <ProcessBar current="offer" />

      {/* Mandats-Warnungen */}
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
                ? "The current combination is not valid according to the mandate logic. Please adjust the selection in the briefing step."
                : "Die aktuelle Kombination ist laut Mandatslogik nicht zulässig. Bitte passen Sie die Auswahl im Projekt-Briefing an."}
            </p>
          )}
        </section>
      )}

      {/* EMPTY STATE – nach Neu-Start oder ohne Briefing */}
      {isEmpty ? (
        <section className="rounded-xl border border-slate-300 bg-white p-8 text-sm flex flex-col items-start gap-4 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {L === "en" ? "No data yet" : "Noch kein Briefing geladen"}
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            {L === "en"
              ? "Start with the project briefing"
              : "Starten Sie mit dem Projekt-Briefing"}
          </h2>
          <p className="text-slate-700 max-w-xl">
            {L === "en"
              ? "There is currently no briefing data for an offer draft. Please complete the project briefing first and then return to this page for a commercial preview."
              : "Aktuell liegen keine Briefing-Daten für einen Angebotsentwurf vor. Bitte füllen Sie zunächst das Projekt-Briefing aus und kehren Sie anschließend für eine kaufmännische Vorschau auf diese Seite zurück."}
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
          {/* Zusammenfassung */}
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
                </div>
              </div>
            </div>
          </section>

          {/* Kaufmännische Vorschau („Pseudo-PDF“ im Browser) */}
          <section className="rounded-xl border border-slate-300 bg-white p-3 shadow-sm">
            <h2 className="font-medium text-sm mb-2 text-slate-900">
              {L === "en"
                ? "Preview (draft, non-binding)"
                : "Vorschau (Entwurf, unverbindlich)"}
            </h2>

            <div
              className={
                "h-[640px] border border-slate-300 rounded bg-slate-50 p-4 overflow-y-auto text-xs text-slate-900 " +
                (isBlocked ? "opacity-60 pointer-events-none" : "")
              }
            >
              {/* Sender & Empfänger */}
              <div className="flex justify-between mb-4 gap-6">
                <div>
                  <div className="font-semibold">
                    {brief.anbieterName || "Muster Consulting GmbH"}
                  </div>
                  <div>
                    {brief.anbieterAdresse ||
                      "Musterstraße 1 · 12345 Musterstadt"}
                  </div>
                  <div>
                    {brief.anbieterKontakt ||
                      "T +49 000 000000 · info@muster-consulting.de"}
                  </div>
                  <div>
                    {label("USt-IdNr.:", "VAT ID:")}{" "}
                    {brief.anbieterUstId || "DEXXXXXXXXX"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {brief.kunde ||
                      (L === "en"
                        ? "Client company"
                        : "Unternehmen des Auftraggebers")}
                  </div>
                  <div className="text-slate-700">
                    {brief.kontakt ||
                      (L === "en"
                        ? "Contact person"
                        : "Ansprechpartner:in (noch offen)")}
                  </div>
                  <div className="mt-1 text-slate-700">
                    {label("Projekt:", "Project:")}{" "}
                    {brief.projekt ||
                      (L === "en" ? "Project / subject" : "Projekt / Thema")}
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-semibold mb-2">
                {label(
                  "Unverbindliches Angebot – Projekt / Thema",
                  "Non-binding offer – project / subject"
                )}
              </h3>

              <p className="mb-3">
                {label(
                  "Vielen Dank für Ihre Anfrage und das entgegengebrachte Vertrauen. Auf Grundlage der vorliegenden Informationen biete ich Ihnen für das oben genannte Vorhaben folgende Unterstützungsleistung an:",
                  "Thank you for your request and the trust placed in this collaboration. Based on the information currently available, I propose the following support for the above project:"
                )}
              </p>

              {/* Verhaltenpaket */}
              <h4 className="font-semibold mt-3 mb-1">
                {label(
                  "2. Verhaltenpaket (Kontext & Stil)",
                  "2. Behaviour package (context & style)"
                )}
              </h4>
              <div className="border border-slate-300 rounded p-2 bg-white mb-2">
                {behavior ? (
                  <div>• {behaviorSummary}</div>
                ) : (
                  <div className="text-slate-600">
                    {label(
                      "Hinweis: (Kein Paket gewählt.)",
                      "Note: (No package selected.)"
                    )}
                  </div>
                )}
              </div>

              {/* Fachliche Rollen & Qualifikationen */}
              <h4 className="font-semibold mt-3 mb-1">
                {label(
                  "3. Fachliche Rollen & Qualifikationen",
                  "3. Professional roles & skills"
                )}
              </h4>
              <div className="border border-slate-300 rounded p-2 bg-white mb-2 space-y-2">
                {selectedSkills.length === 0 ? (
                  <div className="text-slate-600">
                    {label(
                      "Hinweis: (Keine Auswahl getroffen.)",
                      "Note: (No skills selected.)"
                    )}
                  </div>
                ) : (
                  selectedSkills.map((s) => {
                    const note = notes[s.id] || {};
                    return (
                      <div key={s.id} className="mb-1">
                        <div>• {s.title[L]}</div>
                        {note.need && (
                          <div className="text-slate-700">
                            <span className="font-semibold">
                              {label("Ihr Anliegen:", "Your need:")}{" "}
                            </span>
                            {note.need}
                          </div>
                        )}
                        {note.outcome && (
                          <div className="text-slate-700">
                            <span className="font-semibold">
                              {label(
                                "Ihr Nutzen / DoD:",
                                "Your benefit / DoD:"
                              )}{" "}
                            </span>
                            {note.outcome}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Psychosoziale Tiefe */}
              <h4 className="font-semibold mt-3 mb-1">
                {label(
                  "4. Psychosoziale Interaktions-Tiefe",
                  "4. Psychosocial intervention depth"
                )}
              </h4>
              <div className="border border-slate-300 rounded p-2 bg-white mb-2">
                {psych ? (
                  <div>• {psychSummary}</div>
                ) : (
                  <div className="text-slate-600">
                    {label(
                      "Hinweis: (Kein psychosoziales Paket gewählt.)",
                      "Note: (No psychosocial package selected.)"
                    )}
                  </div>
                )}
              </div>

              {/* Caring-Level */}
              <h4 className="font-semibold mt-3 mb-1">
                {label(
                  "5. Grad der emotionalen Investition (Caring-Level)",
                  "5. Degree of emotional investment (caring level)"
                )}
              </h4>
              <div className="border border-slate-300 rounded p-2 bg-white mb-2">
                {caring ? (
                  <div>• {caringSummary}</div>
                ) : (
                  <div className="text-slate-600">
                    {label(
                      "Hinweis: (Kein Caring-Level gewählt.)",
                      "Note: (No caring level selected.)"
                    )}
                  </div>
                )}
              </div>

              {/* Preisübersicht */}
              <h4 className="font-semibold mt-3 mb-1">
                {label("6. Preisübersicht", "6. Price overview")}
              </h4>
              <div className="border border-slate-300 rounded p-2 bg-white mb-2 space-y-1">
                <div>
                  {label("Tage:", "Days:")}{" "}
                  {days.toLocaleString(locale, {
                    minimumFractionDigits: 0,
                  })}{" "}
                  · {label("Satz/Tag:", "Rate/day:")}{" "}
                  {dayRate.toLocaleString(locale, {
                    minimumFractionDigits: 0,
                  })}{" "}
                  {currency}
                </div>
                <div>
                  {label("Netto:", "Net total:")}{" "}
                  {net.toLocaleString(locale, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  {currency}
                </div>
                <div>
                  {label("Umsatzsteuer 19%:", "VAT 19%:")}{" "}
                  {tax.toLocaleString(locale, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  {currency}
                </div>
                <div className="font-semibold">
                  {label("Endbetrag:", "Total amount:")}{" "}
                  {gross.toLocaleString(locale, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  {currency}
                </div>
              </div>

              {/* Zahlungsbedingungen */}
              <h4 className="font-semibold mt-3 mb-1">
                {label(
                  "7. Zahlungsbedingungen & nächster Schritt",
                  "7. Payment terms & next step"
                )}
              </h4>
              <div className="border border-slate-300 rounded p-2 bg-white space-y-1">
                <div>
                  •{" "}
                  {label(
                    "Rechnungsstellung leistungnah nach Projektfortschritt oder Meilensteinen.",
                    "Invoicing close to performance, based on project progress or milestones."
                  )}
                </div>
                <div>
                  •{" "}
                  {label(
                    "Zahlungsziel: 14 Tage netto ohne Abzug.",
                    "Payment term: 14 days net without deduction."
                  )}
                </div>
                <div>
                  •{" "}
                  {label(
                    "Bitte prüfen Sie den Angebotsentwurf und geben Sie mir bei Interesse ein kurzes Go für die Finalisierung.",
                    "Please review this offer draft and let me know if you would like me to finalise it."
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 🔹 Vertragsvorschau § 3 aus Single Source */}
          <section className="rounded-xl border border-slate-300 bg-white p-5 text-sm space-y-3 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              {L === "en"
                ? "Contract preview – § 3 Scope & approach"
                : "Vertragsvorschau – § 3 Leistungsumfang & Vorgehensweise"}
            </h2>

            {isSection3VeryEmpty ? (
              <p className="text-slate-700 text-xs">
                {L === "en"
                  ? "Once you have selected at least one role, skills and interaction levels in the briefing, a draft wording for § 3 will appear here."
                  : "Sobald Sie im Briefing mindestens eine Rolle, fachliche Schwerpunkte und Interaktions-Levels gewählt haben, erscheint hier ein Formulierungsentwurf für § 3."}
              </p>
            ) : (
              <ContractSection3Block
                lang={L}
                input={section3Input}
                className="whitespace-pre-wrap text-xs leading-relaxed text-slate-800"
              />
            )}
          </section>
        </>
      )}

      {/* Footer-Aktion auf der Offer-Seite */}
      <section className="flex justify-between mt-4">
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isDownloading || isEmpty}
          className={
            "rounded-full border px-4 py-2 text-xs transition " +
            (isDownloading || isEmpty
              ? "border-slate-300 text-slate-400 bg-slate-100 cursor-not-allowed"
              : "border-slate-600 text-slate-900 bg-white hover:bg-slate-100")
          }
        >
          {isDownloading
            ? L === "en"
              ? "Generating PDF..."
              : "PDF wird erzeugt..."
            : L === "en"
            ? "Download PDF (offer + §3)"
            : "PDF herunterladen (Angebot + §3)"}
        </button>

        <Link
          href="/confirm"
          className="rounded-full bg-slate-900 text-white px-4 py-2 text-xs hover:bg-slate-800 transition"
        >
          {L === "en"
            ? "Continue: Release & confirmation"
            : "Weiter: Freigabe & Bestätigung"}
        </Link>
      </section>
    </main>
  );
}
