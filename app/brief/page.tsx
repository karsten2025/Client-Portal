"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLang } from "../LanguageProvider";

type BriefForm = {
  kunde?: string;
  ansprechpartner?: string;
  projekt?: string;
  ort?: string;
  zeitraum?: string;

  ziel?: string;
  hebel?: string;

  anbieterName?: string;
  anbieterAdresse?: string;
  anbieterKontakt?: string;
  anbieterUstId?: string;

  angebotsNr?: string;
  bindefrist?: string;
};

type DodChecks = Record<string, boolean>;
type Raci = Record<string, string>;

export default function BriefPage() {
  const [form, setForm] = useState<BriefForm>({});
  const [dodChecks, setDodChecks] = useState<DodChecks>({});
  const [raci, setRaci] = useState<Raci>({});
  const [msg, setMsg] = useState("");

  const searchParams = useSearchParams();
  const { lang, setLang } = useLang();
  const initLangFromUrl = useRef(false);

  // Sprache EINMALIG aus ?lang übernehmen
  useEffect(() => {
    if (initLangFromUrl.current) return;
    initLangFromUrl.current = true;

    const qp = searchParams.get("lang");
    if (qp === "de" || qp === "en") {
      setLang(qp);
    }
  }, [searchParams, setLang]);

  // Laden aus localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const parseJson = <T,>(v: string | null, fallback: T): T => {
        if (!v) return fallback;
        try {
          return JSON.parse(v) as T;
        } catch {
          return fallback;
        }
      };

      setForm(parseJson<BriefForm>(localStorage.getItem("brief.form"), {}));
      setDodChecks(
        parseJson<DodChecks>(localStorage.getItem("brief.dodChecks"), {})
      );
      setRaci(parseJson<Raci>(localStorage.getItem("brief.raci"), {}));
    } catch {
      // passt, Nutzer kann neu ausfüllen
    }
  }, []);

  // Helpers
  function updateFormField<K extends keyof BriefForm>(
    key: K,
    value: BriefForm[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof window !== "undefined") {
        localStorage.setItem("brief.form", JSON.stringify(next));
      }
      return next;
    });
  }

  function toggleDod(key: string) {
    setDodChecks((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (typeof window !== "undefined") {
        localStorage.setItem("brief.dodChecks", JSON.stringify(next));
      }
      return next;
    });
  }

  function updateRaci(key: string, value: string) {
    setRaci((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof window !== "undefined") {
        localStorage.setItem("brief.raci", JSON.stringify(next));
      }
      return next;
    });
  }

  function flashSaved() {
    setMsg(
      lang === "en"
        ? "Saved locally in this browser."
        : "Angaben lokal gespeichert."
    );
    setTimeout(() => setMsg(""), 1500);
  }

  const dodOptions =
    lang === "en"
      ? [
          "Target picture, scope and boundaries are documented and aligned.",
          "Implementation roadmap with responsibilities is defined.",
          "Major risks and assumptions are documented and assessed.",
          "Decision brief for management / steering body is prepared.",
        ]
      : [
          "Zielbild, Scope und Abgrenzung sind dokumentiert.",
          "Maßnahmen- / Umsetzungsplan mit Verantwortlichkeiten liegt vor.",
          "Wesentliche Risiken und Annahmen sind benannt und bewertet.",
          "Entscheidungsunterlage für Management / Gremium ist vorbereitet.",
        ];

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Kopf mit Sprachumschalter */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {lang === "en" ? "Project briefing" : "Projekt-Briefing"}
          </h1>
          <p className="text-sm text-gray-700">
            {lang === "en"
              ? "Your inputs here flow directly into the offer draft and PDF. Data stays local until you choose to save it to your account."
              : "Die folgenden Angaben fließen direkt in den Angebotsentwurf und das PDF. Alles bleibt lokal, bis Sie es bewusst in Ihrem Konto speichern."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <button
            type="button"
            onClick={() => setLang("de")}
            className={lang === "de" ? "font-semibold underline" : ""}
          >
            DE
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={lang === "en" ? "font-semibold underline" : ""}
          >
            EN
          </button>
        </div>
      </header>

      {/* 1. Client & project */}
      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-medium text-lg">
          {lang === "en" ? "1. Client & project" : "1. Kunde & Projekt"}
        </h2>

        <div className="space-y-2">
          <label className="text-sm block">
            {lang === "en"
              ? "Client (company / organization)"
              : "Auftraggeber (Unternehmen / Organisation)"}
          </label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={form.kunde || ""}
            onChange={(e) => updateFormField("kunde", e.target.value)}
            placeholder={
              lang === "en" ? "e.g. Example GmbH" : "z. B. Beispiel GmbH"
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm block">
              {lang === "en"
                ? "Contact person"
                : "Ansprechpartner:in beim Auftraggeber"}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.ansprechpartner || ""}
              onChange={(e) =>
                updateFormField("ansprechpartner", e.target.value)
              }
              placeholder={lang === "en" ? "Name, role" : "Name, Funktion"}
            />
          </div>
          <div>
            <label className="text-sm block">
              {lang === "en" ? "Project title" : "Projektbezeichnung"}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.projekt || ""}
              onChange={(e) => updateFormField("projekt", e.target.value)}
              placeholder={
                lang === "en"
                  ? "e.g. Implementation XY / realignment Z"
                  : "z. B. Einführung XY / Neuausrichtung Z"
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm block">
              {lang === "en" ? "Location / remote" : "Einsatzort / Remote"}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.ort || ""}
              onChange={(e) => updateFormField("ort", e.target.value)}
              placeholder={
                lang === "en"
                  ? "e.g. Munich & remote"
                  : "z. B. München & Remote"
              }
            />
          </div>
          <div>
            <label className="text-sm block">
              {lang === "en"
                ? "Desired period / start"
                : "Gewünschter Zeitraum / Start"}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.zeitraum || ""}
              onChange={(e) => updateFormField("zeitraum", e.target.value)}
              placeholder={
                lang === "en"
                  ? "e.g. Q3–Q4 / from CW 35"
                  : "z. B. Q3–Q4 / Start ab KW 35"
              }
            />
          </div>
        </div>
      </section>

      {/* 2. Outcome & key levers */}
      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-medium text-lg">
          {lang === "en"
            ? "2. Outcome & key levers"
            : "2. Ergebnisbild & wichtigste Hebel"}
        </h2>

        <div className="space-y-2">
          <label className="text-sm block">
            {lang === "en"
              ? "Outcome (what should be clear/decided/completed after 5 days?)"
              : "Ergebnis (so sieht „fertig“ aus)"}
          </label>
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            rows={3}
            value={form.ziel || ""}
            onChange={(e) => updateFormField("ziel", e.target.value)}
            placeholder={
              lang === "en"
                ? "What should be clarified, decided or documented after 5 working days?"
                : "Was soll nach 5 Werktagen klar, entschieden oder dokumentiert sein?"
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm block">
            {lang === "en" ? "Key levers" : "Wichtigste Hebel"}
          </label>
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            rows={3}
            value={form.hebel || ""}
            onChange={(e) => updateFormField("hebel", e.target.value)}
            placeholder={
              lang === "en"
                ? "What do we actually move? (e.g. lead time, quality, clarity, alignment …)"
                : "Woran drehen wir konkret? (z. B. Durchlaufzeit, Qualität, Schnittstellen, Klarheit im Team …)"
            }
          />
        </div>
      </section>

      {/* 3. Sender details */}
      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-medium text-lg">
          {lang === "en"
            ? "3. Sender details for the offer"
            : "3. Absender für das Angebot"}
        </h2>
        <p className="text-xs text-gray-600">
          {lang === "en"
            ? "These details appear in the offer PDF header. If left empty, neutral placeholders are used."
            : "Diese Angaben erscheinen im Kopf des Angebots-PDF. Wenn leer, werden neutrale Platzhalter verwendet."}
        </p>

        <div className="space-y-2">
          <label className="text-sm block">
            {lang === "en" ? "Your name / company" : "Ihr Name / Unternehmen"}
          </label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={form.anbieterName || ""}
            onChange={(e) => updateFormField("anbieterName", e.target.value)}
            placeholder={
              lang === "en"
                ? "e.g. Max Mustermann / Mustermann Consulting"
                : "z. B. Max Mustermann / Mustermann Consulting"
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm block">
            {lang === "en" ? "Address" : "Adresse"}
          </label>
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            rows={2}
            value={form.anbieterAdresse || ""}
            onChange={(e) => updateFormField("anbieterAdresse", e.target.value)}
            placeholder={
              lang === "en" ? "Street, ZIP, City" : "Straße, PLZ, Ort"
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm block">
              {lang === "en"
                ? "Contact (email / phone / web)"
                : "Kontakt (E-Mail / Telefon / Web)"}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.anbieterKontakt || ""}
              onChange={(e) =>
                updateFormField("anbieterKontakt", e.target.value)
              }
              placeholder={
                lang === "en"
                  ? "e.g. mail@..., +49..., www..."
                  : "z. B. mail@..., +49..., www..."
              }
            />
          </div>
          <div>
            <label className="text-sm block">
              {lang === "en"
                ? "VAT ID (if applicable)"
                : "USt-IdNr. (falls vorhanden)"}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.anbieterUstId || ""}
              onChange={(e) => updateFormField("anbieterUstId", e.target.value)}
              placeholder={lang === "en" ? "VAT ID" : "DE..."}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm block">
              {lang === "en"
                ? "Internal offer no. (optional)"
                : "Interne Angebots-Nr. (optional)"}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.angebotsNr || ""}
              onChange={(e) => updateFormField("angebotsNr", e.target.value)}
              placeholder={
                lang === "en" ? "Shown in the PDF" : "wird im PDF angezeigt"
              }
            />
          </div>
          <div>
            <label className="text-sm block">
              {lang === "en"
                ? "Binding period of the offer"
                : "Bindefrist des Angebots"}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.bindefrist || ""}
              onChange={(e) => updateFormField("bindefrist", e.target.value)}
              placeholder={
                lang === "en" ? "e.g. 30.09.2025" : "z. B. 30.09.2025"
              }
            />
          </div>
        </div>
      </section>

      {/* 4. Definition of Done */}
      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="text-lg font-medium">
          {lang === "en"
            ? "4. Definition of Done (selection)"
            : "4. Definition of Done (Auszug)"}
        </h2>
        <p className="text-xs text-gray-600">
          {lang === "en"
            ? "Select what we use as shared orientation for a good result. These points appear in the offer. Billing is based on agreed and delivered services, not on internal approval of criteria."
            : "Wählen Sie, woran wir ein fachlich sauberes Ergebnis messen. Diese Punkte erscheinen im Angebot. Die Vergütung richtet sich nach den vereinbarten und erbrachten Leistungen, nicht nach der formalen Freigabe einzelner Punkte."}
        </p>

        {dodOptions.map((label) => (
          <label key={label} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!dodChecks[label]}
              onChange={() => toggleDod(label)}
            />
            <span>{label}</span>
          </label>
        ))}
      </section>

      {/* 5. Rollen (Mini-RACI) */}
      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="text-lg font-medium">
          {lang === "en" ? "5. Roles (mini RACI)" : "5. Rollen (Mini-RACI)"}
        </h2>
        <p className="text-xs text-gray-600">
          {lang === "en"
            ? "Optional: Short overview of who owns what. It will be shown in the offer."
            : "Optional: Wer ist verantwortlich, wer entscheidet, wer wird eingebunden? Kurzfassung reicht – sie landet als Übersicht im Angebot."}
        </p>

        <div className="space-y-2">
          <label className="text-sm block">
            {lang === "en"
              ? "Owner (accountable for result)"
              : "Owner (verantwortlich für Ergebnis)"}
          </label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={raci.Owner || ""}
            onChange={(e) => updateRaci("Owner", e.target.value)}
            placeholder={lang === "en" ? "Name / role" : "Name / Rolle"}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm block">
            {lang === "en"
              ? "Approver (final decision)"
              : "Approver (entscheidet final)"}
          </label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={raci.Approver || ""}
            onChange={(e) => updateRaci("Approver", e.target.value)}
            placeholder={lang === "en" ? "Name / role" : "Name / Rolle"}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm block">
            {lang === "en"
              ? "Helper (active contributors)"
              : "Helper (arbeitet aktiv mit)"}
          </label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={raci.Helper || ""}
            onChange={(e) => updateRaci("Helper", e.target.value)}
            placeholder={
              lang === "en"
                ? "Names / roles, comma-separated"
                : "Namen / Rollen, kommasepariert"
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm block">
            {lang === "en"
              ? "Consulted (must be heard)"
              : "Consulted (muss gehört werden)"}
          </label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={raci.Consulted || ""}
            onChange={(e) => updateRaci("Consulted", e.target.value)}
            placeholder={
              lang === "en" ? "Names / functions" : "Namen / Funktionen"
            }
          />
        </div>
      </section>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="border rounded-lg px-3 py-1.5"
            onClick={flashSaved}
          >
            {lang === "en" ? "Save locally" : "Angaben speichern"}
          </button>
          {msg && <span>{msg}</span>}
        </div>
        <Link
          href={`/offer?lang=${lang}`}
          className="rounded-lg border px-3 py-1.5 text-xs font-medium"
        >
          {lang === "en"
            ? "Continue to offer draft"
            : "Weiter zum Angebotsentwurf"}
        </Link>
      </div>
    </main>
  );
}
