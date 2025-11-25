// app/brief/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  BEHAVIORS,
  SKILLS,
  PSYCHO_PACKAGES,
  CARING_PACKAGES,
  LOCAL_KEYS,
} from "../lib/catalog";
import type { Lang, BehaviorId, PsychoId, CaringId } from "../lib/catalog";
import { useLanguage } from "../lang/LanguageContext";
import { tPair } from "../lib/i18n";
import { ProcessBar } from "../components/ProcessBar";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { validateSelection } from "../lib/mandateRules";

type Notes = Record<string, { need?: string; outcome?: string }>;

export default function BriefPage() {
  const { lang } = useLanguage(); // "de" | "en"
  const L: Lang = (lang as Lang) || "de";

  const [form, setForm] = useState<Record<string, string>>({});
  const [behaviorId, setBehaviorId] = useState<BehaviorId | "">("");
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<Notes>({});
  const [psychoId, setPsychoId] = useState<PsychoId | "">("");
  const [caringId, setCaringId] = useState<CaringId | "">("");

  // Validierung der aktuellen Auswahl
  const validation = validateSelection(behaviorId, psychoId, caringId);
  const canProceed = validation.severity !== "blocked";

  // --- Laden aus localStorage ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedForm = JSON.parse(
        window.localStorage.getItem(LOCAL_KEYS.form) || "{}"
      );
      setForm(storedForm);
    } catch {
      setForm({});
    }

    setBehaviorId(
      (window.localStorage.getItem(LOCAL_KEYS.behavior) as BehaviorId) || ""
    );

    try {
      const storedSkills = JSON.parse(
        window.localStorage.getItem(LOCAL_KEYS.skills) || "[]"
      );
      setSkillIds(Array.isArray(storedSkills) ? storedSkills : []);
    } catch {
      setSkillIds([]);
    }

    try {
      const storedNotes = JSON.parse(
        window.localStorage.getItem(LOCAL_KEYS.notes) || "{}"
      );
      setNotes(storedNotes || {});
    } catch {
      setNotes({});
    }

    setPsychoId(
      (window.localStorage.getItem(LOCAL_KEYS.psycho) as PsychoId) || ""
    );
    setCaringId(
      (window.localStorage.getItem(LOCAL_KEYS.caring) as CaringId) || ""
    );
  }, []);

  // --- Speichern ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LOCAL_KEYS.form, JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (behaviorId) {
      window.localStorage.setItem(LOCAL_KEYS.behavior, behaviorId);
    } else {
      window.localStorage.removeItem(LOCAL_KEYS.behavior);
    }
  }, [behaviorId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LOCAL_KEYS.skills, JSON.stringify(skillIds));
  }, [skillIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LOCAL_KEYS.notes, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (psychoId) {
      window.localStorage.setItem(LOCAL_KEYS.psycho, psychoId);
    } else {
      window.localStorage.removeItem(LOCAL_KEYS.psycho);
    }
  }, [psychoId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (caringId) {
      window.localStorage.setItem(LOCAL_KEYS.caring, caringId);
    } else {
      window.localStorage.removeItem(LOCAL_KEYS.caring);
    }
  }, [caringId]);

  // --- Hilfsfunktionen ---
  const toggleSkill = (id: string) =>
    setSkillIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const setNote = (id: string, field: "need" | "outcome", v: string) =>
    setNotes((n) => ({ ...n, [id]: { ...(n[id] || {}), [field]: v } }));

  // Empfehlung für Psychosozial-Paket abhängig von Verhalten
  const recommendedPsychoId: PsychoId | "" = useMemo(() => {
    if (behaviorId === "chaos") return "psych-b"; // Pragmatischer Stabilisator -> Resilienz-Schild
    if (behaviorId === "political") return "psych-c"; // Allparteilicher Mediator -> Sensemaker
    return "";
  }, [behaviorId]);

  // Wenn Verhalten geändert wird und noch kein Psycho-Paket gewählt wurde -> Empfehlung automatisch setzen
  useEffect(() => {
    if (!psychoId && recommendedPsychoId) {
      setPsychoId(recommendedPsychoId);
    }
  }, [recommendedPsychoId, psychoId]);

  // Aktuell gewählte Pakete für 5a/5b inkl. Faktor
  const psychoPackage = useMemo(
    () => PSYCHO_PACKAGES.find((p) => p.id === psychoId) ?? null,
    [psychoId]
  );
  const caringPackage = useMemo(
    () => CARING_PACKAGES.find((c) => c.id === caringId) ?? null,
    [caringId]
  );

  const psychoFactor = psychoPackage?.priceFactor ?? 1;
  const caringFactor = caringPackage?.priceFactor ?? 1;
  const hasFactorSelection = !!psychoPackage || !!caringPackage;
  const combinedFactor = hasFactorSelection ? psychoFactor * caringFactor : 1;

  const label = (de: string, en: string) => tPair(L, de, en);

  const inputBase =
    "w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-900 bg-white " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-50";

  const textAreaBase =
    "border border-slate-300 rounded-lg p-2 text-sm text-slate-900 bg-white resize-vertical " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-50";

  const proceedBase = "rounded-full px-4 py-2 text-sm transition font-medium";
  const proceedEnabled = "bg-slate-900 text-white hover:bg-slate-800";
  const proceedDisabled =
    "bg-slate-400 text-white cursor-not-allowed opacity-60 pointer-events-none";
  const proceedClasses = `${proceedBase} ${
    canProceed ? proceedEnabled : proceedDisabled
  }`;

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6 bg-slate-50 text-slate-900 min-h-screen">
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          {L === "en" ? "Project briefing" : "Projekt-Briefing"}
        </h1>
        <LanguageSwitcher />
      </header>

      <ProcessBar current="brief" />

      {/* 1. Kunde & Projekt */}
      <section className="rounded-xl border border-slate-300 bg-white p-4 space-y-3 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          1. {L === "en" ? "Client & project" : "Kunde & Projekt"}
        </h2>
        <input
          className={inputBase}
          placeholder={
            L === "en"
              ? "Client company"
              : "Auftraggeber (Unternehmen / Organisation)"
          }
          value={form.kunde || ""}
          onChange={(e) => setForm((f) => ({ ...f, kunde: e.target.value }))}
        />
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className={inputBase}
            placeholder={
              L === "en"
                ? "Contact name, role"
                : "Ansprechpartner:in beim Auftraggeber"
            }
            value={form.kontakt || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, kontakt: e.target.value }))
            }
          />
          <input
            className={inputBase}
            placeholder={L === "en" ? "Project title" : "Projektbezeichnung"}
            value={form.projekt || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, projekt: e.target.value }))
            }
          />
        </div>
      </section>

      {/* 2. Absender */}
      <section className="rounded-xl border border-slate-300 bg-white p-4 space-y-3 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          2.{" "}
          {L === "en"
            ? "Sender (your offer header)"
            : "Absender für das Angebot"}
        </h2>
        <input
          className={inputBase}
          placeholder={
            L === "en" ? "Your company/name" : "Ihr Name / Unternehmen"
          }
          value={form.anbieterName || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, anbieterName: e.target.value }))
          }
        />
        <input
          className={inputBase}
          placeholder={L === "en" ? "Address" : "Adresse"}
          value={form.anbieterAdresse || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, anbieterAdresse: e.target.value }))
          }
        />
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className={inputBase}
            placeholder={
              L === "en"
                ? "Contact (email/phone/web)"
                : "Kontakt (E-Mail / Telefon / Web)"
            }
            value={form.anbieterKontakt || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, anbieterKontakt: e.target.value }))
            }
          />
          <input
            className={inputBase}
            placeholder={
              L === "en" ? "VAT ID (optional)" : "USt-IdNr. (optional)"
            }
            value={form.anbieterUstId || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, anbieterUstId: e.target.value }))
            }
          />
        </div>
      </section>

      {/* 4. Rollen & fachliche Qualifikationen */}
      <section className="rounded-xl border border-slate-300 bg-white p-4 space-y-4 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          4.{" "}
          {L === "en"
            ? "Roles & professional skills"
            : "Rollen & fachliche Qualifikationen"}
        </h2>

        {/* Verhalten (einfaches Radio) */}
        <div className="space-y-2">
          <h3 className="font-medium text-slate-900">
            {L === "en"
              ? "Behavior package (choose one)"
              : "Verhaltenspaket (eins wählen)"}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {BEHAVIORS.map((b) => (
              <label
                key={b.id}
                className="border border-slate-300 rounded-lg p-3 flex gap-2 cursor-pointer bg-slate-50 hover:border-slate-500 transition shadow-xs"
              >
                <input
                  type="radio"
                  name="behavior"
                  className="mt-1 accent-slate-800"
                  checked={behaviorId === b.id}
                  onChange={() => setBehaviorId(b.id)}
                />
                <div>
                  <div className="font-semibold text-slate-900">
                    {b.ctx[L]} – {b.pkg[L]}
                  </div>
                  <div className="text-sm text-slate-700">{b.style[L]}</div>
                  <div className="text-sm mt-1 text-slate-800">
                    {label("Ihr Nutzen: ", "Benefit: ")}
                    {b.outcome[L]}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <h3 className="font-medium text-slate-900">
            {L === "en"
              ? "Professional skills (multi-select)"
              : "Fachliche Skills (Mehrfachauswahl)"}
          </h3>
          <div className="space-y-3">
            {SKILLS.map((s) => (
              <div
                key={s.id}
                className="border border-slate-300 rounded-lg p-3 space-y-2 bg-slate-50 shadow-xs"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-slate-800"
                    checked={skillIds.includes(s.id)}
                    onChange={() => toggleSkill(s.id)}
                  />
                  <span className="font-semibold text-slate-900">
                    {s.title[L]}
                  </span>
                </label>
                <div className="text-sm text-slate-700">{s.offerShort[L]}</div>
                {skillIds.includes(s.id) && (
                  <div className="grid md:grid-cols-2 gap-3 mt-2">
                    <textarea
                      className={textAreaBase}
                      rows={3}
                      placeholder={s.needPlaceholder[L]}
                      value={notes[s.id]?.need || ""}
                      onChange={(e) => setNote(s.id, "need", e.target.value)}
                    />
                    <textarea
                      className={textAreaBase}
                      rows={3}
                      placeholder={s.outcomePlaceholder[L]}
                      value={notes[s.id]?.outcome || ""}
                      onChange={(e) => setNote(s.id, "outcome", e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Psychosoziale Interaktions- & Caring-Level */}
      <section className="rounded-xl border border-slate-300 bg-white p-4 space-y-4 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          5.{" "}
          {L === "en"
            ? "Psychosocial intervention & emotional investment"
            : "Psychosoziale Interaktions-Level & emotionale Investition"}
        </h2>

        {/* Hinweis direkt bei den relevanten Auswahlfeldern */}
        {validation.messages.length > 0 && (
          <div
            className={
              validation.severity === "blocked"
                ? "rounded-md border border-red-500 bg-red-50 p-2 text-[11px] text-red-800 mb-1"
                : "rounded-md border border-amber-500 bg-amber-50 p-2 text-[11px] text-amber-800 mb-1"
            }
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] font-bold">
                !
              </span>
              <div className="space-y-1">
                {validation.messages.map((m, idx) => (
                  <p key={idx}>{L === "en" ? m.en : m.de}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-slate-700">
          {L === "en"
            ? "Here you define the depth of system intervention and how much emotional investment is part of the mandate. Think of it as the emotional insurance premium."
            : "Hier legen Sie die Tiefe der System-Intervention und den Grad der emotionalen Investition fest – gewissermaßen die emotionale Versicherungsprämie des Mandats."}
        </p>

        {/* 5a – Psychosoziale Interventions-Level */}
        <details
          className="rounded-lg border border-slate-300 bg-slate-50 p-3 space-y-3 shadow-xs"
          open
        >
          <summary className="font-medium cursor-pointer list-none mb-1 text-slate-900">
            {L === "en"
              ? "5a. Psychosocial intervention level (system impact)"
              : "5a. Psychosoziale Interventions-Level (System-Eingriff)"}
          </summary>

          <p className="text-xs text-slate-700">
            {L === "en"
              ? "Choose how deep the mandate goes into team dynamics and stakeholder system."
              : "Wählen Sie, wie tief das Mandat in Teamdynamik und Stakeholder-System eingreift."}
          </p>

          <div className="grid md:grid-cols-3 gap-3">
            {PSYCHO_PACKAGES.map((p) => {
              const isSelected = psychoId === p.id;
              const isRecommended = recommendedPsychoId === p.id;

              return (
                <label
                  key={p.id}
                  className={[
                    "border rounded-lg p-3 flex flex-col gap-1 cursor-pointer text-sm bg-white",
                    isSelected
                      ? "border-slate-800 shadow-md"
                      : "border-slate-300 hover:border-slate-600 shadow-xs",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="psycho"
                      className="mt-1 accent-slate-800"
                      checked={isSelected}
                      onChange={() => setPsychoId(p.id as PsychoId)}
                    />
                    <div>
                      <div className="font-semibold text-slate-900">
                        {p.name[L]}{" "}
                        <span className="text-xs text-slate-700">
                          {(p as any).level?.[L] ?? ""}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700">{p.focus[L]}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-800 mt-1">
                    <strong>
                      {L === "en" ? "Includes: " : "Inklusion (Doing): "}
                    </strong>
                    {(p as any).include?.[L] ?? ""}
                  </div>
                  <div className="text-[11px] text-slate-800">
                    <strong>
                      {L === "en" ? "Excludes: " : "Exklusion (Not Doing): "}
                    </strong>
                    {(p as any).exclude?.[L] ?? ""}
                  </div>
                  <div className="text-[11px] text-slate-800">
                    <strong>{label("Ihr Nutzen: ", "Benefit: ")}</strong>
                    {p.benefit[L]}
                  </div>
                  <div className="text-[11px] font-semibold mt-1 text-slate-900">
                    {(p as any).factorLabel?.[L] ?? ""}
                  </div>
                  {isRecommended && (
                    <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                      {L === "en"
                        ? "Recommended based on your selected behavior package."
                        : "Empfohlen auf Basis Ihres gewählten Verhaltenspakets."}
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-700 mt-2">
            {L === "en"
              ? "Example: In a chaos / hyper-growth phase, package B is typically necessary to protect teams. In a highly political environment, package C is essential for sensemaking and diplomacy."
              : "Beispiel: In einer Chaos- oder Hyperwachstumsphase ist Paket B meist nötig, um Teams emotional zu schützen. In hoch-politischen Umfeldern ist Paket C für Sensemaking und Diplomatie entscheidend."}
          </p>
        </details>

        {/* 5b – Caring-Level */}
        {/* 5b – Caring-Level */}
        <details
          className="rounded-lg border border-slate-300 bg-slate-50 p-3 space-y-3 shadow-xs"
          open
        >
          <summary className="font-medium cursor-pointer list-none mb-1 text-slate-900">
            {L === "en"
              ? "5b. Emotional investment (“caring” level)"
              : "5b. Grad der emotionalen Investition („Caring“-Modell)"}
          </summary>

          <p className="text-xs text-slate-700">
            {L === "en"
              ? "Here you choose the desired engagement level: pure execution, active stakeholder engagement or maximum result dedication."
              : "Hier wählen Sie, welches Engagement-Level Sie wünschen: reine Auftragsabwicklung, aktives Stakeholder-Engagement oder maximale Ergebnis-Dedikation."}
          </p>

          <div className="grid md:grid-cols-3 gap-3">
            {CARING_PACKAGES.map((c) => {
              const isSelected = caringId === c.id;
              return (
                <label
                  key={c.id}
                  className={[
                    "border rounded-lg p-3 flex flex-col gap-1 cursor-pointer text-sm bg-white",
                    isSelected
                      ? "border-slate-800 shadow-md"
                      : "border-slate-300 hover:border-slate-600 shadow-xs",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="caring"
                      className="mt-1 accent-slate-800"
                      checked={isSelected}
                      onChange={() => setCaringId(c.id as CaringId)}
                    />
                    <div>
                      <div className="font-semibold text-slate-900">
                        {c.name[L]}
                      </div>
                      <div className="text-xs text-slate-700">
                        {(c as any).tagline?.[L] ?? ""}
                      </div>
                    </div>
                  </div>

                  {/* kurze Beschreibung */}
                  <div className="text-[11px] text-slate-800">
                    {(c as any).definition?.[L] ?? ""}
                  </div>

                  {/* Angebot (optional) */}
                  <div className="text-[11px] text-slate-800">
                    <strong>{label("Angebot: ", "Offer: ")}</strong>
                    {(c as any).offer?.[L] ?? ""}
                  </div>

                  {/* exakt gleiche Reihenfolge & Labels wie 5a */}
                  <div className="text-[11px] text-slate-800 mt-1">
                    <strong>
                      {L === "en" ? "Includes: " : "Inklusion (Doing): "}
                    </strong>
                    {(c as any).inclusion?.[L] ?? ""}
                  </div>
                  <div className="text-[11px] text-slate-800">
                    <strong>
                      {L === "en" ? "Excludes: " : "Exklusion (Not Doing): "}
                    </strong>
                    {(c as any).exclusion?.[L] ?? ""}
                  </div>
                  <div className="text-[11px] text-slate-800">
                    <strong>{label("Ihr Nutzen: ", "Benefit: ")}</strong>
                    {c.benefit[L]}
                  </div>

                  <div className="text-[11px] font-semibold mt-1 text-slate-900">
                    {(c as any).priceLabel?.[L] ?? ""}
                  </div>
                </label>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-700 mt-2">
            {L === "en"
              ? "Later in the offer we can make explicit what is not included: for example, if you choose level A, cultural integration and deep conflict moderation stay explicitly with the client."
              : "Im Angebot kann später explizit sichtbar werden, was nicht gekauft wurde: Wählt der Auftraggeber z. B. Level A, bleiben kulturelle Integration und tiefe Konfliktmoderation ausdrücklich in seiner Verantwortung."}
          </p>

          <div className="mt-2 rounded-md border border-amber-300 bg-amber-50 p-2 flex gap-2 text-[11px] text-amber-900">
            <span className="mt-0.5">⚖️</span>
            <div>
              <p>
                {L === "en"
                  ? "We know that terms can be emotionally charged and live in different interpretations. Normal clarifications around language, roles and responsibilities are included in the scope."
                  : "Wir wissen, dass Begriffe emotional aufgeladen sein können und unterschiedliche Deutungsräume haben. Übliche Klärungen zu Sprache, Rollen und Verantwortlichkeiten sind im Leistungsumfang enthalten."}
              </p>
              <p className="mt-1">
                {L === "en"
                  ? "Once linguistic or semantic discussions start to repeatedly go in circles and measurably pull attention away from the project goal, they are treated as a separate advisory service (meta-clarification). This may – after mutual agreement – be billed separately as a change / additional time budget."
                  : "Ab dem Punkt, an dem sich sprachliche oder semantische Diskussionen wiederholt im Kreis drehen und messbar Aufmerksamkeit vom Projektziel abziehen, gelten sie als eigenständige Beratungsleistung (Meta-Klärung). Diese kann – nach vorheriger Absprache – gesondert als Change / Zusatzkontingent abgerechnet werden."}
              </p>
            </div>
          </div>
        </details>

        {/* Faktor-Hinweis für 5a/5b kombiniert */}
        {hasFactorSelection && (
          <p className="text-[11px] text-slate-700 mt-1">
            {L === "en"
              ? `Current factor on the base day rate: ${combinedFactor.toFixed(
                  2
                )} (psychosocial level × caring). The concrete day rate is calculated in the next step on the offer page.`
              : `Aktueller Faktor auf den Basis-Tagessatz: ${combinedFactor.toFixed(
                  2
                )} (psychosoziales Level × Caring). Die konkrete Tagessatz-Berechnung sehen Sie im nächsten Schritt im Angebots-Entwurf.`}
          </p>
        )}
      </section>

      {/* Footer-Aktion */}
      <section className="flex justify-end">
        <div className="flex flex-col items-end gap-1">
          <Link
            href={canProceed ? "/offer" : "#"}
            aria-disabled={!canProceed}
            className={proceedClasses}
          >
            {L === "en" ? "Continue: Offer draft" : "Weiter: Angebots-Entwurf"}
          </Link>
          {!canProceed && (
            <p className="text-[11px] text-red-700 max-w-md text-right">
              {L === "en"
                ? "The current combination is not allowed according to the mandate rules. Please adjust context, psychosocial level or caring level above."
                : "Die aktuelle Kombination ist laut Mandatslogik nicht zulässig. Bitte passen Sie Kontext, psychosoziales Level oder Caring-Level oben an."}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
