"use client";

import { useState } from "react";

export default function UnderConstruction() {
  // Nur einfache UI-Visibility pro Seitenaufruf / Tab.
  // Kein localStorage → Banner ist überall zuverlässig sichtbar.
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="sticky top-0 z-50 w-full border-b-2 border-amber-300 bg-amber-50 shadow-sm">
      <div className="mx-auto flex max-w-5xl items-start gap-4 px-4 py-3">
        <span className="mt-0.5 text-2xl">🚧</span>
        <div className="text-amber-900">
          <p className="text-lg font-extrabold tracking-tight">
            Under Construction
          </p>
          <p className="mt-0.5 text-sm leading-6">
            Dieses Client-Portal befindet sich im Aufbau (Alpha). Funktionen
            kommen laufend dazu. Für eine kurze Demo:{" "}
            <a
              href="mailto:karsten.zenk@gmail.com"
              className="underline underline-offset-4"
            >
              Demo anfragen
            </a>{" "}
            oder{" "}
            <a href="/portal" className="underline underline-offset-4">
              Status ansehen
            </a>
            .
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Hinweis schließen"
          className="ml-auto rounded-md border border-amber-300 px-2 py-1 text-amber-900/80 hover:bg-amber-100"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
