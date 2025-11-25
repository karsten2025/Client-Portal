// app/lib/contractSection3.ts
import {
  SKILLS,
  PSYCHO_PACKAGES,
  CARING_PACKAGES,
  type Lang,
  type PsychoId,
  type CaringId,
} from "./catalog";

type RoleId = "sys" | "ops" | "res" | "coach";

type SkillNotes = Record<string, { need?: string; outcome?: string }>;

export type ContractSection3Input = {
  lang: Lang;
  roles: RoleId[]; // aus localStorage "brief.selected"
  skillIds: string[]; // aus brief.skills
  notes?: SkillNotes; // aus brief.notes (optional)
  psychoId: PsychoId | ""; // aus brief.psycho
  caringId: CaringId | ""; // aus brief.caring
};

export type ContractSection3 = {
  title: string;
  paragraphs: string[]; // (1) ... (2) ... (3) ...
};

// ------------------------
// statische Textbausteine
// ------------------------

const INTRO: Record<Lang, string> = {
  de: [
    "(1) Zielsetzung und Vertragscharakter",
    "",
    "Der Auftragnehmer (AN) berät und unterstützt den Auftraggeber (AG) als externer Spezialist. Die Leistung wird als Dienstvertrag (§ 611 BGB) erbracht.",
    "Geschuldet ist das professionelle Tätigwerden zur Erreichung der vertraglich vereinbarten Ziele, nicht ein bestimmter wirtschaftlicher Erfolg.",
    "Der AN unterliegt keiner disziplinarischen Weisungsbefugnis des AG.",
  ].join(" "),
  en: [
    "(1) Objective and legal nature of the engagement",
    "",
    "The contractor (AN) advises and supports the client (AG) as an external specialist. The engagement is governed as a contract for services.",
    "The Contractor owes professional efforts aimed at achieving the contractually agreed objectives, not a specific economic success.",
    "The AN is not subject to the AG’s disciplinary right to issue instructions.",
  ].join(" "),
};

const META_CLARIFICATION: Record<Lang, string> = {
  de: [
    "(5) Klärung von Begrifflichkeiten (Meta-Klärung)",
    "",
    "Die Parteien sind sich bewusst, dass projektbezogene Begriffe unterschiedlichen Interpretationen unterliegen können.",
    "Übliche Klärungen zu Begriffen, Rollen und Verantwortlichkeiten sind im Leistungsumfang enthalten.",
    "Ab dem Zeitpunkt, an dem sich sprachliche oder semantische Diskussionen wiederholt im Kreis drehen und messbar Aufmerksamkeit vom Projektziel abziehen, gilt die strukturierte Auflösung dieser Dissonanzen (Meta-Klärung) als gesonderte Beratungsleistung.",
    "Diese kann nach vorheriger Absprache als Change Request (Zusatzaufwand) abgerechnet werden.",
  ].join(" "),
  en: [
    "(5) Clarification of terminology (meta-clarification)",
    "",
    "The parties acknowledge that project-related terms may be interpreted differently.",
    "Normal clarifications around terminology, roles and responsibilities are included in the scope of services.",
    "From the point where linguistic or semantic discussions repeatedly go in circles and measurably distract attention from the project objective, the structured resolution of such dissonances (meta-clarification) is treated as a separate advisory service.",
    "This may, after mutual agreement, be billed separately as a change request (additional effort).",
  ].join(" "),
};

const EXCLUSIONS: Record<Lang, string> = {
  de: [
    "(6) Exklusionen (Nicht-Leistung)",
    "",
    "Sofern nicht ausdrücklich abweichend vereinbart, sind insbesondere nicht geschuldet:",
    "– Rechts- und Steuerberatung,",
    "– disziplinarische Personalverantwortung (Einstellungen, Abmahnungen, Gehaltsgespräche),",
    "– Übernahme von Organverantwortung (z. B. Geschäftsführung, Prokura),",
    "– Herbeiführung eines Erfolgs, der von der Mitwirkung Dritter abhängt, auf die der AN keinen direkten Zugriff hat.",
  ].join(" "),
  en: [
    "(6) Exclusions (non-services)",
    "",
    "Unless expressly agreed otherwise, the following in particular are not owed:",
    "– legal and tax advice,",
    "– disciplinary HR responsibility (hiring, warnings, salary negotiations),",
    "– assumption of corporate officer responsibility (e.g. managing director, power of attorney),",
    "– achievement of results that depend on third parties over whom the AN has no direct control.",
  ].join(" "),
};

// ------------------------
// Rollen-Bausteine (2)
// ------------------------

