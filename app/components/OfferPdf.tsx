// app/components/OfferPdf.tsx
"use client";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, lineHeight: 1.4 },
  h1: { fontSize: 18, marginBottom: 8 },
  h2: { fontSize: 14, marginTop: 16, marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  listItem: { marginBottom: 3 },

  // ❗ keine Shorthands wie "border: 1" verwenden
  box: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000000",
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});

export function OfferPdf({
  brief,
  roles,
  days,
  dayRate,
  total,
  options,
}: {
  brief: Record<string, any>;
  roles: string[];
  days: number;
  dayRate: number;
  total: number;
  options: Array<{ label: string; days: number; total: number }>;
}) {
  const ziel = brief?.ziel || "—";
  const hebel = brief?.hebel || "—";
  const dod = Object.entries(brief?.dodChecks ?? {}).filter(([, v]) => !!v);
  const raci = brief?.raci ?? {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Angebots-Entwurf</Text>

        <View style={styles.box}>
          <View style={styles.row}>
            <Text>Rollen: {roles.length ? roles.join(", ") : "—"}</Text>
            <Text>Summe: {total.toLocaleString("de-DE")} €</Text>
          </View>
          <View style={styles.row}>
            <Text>Satz/Tag: {dayRate.toLocaleString("de-DE")} €</Text>
            <Text>Tage: {days}</Text>
          </View>
        </View>

        <Text style={styles.h2}>Ergebnis & Nutzen</Text>
        <Text style={styles.listItem}>Ziel: {ziel}</Text>
        <Text style={styles.listItem}>Hebel: {hebel}</Text>

        <Text style={styles.h2}>Lieferumfang</Text>
        <View style={styles.box}>
          <Text style={styles.listItem}>• Kickoff & Zielschärfung</Text>
          <Text style={styles.listItem}>
            • Analyse & Priorisierung (Backlog)
          </Text>
          <Text style={styles.listItem}>
            • Maßnahmenplan mit Verantwortlichen
          </Text>
          <Text style={styles.listItem}>• Abschluss-Review mit Abnahme</Text>
        </View>

        <Text style={styles.h2}>Fahrplan (grobe Milestones)</Text>
        <View style={styles.box}>
          <Text style={styles.listItem}>• Tag 1: Kickoff, Scope, Risiken</Text>
          <Text style={styles.listItem}>• Tag 2–4: Arbeitspakete & Tests</Text>
          <Text style={styles.listItem}>• Tag 5: Review & Abnahme</Text>
        </View>

        <Text style={styles.h2}>Definition of Done (Auszug)</Text>
        <View style={styles.box}>
          {dod.length ? (
            dod.map(([k]) => (
              <Text key={k} style={styles.listItem}>
                • {k}
              </Text>
            ))
          ) : (
            <Text>• Wird im Brief definiert</Text>
          )}
        </View>

        <Text style={styles.h2}>Rollen (Mini-RACI)</Text>
        <View style={styles.box}>
          {Object.keys(raci).length ? (
            Object.entries(raci).map(([k, v]: any) => (
              <Text key={k} style={styles.listItem}>
                • {k}: {String(v)}
              </Text>
            ))
          ) : (
            <Text>• Owner/Helper/Approver/Consulted werden benannt</Text>
          )}
        </View>

        <Text style={styles.h2}>Preisoptionen</Text>
        <View style={styles.box}>
          {options.map((o) => (
            <Text key={o.label} style={styles.listItem}>
              • {o.label}: {o.days} WT – {o.total.toLocaleString("de-DE")} €
            </Text>
          ))}
        </View>

        <Text style={styles.h2}>Risiko-Umkehr</Text>
        <View style={styles.box}>
          <Text>• Abbruch nach Tag 1 möglich (nur 1 WT)</Text>
          <Text>• Fixpreis auf definierten Scope</Text>
        </View>

        <Text style={styles.h2}>Nächster Schritt</Text>
        <Text>
          • Unverbindliches PDF prüfen. Bei Zusage: Login zum Speichern &
          Change-Log.
        </Text>
      </Page>
    </Document>
  );
}
