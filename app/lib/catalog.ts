// app/lib/catalog.ts

export type Lang = "de" | "en";

/** IDs als String-Literal-Typen (gut für Type-Safety im UI) */
export type BehaviorId = "classic" | "political" | "chaos" | "turnaround";
export type SkillId =
  | "eng"
  | "pm-waterfall"
  | "pm-agile"
  | "pm-hybrid"
  | "process"
  | "quality"
  | "pmo"
  | "cognitive"
  | "teamlead"
  | "deptlead"
  | "living-systems"
  | "complex-adaptive";

/** Neue IDs für Kategorie 5 */
export type PsychoId = "psycho-a" | "psycho-b" | "psycho-c";
export type CaringId = "care-a" | "care-b" | "care-c";

/** Verhalten / Kontext-Paket (Tabelle „Adaptive Interim-Pakete & Mandats-Scope“) */
export type Behavior = {
  id: BehaviorId;
  ctx: Record<Lang, string>; // Unternehmenskontext
  pkg: Record<Lang, string>; // Lösungs-Paket (Verhalten)
  style: Record<Lang, string>; // Verhaltens-Fokus (Stil)
  outcome: Record<Lang, string>; // Ihr Nutzen (Ergebnis)
};

/** Fachliche Qualifikation (Tabelle „Fachliche Qualifikation …“) */
export type Skill = {
  id: SkillId;
  title: Record<Lang, string>; // Fachliche Qualifikation
  offerShort: Record<Lang, string>; // Kurzbeschreibung (Mein Angebot)
  needPlaceholder: Record<Lang, string>; // Platzhalter für Anliegen
  outcomePlaceholder: Record<Lang, string>; // Platzhalter für Nutzen/DoD
};

/** Kategorie 5a: Psychosoziale Interventions-Level */
export type PsychoPackage = {
  id: PsychoId;
  name: Record<Lang, string>;
  level: Record<Lang, string>;
  focus: Record<Lang, string>;
  include: Record<Lang, string>;
  exclude: Record<Lang, string>;
  benefit: Record<Lang, string>;
  factor: number;
  factorLabel: Record<Lang, string>;
};

/** Kategorie 5b: Grad der emotionalen Investition („Caring“-Modell) */
export type CaringPackage = {
  id: CaringId;
  name: Record<Lang, string>;
  tagline: Record<Lang, string>;
  definition: Record<Lang, string>;
  offer: Record<Lang, string>;
  inclusion: Record<Lang, string>;
  exclusion: Record<Lang, string>;
  priceLabel: Record<Lang, string>;
};

/** BEHAVIORS: konsolidiert & sprachschlüssig */
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

