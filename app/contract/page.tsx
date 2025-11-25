// app/contract/page.tsx
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

// Rollen aus /explore
type CardId = "sys" | "ops" | "res" | "coach";

// Notes wie in Offer
type SkillNotes = Record<string, { need?: string; outcome?: string }>;

// Mapping Rollen -> Vertragsbaustein
const ROLE_BLOCKS: Record<
  CardId,
  {
    titleDe: string;
    titleEn: string;
    bodyDe: string;
    bodyEn: string;
  }
> = {
  sys: {
    titleDe: "Interim Management & Portfolio-Steuerung",
    titleEn: "Interim management & portfolio steering",
    bodyDe:
      "Übernahme der operativen Steuerung von Projekten, Programmen oder Portfolios (Interim). Der AN schließt temporäre Vakanzen, steuert die Umsetzung auf Basis vereinbarter Meilensteine, sorgt für Transparenz im Reporting und koordiniert die fachliche Zulieferung der Teams ohne Reibungsverluste.",
    bodyEn:
      "Taking over operational steering of projects, programmes or portfolios (interim). The Contractor bridges temporary vacancies, manages delivery based on agreed milestones, ensures transparent reporting and coordinates contributions from the teams without unnecessary friction.",
  },
  ops: {
    titleDe: "Betriebssystem-Performance & Skalierung",
    titleEn: "Operating system performance & scaling",
    bodyDe:
      "Analyse und Optimierung der Prozess- und Systemlandschaft. Der AN transformiert bestehende Abläufe in skalierbare Strukturen („Betriebssystem“), identifiziert Engpässe in der Wertschöpfungskette und etabliert effiziente Governance-Mechanismen zur Entlastung der Teams.",
    bodyEn:
      "Analysis and optimisation of the client’s process and system landscape. The Contractor transforms existing workflows into scalable structures (“operating system”), identifies bottlenecks in the value chain and establishes efficient governance mechanisms to relieve the teams.",
  },
  res: {
    titleDe: "Strategische Resonanz & Stakeholder-Management",
    titleEn: "Strategic resonance & stakeholder management",
    bodyDe:
      "Steuerung komplexer Stakeholder-Umfelder und politischer Kommunikation. Der AN fungiert als Übersetzer zwischen Fachebene und Management, löst kommunikative Blockaden auf und richtet unterschiedliche Interessenlagen strategisch auf das vereinbarte Zielbild aus.",
    bodyEn:
      "Steering complex stakeholder landscapes and political communication. The Contractor acts as a translator between expert teams and management, resolves communication blockages and aligns diverse interests towards the agreed target picture.",
  },
  coach: {
    titleDe: "Sparring, Coaching & Enablement",
    titleEn: "Sparring, coaching & enablement",
    bodyDe:
      "Methodisches Coaching und Sparring für Führungskräfte und Teams. Der AN agiert als „Thinking Partner“ zur Entscheidungsfindung, befähigt Schlüsselpersonen in der Anwendung von Methoden und unterstützt sie dabei, in komplexen Lagen tragfähige Entscheidungen zu treffen.",
    bodyEn:
      "Methodical coaching and sparring for leaders and teams. The Contractor acts as a thinking partner for decision making, equips key people with practical methods and supports them in taking robust decisions in complex situations.",
  },
};