const ROLE_TEXT: Record<Lang, Record<RoleId, string>> = {
  de: {
    sys: [
      "Interim Management & Portfolio-Steuerung:",
      "Der AN übernimmt die operative Steuerung von Projekten, Programmen oder Portfolios (Interim).",
      "Er schließt temporäre Vakanzen, steuert die Umsetzung auf Basis vereinbarter Meilensteine, sorgt für Transparenz im Reporting",
      "und koordiniert die fachliche Zulieferung der Teams ohne unnötige Reibungsverluste.",
    ].join(" "),
    ops: [
      "Betriebssystem-Performance & Skalierung:",
      "Der AN analysiert und optimiert die Prozess- und Systemlandschaft des AG.",
      "Bestehende Abläufe werden in ein skalierbares „Betriebssystem“ überführt, Engpässe in der Wertschöpfungskette identifiziert",
      "und effiziente Governance-Mechanismen etabliert, die die Teams entlasten und messbare Effizienzgewinne ermöglichen.",
    ].join(" "),
    res: [
      "Strategische Resonanz & Stakeholder-Management:",
      "Der AN steuert komplexe Stakeholder-Umfelder und politische Kommunikation.",
      "Er fungiert als Übersetzer zwischen Fachebene und Management, löst kommunikative Blockaden",
      "und richtet unterschiedliche Interessenlagen strategisch auf das vereinbarte Projektziel aus.",
    ].join(" "),
    coach: [
      "Sparring, Coaching & Enablement:",
      "Der AN agiert als strukturierter Sparrings- und Coaching-Partner („Thinking Partner“) für Führungskräfte und Teams.",
      "Er unterstützt bei Entscheidungsfindung, befähigt Schlüsselpersonen methodisch",
      "und fördert eigenständige Lösungsfindung in komplexen Lagen.",
    ].join(" "),
  },
  en: {
    sys: [
      "Interim management & portfolio steering:",
      "The AN assumes operational steering of projects, programmes or portfolios on an interim basis.",
      "They bridge temporary vacancies, steer delivery based on agreed milestones, ensure transparent reporting",
      "and coordinate contributions from the involved teams with minimum friction.",
    ].join(" "),
    ops: [
      "Operating system performance & scaling:",
      "The AN analyses and optimises the client’s process and system landscape.",
      "Existing workflows are transformed into a scalable “operating system”, bottlenecks in the value chain are identified",
      "and efficient governance mechanisms are established to relieve teams and create measurable efficiency gains.",
    ].join(" "),
    res: [
      "Strategic resonance & stakeholder management:",
      "The AN steers complex stakeholder environments and political communication.",
      "They act as a translator between specialist teams and management, resolve communication blockages",
      "and align diverse interests towards the agreed project objective.",
    ].join(" "),
    coach: [
      "Sparring, coaching & enablement:",
      "The AN acts as a structured sparring and coaching partner (“thinking partner”) for leaders and teams.",
      "They support decision-making, methodically empower key people",
      "and foster autonomous problem-solving in complex situations.",
    ].join(" "),
  },
};

// ------------------------
// Helper-Funktionen
// ------------------------

function buildRolesParagraph(lang: Lang, roles: RoleId[]): string {
  if (!roles.length) {
    return lang === "de"
      ? "(2) Leistungsgegenstand (Rolle)\n\nDie konkrete Rolle wird im Angebotsdokument und in der Leistungsbeschreibung definiert."
      : "(2) Scope of services (role)\n\nThe concrete role is defined in the offer document and the detailed scope description.";
  }

  const unique = [...new Set(roles)];
  const header =
    lang === "de"
      ? "(2) Leistungsgegenstand (Rolle)\n\nBasierend auf der Auswahl im Briefing erbringt der AN folgende Kernleistungen:"
      : "(2) Scope of services (role)\n\nBased on the selection made in the briefing, the AN provides the following core services:";

  const items = unique.map((r) => `• ${ROLE_TEXT[lang][r]}`).join("\n");

  return `${header}\n\n${items}`;
}

function buildSkillsParagraph(
  lang: Lang,
  skillIds: string[],
  notes?: SkillNotes
): string {
  if (!skillIds.length) {
    return lang === "de"
      ? "(3) Fachliche Schwerpunkte (Skills)\n\nDie Leistungserbringung erfolgt auf Basis der im Angebot beschriebenen Qualifikationen des AN."
      : "(3) Professional focus (skills)\n\nServices are rendered based on the qualifications of the AN as described in the offer.";
  }

  const picked = SKILLS.filter((s) => skillIds.includes(s.id));

  const header =
    lang === "de"
      ? "(3) Fachliche Schwerpunkte (Skills)\n\nDie Leistungserbringung erfolgt unter Einsatz folgender fachlicher Schwerpunkte, wie im Briefing ausgewählt:"
      : "(3) Professional focus (skills)\n\nServices are rendered using the following professional focus areas as selected in the briefing:";

  const lines = picked.map((s) => {
    const n = notes?.[s.id];
    const base = `• ${s.title[lang]}`;
    if (n?.need || n?.outcome) {
      const extra = [
        n.need && (lang === "de" ? `Bedarf: ${n.need}` : `Need: ${n.need}`),
        n.outcome &&
          (lang === "de"
            ? `Ziel/Nutzen: ${n.outcome}`
            : `Outcome/benefit: ${n.outcome}`),
      ]
        .filter(Boolean)
        .join(" | ");
      return `${base} (${extra})`;
    }
    return base;
  });

  return `${header}\n\n${lines.join("\n")}`;
}