/** SKILLS: konsolidiert & sprachschlüssig */
export const SKILLS: Skill[] = [
  {
    id: "living-systems",
    title: {
      de: "Living systems creator",
      en: "Living systems creator",
    },
    offerShort: {
      de: "Gestaltung resilienter, lernfähiger Arbeitsumgebungen und Organisationsstrukturen.",
      en: "Design of resilient, learning work environments and organisational structures.",
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
    id: "complex-adaptive",
    title: {
      de: "Complex adaptive systems creator",
      en: "Complex adaptive systems creator",
    },
    offerShort: {
      de: "Design von Prozessen & Teams (basierend auf Komplexitätstheorie) für unvorhersehbare Märkte.",
      en: "Design of processes & teams (complexity-informed) for unpredictable markets.",
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

/** 5a – Psychosoziale Interventions-Level */
export const PSYCHO_PACKAGES: PsychoPackage[] = [
  {
    id: "psycho-a",
    name: {
      de: "Der Transparenz-Architekt",
      en: "The transparency architect",
    },
    level: {
      de: "Basis-Level",
      en: "Base level",
    },
    focus: {
      de: "Fokus auf Ordnung & Struktur.",
      en: "Focus on order & structure.",
    },
    include: {
      de: "Sachliche Kommunikation, Status-Transparenz, Eskalation nach definierten Regeln, Einhalten von Governance.",
      en: "Factual communication, status transparency, escalation by clear rules, strict governance adherence.",
    },
    exclude: {
      de: "Lösung tiefer zwischenmenschlicher Konflikte, Kulturwandel-Arbeit, individuelles Coaching.",
      en: "Resolving deep interpersonal conflicts, culture-change work, individual coaching.",
    },
    benefit: {
      de: "Maximale administrative Sicherheit und Planbarkeit (Compliance).",
      en: "Maximum administrative safety and predictability (compliance).",
    },
    factor: 1.0,
    factorLabel: {
      de: "Preisfaktor: Basis (1,0x)",
      en: "Price factor: base (1.0x)",
    },
  },
  {
    id: "psycho-b",
    name: {
      de: "Der Resilienz-Schild",
      en: "The resilience shield",
    },
    level: {
      de: "Advanced Level / Servant Leadership",
      en: "Advanced level / servant leadership",
    },
    focus: {
      de: "Fokus auf Team-Schutz & Befähigung.",
      en: "Focus on team protection & enablement.",
    },
    include: {
      de: "Aktives Shielding des Teams vor externem Druck, psychologische Sicherheit, Coaching, Absorbieren von operativer Hektik.",
      en: "Active shielding of the team from external pressure, psychological safety, coaching, absorbing operational noise.",
    },
    exclude: {
      de: "Command & Control, Weitergabe ungefilterten Stresses, Micromanagement.",
      en: "Command & control, passing on unfiltered stress, micromanagement.",
    },
    benefit: {
      de: "Stabile, hochperformante Teams und Reduktion von Fluktuation auch in stressigen Phasen.",
      en: "Stable high-performing teams and reduced attrition even under stress.",
    },
    factor: 1.2,
    factorLabel: {
      de: "Preisfaktor: Premium (1,2x) – emotionale Stabilität inklusive.",
      en: "Price factor: premium (1.2x) – emotional stability included.",
    },
  },
  {
    id: "psycho-c",
    name: {
      de: "Der Sensemaker & Diplomat",
      en: "The sensemaker & diplomat",
    },
    level: {
      de: "Expert-Level / Systemisch",
      en: "Expert level / systemic",
    },
    focus: {
      de: "Fokus auf Stakeholder & Komplexität.",
      en: "Focus on stakeholders & complexity.",
    },
    include: {
      de: "Übersetzung zwischen Business/IT/Strategie, politisches Stakeholder-Management, Moderation von Interessenkonflikten, Aushalten von Ambiguität.",
      en: "Translation between business/IT/strategy, political stakeholder management, moderation of interest conflicts, holding ambiguity.",
    },
    exclude: {
      de: "Silo-Denken, Rückzug auf reine Vertragserfüllung („Dienst nach Vorschrift“).",
      en: "Silo thinking, retreating to narrow contract fulfilment (“just doing my job”).",
    },
    benefit: {
      de: "Handlungsfähigkeit in politisch komplexen Umfeldern; Sicherung des strategischen Projektwerts.",
      en: "Ability to act in politically complex environments; protection of strategic project value.",
    },
    factor: 1.4,
    factorLabel: {
      de: "Preisfaktor: High-End (1,4x) – Risikominderung auf politischer Ebene.",
      en: "Price factor: high-end (1.4x) – political risk mitigation.",
    },
  },
];

/** 5b – Grad der emotionalen Investition („Caring“-Modell) */
export const CARING_PACKAGES: CaringPackage[] = [
  {
    id: "care-a",
    name: {
      de: "Dienst nach Vorschrift",
      en: "By-the-book delivery",
    },
    tagline: {
      de: "Maximale Indifferenz – reine Methodik.",
      en: "Maximum indifference – pure method.",
    },
    definition: {
      de: "Der PM agiert als technokratischer Beobachter.",
      en: "The PM acts as a technocratic observer.",
    },
    offer: {
      de: "Reines Reporting des Status quo, strikte Prozess-Governance, Verweis auf Regelwerk statt Empathie.",
      en: "Pure status reporting, strict process governance, reference to rules instead of empathy.",
    },
    inclusion: {
      de: "Beobachtung 2. Ordnung („Ich sehe, dass Sie ein Problem haben“).",
      en: "Second-order observation (“I see that you have a problem”).",
    },
    exclusion: {
      de: "Mitleid, Retten-Wollen, Überstunden aus Loyalität.",
      en: "Pity, rescue reflex, overtime out of loyalty.",
    },
    priceLabel: {
      de: "Günstigster Tarif – Sie zahlen für Anwesenheit und Methode, nicht für Herzblut.",
      en: "Cheapest tier – you pay for presence and method, not for emotional investment.",
    },
  },
  {
    id: "care-b",
    name: {
      de: "Professionelle Empathie",
      en: "Professional empathy",
    },
    tagline: {
      de: "Selektive Indifferenz – Caring als Performance-Hebel.",
      en: "Selective indifference – caring as a performance lever.",
    },
    definition: {
      de: "Der PM agiert als Coach mit professioneller Distanz.",
      en: "The PM acts as coach while keeping professional distance.",
    },
    offer: {
      de: "Aktives Konfliktmanagement, Schutz des Teams vor externem Chaos, psychologische Sicherheit als Mittel zum Zweck.",
      en: "Active conflict management, shielding the team from external chaos, psychological safety as a means to performance.",
    },
    inclusion: {
      de: "Situatives Engagement, klare Orientierung am Projektziel.",
      en: "Situational engagement, clear focus on project goals.",
    },
    exclusion: {
      de: "Private Sorgen des Teams, emotionale Verstrickung in Firmenpolitik.",
      en: "Private problems of team members, emotional entanglement in company politics.",
    },
    priceLabel: {
      de: "Mittlerer Tarif – Sie zahlen für kognitive und emotionale Energie statt für bequeme Apathie.",
      en: "Mid-tier – you pay for cognitive and emotional effort instead of convenient apathy.",
    },
  },
  {
    id: "care-c",
    name: {
      de: "Total Ownership",
      en: "Total ownership",
    },
    tagline: {
      de: "Minimale Indifferenz – maximale Identifikation.",
      en: "Minimal indifference – maximum identification.",
    },
    definition: {
      de: "Der PM handelt, als wäre es sein eigenes Geld und seine eigene Firma.",
      en: "The PM acts as if it were their own money and company.",
    },
    offer: {
      de: "Politische Kämpfe für das Projekt, Kulturarbeit und Sinnstiftung, Antizipation von Problemen vor der Messbarkeit.",
      en: "Political battles for the project, culture work and sensemaking, anticipation of issues before they become measurable.",
    },
    inclusion: {
      de: "Emotionales Mittragen des Systemrisikos.",
      en: "Emotionally carrying the systemic risk.",
    },
    exclusion: {
      de: "„Nicht mein Job“-Mentalität, 9-to-5-Denken.",
      en: "“Not my job” mentality, strict 9-to-5 thinking.",
    },
    priceLabel: {
      de: "Höchster Tarif – Sie zahlen für Nerven, Sorge und Reputationseinsatz.",
      en: "Highest tier – you pay for nerves, concern and reputation risk.",
    },
  },
];

/** LocalStorage-Keys für das Briefing */
export const LOCAL_KEYS = {
  form: "brief.form",
  behavior: "brief.behavior",
  skills: "brief.skills",
  notes: "brief.notes",
  psycho: "brief.psycho",
  caring: "brief.caring",
};
