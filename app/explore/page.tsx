// app/explore/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage, type Lang } from "../lang/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { ProcessBar } from "../components/ProcessBar";

type CardId = "sys" | "ops" | "res" | "coach";

type Card = {
  id: CardId;
  rank: string;
  suit: string;
};

const CARDS: Card[] = [
  { id: "sys", rank: "Bube", suit: "♣" },
  { id: "ops", rank: "Dame", suit: "♦" },
  { id: "res", rank: "König", suit: "♦" },
  { id: "coach", rank: "Ass", suit: "♠" },
];

const CARD_HEIGHT = "h-[460px]";
const CARD_BASE = `relative border rounded-xl bg-white w-full ${CARD_HEIGHT} overflow-hidden flex flex-col pt-10 p-5`;
const BADGE =
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-gray-700 bg-white/90";

const TEXT: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    buttonAdd: string;
    buttonRemove: string;
    next: string;
    cards: Record<CardId, { title: string; blurb: string }>;
    ranks: Record<CardId, string>;
  }
> = {
  de: {
    title: "Architektur-Konfiguration: Wählen Sie das Wirkprofil für Ihr System",
    subtitle:
      "Wählen Sie 1\u20132 strategische Hebel aus, die Ihre aktuelle Unternehmung benötigt. Im nächsten Schritt präzisieren wir gemeinsam das operative Briefing.",
    buttonAdd: "Zum Brief hinzufügen",
    buttonRemove: "Entfernen",
    next: "Konfiguration bestätigen: Zum Projekt-Briefing \u2794",
    ranks: {
      sys: "Bube",
      ops: "Dame",
      res: "König",
      coach: "Ass",
    },
    cards: {
      sys: {
        title: "Interim Management & Krisen-Governance",
        blurb:
          "Stabilisierung von Projekten in Schieflage. Reduktion administrativer Kosten, Auflösung von Schnittstellen-Blockaden und Steuerung komplexer Portfolios nach bewährten Standards \u2013 Strategisch, Taktisch, Operational.",
      },
      ops: {
        title: "V-OS System-Integration (Hardware-Software-Symbiose)",
        blurb:
          "Implementierung eines Value Operating Systems. Verankerung von PnG Governance Hubs als Single Source of Truth, methoden-agnostische Synchronisation (V-Modell meets Agile) und RAG-gestützte Compliance zur Verkürzung von Freigabezeiten.",
      },
      res: {
        title: "Strategische Resonanz-Steuerung & Mitbestimmungs-Konsens",
        blurb:
          "Risikominimierung bei tiefgreifenden Transformationen (z. B. KI-Einführungen). Framing von Veränderungen als Datensignale, um empfindliche mitbestimmte Gremien (Betriebsräte) und C-Level-Stakeholder synchron und konfliktfrei auszurichten.",
      },
      coach: {
        title: "Executive Sparring & Systemisches Coaching",
        blurb:
          "Strategischer Resonanzraum für Vorstände, Geschäftsführer, COOs und Projekt-Verantwortliche, etc. Reflexion von Systemblockaden zur schnellen Wiederherstellung der eigenen unternehmerischen Handlungsfähigkeit.",
      },
    },
  },
  en: {
    title: "Architecture Configuration: Define your system’s impact profile",
    subtitle:
      "Select 1–2 strategic levers your enterprise currently requires. In the next step, we will co-create the operational briefing.",
    buttonAdd: "Add to brief",
    buttonRemove: "Remove",
    next: "Confirm Configuration: Proceed to Project Briefing ➔",
    ranks: {
      sys: "Jack",
      ops: "Queen",
      res: "King",
      coach: "Ace",
    },
    cards: {
      sys: {
        title: "Interim Management & Crisis Governance",
        blurb:
          "Stabilizing projects in distress. Reducing administrative overhead, resolving interface blockages, and steering complex portfolios based on recognized standards – strategic, tactical, operational.",
      },
      ops: {
        title: "V-OS System Integration (Hardware-Software Symbiosis)",
        blurb:
          "Deployment of a Value Operating System. Anchoring a PnG Governance Hub as a Single Source of Truth, method-agnostic synchronization (V-Model meets Agile), and RAG-driven compliance to economically cut approval lead times.",
      },
      res: {
        title: "Strategic Resonance Management & Stakeholder Alignment",
        blurb:
          "Risk mitigation during deep structural transformations (e.g., AI integration). Framing change as data signals to align sensitive co-determined committees (works councils) and C-level stakeholders synchronously and without friction.",
      },
      coach: {
        title: "Executive Sparring & Systemic Coaching",
        blurb:
          "Strategic resonance chamber for board members, managing directors, COOs, and project owners etc. Reflection on systemic blockages to swiftly restore entrepreneurial agility.",
      },
    },
  },
};

export default function ExplorePage() {
  const { lang } = useLanguage();
  const t = TEXT[lang];

  const [selected, setSelected] = useState<CardId[]>([]);

  useEffect(() => {
    try {
      const s = JSON.parse(
        localStorage.getItem("brief.selected") || "[]"
      ) as CardId[];
      setSelected(s || []);
    } catch {
      // ignore
    }
  }, []);

  function toggle(id: CardId) {
    const s = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(s);
    localStorage.setItem("brief.selected", JSON.stringify(s));
  }

  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header mit Language Switch */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{t.title}</h1>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
          <LanguageSwitcher />
        </header>

        {/* Prozessanzeige: Schritt 1 (Explore) */}
        <ProcessBar current="explore" />

        {/* Karten-Auswahl */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARDS.map((c) => {
            const active = selected.includes(c.id);
            const cardText = t.cards[c.id];

            return (
              <div
                key={c.id}
                className={`${CARD_BASE} ${
                  active ? "border-black bg-gray-50" : "border-gray-200"
                }`}
              >
                {/* Badge oben rechts */}
                <div className="absolute right-3 top-3">
                  <span className={BADGE}>
                    <span className="font-medium">{t.ranks[c.id]}</span>
                    <span aria-hidden="true">{c.suit}</span>
                  </span>
                </div>

                {/* Inhalt */}
                <div className="flex-1 min-w-0 overflow-y-auto pr-1">
                  <h3 className="font-semibold text-lg leading-snug">
                    {cardText.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-700">{cardText.blurb}</p>
                </div>

                {/* Button */}
                <div className="pt-4">
                  <button
                    onClick={() => toggle(c.id)}
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100 w-full text-center"
                  >
                    {active ? t.buttonRemove : t.buttonAdd}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weiter-Button */}
        <div className="flex justify-end">
          <Link
            href={`/brief?lang=${lang}`}
            className="rounded-lg bg-black text-white px-4 py-2 text-sm"
          >
            {t.next}
          </Link>
        </div>
      </div>
    </main>
  );
}
