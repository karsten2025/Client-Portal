// app/api/offer-pdf/route.ts
import { NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import React from "react";

import { OfferPdfDocument } from "../../components/OfferPdf";
import type { ContractSection3Input } from "../../lib/contractSection3";
import type { Lang } from "../../lib/catalog";
import type { SkillNotes } from "../../components/OfferPdf";

// Wir verwenden POST, weil wir viele Daten (Briefing + Angebot + §3) schicken.
export async function POST(request: Request) {
  // 1. JSON-Body vom Client einlesen
  const body = (await request.json()) as {
    lang: Lang;
    brief: Record<string, string>;
    behaviorSummary: string;
    selectedSkills: {
      id: string;
      title: Record<Lang, string>;
    }[];
    psychLabel: string;
    caringLabel: string;
    notes: SkillNotes;
    days: number;
    dayRate: number;
    net: number;
    tax: number;
    gross: number;
    currency: string;
    section3Input: ContractSection3Input;
  };

  const {
    lang,
    brief,
    behaviorSummary,
    selectedSkills,
    psychLabel,
    caringLabel,
    notes,
    days,
    dayRate,
    net,
    tax,
    gross,
    currency,
    section3Input,
  } = body;

  // 2. React-Element OHNE JSX bauen (weil diese Datei .ts heißt)
  const element = React.createElement(OfferPdfDocument, {
    lang,
    brief,
    behaviorSummary,
    selectedSkills,
    psychLabel,
    caringLabel,
    notes,
    days,
    dayRate,
    net,
    tax,
    gross,
    currency,
    section3Input,
  });

  // 3. Aus dem Element ein PDF-Buffer erzeugen
  //    Typen der Library sind hier strenger als nötig, daher "as any".
  const pdfBuffer = await pdf(element as any).toBuffer();

  // 4. PDF als Download-Response zurückgeben
  return new NextResponse(pdfBuffer as any, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="angebot-vertrag-entwurf.pdf"',
    },
  });
}
