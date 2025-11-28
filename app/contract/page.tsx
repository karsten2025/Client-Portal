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
import {
  buildContractSection3,
  type ContractSection3Input,
} from "../lib/contractSection3";
import {
  getRoleRequirementsFor,
  getRoleModuleLabel,
  type RoleId,
  type RequirementGroup,
} from "../lib/roleRequirements";

// Rollen aus /explore
type CardId = "sys" | "ops" | "res" | "coach";

// Notes wie in Offer (für später, falls du Notizen einblenden willst)
type SkillNotes = Record<string, { need?: string; outcome?: string }>;

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

  // Lookups für Kontexte
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

  // 🔹 Single Source of Truth: Input für contractSection3.ts
  const section3Input: ContractSection3Input = {
    behaviorId: behaviorId as BehaviorId | "",
    selectedRoles: roleIds,
    skillIds,
    psychoId: psychoId as PsychoId | "",
    caringId: caringId as CaringId | "",
  };

  const section3Text = buildContractSection3(L, section3Input);

  // Absätze für die Web-Vorschau
  const section3Paragraphs = section3Text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // 🔹 Detail-Requirements wie im PDF
  const ALL_ROLE_IDS: RoleId[] = ["sys", "ops", "res", "coach"];
  const roleIdsForRequirements: RoleId[] = roleIds.filter((r): r is RoleId =>
    ALL_ROLE_IDS.includes(r as RoleId)
  );

  const detailGroups: RequirementGroup[] = [
    "ziel",
    "leistung",
    "mitwirkung",
    "ergebnis",
    "zeit",
    "kommunikation",
    "abgrenzung",
  ];

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6 bg-slate-50 text-slate-900 min-h-screen">
      <header className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {L === "en" ? "Contract preview" : "Vertragsvorschau"}
        </h1>
        <LanguageSwitcher />
      </header>

      <ProcessBar current="confirm" />

      {/* 🔎 Debug-Info: was kommt hier wirklich an? */}
      <section className="rounded-md border border-dashed border-amber-300 bg-amber-50 p-2 text-[11px] text-amber-900 mb-2">
        <div className="font-semibold mb-1">
          Debug (nur für dich, später löschbar)
        </div>
        <div>
          <strong>roleIds (aus localStorage brief.selected): </strong>
          {JSON.stringify(roleIds)}
        </div>
        <div>
          <strong>roleIdsForRequirements (für INCOSE-Blöcke): </strong>
          {JSON.stringify(roleIdsForRequirements)}
        </div>
      </section>

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

          {/* § 3 – Leistungsumfang & Vorgehensweise (Single Source aus contractSection3.ts) */}
          <div className="space-y-3 leading-relaxed">
            <h3 className="font-semibold text-slate-900">
              {label(
                "§ 3 Leistungsumfang & Vorgehensweise",
                "§ 3 Scope of services & delivery approach"
              )}
            </h3>

            {/* Haupttext aus contractSection3.ts */}
            <div className="space-y-2 text-xs leading-relaxed text-slate-800 whitespace-pre-line">
              {section3Paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Detaillierte Leistungsbeschreibung – Rollenmodule wie im PDF */}
            {roleIdsForRequirements.length > 0 && (
              <div className="mt-6 space-y-6 text-xs leading-relaxed text-slate-800">
                {roleIdsForRequirements.map((roleId) => {
                  const moduleLabel = getRoleModuleLabel(L, roleId);
                  const requirements = getRoleRequirementsFor(L, roleId);
                  if (!requirements.length) return null;

                  return (
                    <div key={roleId}>
                      <h4 className="font-semibold mb-2">
                        {L === "en"
                          ? `Detailed scope of work – role module “${moduleLabel}”`
                          : `Detaillierte Leistungsbeschreibung – Rollenmodul „${moduleLabel}“`}
                      </h4>

                      {detailGroups.map((group) => {
                        const items = requirements.filter(
                          (r) => r.group === group
                        );
                        if (!items.length) return null;

                        const heading =
                          group === "ziel"
                            ? L === "en"
                              ? "A. Purpose and mandate"
                              : "A. Ziel & Mandatsrahmen"
                            : group === "leistung"
                            ? L === "en"
                              ? "B. Services of the Contractor"
                              : "B. Leistungen des Auftragnehmers (AN)"
                            : group === "mitwirkung"
                            ? L === "en"
                              ? "C. Client responsibilities"
                              : "C. Mitwirkungspflichten des Auftraggebers (AG)"
                            : group === "ergebnis"
                            ? L === "en"
                              ? "D. Results / deliverables"
                              : "D. Ergebnisse / Deliverables"
                            : group === "zeit"
                            ? L === "en"
                              ? "E. Time & fees"
                              : "E. Zeit & Umfang / Vergütung"
                            : group === "kommunikation"
                            ? L === "en"
                              ? "F. Communication & escalation"
                              : "F. Kommunikation & Eskalation"
                            : L === "en"
                            ? "G. Exclusions / non-services"
                            : "G. Abgrenzung / Nicht-Leistungen";

                        return (
                          <div key={group} className="mt-3">
                            <div className="font-semibold mb-1">{heading}</div>
                            <ul className="list-disc pl-5 space-y-1">
                              {items.map((item) => (
                                <li key={item.id}>
                                  <span className="font-mono text-[11px] mr-1">
                                    [{item.id}]
                                  </span>
                                  {item.text}
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
