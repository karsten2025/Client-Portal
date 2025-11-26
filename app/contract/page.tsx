// app/contract/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  BEHAVIORS,
  LOCAL_KEYS,
  type Lang,
  type Behavior,
  type BehaviorId,
  type PsychoId,
  type CaringId,
} from "../lib/catalog";
import { useLanguage } from "../lang/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { ProcessBar } from "../components/ProcessBar";
import { validateSelection } from "../lib/mandateRules";
import type { ContractSection3Input } from "../lib/contractSection3";
import { ContractSection3Block } from "../components/ContractSection3Block";

// Rollen aus /explore
type CardId = "sys" | "ops" | "res" | "coach";

export default function ContractPage() {
  const { lang } = useLanguage();
  const L: Lang = (lang as Lang) || "de";

  const [brief, setBrief] = useState<Record<string, string>>({});
  const [behaviorId, setBehaviorId] = useState<string>("");
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [psychoId, setPsychoId] = useState<string>("");
  const [caringId, setCaringId] = useState<string>("");
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
      const rolesRaw = window.localStorage.getItem("brief.selected");

      setBrief(formRaw ? JSON.parse(formRaw) : {});
      setSkillIds(skillsRaw ? (JSON.parse(skillsRaw) as string[]) : []);
      setRoleIds(rolesRaw ? (JSON.parse(rolesRaw) as CardId[]) : []);
      setBehaviorId(window.localStorage.getItem(LOCAL_KEYS.behavior) || "");
      setPsychoId(window.localStorage.getItem(LOCAL_KEYS.psycho) || "");
      setCaringId(window.localStorage.getItem(LOCAL_KEYS.caring) || "");
    } catch {
      setBrief({});
      setSkillIds([]);
      setRoleIds([]);
      setBehaviorId("");
      setPsychoId("");
      setCaringId("");
    }
  }, []);

  // Lookups (nur Behavior wird hier noch für die Meta-Box benötigt)
  const behavior: Behavior | null = useMemo(
    () => BEHAVIORS.find((x) => x.id === behaviorId) ?? null,
    [behaviorId]
  );

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

  // 🔹 Input für Single Source of Truth § 3
  const section3Input: ContractSection3Input = {
    behaviorId: behaviorId as BehaviorId | "",
    selectedRoles: roleIds,
    skillIds,
    psychoId: psychoId as PsychoId | "",
    caringId: caringId as CaringId | "",
  };

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

          {/* 🔹 § 3 – gerendert aus Single Source via Wrapper */}
          <div className="space-y-3 leading-relaxed">
            <ContractSection3Block
              lang={L}
              input={section3Input}
              className="whitespace-pre-wrap text-xs sm:text-sm font-normal text-slate-900"
            />
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
