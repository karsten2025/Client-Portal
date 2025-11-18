// app/brief/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BEHAVIORS,
  SKILLS,
  PSYCHO_PACKAGES,
  CARING_PACKAGES,
  LOCAL_KEYS,
  Lang,
  BehaviorId,
  PsychoId,
  CaringId,
} from "../lib/catalog";
import { useLanguage } from "../lang/LanguageContext";
import { ProcessBar } from "../components/ProcessBar";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import Link from "next/link";

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
    if (behaviorId === "chaos") return "psycho-b"; // Pragmatischer Stabilisator -> Resilienz-Schild
    if (behaviorId === "political") return "psycho-c"; // Allparteilicher Mediator -> Sensemaker
    return "";
  }, [behaviorId]);

  // Wenn Verhalten geändert wird und noch kein Psycho-Paket gewählt wurde -> Empfehlung automatisch setzen
  useEffect(() => {
    if (!psychoId && recommendedPsychoId) {
      setPsychoId(recommendedPsychoId);
    }
  }, [recommendedPsychoId, psychoId]);

  const label = (de: string, en: string) => (L === "en" ? en : de);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {L === "en" ? "Project briefing" : "Projekt-Briefing"}
        </h1>
        <LanguageSwitcher />
      </header>

      <ProcessBar current="brief" />

      {/* 1. Kunde & Projekt */}
      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-medium">
          1. {L === "en" ? "Client & project" : "Kunde & Projekt"}
        </h2>
        <input
          className="w-full border rounded-lg p-2"
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
            className="w-full border rounded-lg p-2"
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
            className="w-full border rounded-lg p-2"
            placeholder={L === "en" ? "Project title" : "Projektbezeichnung"}
            value={form.projekt || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, projekt: e.target.value }))
            }
          />
        </div>
      </section>

      {/* 2. Absender */}
      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-medium">
          2.{" "}
          {L === "en"
            ? "Sender (your offer header)"
            : "Absender für das Angebot"}
        </h2>
        <input
          className="w-full border rounded-lg p-2"
          placeholder={
            L === "en" ? "Your company/name" : "Ihr Name / Unternehmen"
          }
          value={form.anbieterName || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, anbieterName: e.target.value }))
          }
        />
        <input
          className="w-full border rounded-lg p-2"
          placeholder={L === "en" ? "Address" : "Adresse"}
          value={form.anbieterAdresse || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, anbieterAdresse: e.target.value }))
          }
        />
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="w-full border rounded-lg p-2"
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
            className="w-full border rounded-lg p-2"
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
      <section className="rounded-xl border p-4 space-y-4">
        <h2 className="font-medium">
          4.{" "}
          {L === "en"
            ? "Roles & professional skills"
            : "Rollen & fachliche Qualifikationen"}
        </h2>

        {/* Verhalten (einfaches Radio) */}
        <div className="space-y-2">
          <h3 className="font-medium">
            {L === "en"
              ? "Behavior package (choose one)"
              : "Verhaltenspaket (eins wählen)"}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {BEHAVIORS.map((b) => (
              <label
                key={b.id}
                className="border rounded-lg p-3 flex gap-2 cursor-pointer hover:border-black/60 transition"
              >
                <input
                  type="radio"
                  name="behavior"
                  className="mt-1"
                  checked={behaviorId === b.id}
                  onChange={() => setBehaviorId(b.id)}
                />
                <div>
                  <div className="font-medium">
                    {b.ctx[L]} – {b.pkg[L]}
                  </div>
                  <div className="text-sm text-gray-600">{b.style[L]}</div>
                  <div className="text-sm mt-1">
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
          <h3 className="font-medium">
            {L === "en"
              ? "Professional skills (multi-select)"
              : "Fachliche Skills (Mehrfachauswahl)"}
          </h3>
          <div className="space-y-3">
            {SKILLS.map((s) => (
              <div key={s.id} className="border rounded-lg p-3 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skillIds.includes(s.id)}
                    onChange={() => toggleSkill(s.id)}
                  />
                  <span className="font-medium">{s.title[L]}</span>
                </label>
                <div className="text-sm text-gray-600">{s.offerShort[L]}</div>
                {skillIds.includes(s.id) && (
                  <div className="grid md:grid-cols-2 gap-3 mt-2">
                    <textarea
                      className="border rounded-lg p-2 text-sm"
                      rows={3}
                      placeholder={s.needPlaceholder[L]}
                      value={notes[s.id]?.need || ""}
                      onChange={(e) => setNote(s.id, "need", e.target.value)}
                    />
                    <textarea
                      className="border rounded-lg p-2 text-sm"
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
      <section className="rounded-xl border p-4 space-y-4">
        <h2 className="font-medium">
          5.{" "}
          {L === "en"
            ? "Psychosocial intervention & emotional investment"
            : "Psychosoziale Interaktions-Level & emotionale Investition"}
        </h2>

        <p className="text-sm text-gray-700">
          {L === "en"
            ? "Here you define the depth of system intervention and how much emotional investment is part of the mandate. Think of it as the emotional insurance premium."
            : "Hier legen Sie die Tiefe der System-Intervention und den Grad der emotionalen Investition fest – gewissermaßen die emotionale Versicherungspämie des Mandats."}
        </p>

        {/* 5a – Psychosoziale Interventions-Level */}
        <details className="rounded-lg border p-3 space-y-3" open>
          <summary className="font-medium cursor-pointer list-none mb-1">
            {L === "en"
              ? "5a. Psychosocial intervention level (system impact)"
              : "5a. Psychosoziale Interventions-Level (System-Eingriff)"}
          </summary>

          <p className="text-xs text-gray-600">
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
                    "border rounded-lg p-3 flex flex-col gap-1 cursor-pointer text-sm",
                    isSelected
                      ? "border-black shadow-sm"
                      : "hover:border-black/60",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="psycho"
                      className="mt-1"
                      checked={isSelected}
                      onChange={() => setPsychoId(p.id)}
                    />
                    <div>
                      <div className="font-medium">
                        {p.name[L]}{" "}
                        <span className="text-xs text-gray-500">
                          ({p.level[L]})
                        </span>
                      </div>
                      <div className="text-xs text-gray-700">{p.focus[L]}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-700 mt-1">
                    <strong>
                      {L === "en" ? "Includes: " : "Inklusion (Doing): "}
                    </strong>
                    {p.include[L]}
                  </div>
                  <div className="text-[11px] text-gray-700">
                    <strong>
                      {L === "en" ? "Excludes: " : "Exklusion (Not Doing): "}
                    </strong>
                    {p.exclude[L]}
                  </div>
                  <div className="text-[11px] text-gray-700">
                    <strong>{label("Ihr Nutzen: ", "Benefit: ")}</strong>
                    {p.benefit[L]}
                  </div>
                  <div className="text-[11px] font-semibold mt-1">
                    {p.factorLabel[L]}
                  </div>
                  {isRecommended && (
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                      {L === "en"
                        ? "Recommended based on your selected behavior package."
                        : "Empfohlen auf Basis Ihres gewählten Verhaltenspakets."}
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          <p className="text-[11px] text-gray-600 mt-2">
            {L === "en"
              ? "Example: In a chaos / hyper-growth phase, package B is typically necessary to protect teams. In a highly political environment, package C is essential for sensemaking and diplomacy."
              : "Beispiel: In einer Chaos- oder Hyperwachstumsphase ist Paket B meist nötig, um Teams emotional zu schützen. In hoch-politischen Umfeldern ist Paket C für Sensemaking und Diplomatie entscheidend."}
          </p>
        </details>

        {/* 5b – Caring-Level */}
        <details className="rounded-lg border p-3 space-y-3" open>
          <summary className="font-medium cursor-pointer list-none mb-1">
            {L === "en"
              ? "5b. Emotional investment (“caring” level)"
              : "5b. Grad der emotionalen Investition („Caring“-Modell)"}
          </summary>

          <p className="text-xs text-gray-600">
            {L === "en"
              ? "Here you decide how much the fate of the project is allowed to affect the sleep of your project manager."
              : "Hier entscheiden Sie, wie sehr das Schicksal des Projekts den Schlaf des Projektmanagers beeinflussen darf."}
          </p>

          <div className="grid md:grid-cols-3 gap-3">
            {CARING_PACKAGES.map((c) => {
              const isSelected = caringId === c.id;
              return (
                <label
                  key={c.id}
                  className={[
                    "border rounded-lg p-3 flex flex-col gap-1 cursor-pointer text-sm",
                    isSelected
                      ? "border-black shadow-sm"
                      : "hover:border-black/60",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="caring"
                      className="mt-1"
                      checked={isSelected}
                      onChange={() => setCaringId(c.id)}
                    />
                    <div>
                      <div className="font-medium">{c.name[L]}</div>
                      <div className="text-xs text-gray-700">
                        {c.tagline[L]}
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-700">
                    {c.definition[L]}
                  </div>
                  <div className="text-[11px] text-gray-700">
                    <strong>{label("Angebot: ", "Offer: ")}</strong>
                    {c.offer[L]}
                  </div>
                  <div className="text-[11px] text-gray-700">
                    <strong>{label("Inklusion: ", "Includes: ")}</strong>
                    {c.inclusion[L]}
                  </div>
                  <div className="text-[11px] text-gray-700">
                    <strong>{label("Exklusion: ", "Excludes: ")}</strong>
                    {c.exclusion[L]}
                  </div>
                  <div className="text-[11px] font-semibold mt-1">
                    {c.priceLabel[L]}
                  </div>
                </label>
              );
            })}
          </div>

          <p className="text-[11px] text-gray-600 mt-2">
            {L === "en"
              ? "Later in the offer we can make explicit what is not included: for example, if you choose level A, cultural integration and deep conflict moderation stay explicitly with the client."
              : "Im Angebot kann später explizit sichtbar werden, was nicht gekauft wurde: Wählt der Auftraggeber z. B. Level A, bleiben kulturelle Integration und tiefe Konfliktmoderation ausdrücklich in seiner Verantwortung."}
          </p>
        </details>
      </section>

      {/* Footer-Aktion */}
      <section className="flex justify-end">
        <Link
          href="/offer"
          className="rounded-full bg-black text-white px-4 py-2 text-sm"
        >
          {L === "en" ? "Continue: Offer draft" : "Weiter: Angebots-Entwurf"}
        </Link>
      </section>
    </main>
  );
}
