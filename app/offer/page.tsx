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
import { calculatePricing } from "../lib/pricing";
import {
  PricingBreakdown,
  PricingOverviewLines,
} from "../components/PricingBreakdown";
import {
  buildContractSection3,
  type ContractSection3Input,
} from "../lib/contractSection3";
import {
  getRoleRequirementsFor,
  getRoleModuleLabel,
  REQUIREMENT_GROUP_ORDER,
  type RoleId,
} from "../lib/roleRequirements";

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

  // Preis-Logik (Variante C: Basis + ein Zuschlag aus Briefing-Daten)
  const pricing = useMemo(
    () =>
      calculatePricing({
        behaviorId: behaviorId as BehaviorId | "",
        psychoId: psychoId as PsychoId | "",
        caringId: caringId as CaringId | "",
        days,
      }),
    [behaviorId, psychoId, caringId, days]
  );
  const { dayRate } = pricing;

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

  // 🔹 Single Source für §3 auch in der Offer-Vorschau
  const section3Input: ContractSection3Input = {
    behaviorId: behaviorId as BehaviorId | "",
    selectedRoles: roleIds,
    skillIds,
    psychoId: psychoId as PsychoId | "",
    caringId: caringId as CaringId | "",
    dayRate: pricing.dayRate,
    hourlyRate: pricing.hourlyRate,
    halfDayRate: pricing.halfDayRate,
  };

  const section3Text = buildContractSection3(L, section3Input);

  const section3Paragraphs = section3Text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // 🔹 Alle Rollen, die für die detaillierte Beschreibung relevant sind
  const ALL_ROLE_IDS: RoleId[] = ["sys", "ops", "res", "coach"];
  const roleIdsForRequirements: RoleId[] = roleIds.filter((r): r is RoleId =>
    ALL_ROLE_IDS.includes(r)
  );
  const detailGroups = REQUIREMENT_GROUP_ORDER;

  const handleDownloadPdf = async () => {
    try {
      // Alles, was das PDF braucht – wir haben diese Werte ja bereits
      const payload = {
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
        pricing,
        currency,
        // wichtig: der gleiche Input, den auch die Vertragsvorschau nutzt
        section3Input,
      };

      const res = await fetch("/api/offer-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("PDF-Download fehlgeschlagen", await res.text());
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = (brief.projekt || "angebot") + "_angebot_und_vertrag.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Fehler beim PDF-Download", err);
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
                        ? "Intervention Depth"
                        : "Eingriffstiefe"}
                    </div>
                    <div className="text-slate-800">{psychSummary}</div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="text-[13px] font-semibold text-slate-900">
                      {L === "en"
                        ? "Operational Identification"
                        : "Operative Identifikation"}
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

                  <PricingBreakdown
                    lang={L}
                    pricing={pricing}
                    currency={currency}
                    showProjectTotal
                  />
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
                  "2. Mandats-Kontext & Strategisches Wirkprofil",
                  "2. Mandate Context & Strategic Impact Profile"
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
                  "3. Mandats-Kontext & Strategisches Wirkprofil",
                  "3. Mandate Context & Strategic Impact Profile"
                )}
              </h4>
              <div className="border border-slate-300 rounded p-2 bg-white mb-2 space-y-2">
                {selectedSkills.length === 0 ? (
                  <div className="text-slate-600">
                    {label(
                      "Hinweis: (Keine Auswahl getroffen.)",
                      "Note: (No selection made.)"
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
                  "4. Eingriffstiefe & System-Irritation",
                  "4. Depth of Intervention & System Irritation"
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
                  "5. Operative Identifikation & Haftungs-Kompensation",
                  "5. Operational Identification & Surcharge-Compensation"
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
                <PricingOverviewLines
                  lang={L}
                  pricing={pricing}
                  currency={currency}
                />
              </div>

              {/* Hinweis Angebotscharakter */}
              <h4 className="font-semibold mt-3 mb-1">
                {label(
                  "7. Rechtlicher Status: Indikativer Charakter vor Auditierung",
                  "7. Legal Status: Indicative Character Prior to Auditing"
                )}
              </h4>
              <div className="border border-slate-300 rounded p-2 bg-white mb-4">
                <p className="text-slate-700">
                  {label(
                    "Dieses Dokument ist ein unverbindlicher Angebotsentwurf. Verbindlich sind ausschließlich die in der final abgestimmten und freigegebenen Fassung (Angebot, Leistungsbeschreibung, Vertrag) dokumentierten Inhalte.",
                    "This document is a non-binding offer draft. Only the contents documented in the final agreed and approved version (offer, statement of work, contract) are binding."
                  )}
                </p>
              </div>

              {/* 🔹 NEU: Vertragsvorschau § 3 (Single Source + alle Rollen) */}
              <h4 className="font-semibold mt-3 mb-1">
                {label(
                  "8. Vertragsvorschau – § 3 Leistungsumfang & Vorgehensweise",
                  "8. Contract preview – § 3 Scope of services & delivery approach"
                )}
              </h4>

              <div className="border border-slate-300 rounded p-3 bg-white space-y-2">
                {section3Paragraphs.length === 0 ? (
                  <p className="text-slate-600">
                    {label(
                      "Für eine Vorschau von § 3 bitte zunächst Rollen, Skills und Interaktions-Levels im Briefing ausfüllen.",
                      "To see a preview of § 3, please complete roles, skills and interaction levels in the briefing first."
                    )}
                  </p>
                ) : (
                  <>
                    {/* §3-Text aus contractSection3.ts */}
                    <div className="space-y-2 leading-relaxed">
                      {section3Paragraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>

                    {/* Detaillierte Leistungsbeschreibung für alle gewählten Rollen */}
                    {roleIdsForRequirements.length > 0 && (
                      <div className="mt-4 space-y-4">
                        {roleIdsForRequirements.map((roleId) => {
                          const moduleLabel = getRoleModuleLabel(L, roleId);
                          const requirements = getRoleRequirementsFor(
                            L,
                            roleId
                          );
                          if (!requirements.length) return null;

                          return (
                            <div key={roleId} className="space-y-2">
                              <p className="font-semibold text-slate-900">
                                {L === "en"
                                  ? `Detailed scope of work – role module “${moduleLabel}”`
                                  : `Detaillierte Leistungsbeschreibung – Rollenmodul „${moduleLabel}“`}
                              </p>

                              {detailGroups.map((group) => {
                                const items = requirements.filter(
                                  (r) => r.group === group
                                );
                                if (!items.length) return null;

                                const heading =
                                  group === "ziel"
                                    ? label(
                                        "A) Mandatsziel & System-Kontext",
                                        "A) Mandate Objective & System Context"
                                      )
                                    : group === "leistung"
                                    ? label(
                                        "B) Leistungsumfang (Strategisch/Taktisch/Operativ)",
                                        "B) Scope of Services (Strategic/Tactical/Operational)"
                                      )
                                    : group === "mitwirkung"
                                    ? label(
                                        "C) Mitwirkungspflichten des Auftraggebers",
                                        "C) Client Cooperation & General Dependencies"
                                      )
                                    : group === "ergebnis"
                                    ? label(
                                        "D) Artefakte & System-Ergebnisse",
                                        "D) Deliverables & Systemic Artifacts"
                                      )
                                    : group === "zeit"
                                    ? label(
                                        "E) Zeitrahmen, Kontingent & Verg\u00fctungsstruktur",
                                        "E) Timeline, Contingent & Compensation Structure"
                                      )
                                    : group === "kommunikation"
                                    ? label(
                                        "F) Kommunikations-Matrix & Datensignale",
                                        "F) Communication Matrix & Data Signals"
                                      )
                                    : label(
                                        "G) Systemische Abgrenzung (Out of Scope)",
                                        "G) Systemic Boundary (Out of Scope)"
                                      );

                                return (
                                  <div key={group} className="mt-2">
                                    <p className="font-semibold">{heading}</p>
                                    <ul className="mt-1 space-y-1 list-disc pl-6">
                                      {items.map((item) => (
                                        <li
                                          key={item.id}
                                          className="whitespace-pre-wrap"
                                        >
                                          [{item.id}] {item.text}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer-Aktionen auf der Offer-Seite */}
      <section className="flex flex-wrap items-center justify-between mt-4 gap-3">
        {/* Links: PDF herunterladen (Angebot + §3) */}
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="rounded-full border border-slate-400 px-4 py-2 text-xs bg-white text-slate-900 hover:bg-slate-100 transition"
        >
          {L === "en"
            ? "Download (offer + §3)"
            : "PDF herunterladen (Angebot + §3)"}
        </button>

        {/* Rechts: Weiter zur Freigabe */}
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
