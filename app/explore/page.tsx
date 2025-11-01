"use client";
import { useState, useEffect } from "react";
const CATALOG = [
  {
    id: "interim",
    title: "Interim Manager (Operations)",
    blurb:
      "Zeitlich befristete Führungs- & Umsetzungsrolle mit Ergebnisverantwortung.",
  },
  {
    id: "consult",
    title: "Beratung (Diagnose → Umsetzung)",
    blurb: "Hypothesenbasierte Analyse, Roadmap, Co-Delivery mit dem Team.",
  },
  {
    id: "coach",
    title: "Sparring/Coaching (Lead, Team)",
    blurb: "Reflexion, Entscheidungsstütze, Klarheit in komplexen Lagen.",
  },
  {
    id: "process",
    title: "Prozess & Qualität",
    blurb:
      "Durchlaufzeiten, Engpässe, OEE, Abweichungen – sichtbar & steuerbar.",
  },
];

export default function Explore() {
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("brief.selected") || "[]");
    setSelected(s);
  }, []);
  function toggle(id: string) {
    const s = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(s);
    localStorage.setItem("brief.selected", JSON.stringify(s));
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Was passt zu Ihrem Anliegen?</h1>
        <p className="text-sm text-gray-600">
          Klicken Sie Rollen an. Sie können später alles umformulieren.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {CATALOG.map((r) => (
          <div
            key={r.id}
            className={`border rounded-xl p-4 ${
              selected.includes(r.id) ? "bg-gray-50 border-black" : "bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{r.title}</div>
                <p className="text-sm text-gray-700 mt-1">{r.blurb}</p>
              </div>
              <button
                onClick={() => toggle(r.id)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                {selected.includes(r.id) ? "Entfernen" : "Zum Brief hinzufügen"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <a href="/brief" className="rounded-lg bg-black text-white px-4 py-2">
          Weiter: Brief erstellen
        </a>
      </div>
    </main>
  );
}