export default function ContractPage() {
  const { lang } = useLanguage();
  const L: Lang = (lang as Lang) || "de";

  const [brief, setBrief] = useState<Record<string, string>>({});
  const [behaviorId, setBehaviorId] = useState<string>("");
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [psychoId, setPsychoId] = useState<string>("");
  const [caringId, setCaringId] = useState<string>("");
  const [notes, setNotes] = useState<SkillNotes>({});
  const [roleIds, setRoleIds] = useState<CardId[]>([]);

  // Mandatslogik
  const validation = validateSelection(
    behaviorId as BehaviorId | "",
    psychoId as PsychoId | "",
    caringId as CaringId | ""
  );

  // Daten aus localStorage laden
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const formRaw = window.localStorage.getItem(LOCAL_KEYS.form);
      const skillsRaw = window.localStorage.getItem(LOCAL_KEYS.skills);
      const notesRaw = window.localStorage.getItem(LOCAL_KEYS.notes);
      const rolesRaw = window.localStorage.getItem("brief.selected");

      setBrief(formRaw ? JSON.parse(formRaw) : {});
      setSkillIds(skillsRaw ? (JSON.parse(skillsRaw) as string[]) : []);
      setNotes(notesRaw ? (JSON.parse(notesRaw) as SkillNotes) : {});
      setRoleIds(rolesRaw ? (JSON.parse(rolesRaw) as CardId[]) : []);
      setBehaviorId(window.localStorage.getItem(LOCAL_KEYS.behavior) || "");
      setPsychoId(window.localStorage.getItem(LOCAL_KEYS.psycho) || "");
      setCaringId(window.localStorage.getItem(LOCAL_KEYS.caring) || "");
    } catch {
      setBrief({});
      setSkillIds([]);
      setNotes({});
      setRoleIds([]);
      setBehaviorId("");
      setPsychoId("");
      setCaringId("");
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

  const isEmpty =
    (!brief || Object.keys(brief).length === 0) &&
    !behaviorId &&
    skillIds.length === 0 &&
    !psychoId &&
    !caringId &&
    roleIds.length === 0;

  const label = (de: string, en: string) => (L === "en" ? en : de);

  const behaviorSummary = behavior
    ? `${behavior.ctx[L]} – ${behavior.pkg[L]}`
    : "";

  const psychLabel = psych ? psych.name[L] : "";
  const caringLabel = caring ? caring.name[L] : "";

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6 bg-slate-50 text-slate-900 min-h-screen">
      <header className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {L === "en" ? "Contract preview" : "Vertragsvorschau"}
        </h1>
        <LanguageSwitcher />
      </header>

      <ProcessBar current="confirm" />

      {isEmpty ? (
        <section className="rounded-xl border border-slate-300 bg-white p-8 text-sm flex flex-col items-start gap-4 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {L === "en" ? "No data for contract" : "Keine Daten für Vertrag"}
          </div>
          <p className="text-slate-700 max-w-xl">
            {L === "en"
              ? "To generate a contract preview, please first complete the briefing and offer steps."
              : "Um eine Vertragsvorschau zu erzeugen, füllen Sie bitte zunächst Briefing und Angebotsentwurf aus."}
          </p>
          <div className="flex gap-3">
            <Link
              href="/brief"
              className="rounded-full bg-slate-900 text-white px-4 py-2 text-xs hover:bg-slate-800 transition"
            >
              {L === "en" ? "Back to briefing" : "Zurück zum Briefing"}
            </Link>
            <Link
              href="/offer"
              className="rounded-full border border-slate-400 px-4 py-2 text-xs bg-white text-slate-900 hover:bg-slate-100 transition"
            >
              {L === "en" ? "Back to offer" : "Zurück zum Angebot"}
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-300 bg-white p-5 text-sm space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              {label(
                "Vertragsvorschau – Dienstvertrag (Auszug)",
                "Contract preview – service agreement (excerpt)"
              )}
            </h2>
            <Link
              href="/confirm"
              className="text-[11px] text-slate-600 underline-offset-2 hover:underline"
            >
              {label("Zurück zur Freigabe", "Back to release step")}
            </Link>
          </div>

          {/* Parteien / Meta */}
          <div className="border border-slate-200 rounded-md p-3 text-xs space-y-1 bg-slate-50">
            <div>
              <strong>{label("Auftraggeber (AG): ", "Client (AG): ")}</strong>
              {brief.kunde || label("noch offen", "tbd")}
            </div>
            <div>
              <strong>
                {label("Projekt / Thema: ", "Project / subject: ")}
              </strong>
              {brief.projekt || label("noch offen", "tbd")}
            </div>
            {behaviorSummary && (
              <div>
                <strong>
                  {label("Mandats-Kontext: ", "Mandate context: ")}
                </strong>
                {behaviorSummary}
              </div>
            )}
          </div>

          {/* § 3 – Leistungsumfang & Vorgehensweise */}
          <div className="space-y-3 leading-relaxed">
            <h3 className="font-semibold text-slate-900">
              {label(
                "§ 3 Leistungsumfang & Vorgehensweise",
                "§ 3 Scope of work & approach"
              )}
            </h3>

            {/* (1) Zielsetzung & Vertragscharakter */}
            <div className="space-y-1">
              <p>
                <strong>(1) </strong>
                {label(
                  "Der Auftragnehmer (AN) berät und unterstützt den Auftraggeber (AG) als externer Spezialist. Die Leistung wird als Dienstvertrag erbracht. Geschuldet ist das professionelle Tätigwerden zur Erreichung der vertraglich vereinbarten Ziele, nicht ein bestimmter wirtschaftlicher Erfolg. Der AN unterliegt keiner disziplinarischen Weisungsbefugnis des AG.",
                  "The Contractor (AN) advises and supports the Client (AG) as an external specialist. The services are provided as a service agreement. What is owed is professional activity aimed at achieving the contractually agreed objectives, not a specific commercial success. The AN is not subject to the AG’s disciplinary authority."
                )}
              </p>
            </div>

            {/* (2) Rolle(n) */}
            <div className="space-y-1">
              <p>
                <strong>(2) </strong>
                {label(
                  "Leistungsgegenstand (Rolle). Basierend auf der Auswahl im Briefing erbringt der AN folgende Kernleistung(en):",
                  "Scope of work (role). Based on the briefing selection, the AN provides the following core role(s):"
                )}
              </p>
              <ul className="list-disc pl-6">
                {roleIds.length === 0 && (
                  <li className="text-slate-600">
                    {label(
                      "Noch keine Rolle ausgewählt.",
                      "No role selected yet."
                    )}
                  </li>
                )}
                {roleIds.map((id) => {
                  const block = ROLE_BLOCKS[id];
                  return (
                    <li key={id}>
                      <strong>
                        {L === "en" ? block.titleEn : block.titleDe}
                      </strong>
                      {": "}
                      {L === "en" ? block.bodyEn : block.bodyDe}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* (3) Skills */}
            <div className="space-y-1">
              <p>
                <strong>(3) </strong>
                {label(
                  "Fachliche Schwerpunkte (Skills) gemäß Auswahl im Briefing:",
                  "Professional focus areas (skills) as selected in the briefing:"
                )}
              </p>
              <ul className="list-disc pl-6">
                {selectedSkills.length === 0 && (
                  <li className="text-slate-600">
                    {label(
                      "Keine fachlichen Schwerpunkte ausgewählt.",
                      "No professional skills selected."
                    )}
                  </li>
                )}
                {selectedSkills.map((s) => (
                  <li key={s.id}>
                    <strong>{s.title[L]}</strong>
                    {notes[s.id]?.need && (
                      <>
                        {" – "}
                        {notes[s.id]?.need}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* (4) Interaktions-Level & Engagement */}
            <div className="space-y-1">
              <p>
                <strong>(4) </strong>
                {label(
                  "Interaktions-Level & Engagement (Modus Operandi). Die Art der Leistungserbringung wird durch das gewählte psychosoziale Level und das Caring-Level bestimmt.",
                  "Interaction level & engagement (modus operandi). The way of working is determined by the chosen psychosocial level and caring level."
                )}
              </p>

              {/* a) Psycho */}
              <p>
                <strong>
                  a){" "}
                  {label(
                    "Psychosoziale Intervention (System-Tiefe): ",
                    "Psychosocial intervention (system depth): "
                  )}
                </strong>
                {psych
                  ? `${psychLabel}.`
                  : label("Kein Paket ausgewählt.", "No package selected.")}
              </p>

              {/* b) Caring */}
              <p>
                <strong>
                  b){" "}
                  {label(
                    "Grad der emotionalen Investition (Caring): ",
                    "Degree of emotional investment (caring): "
                  )}
                </strong>
                {caring
                  ? `${caringLabel}.`
                  : label(
                      "Kein Caring-Level ausgewählt.",
                      "No caring level selected."
                    )}
              </p>
            </div>

            {/* (5) Meta-Klärung */}
            <div className="space-y-1 text-slate-800">
              <p>
                <strong>(5) </strong>
                {label(
                  "Klärung von Begrifflichkeiten (Meta-Klärung). Die Parteien sind sich bewusst, dass projektbezogene Begriffe unterschiedlich interpretiert werden können. Übliche Klärungen zu Sprache, Rollen und Verantwortlichkeiten sind im Leistungsumfang enthalten.",
                  "Clarification of terminology (meta clarification). The parties acknowledge that project-related terms may be interpreted differently. Usual clarifications on language, roles and responsibilities are included in the scope."
                )}
              </p>
              <p className="text-[12px]">
                {label(
                  "Ab dem Punkt, an dem sich sprachliche oder semantische Diskussionen wiederholt im Kreis drehen und messbar Aufmerksamkeit vom Projektziel abziehen, gilt deren strukturierte Auflösung (Meta-Klärung) als eigenständige Beratungsleistung. Diese kann – nach vorheriger Abstimmung – als Change Request bzw. Zusatzkontingent abgerechnet werden.",
                  "Once linguistic or semantic discussions repeatedly go in circles and measurably distract from the project objective, the structured resolution of these tensions (meta clarification) is treated as a separate advisory service. This may—after mutual agreement—be billed as a change request or additional time budget."
                )}
              </p>
            </div>

            {/* (6) Exklusionen */}
            <div className="space-y-1 text-slate-800">
              <p>
                <strong>(6) </strong>
                {label(
                  "Exklusionen (Nicht-Leistung). Soweit nicht ausdrücklich anders vereinbart, umfasst das Mandat nicht:",
                  "Exclusions (non-services). Unless explicitly agreed otherwise, the mandate does not include:"
                )}
              </p>
              <ul className="list-disc pl-6 text-[13px]">
                <li>
                  {label("Rechts- und Steuerberatung.", "Legal or tax advice.")}
                </li>
                <li>
                  {label(
                    "Disziplinarische Personalverantwortung (Einstellungen, Abmahnungen, Gehaltsgespräche).",
                    "Disciplinary HR responsibility (hiring, warnings, salary negotiations)."
                  )}
                </li>
                <li>
                  {label(
                    "Übernahme von Organverantwortung sowie die Herbeiführung eines Erfolgs, der von der Mitwirkung Dritter abhängt, auf die der AN keinen direkten Zugriff hat.",
                    "Assumption of corporate officer responsibilities or achievement of any result that depends on third parties over which the Contractor has no direct control."
                  )}
                </li>
              </ul>
            </div>
          </div>

          {/* Hinweis auf Entwurfscharakter */}
          <p className="mt-4 text-[11px] text-slate-600">
            {label(
              "Hinweis: Diese Ansicht stellt einen nicht-bindenden Vertragsentwurf dar. Verbindlich ist ausschließlich die final abgestimmte und von beiden Parteien unterzeichnete Vertragsversion.",
              "Note: This view is a non-binding contract draft. Only the final version agreed and signed by both parties is legally binding."
            )}
          </p>
        </section>
      )}
    </main>
  );
}
