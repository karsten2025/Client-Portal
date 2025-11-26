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
  // Seitenlayout: Ränder + Platz für Kopf/Fuß
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 120, // Platz für Header
    paddingBottom: 80, // Platz für Footer
    paddingHorizontal: 55,
    lineHeight: 1.4,
  },
  header: {
    position: "absolute",
    top: 40,
    left: 55,
    right: 55,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {},
  headerRight: {
    textAlign: "right",
  },
  heading: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  small: {
    fontSize: 9,
  },
  body: {
    marginTop: 0,
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 4,
  },
  smallHeading: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletDot: {
    width: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
  },
  muted: {
    fontSize: 9,
    color: "#666666",
  },
  // Neuer Footer unten mit Seitenzahl in der Mitte
  footer: {
    position: "absolute",
    left: 55,
    right: 55,

    // WICHTIG: bottom raus, stattdessen top groß setzen
    // A4 hat ca. 842pt Höhe -> 760 ist kurz über dem Seitenrand
    top: 760,

    borderTopWidth: 0.5,
    borderTopColor: "#999999",
    paddingTop: 4,
    fontSize: 9,
    color: "#555555",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLeft: {
    textAlign: "left",
    flex: 1,
  },
  footerCenter: {
    textAlign: "center",
    flex: 1,
  },
  footerRight: {
    textAlign: "right",
    flex: 1,
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
  const locale = L === "en" ? "en-US" : "de-DE";

  const label = (de: string, en: string) => (L === "en" ? en : de);

  // 🔹 Single Source: § 3 Text aus contractSection3.ts
  const section3Text = buildContractSection3(lang, section3Input);

  // In sinnvolle Absätze zerlegen (doppelte Zeilenumbrüche = neuer Absatz)
  const section3Paragraphs = section3Text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Datum (heute) – simple Variante
  const today = new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const supplierName = brief.anbieterName || "Muster Consulting GmbH";
  const supplierAddress =
    brief.anbieterAdresse || "Musterstraße 1 · 12345 Musterstadt · Deutschland";
  const supplierContact =
    brief.anbieterKontakt || "T +49 000 000000 · info@muster-consulting.de";
  const supplierVat = brief.anbieterUstId || "DEXXXXXXXXX";

  const clientName =
    brief.kunde ||
    (L === "en" ? "Client company" : "Unternehmen des Auftraggebers");
  const clientContact =
    brief.kontakt ||
    (L === "en" ? "Contact person (tbd)" : "Ansprechpartner:in (noch offen)");
  const projectLabel =
    brief.projekt || (L === "en" ? "Project / subject" : "Projekt / Thema");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER – Absender links, Empfänger/Datum rechts */}
        <View style={styles.header} fixed>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.heading}>{supplierName}</Text>
              <Text style={styles.small}>{supplierAddress}</Text>
              <Text style={styles.small}>{supplierContact}</Text>
              <Text style={styles.small}>
                {label("USt-IdNr.: ", "VAT ID: ")}
                {supplierVat}
              </Text>
            </View>
            <View style={styles.headerRight}>
              {/* Zeile 1: Seite 1 = An/To, Folgeseiten = Projekt/Betreff */}
              <Text
                style={styles.small}
                render={({ pageNumber }) =>
                  pageNumber === 1
                    ? `${label("An", "To")} ${clientName}`
                    : projectLabel
                }
              />
              {/* Zeile 2: Seite 1 = Ansprechpartner, Folgeseiten = Kundenname */}
              <Text
                style={styles.small}
                render={({ pageNumber }) =>
                  pageNumber === 1 ? clientContact : clientName
                }
              />
              {/* Zeile 3: Datum (immer gleich) */}
              <Text style={[styles.small, { marginTop: 4 }]}>{`${label(
                "Datum: ",
                "Date: "
              )}${today}`}</Text>
            </View>
          </View>
        </View>

        {/* FOOTER – Firmeninfo + Seitenzahl unten */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}>
            <Text>
              {supplierName} · {supplierAddress}
            </Text>
            <Text>{supplierContact}</Text>
          </View>
          <View style={styles.footerCenter}>
            <Text
              render={({ pageNumber, totalPages }) =>
                `${label("Seite", "Page")} ${pageNumber} ${label(
                  "von",
                  "of"
                )} ${totalPages}`
              }
            />
          </View>
          <View style={styles.footerRight}>
            <Text>
              {label("Projekt:", "Project:")} {projectLabel}
            </Text>
          </View>
        </View>

        {/* BODY – Angebot + Vertrag */}
        <View style={styles.body}>
          {/* Betreffzeile */}
          <View style={styles.section}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 6 }}>
              {label(`Angebot – ${projectLabel}`, `Offer – ${projectLabel}`)}
            </Text>
            <Text style={styles.paragraph}>
              {label(
                "Vielen Dank für Ihre Anfrage und das entgegengebrachte Vertrauen. Auf Grundlage der vorliegenden Informationen biete ich Ihnen für das oben genannte Vorhaben folgende Unterstützungsleistung an:",
                "Thank you for your request and the trust placed in this collaboration. Based on the information currently available, I propose the following support for the above project:"
              )}
            </Text>
          </View>

          {/* 2. Verhaltenpaket / Mandats-Kontext */}
          <View style={styles.section}>
            <Text style={styles.smallHeading}>
              {label(
                "2. Verhaltenpaket (Kontext & Stil)",
                "2. Behaviour package (context & style)"
              )}
            </Text>
            <Text style={styles.paragraph}>
              {behaviorSummary ||
                label("(Kein Paket gewählt.)", "(No package selected.)")}
            </Text>
          </View>

          {/* 3. Fachliche Rollen & Qualifikationen */}
          <View style={styles.section}>
            <Text style={styles.smallHeading}>
              {label(
                "3. Fachliche Rollen & Qualifikationen",
                "3. Professional roles & skills"
              )}
            </Text>
            {selectedSkills.length === 0 ? (
              <Text style={styles.paragraph}>
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
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{s.title[L]}</Text>
                    </View>
                    {note.need && (
                      <Text
                        style={[
                          styles.small,
                          { marginLeft: 10, marginBottom: 1 },
                        ]}
                      >
                        <Text style={{ fontWeight: "bold" }}>
                          {label("Ihr Anliegen: ", "Your need: ")}
                        </Text>
                        {note.need}
                      </Text>
                    )}
                    {note.outcome && (
                      <Text
                        style={[
                          styles.small,
                          { marginLeft: 10, marginBottom: 1 },
                        ]}
                      >
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

          {/* 4. Psychosoziale Tiefe */}
          <View style={styles.section}>
            <Text style={styles.smallHeading}>
              {label(
                "4. Psychosoziale Interaktions-Tiefe",
                "4. Psychosocial intervention depth"
              )}
            </Text>
            <Text style={styles.paragraph}>
              {psychLabel ||
                label(
                  "(Kein psychosoziales Paket gewählt.)",
                  "(No psychosocial package selected.)"
                )}
            </Text>
          </View>

          {/* 5. Caring-Level */}
          <View style={styles.section}>
            <Text style={styles.smallHeading}>
              {label(
                "5. Grad der emotionalen Investition (Caring-Level)",
                "5. Degree of emotional investment (caring level)"
              )}
            </Text>
            <Text style={styles.paragraph}>
              {caringLabel ||
                label(
                  "(Kein Caring-Level gewählt.)",
                  "(No caring level selected.)"
                )}
            </Text>
          </View>

          {/* 6. Preisübersicht */}
          <View style={styles.section}>
            <Text style={styles.smallHeading}>
              {label("6. Preisübersicht", "6. Price overview")}
            </Text>
            <Text style={styles.paragraph}>
              {label("Tage: ", "Days: ")}
              {days.toLocaleString(locale, { minimumFractionDigits: 0 })} ·{" "}
              {label("Satz/Tag: ", "Rate/day: ")}
              {dayRate.toLocaleString(locale, {
                minimumFractionDigits: 0,
              })}{" "}
              {currency}
            </Text>
            <Text style={styles.paragraph}>
              {label("Netto: ", "Net total: ")}
              {net.toLocaleString(locale, { minimumFractionDigits: 2 })}{" "}
              {currency}
            </Text>
            <Text style={styles.paragraph}>
              {label("Umsatzsteuer 19%: ", "VAT 19%: ")}
              {tax.toLocaleString(locale, { minimumFractionDigits: 2 })}{" "}
              {currency}
            </Text>
            <Text style={[styles.paragraph, { fontWeight: "bold" }]}>
              {label("Endbetrag: ", "Total amount: ")}
              {gross.toLocaleString(locale, { minimumFractionDigits: 2 })}{" "}
              {currency}
            </Text>
          </View>

          {/* Hinweis zum Angebotscharakter */}
          <View style={styles.section}>
            <Text style={styles.muted}>
              {label(
                "Hinweis: Dieses Dokument stellt einen unverbindlichen Angebotsentwurf dar. Verbindlich sind ausschließlich die in einer final abgestimmten und von beiden Parteien freigegebenen Unterlagen (z. B. Angebot, Leistungsbeschreibung, Vertrag) geregelten Inhalte.",
                "Note: This document is a non-binding offer draft. Only the contents agreed in the final documents approved and signed by both parties (e.g. offer, statement of work, contract) are legally binding."
              )}
            </Text>
          </View>

          {/* Grußformel + Signaturblock */}
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              {label("Mit freundlichen Grüßen", "Kind regards")}
            </Text>
            <Text style={{ height: 18 }} />
            <Text style={styles.paragraph}>{supplierName}</Text>
            <Text style={styles.small}>
              {brief.anbieterSignaturZeile ||
                label("Geschäftsführung / Beratung", "Consulting / Management")}
            </Text>
          </View>

          {/* --- harter Seitenumbruch: ab hier immer neue Seite --- */}
          <View break />

          {/* Vertragsseite: § 3 Leistungsumfang & Vorgehensweise */}
          <View style={styles.section}>
            <Text style={styles.smallHeading}>
              {label(
                "Dienstvertrag – Auszug § 3 Leistungsumfang & Vorgehensweise",
                "Service agreement – excerpt § 3 Scope of Services & Delivery Approach"
              )}
            </Text>
            <Text style={[styles.muted, { marginBottom: 6 }]}>
              {label(
                "Bezogen auf das vorstehende Angebot zu folgendem Projekt:",
                "With reference to the above offer for the following project:"
              )}{" "}
              {projectLabel}
            </Text>

            {section3Paragraphs.map((p, idx) => (
              <Text key={idx} style={styles.paragraph}>
                {p}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.muted}>
              {label(
                "Hinweis: Diese Vertragsseite ist als Entwurf zu verstehen. Die endgültige Vertragsfassung kann weitere Regelungen (z. B. zu Vergütung, Haftung, Vertraulichkeit) enthalten. Verbindlich ist ausschließlich die von beiden Parteien unterzeichnete Version.",
                "Note: This contract page is a draft. The final contract version may contain additional provisions (e.g. on fees, liability, confidentiality). Only the version signed by both parties is legally binding."
              )}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
