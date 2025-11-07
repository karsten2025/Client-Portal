// app/components/OfferPdf.tsx
"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type Lang = "de" | "en";

type Option = {
  label: string;
  days: number;
  total: number;
};

type Props = {
  brief: Record<string, any>;
  roles: string[];
  days: number;
  dayRate: number;
  total: number;
  options?: Option[];
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
  tableWrapper: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 4,
    wrap: false as any, // nicht umbrechen
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
  },
  th: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 9,
    fontWeight: 700,
  },
  td: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 9,
  },
  colPos: { width: 24 },
  colText: { flexGrow: 1 },
  colQty: { width: 72, textAlign: "right" as const },
  colPrice: { width: 72, textAlign: "right" as const },
  colTotal: { width: 88, textAlign: "right" as const },
  colTax: { width: 24, textAlign: "center" as const },
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

const ROLE_LABELS: Record<string, { de: string; en: string }> = {
  sys: {
    de: "Ganzheitliche Erfolgssteuerung",
    en: "Holistic delivery steering",
  },
  ops: {
    de: "Betriebssystem Performer",
    en: "Operating system performance",
  },
  res: {
    de: "Strategische Resonanz-Steuerung",
    en: "Strategic resonance steering",
  },
  coach: {
    de: "Sparring/Coaching (Lead, Team)",
    en: "Sparring / Coaching (leadership & teams)",
  },
};

