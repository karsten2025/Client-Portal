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
      de: "Objektivität, Mandatsklarheit, Fokus auf Fortschritt.",
      en: "Objectivity, mandate clarity, focus on progress",
    },
    outcome: {
      de: "Systematische Begleitung der Strategie-Realisierung & maximale Transparenz.",
      en: "Systematic support for strategy realization & maximum transparency.",
    },
  },
  {
    id: "political",
    ctx: {
      de: "Hoch-politisches Umfeld",
      en: "Highly political environment",
    },
    pkg: {
      de: "Mediator",
      en: "Mediator",
    },
    style: {
      de: "System-Mediation, Konsens-Förderung, politische Sensitivität.",
      en: "Systemic moderation, consensus building, political sensitivity.",
    },
    outcome: {
      de: "Professionelles Konfliktmanagement & Wiederherstellung der Handlungsfähigkeit.",
      en: "Professional conflict management & restoration of operational capability.",
    },
  },
  {
    id: "chaos",
    ctx: {
      de: "Starkes Wachstum / Chaos",
      en: "Strong growth / chaos",
    },
    pkg: {
      de: "Stabilisator",
      en: "Stabilizer",
    },
    style: {
      de: "Schnelle Analyse (80/20), Fokus auf effiziente Strukturen.",
      en: "Rapid analysis (80/20), focus on efficient structures.",
    },
    outcome: {
      de: "Spürbare operative Entlastung & Etablierung schlanker, skalierbarer Prozesse.",
      en: "Tangible operational relief & establishment of lean, scalable processes.",
    },
  },
  {
    id: "turnaround",
    ctx: {
      de: "Akute Krise / Turnaround",
      en: "Acute crisis / turnaround",
    },
    pkg: {
      de: "Sanierer",
      en: "Turnaround lead",
    },
    style: {
      de: "Konsequente Priorisierung, engmaschige Steuerung, Fokus auf Sofort-Maßnahmen",
      en: "Consistent prioritization, close monitoring, focus on immediate measures.",
    },
    outcome: {
      de: "Aktives Krisenmanagement & Stabilisierung der Situation.",
      en: "Active crisis management & stabilization of the situation.",
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
      de: "Resiliente Unternehmens/Organisations-Architektur (Living Systems)",
      en: "Resilient Enterprise/Organizational Architecture (Living Systems)",
    },
    offerShort: {
      de: "Gestaltung anpassungsfähiger Arbeitsumgebungen und lernender Strukturen.",
      en: "Design of adaptive work environments and learning structures.",
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
      de: "Komplexitätsmanagement & System-Design (CAS)",
      en: "Complexity Management & System Design (CAS)",
    },
    offerShort: {
      de: "Design von Prozessen für unvorhersehbare Märkte (basierend auf Komplexitätstheorie).",
      en: "Design of processes for unpredictable markets (based on complexity theory).",
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
      de: "ITechnische Beratung & Analyse (Engineering)",
      en: "Technical Consulting & Analysis (Engineering)",
    },
    offerShort: {
      de: "Technisches Verständnis & analytische Bewertung komplexer Sachverhalte (als Dipl.-Ing.(FH)).",
      en: "Technical understanding & analytical assessment of complex matters (as M.Eng.).",
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
      en: "Project management classic (waterfall)",
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
    title: {
      de: "Projektmanagement Agil (Scrum/Kanban etc.)",
      en: "Project Management Agile (Scrum/Kanban etc.)",
    },
    offerShort: {
      de: "IIterative Steuerung, Wertfokus und methodisches Coaching von Teams.",
      en: "Iterative control, value focus, and methodical coaching of teams.",
    },
    needPlaceholder: {
      de: "[ z. B. Einführung von Scrum/Kanabn in 3 Teams… ]",
      en: "[ e.g., introduce Scrum/Kanban to 3 teams… ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. Teams arbeiten in Sprints, Velocity messbar… ]",
      en: "[ e.g., teams run sprints, velocity measurable… ]",
    },
  },
  {
    id: "pm-hybrid",
    title: { de: "Projektmanagement Hybrid", en: "Project Management Hybrid" },
    offerShort: {
      de: "Integrative Verzahnung klassischer (Hardware) und agiler (Software) Methoden.",
      en: "Integrative interlocking of classic (hardware) and agile (software) methods.",
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
    title: {
      de: "Prozessmanagement-Beratung (BPMN)",
      en: "Process Management Consulting (BPMN)",
    },
    offerShort: {
      de: "Analyse, Konzeption und Begleitung der Optimierung von Geschäftsabläufen.",
      en: "Analysis, conception, and support in the optimization of business processes.",
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
    title: {
      de: "Qualitätsmanagement-Support",
      en: "Quality Management Support",
    },
    offerShort: {
      de: "Etablierung von Standards und methodische Vorbereitung interner/externer Audits (z. B. ISO).",
      en: "Establishment of standards and methodical preparation for internal/external audits (e.g., ISO).",
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
    title: { de: "PMO-Consulting & Setup", en: "PMO Consulting & Setup" },
    offerShort: {
      de: "Aufbau & operative Steuerung (Strategisch/Taktisch) von Project Management Offices.",
      en: "Setup & operational control (Strategic/Tactical) of Project Management Offices.",
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
    title: {
      de: "KI & Kognitives Projektmanagement",
      en: "AI & Cognitive Project Management",
    },
    offerShort: {
      de: "Management von KI-Initiativen: Schnittstellen-Management zwischen Business & Data Science.",
      en: "Management of AI initiatives: Interface management between Business & Data Science.",
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
    title: {
      de: "Team-Koordination & Laterale Führung",
      en: "Team Coordination & Lateral Leadership",
    },
    offerShort: {
      de: "Fachliche Steuerung von Teams und operative Koordination ohne Disziplinarbefugnis.",
      en: "Functional steering of teams and operational coordination without disciplinary authority.",
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
    title: {
      de: "Interim Management (PMO / Fachbereich)",
      en: "Interim Management (PMO / Department)",
    },
    offerShort: {
      de: "Temporäre Übernahme von Management-Aufgaben und Prozessverantwortung auf Mandatsbasis.",
      en: "Temporary assumption of management tasks and process responsibility on a mandate basis.",
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
      de: "Paket A: Der Struktur-Architekt (Basis-Level)",
      en: "Package A: The Structure Architect (Basic Level)",
    },
    focus: {
      de: "Fokus auf Ordnung & Transparenz.",
      en: "Focus on order and structure.",
    },
    benefit: {
      de: "Hohe administrative Transparenz und verbesserte Planbarkeit (Compliance).",
      en: "High administrative transparency and improved planning certainty (Compliance).",
    },
    priceFactor: 1.0,
    level: {
      de: "Basis-Level",
      en: "Base level",
    },
    include: {
      de: "Schaffung von Klarheit über Rollen, Prozesse und Entscheidungswege.",
      en: "Creating clarity regarding roles, processes, and decision-making paths.",
    },
    exclude: {
      de: "Keine tiefenpsychologische Konfliktintervention oder persönliche Krisenbegleitung.",
      en: "No deep psychological conflict intervention or personal crisis counseling.",
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
      en: "Focus on Team Protection & Enablement.",
    },
    benefit: {
      de: "Stabile, leistungsfähige Teams und reduzierte Reibungsverluste in Stressphasen.",
      en: "Stable, high-performing teams and reduced friction during stressful phases.",
    },
    priceFactor: 1.5,
    level: {
      de: "Advanced-Level",
      en: "Advanced level",
    },
    include: {
      de: "Regelmäßige Team-Reflexionen, Konfliktmoderation im Team, Aufbau von Resilienz-Routinen.",
      en: "RRegular team reflections, moderation of tension fields, establishing resilience routines.",
    },
    exclude: {
      de: "Therapeutischen Maßnahmen oder unternehmensweite Kulturprogramme ohne Mandat.",
      en: "Therapeutic measures or company-wide culture programs without a specific mandate.",
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
      de: "Sicherung der Handlungsfähigkeit in politisch komplexen Umfeldern und Schutz des Wertes.",
      en: "Ensuring ability to act in politically complex environments and protection of project value.",
    },
    priceFactor: 2.0,
    level: {
      de: "Expert-Level",
      en: "Expert level",
    },
    include: {
      de: "Systemische Analyse, Arbeit mit formellen und informellen Einflussstrukturen, Gestaltung belastbarer Netzwerke.",
      en: "SSystemic analysis, working with formal and informal influence structures, shaping resilient networks.",
    },
    exclude: {
      de: "Organhaftung (Geschäftsführung) für Konzerngesellschaften oder Konzern-Governance.",
      en: "Executive liability (officer status) for corporate entities or corporate governance.",
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
      de: "Paket A: Fokus auf Auftragserfüllung (Professionelle Distanz)",
      en: "Package A: Focus on Execution (Professional Distance)",
    },
    focus: {
      de: "Sachlich, effizient, Scope-orientiert. Der Agent agiert fokussiert auf Basis der vereinbarten Deliverables.",
      en: "Objective, efficient, scope-oriented. The project manager acts with focus, based strictly on agreed deliverables.",
    },
    benefit: {
      de: "Maximale Kosteneffizienz und strikte Fokussierung auf harte Fakten ohne administrativen „Overhead“",
      en: "Maximum cost efficiency and strict focus on hard facts without administrative overhead.",
    },
    priceFactor: 1.0,
    tagline: {
      de: "Professionell, distanziert, sachlich.",
      en: "Professional, distant, factual.",
    },
    definition: {
      de: "Der Agent führt sauber aus, die emotionale Beteiligung beschränkt sich auf ein Minimum.",
      en: "The agent executes cleanly, emotional involvement is kept to a minimum.",
    },
    offer: {
      de: "Fokus auf Struktur, Reporting, Termin- und Budgettreue gemäß Vertrag.",
      en: "Focus on structure, reporting, schedule, and budget adherence according to contract.",
    },
    inclusion: {
      de: "Regelmäßige Statusberichte, Risiko-Monitoring, formale Eskalationen.",
      en: "Regular status reports, risk monitoring, formal escalations.",
    },
    exclusion: {
      de: "Tiefe kulturelle Integration, keine psychologische Betreuung von Führung und Teams.",
      en: "Deep cultural integration, no psychological counseling for leadership or teams.",
    },
    priceLabel: {
      de: "Faktor 1,0 (Basis-Caring)",
      en: "Factor 1.0 (base caring)",
    },
  },
  {
    id: "care-b",
    name: {
      de: "Paket B: Aktives Stakeholder-Engagement (Servant Leadership)",
      en: "Package B: Active Stakeholder Engagement (Servant Leadership)",
    },
    focus: {
      de: "Empathisch, teamorientiert, schützend. Der Agent kümmert sich aktiv um die Leistungsfähigkeit des Teams und das Umfeld.",
      en: "Empathetic, team-oriented, protective. The agent actively ensures team performance and manages the environment.",
    },
    benefit: {
      de: "Reduziertes Fluktuations- und Burnout-Risiko im Team sowie höhere Produktivität durch psychologische Sicherheit.",
      en: "Reduced risk of turnover and burnout within the team, plus higher productivity through psychological safety.",
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
      de: "Aktives Stakeholder-Management, Moderation von Spannungen, Schutz der Kernteams („Shielding“)",
      en: "Active stakeholder management, moderation of tensions, shielding of core teams.",
    },
    inclusion: {
      de: "Einzel- und Kleingruppen-Check-ins, konstruktive Konfliktgespräche, Frühwarnsystem für Überlast.",
      en: "One-to-one and small-group check-ins, constructive conflict talks, early warning for overload.",
    },
    exclusion: {
      de: "Übernahme disziplinarischer Personalverantwortung außerhalb des Mandats.",
      en: "No assumption of disciplinary HR responsibility outside the mandate.",
    },
    priceLabel: {
      de: "Faktor 1,5 (erhöhtes Caring)",
      en: "Factor 1.5 (increased caring)",
    },
  },
  {
    id: "care-c",
    name: {
      de: "Paket C: Maximale Ergebnis-Dedikation (Unternehmerisches Denken)",
      en: "Package C: Maximum Result Dedication (Entrepreneurial Mindset)",
    },
    focus: {
      de: "Hochidentifiziert, politisch versiert, intensiv. Der Agent vertritt die Interessen mit unternehmerischem Mindset („Act like an owner, stay a consultant“).",
      en: "Highly identified, politically savvy, intense. The project manager represents project interests with an entrepreneurial mindset (Act like an owner, stay a consultant).",
    },
    benefit: {
      de: "Maximale Entlastung des Auftraggebers und hohe Durchsetzungskraft in schwierigen politischen Gemengelagen.",
      en: "Maximum relief for the client and high assertiveness in difficult political environments.",
    },
    priceFactor: 2.0,
    tagline: {
      de: "Als wäre es das eigene Unternehmen.",
      en: "As if it were their own company.",
    },
    definition: {
      de: "Der Agent identifiziert sich maximal mit den Zielen des Unternehmens und geht politisch in Vorleistung.",
      en: "The agent identifies fully with the company's goals and takes the political initiative.",
    },
    offer: {
      de: "Intensive Präsenz in Entscheidungsgremien, aktive Gestaltung von Allianzen, hartnäckige Vertretung der Ziele.",
      en: "Intensive presence in decision-making bodies, active shaping of alliances, persistent representation of goals.",
    },
    inclusion: {
      de: "Hohe Verfügbarkeit, „Sparring Partner“ für das Management, Ownership für Governance-Themen.",
      en: "High availability, Sparring Partner for management, ownership of governance topics.",
    },
    exclusion: {
      de: "Organschaftliche Vertretung (GF-Haftung) oder Eingliederung in die interne Organisation.",
      en: "Corporate executive liability (x-officer status) or integration into the internal organization.",
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
