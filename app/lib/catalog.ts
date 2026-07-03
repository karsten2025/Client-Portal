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
  | "strategic_architecture"
  | "tactical_governance"
  | "operational_realization";

export type Skill = {
  id: SkillId;
  title: Record<Lang, string>;
  offerShort: Record<Lang, string>;
  needPlaceholder: Record<Lang, string>;
  outcomePlaceholder: Record<Lang, string>;
};

export const SKILLS: Skill[] = [
  {
    id: "strategic_architecture",
    title: {
      de: "Strategische System-Architektur (Weitblick / Governance)",
      en: "Strategic System Architecture (Vision / Governance)",
    },
    offerShort: {
      de: "Langfristige Systemausrichtung, zukunftssichere KI-Integration (Governance Hub), Strukturaufbau und Ausrichtung komplexer Stakeholder-Interessen im mitbestimmten Umfeld.",
      en: "Long-term system alignment, future-proof AI integration (Governance Hub), structural setup, and alignment of complex stakeholder interests within co-determined environments.",
    },
    needPlaceholder: {
      de: "[ z. B. Welche strategischen Weichen müssen gestellt werden? ]",
      en: "[ e.g., Which strategic directions need to be set? ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. Governance-Struktur steht, KI-Roadmap ist freigegeben. ]",
      en: "[ e.g., Governance structure established, AI roadmap approved. ]",
    },
  },
  {
    id: "tactical_governance",
    title: {
      de: "Taktische Steuerung (Prozesse / Intermediäre Synchronisation)",
      en: "Tactical Governance (Processes / Intermediary Synchronization)",
    },
    offerShort: {
      de: "Mittelfristiges Projekt-Framework, methoden-agnostische Synchronisation (Klassisch/Agil/Hybrid), PMO-Strukturen und die Auflösung von Schnittstellen-Blockaden.",
      en: "Medium-term project framework, method-agnostic synchronization (Traditional/Agile/Hybrid), PMO structures, and resolution of interface blockages.",
    },
    needPlaceholder: {
      de: "[ z. B. Welche Prozesse oder Schnittstellen blockieren den Fortschritt? ]",
      en: "[ e.g., Which processes or interfaces are blocking progress? ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. PMO läuft, Synchronisation zwischen Teams ist sichergestellt. ]",
      en: "[ e.g., PMO running, synchronization between teams ensured. ]",
    },
  },
  {
    id: "operational_realization",
    title: {
      de: "Operative Realisierung (Pragmatismus / Werksebene)",
      en: "Operational Realization (Pragmatism / Factory Floor)",
    },
    offerShort: {
      de: "Direkte, messbare Umsetzung vor Ort. Krisen-Intervention, Schließung von Performanz-Lücken, Task-Force-Leitung und Absicherung harter Meilensteine direkt auf der Werksebene.",
      en: "Direct, measurable implementation on-site. Crisis intervention, closing performance gaps, task force management, and securing hard milestones directly on the factory floor.",
    },
    needPlaceholder: {
      de: "[ z. B. Welcher Meilenstein ist in Verzug oder welche Krise muss gelöst werden? ]",
      en: "[ e.g., Which milestone is overdue or which crisis needs resolving? ]",
    },
    outcomePlaceholder: {
      de: "[ z. B. Meilenstein erreicht, Performanz-Lücke geschlossen, Stabilisierung nachweisbar. ]",
      en: "[ e.g., Milestone reached, performance gap closed, stabilization measurable. ]",
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
      de: "Prozessbegleitung & Monitoring",
      en: "Process Guidance & Monitoring",
    },
    focus: {
      de: "Begleitende Steuerung bei stabiler Systemdynamik.",
      en: "Accompanying control under stable system dynamics.",
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
      de: "Leistungsumfang: Standard-Tiefe",
      en: "Scope: standard depth",
    },
  },
  {
    id: "psych-b",
    name: {
      de: "Strukturelle Restrukturierung",
      en: "Structural Restructuring",
    },
    focus: {
      de: "Aktiver Eingriff in verh\u00e4rtete Schnittstellen und Prozesse bei erh\u00f6hter Komplexit\u00e4t.",
      en: "Active intervention in hardened interfaces and processes under increased complexity.",
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
      de: "Leistungsumfang: erweiterte Intervention",
      en: "Scope: extended intervention",
    },
  },
  {
    id: "psych-c",
    name: {
      de: "Fundamentale System-Reorganisation",
      en: "Fundamental System Reorganization",
    },
    focus: {
      de: "Tiefgreifende Neuausrichtung bei akutem Systemversagen oder Blockadesituationen.",
      en: "Deep realigning during acute system failure or total deadlock situations.",
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
      de: "Leistungsumfang: tiefe Systemarbeit",
      en: "Scope: deep system work",
    },
  },
];

export const CARING_LEVELS: Level[] = [
  {
    id: "care-a",
    name: {
      de: "Objektive Beraterdistanz",
      en: "Objective Consultant Distance",
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
      de: "Reine methodische Steuerung und unparteiische Analyse von au\u00dfen.",
      en: "Pure methodical governance and impartial analysis from the outside.",
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
      de: "Leistungsumfang: fokussierte Auftragsabwicklung",
      en: "Scope: focused delivery",
    },
  },
  {
    id: "care-b",
    name: {
      de: "Unternehmerische Mitverantwortung",
      en: "Entrepreneurial Co-Responsibility",
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
      de: "Tiefe operative Integration. Ich denke und handle im Sinne Ihrer Werksziele.",
      en: "Deep operational integration. Active alignment with your factory and business targets.",
    },
    definition: {
      de: "Der Agent kümmert sich spürbar um Team und Stakeholder, bleibt aber gut abgegrenzt.",
      en: "The agent visibly cares for team and stakeholders, while maintaining boundaries.",
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
      de: "Leistungsumfang: aktives Stakeholder-Engagement",
      en: "Scope: active stakeholder engagement",
    },
  },
  {
    id: "care-c",
    name: {
      de: "Interim-Vollkaskohaftung (Mental Ownership)",
      en: "Interim Mental Ownership",
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
      de: "Maximale Identifikation. Kompensation des pers\u00f6nlichen Risikos kritischer Transformationsentscheidungen im Konsens mit der Mitbestimmung.",
      en: "Maximum identification. Compensation of personal risk during critical transformation decisions in alignment with co-determination.",
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
      de: "Leistungsumfang: maximale persönliche Einbindung",
      en: "Scope: maximum personal commitment",
    },
  },
];

/** Für das UI in brief/page.tsx: Aliase mit reicheren Beschreibungen */
export const PSYCHO_PACKAGES = PSYCH_LEVELS;
export const CARING_PACKAGES = CARING_LEVELS;
