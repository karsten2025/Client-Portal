// app/components/OfferPdf.tsx
// Server-/PDF-Komponente (kein "use client")

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  buildContractSection3,
  type ContractSection3Input,
} from "../lib/contractSection3";
import type { Lang } from "../lib/catalog";

// Gleicher Typ wie in OfferPage (dort nur als Type-Import verwendet)
export type SkillNotes = Record<string, { need?: string; outcome?: string }>;

// Minimale Skill-Repräsentation für das PDF
type PdfSkill = {
  id: string;
  title: Record<Lang, string>;
};

type OfferPdfProps = {
  lang: Lang;
  brief: Record<string, string>;
  behaviorSummary: string;
  selectedSkills: PdfSkill[];
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

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  heading: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
  },
  smallHeading: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
  },
  muted: {
    fontSize: 9,
    color: "#666666",
  },
  section: {
    marginBottom: 12,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletDot: {
    width: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginVertical: 8,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 4,
  },
});

export function OfferPdfDocument(props: OfferPdfProps) {
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
  } = props;

  const L = lang;

  const label = (de: string, en: string) => (L === "en" ? en : de);

  // 🔹 Single Source: § 3 Text aus contractSection3.ts
  const section3Text = buildContractSection3(lang, section3Input);

  // Für PDF in sinnvolle Absätze zerlegen (doppelte Zeilenumbrüche als „new paragraph“)
  const section3Paragraphs = section3Text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Kopfbereich: Anbieter / Kunde */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>
              {brief.anbieterName || "Muster Consulting GmbH"}
            </Text>
            <Text style={styles.text}>
              {brief.anbieterAdresse ||
                "Musterstraße 1 · 12345 Musterstadt · Deutschland"}
            </Text>
            <Text style={styles.text}>
              {brief.anbieterKontakt ||
                "T +49 000 000000 · info@muster-consulting.de"}
            </Text>
            <Text style={styles.text}>
              {label("USt-IdNr.: ", "VAT ID: ")}
              {brief.anbieterUstId || "DEXXXXXXXXX"}
            </Text>
          </View>
          <View>
            <Text style={[styles.text, { textAlign: "right" }]}>
              {brief.kunde ||
                (L === "en"
                  ? "Client company"
                  : "Unternehmen des Auftraggebers")}
            </Text>
            <Text style={[styles.text, { textAlign: "right" }]}>
              {brief.kontakt ||
                (L === "en"
                  ? "Contact person (tbd)"
                  : "Ansprechpartner:in (noch offen)")}
            </Text>
            <Text style={[styles.text, { textAlign: "right", marginTop: 4 }]}>
              {label("Projekt: ", "Project: ")}
              {brief.projekt ||
                (L === "en" ? "Project / subject" : "Projekt / Thema")}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            {label(
              "Unverbindliches Angebot – Projekt / Thema",
              "Non-binding offer – project / subject"
            )}
          </Text>
          <Text style={styles.paragraph}>
            {label(
              "Vielen Dank für Ihre Anfrage und das entgegengebrachte Vertrauen. Auf Grundlage der vorliegenden Informationen biete ich Ihnen für das oben genannte Vorhaben folgende Unterstützungsleistung an:",
              "Thank you for your request and the trust placed in this collaboration. Based on the information currently available, I propose the following support for the above project:"
            )}
          </Text>
        </View>

        {/* Mandats-Kontext */}
        <View style={styles.section}>
          <Text style={styles.smallHeading}>
            {label(
              "2. Verhaltenpaket (Kontext & Stil)",
              "2. Behaviour package (context & style)"
            )}
          </Text>
          <Text style={styles.text}>
            {behaviorSummary ||
              label("(Kein Paket gewählt.)", "(No package selected.)")}
          </Text>
        </View>

        {/* Fachliche Rollen & Skills */}
        <View style={styles.section}>
          <Text style={styles.smallHeading}>
            {label(
              "3. Fachliche Rollen & Qualifikationen",
              "3. Professional roles & skills"
            )}
          </Text>
          {selectedSkills.length === 0 ? (
            <Text style={styles.text}>
              {label(
                "Hinweis: (Keine Auswahl getroffen.)",
                "Note: (No skills selected.)"
              )}
            </Text>
          ) : (
            selectedSkills.map((s) => {
              const note = notes[s.id] || {};
              return (
                <View key={s.id} style={{ marginBottom: 3 }}>
                  <View style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{s.title[L]}</Text>
                  </View>
                  {note.need && (
                    <Text style={[styles.text, { marginLeft: 8 }]}>
                      <Text style={{ fontWeight: "bold" }}>
                        {label("Ihr Anliegen: ", "Your need: ")}
                      </Text>
                      {note.need}
                    </Text>
                  )}
                  {note.outcome && (
                    <Text style={[styles.text, { marginLeft: 8 }]}>
                      <Text style={{ fontWeight: "bold" }}>
                        {label("Ihr Nutzen / DoD: ", "Your benefit / DoD: ")}
                      </Text>
                      {note.outcome}
                    </Text>
                  )}
                </View>
              );
            })
          )}
        </View>

        {/* Psychosoziale Tiefe & Caring */}
        <View style={styles.section}>
          <Text style={styles.smallHeading}>
            {label(
              "4. Psychosoziale Interaktions-Tiefe",
              "4. Psychosocial intervention depth"
            )}
          </Text>
          <Text style={styles.text}>
            {psychLabel ||
              label(
                "(Kein psychosoziales Paket gewählt.)",
                "(No psychosocial package selected.)"
              )}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.smallHeading}>
            {label(
              "5. Grad der emotionalen Investition (Caring-Level)",
              "5. Degree of emotional investment (caring level)"
            )}
          </Text>
          <Text style={styles.text}>
            {caringLabel ||
              label(
                "(Kein Caring-Level gewählt.)",
                "(No caring level selected.)"
              )}
          </Text>
        </View>

        {/* Preisübersicht */}
        <View style={styles.section}>
          <Text style={styles.smallHeading}>
            {label("6. Preisübersicht", "6. Price overview")}
          </Text>
          <Text style={styles.text}>
            {label("Tage: ", "Days: ")}
            {days} · {label("Satz/Tag: ", "Rate/day: ")}
            {dayRate.toLocaleString(L === "en" ? "en-US" : "de-DE", {
              minimumFractionDigits: 0,
            })}{" "}
            {currency}
          </Text>
          <Text style={styles.text}>
            {label("Netto: ", "Net total: ")}
            {net.toLocaleString(L === "en" ? "en-US" : "de-DE", {
              minimumFractionDigits: 2,
            })}{" "}
            {currency}
          </Text>
          <Text style={styles.text}>
            {label("Umsatzsteuer 19%: ", "VAT 19%: ")}
            {tax.toLocaleString(L === "en" ? "en-US" : "de-DE", {
              minimumFractionDigits: 2,
            })}{" "}
            {currency}
          </Text>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            {label("Endbetrag: ", "Total amount: ")}
            {gross.toLocaleString(L === "en" ? "en-US" : "de-DE", {
              minimumFractionDigits: 2,
            })}{" "}
            {currency}
          </Text>
        </View>

        <View style={styles.hr} />

        {/* 🔹 § 3 Leistungsumfang & Vorgehensweise – Single Source */}
        <View style={styles.section}>
          <Text style={styles.smallHeading}>
            {label(
              "§ 3 Leistungsumfang & Vorgehensweise",
              "§ 3 Scope of Services & Delivery Approach"
            )}
          </Text>
          {section3Paragraphs.map((p, idx) => (
            <Text key={idx} style={styles.paragraph}>
              {p}
            </Text>
          ))}
        </View>

        {/* Fußnote / Hinweis */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.muted}>
            {label(
              "Hinweis: Dieses Dokument stellt einen Angebots- und Vertragsentwurf dar. Verbindlich ist die final abgestimmte und von beiden Parteien unterzeichnete Fassung.",
              "Note: This document is a draft offer and contract. Only the final version agreed and signed by both parties is legally binding."
            )}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