function buildPsychParagraph(lang: Lang, psychoId: PsychoId | ""): string {
  const pkg = PSYCHO_PACKAGES.find((p) => p.id === psychoId) ?? null;

  if (!pkg) {
    return lang === "de"
      ? "(4a) Psychosoziale Intervention (System-Tiefe)\n\nDie Tiefe der psychosozialen Intervention wird im Angebot beschrieben. Ohne abweichende Vereinbarung liegt der Schwerpunkt auf Struktur, Transparenz und Governance (Basis-Level)."
      : "(4a) Psychosocial intervention (system depth)\n\nThe depth of psychosocial intervention is described in the offer. Unless agreed otherwise, the focus is on structure, transparency and governance (base level).";
  }

  const levelLabel = (pkg as any).level?.[lang] ?? pkg.name[lang];
  const include = (pkg as any).include?.[lang] ?? "";
  const exclude = (pkg as any).exclude?.[lang] ?? "";
  const benefit = pkg.benefit[lang];

  if (lang === "de") {
    return [
      "(4a) Psychosoziale Intervention (System-Tiefe)",
      "",
      `Bei Auswahl ${levelLabel} gilt: ${pkg.focus.de}`,
      include && `Inklusion (Doing): ${include}`,
      exclude && `Exklusion (Not Doing): ${exclude}`,
      `Ihr Nutzen: ${benefit}`,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    "(4a) Psychosocial intervention (system depth)",
    "",
    `Where ${levelLabel} is selected, the following applies: ${pkg.focus.en}`,
    include && `Includes: ${include}`,
    exclude && `Excludes: ${exclude}`,
    `Benefit: ${benefit}`,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildCaringParagraph(lang: Lang, caringId: CaringId | ""): string {
  const pkg = CARING_PACKAGES.find((c) => c.id === caringId) ?? null;

  if (!pkg) {
    return lang === "de"
      ? "(4b) Grad der emotionalen Investition (Caring)\n\nDas Caring-Level orientiert sich am marktüblichen professionellen Standard. Eine darüber hinausgehende emotionale Bindung ist nicht geschuldet."
      : "(4b) Degree of emotional investment (caring)\n\nThe caring level follows a market-standard professional baseline. Any emotional involvement beyond that is not owed.";
  }

  const name = pkg.name[lang];
  const tagline = (pkg as any).tagline?.[lang] ?? "";
  const definition = (pkg as any).definition?.[lang] ?? "";
  const offer = (pkg as any).offer?.[lang] ?? "";
  const inclusion = (pkg as any).inclusion?.[lang] ?? "";
  const exclusion = (pkg as any).exclusion?.[lang] ?? "";
  const benefit = pkg.benefit[lang];

  if (lang === "de") {
    return [
      "(4b) Grad der emotionalen Investition (Caring)",
      "",
      `${name}${tagline ? ` – ${tagline}` : ""}`,
      definition,
      offer && `Angebot: ${offer}`,
      inclusion && `Inklusion (Doing): ${inclusion}`,
      exclusion && `Exklusion (Not Doing): ${exclusion}`,
      `Ihr Nutzen: ${benefit}`,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    "(4b) Degree of emotional investment (caring)",
    "",
    `${name}${tagline ? ` – ${tagline}` : ""}`,
    definition,
    offer && `Offer: ${offer}`,
    inclusion && `Includes: ${inclusion}`,
    exclusion && `Excludes: ${exclusion}`,
    `Benefit: ${benefit}`,
  ]
    .filter(Boolean)
    .join(" ");
}

// ------------------------
// Haupt-Builder
// ------------------------

export function buildContractSection3(
  input: ContractSection3Input
): ContractSection3 {
  const { lang, roles, skillIds, notes, psychoId, caringId } = input;

  const intro = INTRO[lang];
  const rolesPara = buildRolesParagraph(lang, roles);
  const skillsPara = buildSkillsParagraph(lang, skillIds, notes);
  const psychPara = buildPsychParagraph(lang, psychoId);
  const caringPara = buildCaringParagraph(lang, caringId);
  const meta = META_CLARIFICATION[lang];
  const excl = EXCLUSIONS[lang];

  return {
    title:
      lang === "de"
        ? "§ 3 Leistungsumfang & Vorgehensweise"
        : "Section 3 – Scope of services & approach",
    paragraphs: [
      intro,
      rolesPara,
      skillsPara,
      psychPara,
      caringPara,
      meta,
      excl,
    ],
  };
}
