"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../lang/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

type BriefForm = {
  company?: string;
  contact?: string;
  projectTitle?: string;
  location?: string;
  period?: string;
  outcome?: string;
  levers?: string;
  senderName?: string;
  senderAddress?: string;
  senderContact?: string;
  senderVatId?: string;
  offerNumber?: string;
  offerValidUntil?: string;
};

type DodChecks = Record<string, boolean>;

type Raci = {
  owner?: string;
  approver?: string;
  helper?: string;
  consulted?: string;
};

const DOD_KEYS = [
  "zielbild",
  "umsetzungsplan",
  "risiken",
  "entscheidungsvorlage",
];

export default function BriefPage() {
  const { lang } = useLanguage();

  const [form, setForm] = useState<BriefForm>({});
  const [dodChecks, setDodChecks] = useState<DodChecks>({});
  const [raci, setRaci] = useState<Raci>({});
  const [savedHint, setSavedHint] = useState<string>("");

  // Initial aus localStorage laden
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const f = JSON.parse(
        localStorage.getItem("brief.form") || "{}"
      ) as BriefForm;
      const d = JSON.parse(
        localStorage.getItem("brief.dodChecks") || "{}"
      ) as DodChecks;
      const r = JSON.parse(localStorage.getItem("brief.raci") || "{}") as Raci;

      setForm(f || {});
      setDodChecks(d || {});
      setRaci(r || {});
    } catch {
      // ignore parse errors
    }
  }, []);

  // Helper: speichern + kleines Feedback
  function persistForm(next: BriefForm) {
    setForm(next);
    try {
      localStorage.setItem("brief.form", JSON.stringify(next));
    } catch {}
    pingSaved();
  }

  function persistDod(next: DodChecks) {
    setDodChecks(next);
    try {
      localStorage.setItem("brief.dodChecks", JSON.stringify(next));
    } catch {}
    pingSaved();
  }

  function persistRaci(next: Raci) {
    setRaci(next);
    try {
      localStorage.setItem("brief.raci", JSON.stringify(next));
    } catch {}
    pingSaved();
  }

  function pingSaved() {
    setSavedHint(
      lang === "de" ? "Angaben lokal gespeichert." : "Details saved locally."
    );
    setTimeout(() => setSavedHint(""), 1500);
  }

  const t =
    lang === "de"
      ? {
          title: "Projekt-Briefing",
          intro:
            "Die folgenden Angaben fließen direkt in den Angebotsentwurf auf /offer ein (inkl. PDF). Alles wird nur lokal gespeichert, bis Sie sich entscheiden, es in Ihrem Konto abzulegen.",
          sec1: "1. Kunde & Projekt",
          company: "Auftraggeber (Unternehmen / Organisation)",
          contact: "Ansprechpartner:in beim Auftraggeber",
          projectTitle: "Projektbezeichnung",
          location: "Einsatzort / Remote",
          period: "Gewünschter Zeitraum / Start",
          sec2: "2. Ergebnisbild & wichtigste Hebel",
          outcomeLabel: "Ergebnis (so sieht „fertig“ aus – nach 5 Werktagen)",
          leversLabel: "Wichtigste Hebel / Fokusthemen",
          sec3: "3. Absender für das Angebot",
          senderHint:
            "Diese Angaben erscheinen im Kopf des Angebots-PDF. Wenn leer, werden Platzhalter verwendet.",
          senderName: "Ihr Name / Unternehmen",
          senderAddress: "Adresse",
          senderContact: "Kontakt (E-Mail / Telefon / Web)",
          senderVatId: "USt-IdNr. (falls vorhanden)",
          offerNumber: "Interne Angebots-Nr. (optional)",
          offerValidUntil: "Bindefrist des Angebots",
          sec4: "4. Definition of Done (Auszug)",
          dodIntro:
            "Wählen Sie, woran wir gemeinsam messen, ob die fünf Tage erfolgreich waren. Diese Punkte erscheinen im Angebot. Abgerechnet werden die vereinbarten und erbrachten Leistungen.",
          dodItems: [
            "Zielbild, Scope und Abgrenzung sind dokumentiert und abgestimmt.",
            "Maßnahmen- / Umsetzungsplan mit Verantwortlichkeiten liegt vor.",
            "Wesentliche Risiken und Annahmen sind benannt und bewertet.",
            "Entscheidungsunterlage für Management / Gremium ist vorbereitet.",
          ],
          sec5: "5. Rollen (Mini-RACI)",
          raciIntro:
            "Optional: Wer ist verantwortlich, wer entscheidet, wer wird eingebunden? Kurzfassung reicht – sie erscheint als Übersicht im Angebot.",
          owner: "Owner (verantwortlich für Ergebnis)",
          approver: "Approver (entscheidet final)",
          helper: "Helper (arbeitet aktiv mit)",
          consulted: "Consulted (muss gehört werden)",
          back: "Zurück: Rollen wählen",
          next: "Weiter: Angebots-Entwurf",
          save: "Angaben speichern",
        }
      : {
          title: "Project briefing",
          intro:
            "Your inputs here flow directly into the offer draft and PDF. Data stays local until you decide to save it to your account.",
          sec1: "1. Client & project",
          company: "Client (company / organization)",
          contact: "Contact person",
          projectTitle: "Project title",
          location: "Location / remote",
          period: "Desired period / start",
          sec2: "2. Outcome & key levers",
          outcomeLabel:
            "Outcome (what should be clear/decided/completed after 5 days?)",
          leversLabel: "Key levers / focus topics",
          sec3: "3. Sender details for the offer",
          senderHint:
            "These details appear in the offer PDF header. If left empty, neutral placeholders are used.",
          senderName: "Your name / company",
          senderAddress: "Address",
          senderContact: "Contact (email / phone / web)",
          senderVatId: "VAT ID (if applicable)",
          offerNumber: "Internal offer no. (optional)",
          offerValidUntil: "Binding period of the offer",
          sec4: "4. Definition of Done (selection)",
          dodIntro:
            "Select what we use as shared orientation for a good result. These points appear in the offer. Billing is based on agreed and delivered services, not internal approval of criteria.",
          dodItems: [
            "Target picture, scope and boundaries are documented and aligned.",
            "Implementation roadmap with responsibilities is defined.",
            "Major risks and assumptions are documented and assessed.",
            "Decision brief for management / steering body is prepared.",
          ],
          sec5: "5. Roles (mini-RACI)",
          raciIntro:
            "Optional: Who owns the outcome, who decides, who helps, who must be consulted? Short version is enough – it appears as overview in the offer.",
          owner: "Owner (accountable for outcome)",
          approver: "Approver (final decision)",
          helper: "Helper (actively involved)",
          consulted: "Consulted (must be heard)",
          back: "Back: Choose roles",
          next: "Next: Offer draft",
          save: "Save briefing",
        };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          <p className="text-sm text-gray-600">{t.intro}</p>
        </div>
        <LanguageSwitcher />
      </header>

      {/* 1. Client & project */}
      <section className="rounded-2xl border p-5 space-y-4">
        <h2 className="font-semibold">{t.sec1}</h2>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t.company}
          </label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={form.company || ""}
            onChange={(e) => persistForm({ ...form, company: e.target.value })}
            placeholder={
              lang === "de" ? "z. B. Beispiel GmbH" : "e.g. Example GmbH"
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t.contact}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.contact || ""}
              onChange={(e) =>
                persistForm({ ...form, contact: e.target.value })
              }
              placeholder={
                lang === "de" ? "Name, Funktion" : "Name, role / position"
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t.projectTitle}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.projectTitle || ""}
              onChange={(e) =>
                persistForm({
                  ...form,
                  projectTitle: e.target.value,
                })
              }
              placeholder={
                lang === "de"
                  ? "z. B. Einführung XY / Neuausrichtung Z"
                  : "e.g. Implementation XY / realignment Z"
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t.location}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.location || ""}
              onChange={(e) =>
                persistForm({ ...form, location: e.target.value })
              }
              placeholder={
                lang === "de"
                  ? "z. B. München & Remote"
                  : "e.g. Munich & remote"
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t.period}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.period || ""}
              onChange={(e) => persistForm({ ...form, period: e.target.value })}
              placeholder={
                lang === "de"
                  ? "z. B. Q3–Q4 / Start ab KW 35"
                  : "e.g. Q3–Q4 / from CW 35"
              }
            />
          </div>
        </div>
      </section>

      {/* 2. Outcome & key levers */}
      <section className="rounded-2xl border p-5 space-y-3">
        <h2 className="font-semibold">{t.sec2}</h2>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t.outcomeLabel}
          </label>
          <textarea
            className="w-full border rounded-lg p-2 text-sm min-h-[96px]"
            value={form.outcome || ""}
            onChange={(e) => persistForm({ ...form, outcome: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t.leversLabel}
          </label>
          <textarea
            className="w-full border rounded-lg p-2 text-sm min-h-[72px]"
            value={form.levers || ""}
            onChange={(e) => persistForm({ ...form, levers: e.target.value })}
          />
        </div>
      </section>

      {/* 3. Sender */}
      <section className="rounded-2xl border p-5 space-y-3">
        <h2 className="font-semibold">{t.sec3}</h2>
        <p className="text-xs text-gray-500">{t.senderHint}</p>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t.senderName}
          </label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={form.senderName || ""}
            onChange={(e) =>
              persistForm({
                ...form,
                senderName: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t.senderAddress}
          </label>
          <textarea
            className="w-full border rounded-lg p-2 text-sm min-h-[60px]"
            value={form.senderAddress || ""}
            onChange={(e) =>
              persistForm({
                ...form,
                senderAddress: e.target.value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t.senderContact}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.senderContact || ""}
              onChange={(e) =>
                persistForm({
                  ...form,
                  senderContact: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t.senderVatId}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.senderVatId || ""}
              onChange={(e) =>
                persistForm({
                  ...form,
                  senderVatId: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t.offerNumber}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.offerNumber || ""}
              onChange={(e) =>
                persistForm({
                  ...form,
                  offerNumber: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t.offerValidUntil}
            </label>
            <input
              className="w-full border rounded-lg p-2 text-sm"
              value={form.offerValidUntil || ""}
              onChange={(e) =>
                persistForm({
                  ...form,
                  offerValidUntil: e.target.value,
                })
              }
            />
          </div>
        </div>
      </section>

      {/* 4. Definition of Done */}
      <section className="rounded-2xl border p-5 space-y-3">
        <h2 className="font-semibold">{t.sec4}</h2>
        <p className="text-xs text-gray-500">{t.dodIntro}</p>

        {t.dodItems.map((label, idx) => {
          const key = DOD_KEYS[idx];
          const checked = !!dodChecks[key];
          return (
            <label
              key={key}
              className="flex items-start gap-2 text-sm text-gray-800"
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={checked}
                onChange={(e) =>
                  persistDod({
                    ...dodChecks,
                    [key]: e.target.checked,
                  })
                }
              />
              <span>{label}</span>
            </label>
          );
        })}
      </section>

      {/* 5. Rollen (Mini-RACI) */}
      <section className="rounded-2xl border p-5 space-y-3">
        <h2 className="font-semibold">{t.sec5}</h2>
        <p className="text-xs text-gray-500">{t.raciIntro}</p>

        <div>
          <label className="block text-xs text-gray-600 mb-1">{t.owner}</label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={raci.owner || ""}
            onChange={(e) => persistRaci({ ...raci, owner: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t.approver}
          </label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={raci.approver || ""}
            onChange={(e) => persistRaci({ ...raci, approver: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">{t.helper}</label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={raci.helper || ""}
            onChange={(e) => persistRaci({ ...raci, helper: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t.consulted}
          </label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={raci.consulted || ""}
            onChange={(e) =>
              persistRaci({ ...raci, consulted: e.target.value })
            }
          />
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href={`/explore?lang=${lang}`}
            className="text-sm text-gray-700 underline underline-offset-4"
          >
            {t.back}
          </Link>
          {savedHint && (
            <span className="text-xs text-emerald-600">{savedHint}</span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={pingSaved}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            {t.save}
          </button>
          <Link
            href={`/offer?lang=${lang}`}
            className="rounded-lg bg-black text-white px-4 py-2 text-sm"
          >
            {t.next}
          </Link>
        </div>
      </section>
    </main>
  );
}
