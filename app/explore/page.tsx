"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage, type Lang } from "../lang/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

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
    title: "Was passt zu Ihrem Anliegen?",
    subtitle:
      "Wählen Sie 1–2 Rollen. Formulierungen können Sie später im Brief anpassen.",
    buttonAdd: "Zum Brief hinzufügen",
    buttonRemove: "Entfernen",
    next: "Weiter: Brief erstellen",
    ranks: {
      sys: "Bube",
      ops: "Dame",
      res: "König",
      coach: "Ass",
    },
    cards: {
      sys: {
        title: "Ganzheitliche Erfolgssteuerung",
        blurb:
          "Ich orchestriere Ihre Initiativen über Produkt, Portfolio, Programm und Projekt, mit dem passenden Vorgehen (prädiktiv, hybrid, agil). Ziel: Investitionen zahlen klar auf Strategie und Wert ein.",
      },
      ops: {
        title: "Betriebssystem Performer",
        blurb:
          "Wir richten Prozesse, Systeme und Teams auf messbare Performance, Effizienz und Skalierbarkeit aus – ergebnisorientiert.",
      },
      res: {
        title: "Strategische Resonanz-Steuerung",
        blurb:
          "Ich navigiere anspruchsvolle Stakeholder-Landschaften, übersetze Erwartungen und sorge dafür, dass Botschaften die richtigen Empfänger erreichen.",
      },
      coach: {
        title: "Sparring / Coaching (Lead, Team)",
        blurb:
          "Strukturiertes Sparring in komplexen Lagen: Klarheit, Entscheidungen, Handlungsfähigkeit.",
      },
    },
  },
  en: {
    title: "What fits your challenge?",
    subtitle:
      "Select 1–2 roles. You can adjust the wording later in the briefing.",
    buttonAdd: "Add to brief",
    buttonRemove: "Remove",
    next: "Next: Create briefing",
    ranks: {
      sys: "Jack",
      ops: "Queen",
      res: "King",
      coach: "Ace",
    },
    cards: {
      sys: {
        title: "Holistic delivery steering",
        blurb:
          "I orchestrate initiatives across product, portfolio, program and projects using the most effective delivery mode. Investments align with strategy and measurable value.",
      },
      ops: {
        title: "Operating system performance",
        blurb:
          "We design processes, systems and teams for measurable performance, efficiency and scalability.",
      },
      res: {
        title: "Strategic resonance steering",
        blurb:
          "I navigate demanding stakeholder landscapes and ensure your messages reach the right people in the right tone.",
      },
      coach: {
        title: "Sparring / Coaching (leadership & teams)",
        blurb:
          "Structured reflection and decision support in complex situations for clear, confident action.",
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
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          <p className="text-sm text-gray-600">{t.subtitle}</p>
        </div>
        <LanguageSwitcher />
      </header>

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
              <div className="absolute right-3 top-3">
                <span className={BADGE}>
                  <span className="font-medium">{t.ranks[c.id]}</span>
                  <span aria-hidden="true">{c.suit}</span>
                </span>
              </div>

              <div className="flex-1 min-w-0 overflow-y-auto pr-1">
                <h3 className="font-semibold text-lg leading-snug">
                  {cardText.title}
                </h3>
                <p className="mt-3 text-sm text-gray-700">{cardText.blurb}</p>
              </div>

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

      <div className="flex justify-end">
        <Link
          href={`/brief?lang=${lang}`}
          className="rounded-lg bg-black text-white px-4 py-2 text-sm"
        >
          {t.next}
        </Link>
      </div>
    </main>
  );
}
