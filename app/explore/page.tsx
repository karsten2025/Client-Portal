"use client";

import { useEffect, useState } from "react";

type Card = {
  id: string;
  title: string;
  blurb: string;
  rank?: string; // Bube | Dame | König | Ass
  suit?: string; // ♣ ♦ ♥ ♠
};

const CARDS: Card[] = [
  {
    id: "sys",
    title: "Ganzheitliche Erfolgssteuerung",
    blurb:
      "Ich orchestriere Ihre Initiativen auf allen Ebenen – Produkt, Portfolio, Programm und Projekt. Mit dem methodisch besten Ansatz (prädiktiv, hybrid, agil) stelle ich sicher, dass Ihre Investitionen die definierte Strategie treffen und den maximalen Wert erzeugen.",
    rank: "Bube",
    suit: "♣",
  },
  {
    id: "ops",
    title: "Betriebssystem Performer",
    blurb:
      "Prozesse, Systeme und Teams richten wir auf messbare Performance, Effizienz und Skalierbarkeit aus – ergebnisorientiert.",
    rank: "Dame",
    suit: "♦",
  },
  {
    id: "res",
    title: "Strategische Resonanz-Steuerung",
    blurb:
      "Ich navigiere anspruchsvolle Stakeholder-Landschaften, übersetze Erwartungen und stelle sicher, dass Botschaften die richtigen Empfänger erreichen.",
    rank: "König",
    suit: "♦",
  },
  {
    id: "coach",
    title: "Sparring/Coaching (Lead, Team)",
    blurb:
      "Reflexion, Entscheidungsstütze, Klarheit in komplexen Lagen – souveräne, wirksame Entscheidungen.",
    rank: "Ass",
    suit: "♠",
  },
];

// Einheitshöhe für alle Karten (bei Bedarf anpassen)
const CARD_HEIGHT = "h-[460px]";
const CARD_BASE = `relative border rounded-xl bg-white w-full ${CARD_HEIGHT} overflow-hidden flex flex-col pt-10 p-5`; // <- pt-10: Platz fürs Badge oben
const BADGE =
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-gray-700 bg-white/90";

export default function Explore() {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("brief.selected") || "[]");
      setSelected(s);
    } catch {}
  }, []);

  function toggle(id: string) {
    const s = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(s);
    localStorage.setItem("brief.selected", JSON.stringify(s));
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Was passt zu Ihrem Anliegen?</h1>
        <p className="text-sm text-gray-600">
          Klicken Sie Rollen an. Sie können später alles umformulieren.
        </p>
      </header>

      {/* 1 Spalte mobil, 2 ab md, 4 ab lg */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map((c) => {
          const active = selected.includes(c.id);

          // Für die eine Karte (sys) KEIN Clamp → vollständiger Text; sonst Clamp
          const clamped =
            c.id !== "sys"
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: 6, // bei Bedarf anpassen
                  WebkitBoxOrient: "vertical" as const,
                  overflow: "hidden",
                }
              : undefined;

          return (
            <div
              key={c.id}
              className={`${CARD_BASE} ${
                active ? "border-black bg-gray-50" : "border-gray-200"
              }`}
            >
              {/* Rang/Badge oben rechts */}
              {(c.rank || c.suit) && (
                <div className="absolute right-3 top-3">
                  <span className={BADGE}>
                    {c.rank && <span className="font-medium">{c.rank}</span>}
                    {c.suit && <span aria-hidden="true">{c.suit}</span>}
                  </span>
                </div>
              )}

              {/* Inhalt füllt die Karte; Textbereich kann bei Bedarf scrollen */}
              <div
                className="flex-1 min-w-0 overflow-y-auto pr-1"
                style={{ scrollbarGutter: "stable" as any }}
              >
                <h3 className="font-semibold text-lg leading-snug">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm text-gray-700" style={clamped}>
                  {c.blurb}
                </p>
              </div>

              {/* Button fix unten */}
              <div className="pt-4">
                <button
                  onClick={() => toggle(c.id)}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
                >
                  {active ? "Entfernen" : "Zum Brief hinzufügen"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <a href="/brief" className="rounded-lg bg-black text-white px-4 py-2">
          Weiter: Brief erstellen
        </a>
      </div>
    </main>
  );
}
