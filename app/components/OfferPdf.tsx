// app/components/OfferPdf.tsx
"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Lang } from "../lib/catalog";

export type BehaviorLike = { id: string; label: string };
export type SkillLike = { id: string; label: string };
export type LevelLike = { id: string; label: string };
export type SkillNotes = Record<string, { need?: string; outcome?: string }>;

type Props = {
  brief: Record<string, any>;
  behavior: BehaviorLike | null;
  skills: SkillLike[];
  psychosocial: LevelLike | null;
  caring: LevelLike | null;
  notes: SkillNotes;
  days: number;
  dayRate: number;
  net: number;
  tax: number;
  gross: number;
  lang?: Lang;
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    lineHeight: 1.4,
    fontFamily: "Helvetica",
  },
  h1: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 700,
  },
  h2: {
    fontSize: 12,
    marginTop: 14,
    marginBottom: 4,
    fontWeight: 700,
  },
  small: {
    fontSize: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  box: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginTop: 6,
  },
  bullet: {
    fontSize: 9,
    marginBottom: 2,
  },
  totalBox: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    fontSize: 10,
  },
  totalLabel: { fontWeight: 700 },
});

export function OfferPdf({
  brief,
  behavior,
  skills,
  psychosocial,
  caring,
  notes,
  days,
  dayRate,
  net,
  tax,
  gross,
  lang = "de",
}: Props) {
  const label = (de: string, en: string) => (lang === "en" ? en : de);

  // Absender
  const senderName = brief?.anbieterName || "Muster Consulting GmbH";
  const senderAddr =
    brief?.anbieterAdresse || "Musterstraße 1 · 12345 Musterstadt";
  const senderContact =
    brief?.anbieterKontakt || "T +49 000 000000 · info@muster-consulting.de";
  const senderVat = brief?.anbieterUstId || "DEXXXXXXXXX";

  // Empfänger
  const fallbackCustomer =
    lang === "en" ? "Client company" : "Unternehmen des Auftraggebers";
  const customer = brief?.kunde || brief?.client || fallbackCustomer;

  // Angebot-Meta
  const offerNo = brief?.angebotsNr || "AN-2025-0001";
  const offerDate = brief?.angebotsDatum || "7.11.2025";

  // Projektinfos
  const project = brief?.projekt || brief?.project || "Projekt / Thema";

  const locale = lang === "en" ? "en-US" : "de-DE";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Kopf: Logo & Absenderblock */}
        <View
          style={[styles.row, { alignItems: "flex-start", marginBottom: 16 }]}
        >
          <View
            style={{
              borderWidth: 1,
              padding: 10,
              width: 180,
              alignItems: "center",
            }}
          >
            <Text>MUSTERLOGO</Text>
          </View>

          <View
            style={{
              marginLeft: 16,
              flexGrow: 1,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: 700 }}>{senderName}</Text>
            <Text>{senderAddr}</Text>
            <Text>{senderContact}</Text>
            <Text>
              {label("USt-IdNr.:", "VAT ID:")} {senderVat}
            </Text>
            <Text style={styles.small}>
              {label("Angebots-Nr.:", "Offer no.:")} {offerNo} ·{" "}
              {label("Datum:", "Date:")} {offerDate}
            </Text>
          </View>
        </View>

        {/* Empfänger */}
        <View style={{ marginBottom: 14 }}>
          <Text>{label("An", "To")}</Text>
          <Text>{customer}</Text>
        </View>

        {/* Betreff */}
        <Text style={styles.h1}>
          {label(
            "Unverbindliches Angebot – Projekt / Thema",
            "Non-binding offer – project / subject"
          )}
        </Text>

        {/* Einleitung */}
        <View style={{ marginBottom: 10 }}>
          <Text>
            {label(
              "Vielen Dank für Ihre Anfrage und das entgegengebrachte Vertrauen. Auf Grundlage der vorliegenden Informationen biete ich Ihnen für das oben genannte Vorhaben folgende Unterstützungsleistung an:",
              "Thank you for your request and the trust placed in this collaboration. Based on the information currently available, I propose the following support for the above project:"
            )}
          </Text>
          <Text style={{ marginTop: 4 }}>
            {label("Projekt:", "Project:")} {project}
          </Text>
        </View>

        {/* 2. Verhaltenpaket */}
        <Text style={styles.h2}>
          {label("2. Verhaltenpaket (Kontext & Stil)", "2. Behaviour package")}
        </Text>
        <View style={styles.box}>
          {behavior ? (
            <Text style={styles.bullet}>• {behavior.label}</Text>
          ) : (
            <Text style={styles.bullet}>
              {label(
                "Hinweis: (Kein Paket gewählt.)",
                "Note: (No package selected.)"
              )}
            </Text>
          )}
        </View>

        {/* 3. Fachliche Rollen & Qualifikationen */}
        <Text style={styles.h2}>
          {label(
            "3. Fachliche Rollen & Qualifikationen",
            "3. Professional roles & skills"
          )}
        </Text>
        <View style={styles.box}>
          {skills.length === 0 ? (
            <Text style={styles.bullet}>
              {label(
                "Hinweis: (Keine Auswahl getroffen.)",
                "Note: (No skills selected.)"
              )}
            </Text>
          ) : (
            skills.map((s) => {
              const note = notes[s.id] || {};
              return (
                <View key={s.id} style={{ marginBottom: 4 }}>
                  <Text style={styles.bullet}>• {s.label}</Text>
                  {note.need && (
                    <Text style={styles.small}>
                      {label("Ihr Anliegen:", "Your need:")} {note.need}
                    </Text>
                  )}
                  {note.outcome && (
                    <Text style={styles.small}>
                      {label("Ihr Nutzen / DoD:", "Your benefit / DoD:")}{" "}
                      {note.outcome}
                    </Text>
                  )}
                </View>
              );
            })
          )}
        </View>

        {/* 4. Psychosoziale Interaktions-Tiefe */}
        <Text style={styles.h2}>
          {label(
            "4. Psychosoziale Interaktions-Tiefe",
            "4. Psychosocial intervention depth"
          )}
        </Text>
        <View style={styles.box}>
          {psychosocial ? (
            <Text style={styles.bullet}>• {psychosocial.label}</Text>
          ) : (
            <Text style={styles.bullet}>
              {label(
                "Hinweis: (Kein psychosoziales Paket gewählt.)",
                "Note: (No psychosocial package selected.)"
              )}
            </Text>
          )}
        </View>

        {/* 5. Grad der emotionalen Investition */}
        <Text style={styles.h2}>
          {label(
            "5. Grad der emotionalen Investition (Caring-Level)",
            "5. Degree of emotional investment (caring level)"
          )}
        </Text>
        <View style={styles.box}>
          {caring ? (
            <Text style={styles.bullet}>• {caring.label}</Text>
          ) : (
            <Text style={styles.bullet}>
              {label(
                "Hinweis: (Kein Caring-Level gewählt.)",
                "Note: (No caring level selected.)"
              )}
            </Text>
          )}
        </View>

        {/* 6. Preisübersicht */}
        <Text style={styles.h2}>
          {label("6. Preisübersicht", "6. Price overview")}
        </Text>
        <View style={styles.box}>
          <Text style={styles.bullet}>
            {label("Tage:", "Days:")}{" "}
            {days.toLocaleString(locale, { minimumFractionDigits: 0 })} ·{" "}
            {label("Satz/Tag:", "Rate/day:")}{" "}
            {dayRate.toLocaleString(locale, {
              minimumFractionDigits: 0,
            })}{" "}
            EUR
          </Text>
        </View>

        {/* Summen */}
        <View style={styles.totalBox}>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>
              {label("Netto/EUR", "Net total/EUR")}
            </Text>
            <Text>
              {net.toLocaleString(locale, { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>
              {label("Umsatzsteuer 19%/EUR", "VAT 19%/EUR")}
            </Text>
            <Text>
              {tax.toLocaleString(locale, { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>
              {label("Endbetrag/EUR", "Total amount/EUR")}
            </Text>
            <Text style={{ fontWeight: 700 }}>
              {gross.toLocaleString(locale, { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* 7. Zahlungsbedingungen & nächster Schritt */}
        <Text style={styles.h2}>
          {label(
            "7. Zahlungsbedingungen & nächster Schritt",
            "7. Payment terms & next step"
          )}
        </Text>
        <View style={styles.box}>
          <Text style={styles.bullet}>
            •{" "}
            {label(
              "Rechnungsstellung leistungnah nach Projektfortschritt oder Meilensteinen.",
              "Invoicing close to performance, based on project progress or milestones."
            )}
          </Text>
          <Text style={styles.bullet}>
            •{" "}
            {label(
              "Zahlungsziel: 14 Tage netto ohne Abzug.",
              "Payment term: 14 days net without deduction."
            )}
          </Text>
          <Text style={styles.bullet}>
            •{" "}
            {label(
              "Bitte prüfen Sie den Angebotsentwurf und geben Sie mir bei Interesse ein kurzes Go für die Finalisierung.",
              "Please review this offer draft and let me know if you would like me to finalise it."
            )}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
