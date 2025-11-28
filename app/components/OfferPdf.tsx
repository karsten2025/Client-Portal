// app/components/OfferPdf.tsx
// Server-/PDF-Komponente (kein "use client")

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  buildContractSection3,
  type ContractSection3Input,
} from "../lib/contractSection3";

import type { Lang } from "../lib/catalog";
import {
  getRoleRequirementsFor,
  getRoleModuleLabel,
  type RoleId,
  type RequirementGroup,
} from "../lib/roleRequirements";

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
  subheading: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
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
  // Neuer Footer unten mit Seitenzahl
  footer: {
    position: "absolute",
    left: 55,
    right: 55,
    top: 760, // nah am Seitenende
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
  signatureRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  signatureCol: {
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

  // Rollen, die wirklich bekannt sind
  const roleIdsRaw = section3Input.selectedRoles ?? [];
  const ALL_ROLES: RoleId[] = ["sys", "ops", "res", "coach"];
  const roleIds: RoleId[] = roleIdsRaw.filter((r): r is RoleId =>
    ALL_ROLES.includes(r as RoleId)
  );

  const detailGroups: RequirementGroup[] = [
    "ziel",
    "leistung",
    "mitwirkung",
    "ergebnis",
    "zeit",
    "kommunikation",
    "abgrenzung",
  ];

  // Kontaktname für Anrede
  const contactName = (brief.kontakt || "").trim();

  const salutation =
    L === "de"
      ? contactName
        ? `Guten Tag ${contactName},`
        : "Sehr geehrte Damen und Herren,"
      : contactName
      ? `Dear ${contactName},`
      : "Dear Sir or Madam,";

  // 🔹 Single Source: § 3 Text aus contractSection3.ts
  const section3Text = buildContractSection3(lang, section3Input);

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
          {/* Betreff + Anrede */}
          <View style={styles.section}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              {label(`Angebot – ${projectLabel}`, `Offer – ${projectLabel}`)}
            </Text>

            <Text
              style={{
                fontSize: 10,
                marginBottom: 8,
              }}
            >
              {salutation}
            </Text>

            <Text style={styles.paragraph}>
              {label(
                "vielen Dank für Ihre Anfrage und das entgegengebrachte Vertrauen. Auf Grundlage der vorliegenden Informationen biete ich Ihnen für das oben genannte Vorhaben folgende Unterstützungsleistung an:",
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
          <View style={[styles.section, { marginTop: 16 }]}>
            <Text style={styles.subheading}>
              {label(
                "§ 3 Leistungsumfang & Vorgehensweise",
                "§ 3 Scope of services & delivery approach"
              )}
            </Text>

            {/* Bisheriger Vertragstext aus contractSection3.ts */}
            <Text style={styles.paragraph}>{section3Text}</Text>

            {/* Detailblöcke für alle gewählten Rollen (sys / ops / res / coach) */}
            {roleIds.length > 0 && (
              <View style={{ marginTop: 12 }}>
                {roleIds.map((roleId, index) => {
                  const requirements = getRoleRequirementsFor(lang, roleId);
                  if (!requirements.length) return null;

                  const moduleLabel = getRoleModuleLabel(lang, roleId);
                  const headingText =
                    lang === "en"
                      ? `Detailed scope of work – role module “${moduleLabel}”`
                      : `Detaillierte Leistungsbeschreibung – Rollenmodul „${moduleLabel}“`;

                  return (
                    <View
                      key={roleId}
                      style={{ marginTop: index === 0 ? 0 : 12 }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "bold",
                          marginBottom: 4,
                        }}
                      >
                        {headingText}
                      </Text>

                      {detailGroups.map((group) => {
                        const items = requirements.filter(
                          (r) => r.group === group
                        );
                        if (!items.length) return null;

                        let groupHeading: string;
                        switch (group) {
                          case "ziel":
                            groupHeading =
                              lang === "en"
                                ? "A. Purpose and mandate"
                                : "A. Ziel & Mandatsrahmen";
                            break;
                          case "leistung":
                            groupHeading =
                              lang === "en"
                                ? "B. Services of the Contractor"
                                : "B. Leistungen des Auftragnehmers (AN)";
                            break;
                          case "mitwirkung":
                            groupHeading =
                              lang === "en"
                                ? "C. Client responsibilities"
                                : "C. Mitwirkungspflichten des Auftraggebers (AG)";
                            break;
                          case "ergebnis":
                            groupHeading =
                              lang === "en"
                                ? "D. Results / deliverables"
                                : "D. Ergebnisse / Deliverables";
                            break;
                          case "zeit":
                            groupHeading =
                              lang === "en"
                                ? "E. Time & fees"
                                : "E. Zeit & Umfang / Vergütung";
                            break;
                          case "kommunikation":
                            groupHeading =
                              lang === "en"
                                ? "F. Communication & escalation"
                                : "F. Kommunikation & Eskalation";
                            break;
                          default:
                            groupHeading =
                              lang === "en"
                                ? "G. Exclusions / non-services"
                                : "G. Abgrenzung / Nicht-Leistungen";
                            break;
                        }

                        return (
                          <View key={group} style={{ marginTop: 6 }}>
                            <Text
                              style={{
                                fontWeight: "bold",
                                marginBottom: 2,
                              }}
                            >
                              {groupHeading}
                            </Text>

                            {items.map((item) => (
                              <Text
                                key={item.id}
                                style={styles.paragraph}
                              >{`[${item.id}] ${item.text}`}</Text>
                            ))}
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.muted}>
              {label(
                "Hinweis: Diese Vertragsseite ist als Entwurf zu verstehen. Die endgültige Vertragsfassung kann weitere Regelungen (z. B. zu Vergütung, Haftung, Vertraulichkeit) enthalten. Verbindlich ist ausschließlich die von beiden Parteien unterzeichnete Version.",
                "Note: This contract page is a draft. The final contract version may contain additional provisions (e.g. on fees, liability, confidentiality). Only the version signed by both parties is legally binding."
              )}
            </Text>
          </View>

          {/* Unterschriftsbereich AG / AN – zweispaltig */}
          <View style={[styles.section, { marginTop: 20 }]}>
            <View style={styles.signatureRow}>
              {/* Linke Spalte: Auftraggeber (AG) */}
              <View style={[styles.signatureCol, { marginRight: 40 }]}>
                <Text style={styles.paragraph}>
                  {label("Für den Auftraggeber (AG):", "For the Client (AG):")}
                </Text>

                <Text style={{ height: 16 }} />

                <Text style={styles.paragraph}>{clientName}</Text>

                <Text style={{ height: 10 }} />

                <Text style={styles.small}>
                  {label(
                    "Ort, Datum: ___________________________",
                    "Place, date: ___________________________"
                  )}
                </Text>
                <Text style={[styles.small, { marginTop: 8 }]}>
                  {label(
                    "Unterschrift: __________________________",
                    "Signature: __________________________"
                  )}
                </Text>
              </View>

              {/* Rechte Spalte: Auftragnehmer (AN) */}
              <View style={styles.signatureCol}>
                <Text style={styles.paragraph}>
                  {label("Für den Auftragnehmer (AN):", "For the Contractor:")}
                </Text>

                <Text style={{ height: 16 }} />

                <Text style={styles.paragraph}>{supplierName}</Text>

                <Text style={{ height: 10 }} />

                <Text style={styles.small}>
                  {label(
                    "Ort, Datum: ___________________________",
                    "Place, date: ___________________________"
                  )}
                </Text>
                <Text style={[styles.small, { marginTop: 8 }]}>
                  {label(
                    "Unterschrift: __________________________",
                    "Signature: __________________________"
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
