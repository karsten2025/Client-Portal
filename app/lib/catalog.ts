// app/lib/catalog.ts

export type Lang = "de" | "en";

/** Lokale Storage-Keys – alles bleibt im Browser dieses Geräts */
export const LOCAL_KEYS = {
  form: "brief.form",
  behavior: "brief.behavior",
  skills: "brief.skills",
  psycho: "brief.psycho", // psychosoziales Paket
  caring: "brief.caring",
  notes: "brief.notes",
} as const;

/* ------------------------------------------------------------------ */
/* 4. Verhalten / Kontext-Pakete                                      */
/* ------------------------------------------------------------------ */

export type BehaviorId = "classic" | "political" | "chaos" | "turnaround";

export type Behavior = {
  id: BehaviorId;
  ctx: Record<Lang, string>; // Unternehmenskontext
  pkg: Record<Lang, string>; // Paket-Name
  style: Record<Lang, string>; // Verhaltens-Fokus (Stil)
  outcome: Record<Lang, string>; // Nutzen / Ergebnis
};

export const BEHAVIORS: Behavior[] = [
  {
    id: "classic",
    ctx: {
      de: "Klassisches Marktumfeld",
      en: "Classical market environment",
    },
    pkg: {
      de: "Der Neutrale Steuermann",
      en: "The neutral helmsman",
    },
    style: {
      de: "Objektivität, Mandatsklarheit, strikte Abgrenzung (Externalität).",
      en: "Objectivity, mandate clarity, strict boundary (externality).",
    },
    outcome: {
      de: "Messbare Strategie-Umsetzung.",
      en: "Measurable strategy execution.",
    },
  },
  {
    id: "political",
    ctx: {
      de: "Hoch-politisches Umfeld",
      en: "Highly political environment",
    },
    pkg: {
      de: "Der Allparteiliche Mediator",
      en: "The all-party mediator",
    },
    style: {
      de: "System-Mediation, Konsens-Findung, politische Sensitivität.",
      en: "System mediation, consensus building, political sensitivity.",
    },
    outcome: {
      de: "Auflösung von Blockaden, tragfähiges Mandat.",
      en: "Removes blockages, viable mandate.",
    },
  },
  {
    id: "chaos",
    ctx: {
      de: "Starkes Wachstum / Chaos",
      en: "Strong growth / chaos",
    },
    pkg: {
      de: "Der Pragmatische Stabilisator",
      en: "The pragmatic stabilizer",
    },
    style: {
      de: "Schnelle Analyse (80/20), Fokus auf „Good enough“-Strukturen.",
      en: "Rapid 80/20 analysis, focus on good-enough structures.",
    },
    outcome: {
      de: "Schnelle Entlastung, skalierfähige Minimal-Prozesse.",
      en: "Quick relief, scalable minimal processes.",
    },
  },
  {
    id: "turnaround",
    ctx: {
      de: "Akute Krise / Turnaround",
      en: "Acute crisis / turnaround",
    },
    pkg: {
      de: "Der Konsequente Sanierer",
      en: "The decisive turnaround lead",
    },
    style: {
      de: "Klare Direktiven (Top-Down), Fokus auf kurzfristige Ergebnisse.",
      en: "Clear top-down directives, focus on short-term results.",
    },
    outcome: {
      de: "Abwendung der Krise, Stabilisierung.",
      en: "Crisis averted, stabilisation.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* 4. Fachliche Skills                                                */
/* ------------------------------------------------------------------ */

export type SkillId =
  | "living-systems"
  | "complex-systems"
  | "eng"
  | "pm-waterfall"
  | "pm-agile"
  | "pm-hybrid"
  | "process"
  | "quality"
  | "pmo"
  | "cognitive"
  | "teamlead"
  | "deptlead";

export type Skill = {
  id: SkillId;
  title: Record<Lang, string>;
  offerShort: Record<Lang, string>;
  needPlaceholder: Record<Lang, string>;
  outcomePlaceholder: Record<Lang, string>;
};

export const SKILLS: Skill[] = [
  {
    id: "living-systems",
    title: {
      de: "Living systems creator",
      en: "Living systems creator",
    },
    offerShort: {
      de: "Gestaltung resilienter, lernfähiger Arbeitsumgebungen und Organisationsstrukturen.",
      en: "Design of resilient, learning workplace environments and organisational structures.",
    },
    needPlaceholder: {
      de: "[ Hier beschreiben Sie Ihren Bedarf… ]",
      en: "[ Describe your need here… ]",
    },
    outcomePlaceholder: {
      de: "[ Hier definieren Sie das gewünschte Ergebnis… ]",
      en: "[ Define the desired outcome here… ]",
    },
  },
  {
    id: "complex-systems",
    title: {
      de: "Complex adaptive systems creator",
      en: "Complex adaptive systems creator",
    },
    offerShort: {
      de: "Design von Prozessen & Teams (basierend auf Komplexitätstheorie) für unvorhersehbare Märkte.",
      en: "Design of processes & teams (complexity-based) for unpredictable markets.",
    },
    needPlaceholder: {
      de: "[ Hier beschreiben Sie Ihren Bedarf… ]",
      en: "[ Describe your need here… ]",
    },
    outcomePlaceholder: {
      de: "[ Hier definieren Sie das gewünschte Ergebnis… ]",
      en: "[ Define the desired outcome here… ]",
    },
  },
  {
    id: "eng",
    title: {
      de: "Ingenieurtätigkeiten",
      en: "Engineering activities",
    },
    offerShort: {
      de: "Technisches Verständnis & Analysefähigkeit für komplexe (z. B. mech.) Sachverhalte.",
      en: "Technical understanding & analysis for complex (e.g., mech.) topics.",
    },
    needPlaceholder: {
      de: "[ Hier beschreiben Sie Ihren Bedarf… ]",
      en: "[ Describe your need here… ]",
    },
    outcomePlaceholder: {
      de: "[ Hier definieren Sie das gewünschte Ergebnis… ]",
      en: "[ Define the desired outcome here… ]",
    },
  },
  {
    id: "pm-waterfall",
    title: {
      de: "PM klassisch (Wasserfall)",
      en: "Project management (waterfall)",
    },
    offerShort: {
      de: "Struktur, Planung & Steuerung nach etablierten Standards (z. B. PMP/PRINCE2).",
      en: "Structure, planning & control per standards (e.g., PMP/PRINCE2).",
    },
    needPlaceholder: {
      de: "[ z. B. Großprojekt X ist aus dem Ruder… ]",
      en: "[ e.g., major project X is off track… ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. Projekt ist wieder im Zeit/Budget-Plan… ]",
      en: "[ e.g., project is back on time/budget… ]",
    },
  },
  {
    id: "pm-agile",
    title: { de: "PM agil", en: "PM agile" },
    offerShort: {
      de: "Iterative Steuerung, Wertfokus, Coaching von Teams (z. B. Scrum, SAFe).",
      en: "Iterative delivery, value focus, team coaching (e.g., Scrum, SAFe).",
    },
    needPlaceholder: {
      de: "[ z. B. Einführung von Scrum in 3 Teams… ]",
      en: "[ e.g., introduce Scrum to 3 teams… ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. Teams arbeiten in Sprints, Velocity messbar… ]",
      en: "[ e.g., teams run sprints, velocity measurable… ]",
    },
  },
  {
    id: "pm-hybrid",
    title: { de: "PM hybrid", en: "PM hybrid" },
    offerShort: {
      de: "Integration klassischer (Hardware) und agiler (Software) Methoden.",
      en: "Blend hardware-style and agile/software practices.",
    },
    needPlaceholder: {
      de: "[ z. B. Hardware trifft Software… ]",
      en: "[ e.g., hardware meets software… ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. Integrierter Release-Plan existiert… ]",
      en: "[ e.g., integrated release plan exists… ]",
    },
  },
  {
    id: "process",
    title: { de: "Prozessmanagement", en: "Process management" },
    offerShort: {
      de: "Analyse, Design und Optimierung von Geschäftsabläufen (z. B. BPMN).",
      en: "Analysis, design, optimisation of business processes (e.g., BPMN).",
    },
    needPlaceholder: {
      de: "[ z. B. Unser Onboarding-Prozess ist ineffizient… ]",
      en: "[ e.g., our onboarding process is inefficient… ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. Prozesszeit um 20 % reduziert… ]",
      en: "[ e.g., process time reduced by 20%… ]",
    },
  },
  {
    id: "quality",
    title: { de: "Qualitätsmanagement", en: "Quality management" },
    offerShort: {
      de: "Sicherstellung von Standards und Ergebnissen (z. B. ISO, Audit-Vorbereitung).",
      en: "Assure standards & outcomes (e.g., ISO, audit readiness).",
    },
    needPlaceholder: {
      de: "[ z. B. Reklamationen reduzieren… ]",
      en: "[ e.g., reduce claims… ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. ISO-Zertifizierung bestanden… ]",
      en: "[ e.g., ISO certification passed… ]",
    },
  },
  {
    id: "pmo",
    title: { de: "PMO-Ausrichtung", en: "PMO alignment" },
    offerShort: {
      de: "Aufbau & Steuerung (Strategisch, Taktisch, Operational) von PMOs.",
      en: "Build & steer PMOs (strategic, tactical, operational).",
    },
    needPlaceholder: {
      de: "[ z. B. PMO liefert keine strategischen Inputs… ]",
      en: "[ e.g., PMO lacks strategic input… ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. Portfolio-Dashboard für C-Level etabliert… ]",
      en: "[ e.g., C-level portfolio dashboard established… ]",
    },
  },
  {
    id: "cognitive",
    title: { de: "Cognitive Projekte (KI)", en: "Cognitive projects (AI)" },
    offerShort: {
      de: "Management von KI/Automatisierungs-Initiativen; Brücke zwischen Business & Data Science.",
      en: "Run AI/automation initiatives; bridge business & data science.",
    },
    needPlaceholder: {
      de: "[ z. B. Pilotprojekt ‚RPA‘ muss gesteuert werden… ]",
      en: "[ e.g., RPA pilot needs steering… ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. Business Case validiert, Pilot live… ]",
      en: "[ e.g., business case validated, pilot live… ]",
    },
  },
  {
    id: "teamlead",
    title: { de: "Gruppen-Ausrichtung (Leitung)", en: "Team leadership" },
    offerShort: {
      de: "Fachliche oder disziplinarische Führung von Teams oder Projektgruppen.",
      en: "Functional or disciplinary leadership of teams/project groups.",
    },
    needPlaceholder: {
      de: "[ z. B. Teamleiter X ist ausgefallen… ]",
      en: "[ e.g., team lead X unavailable… ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. Team ist stabilisiert, operative Ziele erreicht… ]",
      en: "[ e.g., team stabilised, operating targets met… ]",
    },
  },
  {
    id: "deptlead",
    title: { de: "Abteilungsleitung", en: "Department leadership" },
    offerShort: {
      de: "Temporäre Übernahme der vollen Linienverantwortung (z. B. als ‚Head of PMO‘).",
      en: "Temporary full line responsibility (e.g., Head of PMO).",
    },
    needPlaceholder: {
      de: "[ z. B. Vakanz für 6 Monate überbrücken… ]",
      en: "[ e.g., cover 6-month vacancy… ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. Abteilung ist stabil geführt, Übergabe erfolgt… ]",
      en: "[ e.g., department stable, handover complete… ]",
    },
  },
];

/* ------------------------------------------------------------------ */
/* 5. Psychosoziale Interventions-Tiefe & Caring-Level                 */
/* ------------------------------------------------------------------ */

export type PsychoId = "psych-a" | "psych-b" | "psych-c";
export type CaringId = "care-a" | "care-b" | "care-c";

export type Level = {
  id: string;
  name: Record<Lang, string>;
  focus: Record<Lang, string>;
  benefit: Record<Lang, string>;
  priceFactor: number;

  // Zusätzliche Felder für UI / Angebote
  level?: Record<Lang, string>;
  include?: Record<Lang, string>;
  exclude?: Record<Lang, string>;
  factorLabel?: Record<Lang, string>;

  tagline?: Record<Lang, string>;
  definition?: Record<Lang, string>;
  offer?: Record<Lang, string>;
  inclusion?: Record<Lang, string>;
  exclusion?: Record<Lang, string>;
  priceLabel?: Record<Lang, string>;
};

export const PSYCH_LEVELS: Level[] = [
  {
    id: "psych-a",
    name: {
      de: "Paket A: Der Transparenz-Architekt (Basis-Level)",
      en: "Package A: Transparency architect (base level)",
    },
    focus: {
      de: "Fokus auf Ordnung & Struktur.",
      en: "Focus on order and structure.",
    },
    benefit: {
      de: "Maximale administrative Sicherheit und Planbarkeit (Compliance).",
      en: "Maximum administrative safety and planning reliability (compliance).",
    },
    priceFactor: 1.0,
    level: {
      de: "Basis-Level",
      en: "Base level",
    },
    include: {
      de: "Transparenz über Rollen, Prozesse und Entscheidungswege.",
      en: "Transparency regarding roles, processes and decision paths.",
    },
    exclude: {
      de: "Tiefe Konfliktmoderation, Trauma-Arbeit oder Therapie.",
      en: "Deep conflict moderation, trauma work or therapy.",
    },
    factorLabel: {
      de: "Faktor 1,0 (Basis-Intervention)",
      en: "Factor 1.0 (base intervention)",
    },
  },
  {
    id: "psych-b",
    name: {
      de: "Paket B: Der Resilienz-Schild (Advanced / Servant Leadership)",
      en: "Package B: Resilience shield (advanced / servant leadership)",
    },
    focus: {
      de: "Fokus auf Team-Schutz & Befähigung.",
      en: "Focus on team protection and empowerment.",
    },
    benefit: {
      de: "Stabile, hochperformante Teams und reduzierte Fluktuation in Stressphasen.",
      en: "Stable, high-performing teams and reduced turnover in stressful phases.",
    },
    priceFactor: 1.5,
    level: {
      de: "Advanced-Level",
      en: "Advanced level",
    },
    include: {
      de: "Regelmäßige Team-Reflexionen, Konfliktmoderation im Team, Aufbau von Resilienz-Routinen.",
      en: "Regular team reflections, conflict moderation within the team, building resilience routines.",
    },
    exclude: {
      de: "Unternehmensweite Kulturprogramme oder tiefgreifende Reorganisationen.",
      en: "Company-wide culture programs or deep reorganisations.",
    },
    factorLabel: {
      de: "Faktor 1,5 (erweitertes Mandat)",
      en: "Factor 1.5 (extended mandate)",
    },
  },
  {
    id: "psych-c",
    name: {
      de: "Paket C: Der Sensemaker & Diplomat (Expert / Systemisch)",
      en: "Package C: Sensemaker & diplomat (expert / systemic)",
    },
    focus: {
      de: "Fokus auf Stakeholder-Management & Komplexität.",
      en: "Focus on stakeholder management and complexity.",
    },
    benefit: {
      de: "Handlungsfähigkeit in politisch komplexen Umfeldern, Sicherung des Projektwerts.",
      en: "Ability to act in politically complex environments, safeguarding project value.",
    },
    priceFactor: 2.0,
    level: {
      de: "Expert-Level",
      en: "Expert level",
    },
    include: {
      de: "Systemische Analyse, Arbeit mit formellen und informellen Machtzentren, Gestaltung belastbarer Allianzen.",
      en: "Systemic analysis, work with formal and informal power centres, crafting robust alliances.",
    },
    exclude: {
      de: "Übernahme der Gesamtverantwortung für Konzernpolitik oder Board-Governance.",
      en: "Taking full responsibility for corporate politics or board governance.",
    },
    factorLabel: {
      de: "Faktor 2,0 (hohe Systemkomplexität)",
      en: "Factor 2.0 (high system complexity)",
    },
  },
];

export const CARING_LEVELS: Level[] = [
  {
    id: "care-a",
    name: {
      de: "Paket A: Dienst nach Vorschrift (Maximale Indifferenz)",
      en: "Package A: Duty only (maximum indifference)",
    },
    focus: {
      de: "Reines Reporting & Governance, kein emotionales Mittragen.",
      en: "Pure reporting & governance, no emotional co-ownership.",
    },
    benefit: {
      de: "Günstigster Tarif – Sie zahlen nur für Methode und Präsenz.",
      en: "Lowest rate – you pay only for method and presence.",
    },
    priceFactor: 1.0,
    tagline: {
      de: "Professionell, distanziert, sachlich.",
      en: "Professional, distant, factual.",
    },
    definition: {
      de: "Der Projektleiter führt sauber aus, ohne sich emotional zu involvieren.",
      en: "The project lead executes cleanly without emotional involvement.",
    },
    offer: {
      de: "Fokus auf Struktur, Reporting, Termin- und Budgettreue.",
      en: "Focus on structure, reporting, and adherence to time and budget.",
    },
    inclusion: {
      de: "Regelmäßige Statusberichte, Risiko-Monitoring, formale Eskalationen.",
      en: "Regular status reports, risk monitoring, formal escalations.",
    },
    exclusion: {
      de: "Keine Kulturarbeit, keine tiefe Begleitung von Führung und Teams.",
      en: "No culture work, no deep coaching of leadership and teams.",
    },
    priceLabel: {
      de: "Faktor 1,0 (Basis-Caring)",
      en: "Factor 1.0 (base caring)",
    },
  },
  {
    id: "care-b",
    name: {
      de: "Paket B: Professionelle Empathie (Selektive Indifferenz)",
      en: "Package B: Professional empathy (selective indifference)",
    },
    focus: {
      de: "Konfliktmanagement & Team-Schutz, klare professionelle Distanz.",
      en: "Conflict management & team shielding with professional distance.",
    },
    benefit: {
      de: "Performance-orientierte Fürsorge ohne emotionale Verstrickung.",
      en: "Performance-oriented care without emotional entanglement.",
    },
    priceFactor: 1.5,
    tagline: {
      de: "Empathisch, aber klar abgegrenzt.",
      en: "Empathetic, but clearly bounded.",
    },
    definition: {
      de: "Der Projektleiter kümmert sich spürbar um Team und Stakeholder, bleibt aber gut abgegrenzt.",
      en: "The project lead visibly cares for team and stakeholders, while maintaining boundaries.",
    },
    offer: {
      de: "Aktives Stakeholder-Management, Moderation von Spannungen, Schutz der Kernteams.",
      en: "Active stakeholder management, tension moderation, protection of core teams.",
    },
    inclusion: {
      de: "Einzel- und Kleingruppen-Check-ins, konstruktive Konfliktgespräche, Frühwarnsystem für Überlast.",
      en: "One-to-one and small-group check-ins, constructive conflict talks, early warning for overload.",
    },
    exclusion: {
      de: "Kein 24/7-Ownership des Projekts, keine Übernahme von Personalverantwortung außerhalb des Mandats.",
      en: "No 24/7 ownership of the project, no personnel responsibility beyond the mandate.",
    },
    priceLabel: {
      de: "Faktor 1,5 (erhöhtes Caring)",
      en: "Factor 1.5 (increased caring)",
    },
  },
  {
    id: "care-c",
    name: {
      de: "Paket C: Total Ownership (Maximale Identifikation)",
      en: "Package C: Total ownership (maximum identification)",
    },
    focus: {
      de: "Intrapreneurship, politische Kämpfe für das Projekt, Kulturarbeit.",
      en: "Intrapreneurship, political fights for the project, culture work.",
    },
    benefit: {
      de: "Höchster Einsatz – der Projektleiter verkauft seine Nerven und Sorge.",
      en: "Highest commitment – the project lead literally sells their nerves and concern.",
    },
    priceFactor: 2.0,
    tagline: {
      de: "Als wäre es das eigene Unternehmen.",
      en: "As if it were their own company.",
    },
    definition: {
      de: "Der Projektleiter identifiziert sich maximal mit Projekt und Organisation und geht politisch in Vorleistung.",
      en: "The project lead identifies strongly with project and organisation and leans in politically.",
    },
    offer: {
      de: "Aktive Kulturarbeit, politische Allianzen, hartnäckige Vertretung der Projektinteressen.",
      en: "Active culture work, political alliances, persistent representation of project interests.",
    },
    inclusion: {
      de: "Hohe Verfügbarkeit, intensive Präsenz in Entscheidungsrunden, Ownership auch in Grauzonen.",
      en: "High availability, intensive presence in decision rounds, ownership even in grey areas.",
    },
    exclusion: {
      de: "Keine Übernahme der rechtlichen Arbeitgeberfunktion oder formaler Organhaftung.",
      en: "No assumption of legal employer function or formal director liability.",
    },
    priceLabel: {
      de: "Faktor 2,0 (maximales Caring)",
      en: "Factor 2.0 (maximum caring)",
    },
  },
];

/** Für das UI in brief/page.tsx: Aliase mit reicheren Beschreibungen */
export const PSYCHO_PACKAGES = PSYCH_LEVELS;
export const CARING_PACKAGES = CARING_LEVELS;
