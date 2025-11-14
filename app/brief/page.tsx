// app/brief/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { BEHAVIORS, SKILLS, LOCAL_KEYS, Lang } from "../lib/catalog";
import { useLanguage } from "../lang/LanguageContext";
import { ProcessBar } from "../components/ProcessBar";
import Link from "next/link";

type Notes = Record<string, { need?: string; outcome?: string }>;

export default function BriefPage() {
  const { lang } = useLanguage(); // "de" | "en"
  const L: Lang = (lang as Lang) || "de";

  const [form, setForm] = useState<Record<string, string>>({});
  const [behaviorId, setBehaviorId] = useState<string>("");
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<Notes>({});

  // Laden
  useEffect(() => {
    if (typeof window === "undefined") return;
    setForm(JSON.parse(localStorage.getItem("brief.form") || "{}"));
    setBehaviorId(localStorage.getItem(LOCAL_KEYS.behavior) || "");
    setSkillIds(JSON.parse(localStorage.getItem(LOCAL_KEYS.skills) || "[]"));
    setNotes(JSON.parse(localStorage.getItem(LOCAL_KEYS.notes) || "{}"));
  }, []);

  // Speichern
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("brief.form", JSON.stringify(form));
  }, [form]);
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(LOCAL_KEYS.behavior, behaviorId || "");
  }, [behaviorId]);
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(LOCAL_KEYS.skills, JSON.stringify(skillIds));
  }, [skillIds]);
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(LOCAL_KEYS.notes, JSON.stringify(notes));
  }, [notes]);

  const toggleSkill = (id: string) =>
    setSkillIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const setNote = (id: string, field: "need" | "outcome", v: string) =>
    setNotes((n) => ({ ...n, [id]: { ...(n[id] || {}), [field]: v } }));

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {L === "en" ? "Project briefing" : "Projekt-Briefing"}
        </h1>
      </header>

      <ProcessBar current="brief" />

      {/* 1. Kunde & Projekt – unverändert (Kurzform, bleibt kompatibel) */}
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

      {/* 2. Absender – unverändert (Kurzform, bleibt kompatibel) */}
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
      <section className="rounded-xl border p-4 space-y-3">
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
              <label key={b.id} className="border rounded-lg p-3 flex gap-2">
                <input
                  type="radio"
                  name="behavior"
                  checked={behaviorId === b.id}
                  onChange={() => setBehaviorId(b.id)}
                />
                <div>
                  <div className="font-medium">
                    {b.ctx[L]} – {b.pkg[L]}
                  </div>
                  <div className="text-sm text-gray-600">{b.style[L]}</div>
                  <div className="text-sm">
                    {L === "en" ? "Benefit: " : "Ihr Nutzen: "}
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
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={skillIds.includes(s.id)}
                    onChange={() => toggleSkill(s.id)}
                  />
                  <span className="font-medium">{s.title[L]}</span>
                </label>
                <div className="text-sm text-gray-600">{s.offerShort[L]}</div>
                {skillIds.includes(s.id) && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <textarea
                      className="border rounded-lg p-2"
                      rows={3}
                      placeholder={s.needPH[L]}
                      value={notes[s.id]?.need || ""}
                      onChange={(e) => setNote(s.id, "need", e.target.value)}
                    />
                    <textarea
                      className="border rounded-lg p-2"
                      rows={3}
                      placeholder={s.outcomePH[L]}
                      value={notes[s.id]?.outcome || ""}
                      onChange={(e) => setNote(s.id, "outcome", e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/offer"
            className="rounded-full bg-black text-white px-4 py-2 text-sm"
          >
            {L === "en" ? "Continue: Offer draft" : "Weiter: Angebots-Entwurf"}
          </Link>
        </div>
      </section>
    </main>
  );
}
