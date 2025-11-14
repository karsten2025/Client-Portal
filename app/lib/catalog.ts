// app/lib/catalog.ts
export type Lang = "de" | "en";

export type BehaviorId = "classic" | "political" | "chaos" | "turnaround";
export type SkillId =
  | "living-systems"
  | "complex-adaptive"
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

export const BEHAVIORS: {
  id: BehaviorId;
  ctx: Record<Lang, string>;
  pkg: Record<Lang, string>;
  style: Record<Lang, string>;
  outcome: Record<Lang, string>;
}[] = [
  {
    id: "classic",
    ctx: { de: "Klassisches Marktumfeld", en: "Classical market environment" },
    pkg: { de: "Der Neutrale Steuermann", en: "The neutral helmsman" },
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
    ctx: { de: "Hoch-politisches Umfeld", en: "Highly political environment" },
    pkg: { de: "Der Allparteiliche Mediator", en: "The all-party mediator" },
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
    ctx: { de: "Starkes Wachstum / Chaos", en: "Strong growth / chaos" },
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
    ctx: { de: "Akute Krise / Turnaround", en: "Acute crisis / turnaround" },
    pkg: { de: "Der Konsequente Sanierer", en: "The decisive turnaround lead" },
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

export const SKILLS: {
  id: SkillId;
  title: Record<Lang, string>;
  offerShort: Record<Lang, string>;
  needPH: Record<Lang, string>;
  outcomePH: Record<Lang, string>;
}[] = [
  // ⬇️ NEU 1: Living systems creator
  {
    id: "living-systems",
    title: { de: "Living systems creator", en: "Living systems creator" },
    offerShort: {
      de: "Gestaltung resilienter, lernfähiger Arbeitsumgebungen und Organisationsstrukturen.",
      en: "Design of resilient, learning work environments and organizational structures.",
    },
    needPH: {
      de: "[ Hier beschreiben Sie Ihren Bedarf… ]",
      en: "[ Describe your need here… ]",
    },
    outcomePH: {
      de: "[ Hier definieren Sie das gewünschte Ergebnis… ]",
      en: "[ Define the desired outcome here… ]",
    },
  },
  // ⬇️ NEU 2: Complex adaptive systems creator
  {
    id: "complex-adaptive",
    title: {
      de: "Complex adaptive systems creator",
      en: "Complex adaptive systems creator",
    },
    offerShort: {
      de: "Design von Prozessen & Teams (basierend auf Komplexitätstheorie) für unvorhersehbare Märkte.",
      en: "Design of processes & teams (complexity science) for unpredictable markets.",
    },
    needPH: {
      de: "[ Hier beschreiben Sie Ihren Bedarf… ]",
      en: "[ Describe your need here… ]",
    },
    outcomePH: {
      de: "[ Hier definieren Sie das gewünschte Ergebnis… ]",
      en: "[ Define the desired outcome here… ]",
    },
  },

  // --- bestehender Katalog ---
  {
    id: "eng",
    title: { de: "Ingenieurtätigkeiten", en: "Engineering activities" },
    offerShort: {
      de: "Technisches Verständnis & Analysefähigkeit für komplexe (z. B. mech.) Sachverhalte.",
      en: "Technical understanding & analysis for complex (e.g., mech.) topics.",
    },
    needPH: {
      de: "[ Hier beschreiben Sie Ihren Bedarf… ]",
      en: "[ Describe your need here… ]",
    },
    outcomePH: {
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
    needPH: {
      de: "[ z. B. Großprojekt X ist aus dem Ruder… ]",
      en: "[ e.g., major project X is off track… ]",
    },
    outcomePH: {
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
    needPH: {
      de: "[ z. B. Einführung von Scrum in 3 Teams… ]",
      en: "[ e.g., introduce Scrum to 3 teams… ]",
    },
    outcomePH: {
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
    needPH: {
      de: "[ z. B. Hardware trifft Software… ]",
      en: "[ e.g., hardware meets software… ]",
    },
    outcomePH: {
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
    needPH: {
      de: "[ z. B. Unser Onboarding-Prozess ist ineffizient… ]",
      en: "[ e.g., our onboarding process is inefficient… ]",
    },
    outcomePH: {
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
    needPH: {
      de: "[ z. B. Reklamationen reduzieren… ]",
      en: "[ e.g., reduce claims… ]",
    },
    outcomePH: {
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
    needPH: {
      de: "[ z. B. PMO liefert keine strategischen Inputs… ]",
      en: "[ e.g., PMO lacks strategic input… ]",
    },
    outcomePH: {
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
    needPH: {
      de: "[ z. B. Pilotprojekt ‚RPA‘ muss gesteuert werden… ]",
      en: "[ e.g., RPA pilot needs steering… ]",
    },
    outcomePH: {
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
    needPH: {
      de: "[ z. B. Teamleiter X ist ausgefallen… ]",
      en: "[ e.g., team lead X unavailable… ]",
    },
    outcomePH: {
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
    needPH: {
      de: "[ z. B. Vakanz für 6 Monate überbrücken… ]",
      en: "[ e.g., cover 6-month vacancy… ]",
    },
    outcomePH: {
      de: "[ z. B. Abteilung ist stabil geführt, Übergabe erfolgt… ]",
      en: "[ e.g., department stable, handover complete… ]",
    },
  },
];

export const LOCAL_KEYS = {
  behavior: "selectedBehaviorId",
  skills: "selectedSkillIds",
  notes: "skillNotes",
} as const;
