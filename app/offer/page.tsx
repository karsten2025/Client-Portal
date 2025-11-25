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

const BASE_DAY_RATE = 2000;

// IDs wie in /explore
type RoleId = "sys" | "ops" | "res" | "coach";

const CONTRACT_ROLES: Record<
  RoleId,
  {
    heading: Record<Lang, string>;
    body: Record<Lang, string>;
  }
> = {
  sys: {
    heading: {
      de: "Interim Management & Portfolio-Steuerung",
      en: "Interim management & portfolio steering",
    },
    body: {
      de: "Übernahme der operativen Steuerung von Projekten, Programmen oder Portfolios (Interim). Der AN schließt temporäre Vakanzen, steuert die Umsetzung auf Basis vereinbarter Meilensteine, sorgt für Transparenz im Reporting und koordiniert die fachliche Zulieferung der Teams ohne Reibungsverluste.",
      en: "Assumption of operational steering of projects, programmes or portfolios on an interim basis. The Contractor bridges temporary vacancies, steers implementation based on agreed milestones, ensures transparent reporting and coordinates the professional contributions of the teams without friction.",
    },
  },
  ops: {
    heading: {
      de: "Betriebssystem-Performance & Skalierung",
      en: "Operating system performance & scaling",
    },
    body: {
      de: "Analyse und Optimierung der Prozess- und Systemlandschaft. Der AN transformiert bestehende Abläufe in skalierbare Strukturen („Betriebssystem“), identifiziert Engpässe in der Wertschöpfungskette und etabliert effiziente Governance-Mechanismen zur Entlastung der Teams.",
      en: "Analysis and optimisation of the process and system landscape. The Contractor transforms existing workflows into scalable structures (“operating system”), identifies bottlenecks along the value chain and establishes efficient governance mechanisms to relieve the teams.",
    },
  },
  res: {
    heading: {
      de: "Strategische Resonanz & Stakeholder-Management",
      en: "Strategic resonance & stakeholder management",
    },
    body: {
      de: "Steuerung komplexer Stakeholder-Umfelder und politischer Kommunikation. Der AN fungiert als Übersetzer zwischen Fachebene und Management, löst kommunikative Blockaden auf und richtet unterschiedliche Interessenlagen strategisch auf das Projektziel aus.",
      en: "Steering of complex stakeholder landscapes and political communication. The Contractor acts as a translator between specialist teams and management, resolves communication blockages and strategically aligns diverse interests with the project objectives.",
    },
  },
  coach: {
    heading: {
      de: "Sparring, Coaching & Enablement",
      en: "Sparring, coaching & enablement",
    },
    body: {
      de: "Methodisches Coaching und Sparring für Führungskräfte und Teams. Der AN agiert als „Thinking Partner“ zur Entscheidungsfindung, befähigt Schlüsselpersonen in der Anwendung von Methoden und fördert die eigenständige Lösungsfindung in komplexen Lagen.",
      en: "Methodical coaching and sparring for leaders and teams. The Contractor acts as a thinking partner in decision making, enables key players in the use of methods and supports independent solution finding in complex situations.",
    },
  },
};

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

  // Hauptrolle für Vertragsvorschau
  const mainRoleId: RoleId | null = (roleIds[0] as RoleId | undefined) ?? null;
  const mainRole = mainRoleId ? CONTRACT_ROLES[mainRoleId] : null;

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

          {/* NEU: Vertragsvorschau § 3 */}
          <section className="rounded-xl border border-slate-300 bg-white p-5 text-sm space-y-3 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              {L === "en"
                ? "Contract preview – § 3 Scope & approach"
                : "Vertragsvorschau – § 3 Leistungsumfang & Vorgehensweise"}
            </h2>

            {!mainRole && selectedSkills.length === 0 && !psych && !caring ? (
              <p className="text-slate-700 text-xs">
                {L === "en"
                  ? "Once you have selected at least one role, skills and interaction levels in the briefing, a draft wording for § 3 will appear here."
                  : "Sobald Sie im Briefing mindestens eine Rolle, fachliche Schwerpunkte und Interaktions-Levels gewählt haben, erscheint hier ein Formulierungsentwurf für § 3."}
              </p>
            ) : (
              <div className="space-y-3 text-xs leading-relaxed text-slate-800">
                <p>
                  <strong>§ 3 </strong>
                  {L === "en"
                    ? "Scope of services & approach"
                    : "Leistungsumfang & Vorgehensweise"}
                </p>

                {/* (1) Zielsetzung */}
                <p>
                  <strong>(1) </strong>
                  {L === "en"
                    ? "The Contractor (AN) supports the Client (AG) as an external specialist. The work is rendered as a contract for services. What is owed is professional activity aimed at achieving the project objectives, not a specific economic success. The Contractor is not subject to any disciplinary authority of the Client."
                    : "Der Auftragnehmer (AN) berät und unterstützt den Auftraggeber (AG) als externer Spezialist. Die Leistung wird als Dienstvertrag erbracht. Geschuldet ist das professionelle Tätigwerden zur Erreichung der vertraglich vereinbarten Ziele, nicht ein bestimmter wirtschaftlicher Erfolg. Der AN unterliegt keiner disziplinarischen Weisungsbefugnis des AG."}
                </p>

                {/* (2) Rolle */}
                <p>
                  <strong>(2) </strong>
                  {L === "en"
                    ? "Subject of performance (role). Based on the selection in the briefing, the Contractor renders the following core service:"
                    : "Leistungsgegenstand (Rolle). Basierend auf der Auswahl im Briefing erbringt der AN folgende Kernleistung:"}
                </p>

                {mainRole && (
                  <div className="ml-4">
                    <p>
                      <strong>• {mainRole.heading[L]}</strong>
                    </p>
                    <p>{mainRole.body[L]}</p>
                  </div>
                )}

                {/* (3) Skills */}
                <p>
                  <strong>(3) </strong>
                  {L === "en"
                    ? "Professional focus areas (skills) as selected in the briefing:"
                    : "Fachliche Schwerpunkte (Skills) gemäß Auswahl im Briefing:"}
                </p>
                {selectedSkills.length ? (
                  <ul className="list-disc ml-6">
                    {selectedSkills.map((s) => (
                      <li key={s.id}>{s.title[L]}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="ml-4 text-slate-600">
                    {L === "en"
                      ? "No specific skills selected; the mandate remains generalist."
                      : "Keine spezifischen Skills ausgewählt; das Mandat bleibt generalistisch gefasst."}
                  </p>
                )}

                {/* (4) Interaktions-Level */}
                <p>
                  <strong>(4) </strong>
                  {L === "en"
                    ? "Interaction level & engagement (modus operandi). The way the service is provided is defined by the selected psychosocial level and caring level."
                    : "Interaktions-Level & Engagement (Modus Operandi). Die Art der Leistungserbringung wird durch das gewählte psychosoziale Level und das Caring-Level bestimmt."}
                </p>

                <div className="ml-4 space-y-1">
                  <p>
                    <strong>
                      {L === "en"
                        ? "a) Psychosocial intervention level:"
                        : "a) Psychosoziale Intervention (System-Tiefe): "}
                    </strong>
                    {psych
                      ? psych.name[L]
                      : L === "en"
                      ? "none explicitly selected."
                      : "kein Level explizit gewählt."}
                  </p>
                  <p>
                    <strong>
                      {L === "en"
                        ? "b) Degree of emotional investment (caring):"
                        : "b) Grad der emotionalen Investition (Caring): "}
                    </strong>
                    {caring
                      ? caring.name[L]
                      : L === "en"
                      ? "none explicitly selected."
                      : "kein Level explizit gewählt."}
                  </p>
                </div>

                {/* (5) Meta-Klärung */}
                <p>
                  <strong>(5) </strong>
                  {L === "en"
                    ? "Clarification of terminology (meta-clarification). Normal clarifications regarding language, roles and responsibilities are included in the scope. If linguistic or semantic discussions repeatedly hinder project progress and measurably draw attention away from the project goal, their structured resolution (meta-clarification) is treated as a separate advisory service and may – after mutual agreement – be invoiced as a change request or additional time budget."
                    : "Klärung von Begrifflichkeiten (Meta-Klärung). Übliche Klärungen zu Sprache, Rollen und Verantwortlichkeiten sind im Leistungsumfang enthalten. Ab dem Punkt, an dem sich sprachliche oder semantische Diskussionen wiederholt im Kreis drehen und messbar Aufmerksamkeit vom Projektziel abziehen, gilt deren strukturierte Auflösung (Meta-Klärung) als eigenständige Beratungsleistung und kann – nach vorheriger Abstimmung – als Change Request bzw. Zusatzkontingent abgerechnet werden."}
                </p>

                {/* (6) Exklusionen */}
                <p>
                  <strong>(6) </strong>
                  {L === "en"
                    ? "Exclusions (non-performance). Unless expressly agreed otherwise, the mandate does not include: legal or tax advice, disciplinary personnel responsibility (hirings, warnings, salary negotiations), assumption of corporate body responsibility, or the achievement of a result that depends on third parties over whom the Contractor has no direct control."
                    : "Exklusionen (Nicht-Leistung). Sofern nicht ausdrücklich anders vereinbart, umfasst das Mandat nicht: Rechts- und Steuerberatung, disziplinarische Personalverantwortung (Einstellungen, Abmahnungen, Gehaltsgespräche), Übernahme von Organverantwortung sowie die Herbeiführung eines Erfolgs, der von der Mitwirkung Dritter abhängt, auf die der AN keinen direkten Zugriff hat."}
                </p>
              </div>
            )}
          </section>
        </>
      )}
      {/* Footer-Aktion auf der Offer-Seite */}
      <section className="flex justify-end mt-4">
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
