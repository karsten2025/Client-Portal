// app/api/offer-pdf/route.ts
import { NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import React from "react";
import sharp from "sharp";
import path from "path";
import fs from "fs";

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

  // 2a. Logo-Wasserzeichen: dunklen Hintergrund entfernen, als Base64-URI kodieren
  let logoWatermark: string | undefined;
  try {
    const logoPath = path.join(process.cwd(), "public", "torus-logo.png");
    const logoBuffer = fs.readFileSync(logoPath);

    // Bild als RGBA-Rohdaten laden
    const { data, info } = await sharp(logoBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Dunkle Hintergrundpixel transparent machen (Luminanz-basiertes Alpha-Masking):
    // Pixel mit niedriger Helligkeit werden ausgeblendet, helle Pixel bleiben sichtbar.
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i + 3] = Math.min(255, Math.max(0, Math.round((luminance - 25) * 3)));
    }

    const processedBuffer = await sharp(Buffer.from(data), {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png()
      .toBuffer();

    logoWatermark = `data:image/png;base64,${processedBuffer.toString("base64")}`;
  } catch {
    // Wasserzeichen nicht verfügbar – PDF wird ohne generiert
  }

  // 2b. React-Element OHNE JSX bauen (weil diese Datei .ts heißt)
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
    logoWatermark,
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
