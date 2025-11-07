"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "../LanguageProvider";
import type { Lang } from "../lib/i18n";

type CardBase = {
  id: "sys" | "ops" | "res" | "coach";
  rankKey: "jack" | "queen" | "king" | "ace";
  suit?: string;
};

type CardText = { title: string; blurb: string };

const BASE_CARDS: CardBase[] = [
  { id: "sys", rankKey: "jack", suit: "♣" },
  { id: "ops", rankKey: "queen", suit: "♦" },
  { id: "res", rankKey: "king", suit: "♦" },
  { id: "coach", rankKey: "ace", suit: "♠" },
];

const RANK_LABELS: Record<Lang, Record<CardBase["rankKey"], string>> = {
  de: { jack: "Bube", queen: "Dame", king: "König", ace: "Ass" },
  en: { jack: "Jack", queen: "Queen", king: "King", ace: "Ace" },
};

const CARD_TEXT: Record<Lang, Record<CardBase["id"], CardText>> = {
  de: {
    sys: {
      title: "Ganzheitliche Erfolgssteuerung",
      blurb:
        "Ich orchestriere Ihre Initiativen auf allen Ebenen – Produkt, Portfolio, Programm und Projekt. Mit dem methodisch passenden Ansatz stelle ich sicher, dass Investitionen Strategie und Wertbeitrag treffen.",
    },
    ops: {
      title: "Betriebssystem Performer",
      blurb:
        "Prozesse, Systeme und Teams richten wir auf messbare Performance, Effizienz und Skalierbarkeit aus – mit klaren Verantwortlichkeiten.",
    },
    res: {
      title: "Strategische Resonanz-Steuerung",
      blurb:
        "Ich navigiere anspruchsvolle Stakeholder-Landschaften und sorge dafür, dass Botschaften bei den richtigen Empfängern ankommen.",
    },
    coach: {
      title: "Sparring/Coaching (Lead, Team)",
      blurb:
        "Reflexion und Entscheidungsunterstützung in komplexen Lagen – für souveräne, wirksame Entscheidungen.",
    },
  },
  en: {
    sys: {
      title: "Holistic delivery steering",
      blurb:
        "I orchestrate your initiatives across product, portfolio, program and projects so investments align with strategy and value.",
    },
    ops: {
      title: "Operating system performance",
      blurb:
        "We shape processes, systems and teams for measurable performance, efficiency and scalability, with clear ownership.",
    },
    res: {
      title: "Strategic resonance steering",
      blurb:
        "I navigate complex stakeholder landscapes so messages land with the right people – focused and effective.",
    },
    coach: {
      title: "Sparring / Coaching (leadership & teams)",
      blurb:
        "Structured reflection and decision support in complex situations – so leaders and teams act with clarity.",
    },
  },
};

const CARD_HEIGHT = "h-[460px]";
const CARD_BASE = `relative border rounded-xl bg-white w-full ${CARD_HEIGHT} overflow-hidden flex flex-col pt-10 p-5`;
const BADGE =
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-gray-700 bg-white/90";

export default function Explore() {
  const [selected, setSelected] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const { lang, setLang, t } = useLang();
  const initLangFromUrl = useRef(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("brief.selected") || "[]");
      setSelected(Array.isArray(s) ? s : []);
    } catch {}
  }, []);

  // Sprache nur einmal aus URL ziehen
  useEffect(() => {
    if (initLangFromUrl.current) return;
    initLangFromUrl.current = true;
    const qp = searchParams.get("lang");
    if (qp === "de" || qp === "en") setLang(qp as Lang);
  }, [searchParams, setLang]);

  function toggle(id: string) {
    const s = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(s);
    if (typeof window !== "undefined") {
      localStorage.setItem("brief.selected", JSON.stringify(s));
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t("explore.title")}</h1>
          <p className="text-sm text-gray-600">{t("explore.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <button
            onClick={() => setLang("de")}
            className={lang === "de" ? "font-semibold underline" : ""}
          >
            DE
          </button>
          <span>|</span>
          <button
            onClick={() => setLang("en")}
            className={lang === "en" ? "font-semibold underline" : ""}
          >
            EN
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BASE_CARDS.map((c) => {
          const active = selected.includes(c.id);
          const texts = CARD_TEXT[lang][c.id] ?? CARD_TEXT.de[c.id];
          const clamped =
            c.id !== "sys"
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: 6,
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
              <div className="absolute right-3 top-3">
                <span className={BADGE}>
                  <span className="font-medium">
                    {RANK_LABELS[lang][c.rankKey]}
                  </span>
                  {c.suit && <span aria-hidden="true">{c.suit}</span>}
                </span>
              </div>

              <div
                className="flex-1 min-w-0 overflow-y-auto pr-1"
                style={{ scrollbarGutter: "stable" as any }}
              >
                <h3 className="font-semibold text-lg leading-snug">
                  {texts.title}
                </h3>
                <p className="mt-3 text-sm text-gray-700" style={clamped}>
                  {texts.blurb}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => toggle(c.id)}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
                >
                  {active ? t("explore.remove") : t("explore.add")}
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
          {t("explore.next")}
        </Link>
      </div>
    </main>
  );
}