export function OfferPdf({
  brief,
  roles,
  days,
  dayRate,
  total,
  options,
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
  const outcome = brief?.ziel;
  const lever = brief?.hebel;

  // Rollen lesbar machen
  const readableRoles = roles
    .map((id) => {
      const mapping = ROLE_LABELS[id];
      if (!mapping) return id;
      return lang === "en" ? mapping.en : mapping.de;
    })
    .join(", ");

  const positionTextBase = label(
    "Projektunterstützung gemäß Ziffer 2–4 dieses Angebots",
    "Project support as per sections 2–4 of this offer"
  );
  const positionText =
    readableRoles.length > 0
      ? `${positionTextBase} – ${readableRoles}`
      : positionTextBase;

  // Summen
  const netto = total;
  const taxRate = 0.19;
  const tax = Math.round(netto * taxRate * 100) / 100;
  const gross = Math.round((netto + tax) * 100) / 100;
  const locale = lang === "en" ? "en-US" : "de-DE";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Kopf: Logo & Absenderblock unter Logo */}
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
        </View>

        {/* 1. Outcome & Fokus */}
        <Text style={styles.h2}>
          {label(
            "1. Zielbild & Fokus (aus Ihrem Briefing)",
            "1. Outcome & focus (from your briefing)"
          )}
        </Text>
        <View style={styles.box}>
          <Text style={{ fontSize: 9 }}>
            {label("Projekt:", "Project:")} {project}
          </Text>
          {outcome ? (
            <Text style={{ fontSize: 9, marginTop: 2 }}>
              {label(
                "Ergebnis nach fünf Werktagen:",
                "Outcome after five working days:"
              )}{" "}
              {outcome}
            </Text>
          ) : (
            <Text style={{ fontSize: 9, marginTop: 2 }}>
              {label(
                "Das konkrete Ergebnisbild konkretisieren wir gemeinsam zum Start.",
                "We refine the concrete outcome together at project start."
              )}
            </Text>
          )}
          {lever && (
            <Text style={{ fontSize: 9, marginTop: 2 }}>
              {label("Wichtigster Hebel:", "Key lever:")} {lever}
            </Text>
          )}
        </View>

        {/* 2. Scope */}
        <Text style={styles.h2}>
          {label(
            "2. Leistungsumfang (Auszug)",
            "2. Scope of services (excerpt)"
          )}
        </Text>
        <View style={styles.box}>
          <Text style={styles.bullet}>
            •{" "}
            {label(
              "Analyse, Strukturierung und Priorisierung der Themen im Kontext Ihrer Ziele.",
              "Analysis, structuring and prioritisation of topics in line with your objectives."
            )}
          </Text>
          <Text style={styles.bullet}>
            •{" "}
            {label(
              "Moderation von Arbeits- und Entscheidungsformaten mit relevanten Stakeholdern.",
              "Facilitation of work and decision formats with relevant stakeholders."
            )}
          </Text>
          <Text style={styles.bullet}>
            •{" "}
            {label(
              "Erarbeitung von Entscheidungsgrundlagen, Roadmaps und Verantwortlichkeiten.",
              "Development of decision bases, roadmaps and clear responsibilities."
            )}
          </Text>
          <Text style={styles.bullet}>
            •{" "}
            {label(
              "Dokumentation der Ergebnisse in praxistauglicher Form.",
              "Documentation of results in a pragmatic, usable format."
            )}
          </Text>
        </View>

        {/* 3. Definition of Done */}
        <Text style={styles.h2}>
          {label(
            "3. Definition of Done (Orientierung)",
            "3. Definition of Done (orientation)"
          )}
        </Text>
        <View style={styles.box}>
          <Text style={styles.bullet}>
            {label(
              "Die folgenden Punkte dienen als gemeinsame Orientierung für ein fachlich sauberes Ergebnis der beauftragten Tage. Sie stellen keine aufschiebende Bedingung für die Vergütung dar; abrechenbar sind die vereinbarten und erbrachten Leistungen.",
              "The points below serve as shared guidance for a solid professional outcome. They are not a condition precedent for payment; invoicing is based on the agreed and delivered services."
            )}
          </Text>
          <Text style={styles.bullet}>
            •{" "}
            {label(
              "Zielbild, Scope und Abgrenzung sind dokumentiert und abgestimmt.",
              "Target picture, scope and boundaries are documented and aligned."
            )}
          </Text>
          <Text style={styles.bullet}>
            •{" "}
            {label(
              "Umsetzungsplan mit Verantwortlichkeiten liegt vor.",
              "Implementation roadmap with responsibilities is defined."
            )}
          </Text>
          <Text style={styles.bullet}>
            •{" "}
            {label(
              "Wesentliche Risiken und Annahmen sind dokumentiert.",
              "Key risks and assumptions are documented."
            )}
          </Text>
          <Text style={styles.bullet}>
            •{" "}
            {label(
              "Entscheidungsunterlage für Management / Gremium ist vorbereitet.",
              "Decision brief for management / steering body is prepared."
            )}
          </Text>
        </View>

        {/* 4. Rollen */}
        <Text style={styles.h2}>
          {label(
            "4. Rollen & Zusammenarbeit (Mini-RACI)",
            "4. Roles & collaboration (mini RACI)"
          )}
        </Text>
        <View style={styles.box}>
          <Text style={styles.bullet}>
            {brief?.raci
              ? label(
                  "Die im Briefing benannten Rollen (Owner/Approver/Helper/Consulted) gelten als gemeinsame Grundlage.",
                  "The roles defined in the briefing (Owner/Approver/Helper/Consulted) apply as joint reference."
                )
              : label(
                  "Die konkreten Rollen stimmen wir zu Projektstart gemeinsam ab.",
                  "Specific roles will be aligned together at project start."
                )}
          </Text>
        </View>

        {/* 5. Preisübersicht */}
        <Text style={styles.h2}>
          {label("5. Preisübersicht", "5. Price overview")}
        </Text>
        <View style={styles.tableWrapper}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, styles.colPos]}>Pos.</Text>
            <Text style={[styles.th, styles.colText]}>
              {label("Text", "Description")}
            </Text>
            <Text style={[styles.th, styles.colQty]}>
              {label("Menge/Einheit", "Qty / unit")}
            </Text>
            <Text style={[styles.th, styles.colPrice]}>
              {label("Einzelpreis/EUR", "Unit price/EUR")}
            </Text>
            <Text style={[styles.th, styles.colTotal]}>
              {label("Ges.-Netto/EUR", "Total net/EUR")}
            </Text>
            <Text style={[styles.th, styles.colTax]}>
              {label("St.", "Tax")}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.td, styles.colPos]}>1</Text>
            <Text style={[styles.td, styles.colText]}>{positionText}</Text>
            <Text style={[styles.td, styles.colQty]}>
              {days.toFixed(2)} {label("Tag(e)", "day(s)")}
            </Text>
            <Text style={[styles.td, styles.colPrice]}>
              {dayRate.toLocaleString(locale)}
            </Text>
            <Text style={[styles.td, styles.colTotal]}>
              {total.toLocaleString(locale)}
            </Text>
            <Text style={[styles.td, styles.colTax]}>01</Text>
          </View>
        </View>

        {/* Summen */}
        <View style={styles.totalBox}>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>
              {label("Netto/EUR", "Net total/EUR")}
            </Text>
            <Text>{netto.toLocaleString(locale)}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>
              {label("Umsatzsteuer 19%/EUR", "VAT 19%/EUR")}
            </Text>
            <Text>{tax.toLocaleString(locale)}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>
              {label("Endbetrag/EUR", "Total amount/EUR")}
            </Text>
            <Text style={{ fontWeight: 700 }}>
              {gross.toLocaleString(locale)}
            </Text>
          </View>
        </View>

        {/* Zahlungsbedingungen */}
        <Text style={styles.h2}>
          {label(
            "6. Zahlungsbedingungen & Geltungsdauer",
            "6. Payment terms & validity"
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
        </View>

        {/* Nächster Schritt */}
        <Text style={styles.h2}>
          {label("7. Nächster Schritt", "7. Next step")}
        </Text>
        <View style={styles.box}>
          <Text style={styles.bullet}>
            {label(
              "Bitte prüfen Sie den Angebotsentwurf. Bei Zusage erhalten Sie Zugang zum Portal, in dem Angebot, Anpassungen und Freigaben transparent dokumentiert werden.",
              "Please review this offer draft. Upon your approval you will receive access to the portal where offer, adjustments and approvals are documented transparently."
            )}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
