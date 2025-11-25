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
        title:
          "Interim Management & Produkt, Projekt, Programm & Portfolio-Steuerung",
        blurb:
          "Ich bringe Ihre kritischen Initiativen auf Kurs. Als Interim-Manager übernehme ich temporär die operative Steuerung Ihrer Projekte oder Portfolios, schließe Vakanzen und sorge dafür, dass Ergebnisse pünktlich geliefert werden – ohne Reibungsverluste.",
      },
      ops: {
        title: "Betriebssystem Performer",
        blurb:
          "Ich richte Ihre Prozesse und Systeme auf Skalierbarkeit aus. Ich analysiere Ihre Wertschöpfungsketten und transformiere starre Abläufe in ein leistungsfähiges „Betriebssystem“, das Ihre Teams entlastet und messbare Effizienz schafft.",
      },
      res: {
        title: "Strategische Resonanz-Steuerung",
        blurb:
          "Ich navigiere Sie durch anspruchsvolle Stakeholder-Landschaften. Ich übersetze Erwartungen zwischen Fachebene und Management, löse politische Blockaden auf und sorge dafür, dass Ihre Botschaften bei den richtigen Entscheidern ankommen.",
      },
      coach: {
        title: "Sparring / Coaching (Lead, Team)",
        blurb:
          "Ich stehe Ihnen als „Thinking Partner“ zur Seite. In komplexen Lagen sorge ich durch strukturiertes Sparring für Klarheit, befähige Ihre Schlüsselspieler methodisch und helfe Ihnen, tragfähige Entscheidungen zu treffen.",
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
        title:
          "Interim Management & Product, Project, Program & Portfolio Management",
        blurb:
          "I get your critical initiatives on track. As an interim manager, I temporarily assume operational control of your projects or portfolios, bridge vacancies, and ensure results are delivered on time—without friction.",
      },
      ops: {
        title: "Operating system performance",
        blurb:
          "I align your processes and systems for scalability. I analyze your value chains and transform rigid workflows into a high-performance operating system that relieves your teams and creates measurable efficiency.",
      },
      res: {
        title: "Strategic resonance steering",
        blurb:
          "I navigate you through demanding stakeholder landscapes. I translate expectations between technical teams and management, resolve political blockades, and ensure your messages land with the right decision-makers.",
      },
      coach: {
        title: "Sparring / Coaching (leadership & teams)",
        blurb:
          "I stand by your side as a Thinking Partner In complex situations, I ensure clarity through structured sparring, methodically empower your key players, and help you make viable decisions.",
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
