// app/components/OfferPdf.tsx
"use client";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type Lang = "de" | "en";
type Option = { label: string; days: number; total: number };
type BehaviorResolved = {
  ctx: string;
  pkg: string;
  style: string;
  outcome: string;
} | null;
type SkillResolved = {
  id: string;
  title: string;
  offer: string;
  need?: string;
  outcome?: string;
}[];

type Props = {
  brief: Record<string, any>;
  roles: string[];
  days: number;
  dayRate: number;
  total: number;
  options?: Option[];
  lang?: Lang;
  behavior?: BehaviorResolved;
  skills?: SkillResolved;
};

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, lineHeight: 1.4, fontFamily: "Helvetica" },
  h1: { fontSize: 16, marginBottom: 10, fontWeight: 700 },
  h2: { fontSize: 12, marginTop: 14, marginBottom: 4, fontWeight: 700 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  box: { borderWidth: 1, borderRadius: 4, padding: 8, marginTop: 6 },
  tableWrapper: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 4,
    wrap: false as any,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
  },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5 },
  th: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 9,
    fontWeight: 700,
  },
  td: { paddingVertical: 4, paddingHorizontal: 6, fontSize: 9 },
  colPos: { width: 24 },
  colText: { flexGrow: 1 },
  colQty: { width: 72, textAlign: "right" as const },
  colPrice: { width: 72, textAlign: "right" as const },
  colTotal: { width: 88, textAlign: "right" as const },
  colTax: { width: 24, textAlign: "center" as const },
  totalBox: { marginTop: 10, alignItems: "flex-end" },
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
  ops: { de: "Betriebssystem Performer", en: "Operating system performance" },
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
  lang = "de",
  behavior = null,
  skills = [],
}: Props) {
  const label = (de: string, en: string) => (lang === "en" ? en : de);
  const senderName = brief?.anbieterName || "Muster Consulting GmbH";
  const senderAddr =
    brief?.anbieterAdresse || "Musterstraße 1 · 12345 Musterstadt";
  const senderContact =
    brief?.anbieterKontakt || "T +49 000 000000 · info@muster-consulting.de";
  const senderVat = brief?.anbieterUstId || "DEXXXXXXXXX";
  const customer =
    brief?.kunde ||
    brief?.client ||
    (lang === "en" ? "Client company" : "Unternehmen des Auftraggebers");
  const project =
    brief?.projekt ||
    brief?.project ||
    label("Projekt / Thema", "Project / Subject");

  const readableRoles = roles
    .map((id) =>
      ROLE_LABELS[id]
        ? lang === "en"
          ? ROLE_LABELS[id].en
          : ROLE_LABELS[id].de
        : id
    )
    .join(", ");

  const posBase = label(
    "Projektunterstützung gemäß Ziffer 2–4 dieses Angebots",
    "Project support as per sections 2–4 of this offer"
  );
  const positionText = readableRoles
    ? `${posBase} – ${readableRoles}`
    : posBase;

  const netto = total,
    taxRate = 0.19;
  const tax = Math.round(netto * taxRate * 100) / 100;
  const gross = Math.round((netto + tax) * 100) / 100;
  const locale = lang === "en" ? "en-US" : "de-DE";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Kopf */}
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
          <View style={{ marginLeft: 16, flexGrow: 1 }}>
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

        {/* Intro */}
        <View style={{ marginBottom: 10 }}>
          <Text>
            {label(
              "Vielen Dank für Ihre Anfrage. Für das oben genannte Vorhaben schlage ich folgende Ausgestaltung vor:",
              "Thank you for your request. For the above project I propose the following setup:"
            )}
          </Text>
          <Text>
            {label("Projekt:", "Project:")} {project}
          </Text>
        </View>

        {/* 2. Verhalten */}
        <Text style={styles.h2}>
          {label(
            "2. Verhaltenpaket (Kontext & Stil)",
            "2. Behavior package (context & style)"
          )}
        </Text>
        <View style={styles.box}>
          {behavior ? (
            <>
              <Text style={{ fontSize: 9 }}>{behavior.ctx}</Text>
              <Text style={{ fontSize: 9, marginTop: 2 }}>{behavior.pkg}</Text>
              <Text style={{ fontSize: 9, marginTop: 2 }}>
                {behavior.style}
              </Text>
              <Text style={{ fontSize: 9, marginTop: 2 }}>
                {label("Ihr Nutzen:", "Benefit:")} {behavior.outcome}
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 9, fontStyle: "italic" }}>
              {label(
                "Hinweis: (Kein Paket gewählt.)",
                "Note: (No package selected.)"
              )}
            </Text>
          )}
        </View>

        {/* 3. Skills */}
        <Text style={styles.h2}>
          {label(
            "3. Fachliche Rollen & Qualifikationen",
            "3. Professional roles & skills"
          )}
        </Text>
        <View style={styles.box}>
          {skills && skills.length > 0 ? (
            <>
              {skills.map((s, i) => (
                <View key={s.id} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 9, fontWeight: 700 }}>
                    {i + 1}. {s.title}
                  </Text>
                  <Text style={{ fontSize: 9 }}>{s.offer}</Text>
                  {s.need && (
                    <Text style={{ fontSize: 9, marginTop: 2 }}>
                      {label("Ihr Anliegen:", "Your need:")} {s.need}
                    </Text>
                  )}
                  {s.outcome && (
                    <Text style={{ fontSize: 9, marginTop: 2 }}>
                      {label("Gewünschtes Ergebnis:", "Desired outcome:")}{" "}
                      {s.outcome}
                    </Text>
                  )}
                </View>
              ))}
            </>
          ) : (
            <Text style={{ fontSize: 9, fontStyle: "italic" }}>
              {label(
                "Hinweis: (Keine Auswahl getroffen.)",
                "Note: (No selection made.)"
              )}
            </Text>
          )}
        </View>

        {/* 4. Preisübersicht */}
        <Text style={styles.h2}>
          {label("4. Preisübersicht", "4. Price overview")}
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
              {netto.toLocaleString(locale)}
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

        {/* 5. Next step */}
        <Text style={styles.h2}>
          {label("5. Nächster Schritt", "5. Next step")}
        </Text>
        <View style={styles.box}>
          <Text style={{ fontSize: 9 }}>
            {label(
              "Bitte prüfen Sie den Angebotsentwurf. Bei Zusage erhalten Sie Zugang zum Portal, in dem Angebot, Anpassungen und Freigaben transparent dokumentiert werden.",
              "Please review this offer draft. Upon approval you will get access to the portal where offer, adjustments and approvals are documented transparently."
            )}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
