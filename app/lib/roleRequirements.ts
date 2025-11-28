// app/lib/roleRequirements.ts
// Single Source of Truth für rollenbezogene Leistungsbeschreibungen
// (INCOSE-inspirierte Requirements, DE / EN)

import type { Lang } from "./catalog";

export type RoleId = "sys" | "ops" | "res" | "coach";

export type RequirementGroup =
  | "ziel" // A. Ziel & Mandatsrahmen
  | "leistung" // B. Leistungen AN
  | "mitwirkung" // C. Mitwirkung AG
  | "ergebnis" // D. Ergebnisse / Deliverables
  | "zeit" // E. Zeit / Umfang / Vergütung
  | "kommunikation" // F. Kommunikation & Eskalation
  | "abgrenzung"; // G. Abgrenzung / Nicht-Leistungen

export type RoleRequirement = {
  id: string; // z. B. "sys-A-1"
  roleId: RoleId; // z. B. "sys"
  group: RequirementGroup; // z. B. "ziel"
  textDe: string;
  textEn: string;
};

// View-Typ für UI / PDF (sprachspezifisch)
export type RoleRequirementView = {
  id: string;
  group: RequirementGroup;
  text: string;
};

// Einheitliche Reihenfolge für alle Stellen, die A–G ausgeben
export const REQUIREMENT_GROUP_ORDER: RequirementGroup[] = [
  "ziel",
  "leistung",
  "mitwirkung",
  "ergebnis",
  "zeit",
  "kommunikation",
  "abgrenzung",
];

// ---------------------------------------------------------------------------
// SYS – Interim Management & Portfolio-Steuerung
// ---------------------------------------------------------------------------

const SYS_REQUIREMENTS: RoleRequirement[] = [
  // A. Ziel & Mandatsrahmen
  {
    id: "sys-A-1",
    roleId: "sys",
    group: "ziel",
    textDe:
      "Der AN übernimmt für den Zeitraum {Startdatum} bis {Enddatum} die interimistische Steuerung der im Projekt-Briefing bezeichneten Projekte, Programme oder Portfolios („Mandat“) im Rahmen der vom AG vorgegebenen Ziele und Governance-Strukturen.",
    textEn:
      "The Contractor assumes interim steering responsibility for the projects, programmes or portfolios described in the Project Briefing (the “Mandate”) for the period from {startDate} to {endDate}, within the Client’s agreed objectives and governance structures.",
  },
  {
    id: "sys-A-2",
    roleId: "sys",
    group: "ziel",
    textDe:
      "Ziel des Mandats ist es, laufende Vorhaben stabil zu führen, Transparenz über Status, Risiken und Abhängigkeiten herzustellen und Entscheidungen des AG so vorzubereiten, dass das vereinbarte Zielbild („Zielbild“) erreichbar wird.",
    textEn:
      "The purpose of the mandate is to keep ongoing initiatives stable, provide transparency on status, risks and dependencies, and prepare the Client’s decisions in a way that enables achievement of the agreed target state (the “Target Picture”).",
  },

  // B. Leistungen des Auftragnehmers (AN)
  {
    id: "sys-B-1",
    roleId: "sys",
    group: "leistung",
    textDe:
      "Der AN plant, steuert und überwacht die im Mandat befindlichen Vorhaben auf Basis eines mit dem AG abgestimmten Meilenstein- und Maßnahmenplans und berichtet regelmäßig über Fortschritt, Risiken und notwendige Entscheidungen.",
    textEn:
      "The Contractor plans, steers and monitors the initiatives within the mandate based on a milestone and action plan agreed with the Client and reports regularly on progress, risks and required decisions.",
  },
  {
    id: "sys-B-2",
    roleId: "sys",
    group: "leistung",
    textDe:
      "Der AN führt mindestens einmal pro Woche ein Steuerungs- oder Jour-Fixe-Meeting mit den vom AG benannten Verantwortlichen durch und dokumentiert wesentliche Entscheidungen sowie Risiken in einem für den AG zugänglichen Protokoll.",
    textEn:
      "The Contractor conducts at least one steering or jour fixe meeting per week with the Client’s nominated counterparts and documents key decisions and risks in minutes accessible to the Client.",
  },
  {
    id: "sys-B-3",
    roleId: "sys",
    group: "leistung",
    textDe:
      "Der AN identifiziert Engpässe und Konflikte zwischen Vorhaben (z. B. Ressourcen, Abhängigkeiten, Prioritäten) und schlägt dem AG konkrete Handlungsoptionen einschließlich Auswirkungen auf Zeit, Aufwand und Risiko vor.",
    textEn:
      "The Contractor identifies bottlenecks and conflicts between initiatives (e.g. resources, dependencies, priorities) and proposes concrete options to the Client, including impacts on time, effort and risk.",
  },

  // C. Mitwirkungspflichten des Auftraggebers (AG)
  {
    id: "sys-C-1",
    roleId: "sys",
    group: "mitwirkung",
    textDe:
      "Der AG benennt spätestens zum Startdatum eine verantwortliche Projektleitung als Single Point of Contact sowie die Mitglieder der relevanten Steuerungsgremien und stellt deren Verfügbarkeit für Steuerungstermine sicher.",
    textEn:
      "By the start date, the Client appoints a responsible project lead as single point of contact and the members of the relevant steering bodies and ensures their availability for steering meetings.",
  },
  {
    id: "sys-C-2",
    roleId: "sys",
    group: "mitwirkung",
    textDe:
      "Der AG stellt sicher, dass der AN rechtzeitig Zugang zu den für das Mandat erforderlichen Informationen, Systemen und Ansprechpersonen erhält und dass vereinbarte Entscheidungen innerhalb der gemeinsam festgelegten Fristen getroffen werden.",
    textEn:
      "The Client ensures that the Contractor receives timely access to the information, systems and stakeholders required for the mandate and that agreed decisions are taken within the jointly defined time frames.",
  },

  // D. Ergebnisse / Deliverables
  {
    id: "sys-D-1",
    roleId: "sys",
    group: "ergebnis",
    textDe:
      "Der AN liefert in den mit dem AG vereinbarten Intervallen ein konsolidiertes Status-Reporting für das Mandat mit Ampelbewertung, wesentlichen Risiken, Abhängigkeiten und erforderlichen Entscheidungen des AG.",
    textEn:
      "The Contractor provides consolidated mandate status reports at the intervals agreed with the Client, including traffic-light status, key risks, dependencies and required Client decisions.",
  },
  {
    id: "sys-D-2",
    roleId: "sys",
    group: "ergebnis",
    textDe:
      "Der AN dokumentiert beschlossene Maßnahmen, Verantwortlichkeiten und Zieltermine so, dass deren Bearbeitung und Umsetzung durch AG und beteiligte Teams nachvollziehbar ist.",
    textEn:
      "The Contractor documents agreed actions, responsibilities and target dates in a way that allows the Client and involved teams to transparently track their execution.",
  },

  // E. Zeit, Umfang & Vergütung
  {
    id: "sys-E-1",
    roleId: "sys",
    group: "zeit",
    textDe:
      "Das Rollenmodul „Interim Management & Portfolio-Steuerung (sys)“ wird mit einem im Angebotsdokument ausgewiesenen Umfang an Beratertagen im Zeitraum {Startdatum} bis {Enddatum} geplant; Anpassungen des Umfangs erfolgen über einen gemeinsam abgestimmten Change Request.",
    textEn:
      "The role module “Interim Management & Portfolio Steering (sys)” is planned with the number of consulting days indicated in the Offer document for the period from {startDate} to {endDate}; any changes to this scope are agreed via a joint Change Request.",
  },
  {
    id: "sys-E-2",
    roleId: "sys",
    group: "zeit",
    textDe:
      "Die Vergütung der Leistungen aus diesem Rollenmodul erfolgt gemäß der in Angebot und Vertrag geregelten Vergütung (§ Vergütung). Abgerechnet wird auf Basis der nachgewiesenen Beratertage des AN; Rechnungen sind innerhalb des dort vereinbarten Zahlungsziels an den AN zu zahlen.",
    textEn:
      "Fees for this role module are paid in accordance with the remuneration provisions set out in the Offer and the Contract (§ Fees). Invoices are based on the Contractor’s documented consulting days and are payable within the payment term agreed therein.",
  },

  // F. Kommunikation & Eskalation
  {
    id: "sys-F-1",
    roleId: "sys",
    group: "kommunikation",
    textDe:
      "Der AN informiert den AG unverzüglich über Risiken oder Blockaden, die den Projekterfolg wesentlich gefährden, und schlägt ein abgestuftes Eskalationsvorgehen vor (z. B. Jour Fixe, Lenkungskreis, Management-Board).",
    textEn:
      "The Contractor promptly informs the Client of any risks or blockages that materially endanger project success and proposes a graduated escalation approach (e.g. jour fixe, steering committee, management board).",
  },

  // G. Abgrenzung / Nicht-Leistungen
  {
    id: "sys-G-1",
    roleId: "sys",
    group: "abgrenzung",
    textDe:
      "Der AN übernimmt im Rahmen dieses Rollenmoduls keine disziplinarische Personalverantwortung und trifft keine rechtsverbindlichen Erklärungen für den AG, sofern dies nicht ausdrücklich und schriftlich gesondert vereinbart wurde.",
    textEn:
      "Under this role module, the Contractor does not assume disciplinary HR responsibility and does not make legally binding declarations on behalf of the Client unless explicitly agreed separately in writing.",
  },
  {
    id: "sys-G-2",
    roleId: "sys",
    group: "abgrenzung",
    textDe:
      "Der AN schuldet kein bestimmtes wirtschaftliches Ergebnis, sondern ein fachgerechtes Tätigwerden im beschriebenen Mandatsrahmen; weitergehende Erfolgspflichten gelten nur, wenn sie ausdrücklich im Vertrag oder in bestätigten Change Requests vereinbart sind.",
    textEn:
      "The Contractor does not owe a specific commercial result but the professional performance described within the mandate; any further result obligations apply only if expressly agreed in the Contract or approved Change Requests.",
  },
];

// ---------------------------------------------------------------------------
// OPS – Betriebssystem-Performance & Skalierung
// ---------------------------------------------------------------------------

const OPS_REQUIREMENTS: RoleRequirement[] = [
  // A. Ziel & Mandatsrahmen
  {
    id: "ops-A-1",
    roleId: "ops",
    group: "ziel",
    textDe:
      "Ziel des Rollenmoduls „Betriebssystem-Performance & Skalierung (ops)“ ist es, die im Briefing beschriebenen Kernprozesse und Systeme des AG so auszurichten, dass das Geschäft mit vertretbarem Aufwand stabil betrieben und skaliert werden kann.",
    textEn:
      "The purpose of the role module “Operating System Performance & Scaling (ops)” is to align the Client’s core processes and systems, as described in the Briefing, so that the business can be operated and scaled in a stable manner with reasonable effort.",
  },
  {
    id: "ops-A-2",
    roleId: "ops",
    group: "ziel",
    textDe:
      "Der Fokus liegt auf der Beseitigung struktureller Engpässe in Wertschöpfungs- und Unterstützungsprozessen sowie auf der Gestaltung eines skalierbaren „Betriebssystems“ mit klaren Verantwortlichkeiten und Schnittstellen.",
    textEn:
      "The focus is on removing structural bottlenecks in value-creating and support processes and on designing a scalable “operating system” with clear responsibilities and interfaces.",
  },

  // B. Leistungen des Auftragnehmers (AN)
  {
    id: "ops-B-1",
    roleId: "ops",
    group: "leistung",
    textDe:
      "Der AN analysiert die relevanten End-to-End-Prozesse, Systemlandschaften und Governance-Strukturen des AG, identifiziert Engpässe sowie Medienbrüche und erarbeitet priorisierte Verbesserungsvorschläge.",
    textEn:
      "The Contractor analyses the Client’s relevant end-to-end processes, system landscape and governance structures, identifies bottlenecks and hand-off issues and develops a prioritised set of improvement proposals.",
  },
  {
    id: "ops-B-2",
    roleId: "ops",
    group: "leistung",
    textDe:
      "Der AN unterstützt den AG bei der Detailkonzeption und Umsetzung der vereinbarten Maßnahmen (z. B. Prozessanpassungen, Rollenbeschreibungen, Systemkonfiguration), ohne dabei selbst Systemverantwortung oder Linienführung zu übernehmen.",
    textEn:
      "The Contractor supports the Client in the detailed design and implementation of agreed measures (e.g. process adjustments, role descriptions, system configuration) without assuming system ownership or line management responsibility.",
  },

  // C. Mitwirkungspflichten des Auftraggebers (AG)
  {
    id: "ops-C-1",
    roleId: "ops",
    group: "mitwirkung",
    textDe:
      "Der AG stellt fachliche Expert:innen für die relevanten Prozesse sowie Systemverantwortliche für Workshops, Interviews und Abnahmetermine in angemessenem Umfang frei.",
    textEn:
      "The Client makes subject-matter experts for the relevant processes and system owners available for workshops, interviews and acceptance meetings in an appropriate scope.",
  },
  {
    id: "ops-C-2",
    roleId: "ops",
    group: "mitwirkung",
    textDe:
      "Der AG entscheidet fristgerecht über vorgeschlagene Prozess- und Strukturänderungen und stellt sicher, dass erforderliche Anpassungen in den eigenen Systemen und Organisationseinheiten umgesetzt werden.",
    textEn:
      "The Client takes timely decisions on proposed process and structural changes and ensures that the required adjustments are implemented within its own systems and organisational units.",
  },

  // D. Ergebnisse / Deliverables
  {
    id: "ops-D-1",
    roleId: "ops",
    group: "ergebnis",
    textDe:
      "Der AN erstellt eine strukturierte Übersicht über identifizierte Engpässe und Empfehlungen einschließlich Wirkungsabschätzung (z. B. Durchlaufzeit, Qualität, Arbeitslast) und Priorisierung.",
    textEn:
      "The Contractor prepares a structured overview of identified bottlenecks and recommendations, including impact assessment (e.g. lead time, quality, workload) and prioritisation.",
  },
  {
    id: "ops-D-2",
    roleId: "ops",
    group: "ergebnis",
    textDe:
      "Für umzusetzende Maßnahmen dokumentiert der AN – soweit vereinbart – Zielbild, Verantwortlichkeiten, Meilensteine und Abnahmekriterien in einer für den AG nutzbaren Form (z. B. Maßnahmenplan, Backlog).",
    textEn:
      "For measures to be implemented, the Contractor documents – where agreed – the target state, responsibilities, milestones and acceptance criteria in a format usable by the Client (e.g. action plan, backlog).",
  },

  // E. Zeit, Umfang & Vergütung
  {
    id: "ops-E-1",
    roleId: "ops",
    group: "zeit",
    textDe:
      "Das Rollenmodul „Betriebssystem-Performance & Skalierung (ops)“ wird mit dem im Angebot ausgewiesenen Beratertage-Umfang geplant; Anpassungen des Umfangs erfolgen über Change Requests, die zwischen AG und AN abgestimmt werden.",
    textEn:
      "The role module “Operating System Performance & Scaling (ops)” is planned with the number of consulting days specified in the Offer; changes to this scope are agreed via Change Requests between Client and Contractor.",
  },
  {
    id: "ops-E-2",
    roleId: "ops",
    group: "zeit",
    textDe:
      "Die Vergütung richtet sich nach den im Vertrag geregelten Tagessätzen und Zahlungsbedingungen (§ Vergütung). Arbeitsaufwand wird auf Basis der tatsächlich geleisteten und vom AG freigegebenen Tage abgerechnet.",
    textEn:
      "Fees are based on the daily rates and payment terms set out in the Contract (§ Fees). Effort is invoiced based on the days actually worked and approved by the Client.",
  },

  // F. Kommunikation & Eskalation
  {
    id: "ops-F-1",
    roleId: "ops",
    group: "kommunikation",
    textDe:
      "Der AN stimmt sich regelmäßig mit den benannten Verantwortlichen des AG über den Status der Maßnahmen, Risiken und Abhängigkeiten ab und schlägt bei drohenden Zielverfehlungen rechtzeitig Eskalationsschritte vor.",
    textEn:
      "The Contractor regularly coordinates with the Client’s nominated counterparts on the status of measures, risks and dependencies and proactively proposes escalation steps in case of emerging deviations from targets.",
  },

  // G. Abgrenzung
  {
    id: "ops-G-1",
    roleId: "ops",
    group: "abgrenzung",
    textDe:
      "Der AN übernimmt keine dauerhafte Linien- oder Systemverantwortung; der Betrieb der Systeme und Prozesse verbleibt beim AG.",
    textEn:
      "The Contractor does not assume permanent line or system responsibility; operation of systems and processes remains with the Client.",
  },
];

// ---------------------------------------------------------------------------
// RES – Strategische Resonanz & Stakeholder-Management
// ---------------------------------------------------------------------------

const RES_REQUIREMENTS: RoleRequirement[] = [
  // A. Ziel & Mandatsrahmen
  {
    id: "res-A-1",
    roleId: "res",
    group: "ziel",
    textDe:
      "Ziel des Rollenmoduls „Strategische Resonanz & Stakeholder-Management (res)“ ist es, die relevanten internen und externen Stakeholder so einzubinden, dass Entscheidungen zum Mandat verstehbar, tragfähig und umsetzbar werden.",
    textEn:
      "The purpose of the role module “Strategic Resonance & Stakeholder Management (res)” is to engage relevant internal and external stakeholders in a way that makes mandate-related decisions understandable, robust and implementable.",
  },
  {
    id: "res-A-2",
    roleId: "res",
    group: "ziel",
    textDe:
      "Der Fokus liegt auf der Übersetzung zwischen Fachebene und Management sowie auf der Bearbeitung politischer Spannungsfelder, ohne dass der AN selbst Organ- oder Linienverantwortung übernimmt.",
    textEn:
      "The focus is on translating between expert teams and management and on addressing political tensions without the Contractor assuming corporate officer or line responsibility.",
  },

  // B. Leistungen des Auftragnehmers (AN)
  {
    id: "res-B-1",
    roleId: "res",
    group: "leistung",
    textDe:
      "Der AN analysiert Erwartungsbilder, Interessen und Einflussmöglichkeiten der relevanten Stakeholder und bereitet Stakeholder-Landkarten und Kommunikationsszenarien für den AG auf.",
    textEn:
      "The Contractor analyses expectations, interests and influence of relevant stakeholders and prepares stakeholder maps and communication scenarios for the Client.",
  },
  {
    id: "res-B-2",
    roleId: "res",
    group: "leistung",
    textDe:
      "Der AN moderiert – soweit vereinbart – Workshops, Dialogformate und Konfliktklärungen und unterstützt den AG bei der Gestaltung von Botschaften, Entscheidungsunterlagen und Kommunikationsplänen.",
    textEn:
      "The Contractor moderates – as agreed – workshops, dialogue formats and conflict-resolution sessions and supports the Client in crafting messages, decision papers and communication plans.",
  },

  // C. Mitwirkungspflichten des Auftraggebers (AG)
  {
    id: "res-C-1",
    roleId: "res",
    group: "mitwirkung",
    textDe:
      "Der AG benennt die für das Mandat relevanten Stakeholder-Gruppen und stellt sicher, dass der AN diese – soweit erforderlich – in angemessenem Rahmen ansprechen oder einbeziehen darf.",
    textEn:
      "The Client identifies the stakeholder groups relevant for the mandate and ensures that the Contractor may approach or involve them to an appropriate extent where required.",
  },
  {
    id: "res-C-2",
    roleId: "res",
    group: "mitwirkung",
    textDe:
      "Der AG entscheidet über heikle Botschaften und verbindliche Aussagen gegenüber Stakeholdern; der AN bereitet Vorschläge vor, trifft jedoch ohne ausdrückliche Bevollmächtigung keine eigenen rechtsverbindlichen Zusagen.",
    textEn:
      "The Client decides on sensitive messages and binding statements to stakeholders; the Contractor prepares proposals but does not make legally binding commitments without explicit authorisation.",
  },

  // D. Ergebnisse / Deliverables
  {
    id: "res-D-1",
    roleId: "res",
    group: "ergebnis",
    textDe:
      "Der AN liefert dokumentierte Stakeholder-Analysen, Kommunikationsansätze und – soweit vereinbart – Protokolle bzw. Zusammenfassungen wichtiger Dialogformate.",
    textEn:
      "The Contractor delivers documented stakeholder analyses, communication approaches and – where agreed – minutes or summaries of key dialogue formats.",
  },

  // E. Zeit, Umfang & Vergütung
  {
    id: "res-E-1",
    roleId: "res",
    group: "zeit",
    textDe:
      "Zeitlicher Umfang und Taktung der Stakeholder-Arbeit werden im Angebotsdokument bzw. in der Leistungsbeschreibung festgelegt; Anpassungen erfolgen über Change Requests.",
    textEn:
      "The time scope and cadence of stakeholder work are defined in the Offer or Statement of Work; changes are agreed via Change Requests.",
  },
  {
    id: "res-E-2",
    roleId: "res",
    group: "zeit",
    textDe:
      "Die Vergütung richtet sich nach den im Vertrag geregelten Tagessätzen und Zahlungsbedingungen (§ Vergütung); aufwändige Dialogformate können – sofern vereinbart – als separate Kontingente ausgewiesen werden.",
    textEn:
      "Fees are based on the daily rates and payment terms set out in the Contract (§ Fees); elaborate dialogue formats may – where agreed – be priced as separate contingents.",
  },

  // F. Kommunikation & Eskalation
  {
    id: "res-F-1",
    roleId: "res",
    group: "kommunikation",
    textDe:
      "Der AN weist den AG frühzeitig auf politische Spannungen oder Kommunikationsrisiken hin, die den Mandatserfolg beeinträchtigen können, und schlägt abgestufte Reaktionsoptionen vor.",
    textEn:
      "The Contractor alerts the Client early to political tensions or communication risks that may jeopardise the mandate and proposes graduated response options.",
  },

  // G. Abgrenzung
  {
    id: "res-G-1",
    roleId: "res",
    group: "abgrenzung",
    textDe:
      "Der AN übernimmt keine Verantwortung für interne Entscheidungsfindung und Gremienbeschlüsse des AG; diese verbleiben vollständig beim AG.",
    textEn:
      "The Contractor does not assume responsibility for the Client’s internal decision-making and committee resolutions; these remain entirely with the Client.",
  },
];

// ---------------------------------------------------------------------------
// COACH – Sparring, Coaching & Enablement
// ---------------------------------------------------------------------------

const COACH_REQUIREMENTS: RoleRequirement[] = [
  // A. Ziel & Mandatsrahmen
  {
    id: "coach-A-1",
    roleId: "coach",
    group: "ziel",
    textDe:
      "Ziel des Rollenmoduls „Sparring, Coaching & Enablement (coach)“ ist es, die im Briefing benannten Führungskräfte und Schlüsselpersonen des AG in ihrer Entscheidungs- und Umsetzungsfähigkeit im Kontext des Mandats zu stärken.",
    textEn:
      "The purpose of the role module “Sparring, Coaching & Enablement (coach)” is to strengthen the decision-making and execution capabilities of the Client’s leaders and key people in the context of the mandate.",
  },
  {
    id: "coach-A-2",
    roleId: "coach",
    group: "ziel",
    textDe:
      "Der Fokus liegt auf Reflexion, methodischer Befähigung und Entscheidungsunterstützung; Coaching ersetzt keine Therapie und keine arbeitsrechtliche Beratung.",
    textEn:
      "The focus is on reflection, methodological enablement and decision support; coaching does not replace therapy or employment law advice.",
  },

  // B. Leistungen des Auftragnehmers (AN)
  {
    id: "coach-B-1",
    roleId: "coach",
    group: "leistung",
    textDe:
      "Der AN führt – wie in Leistungsbeschreibung und Angebot vereinbart – Einzel- und Gruppenformate (z. B. Coachings, Sparrings, Reflexionssessions) mit den benannten Personen durch.",
    textEn:
      "The Contractor delivers the agreed individual and group formats (e.g. coaching, sparring, reflection sessions) with the nominated individuals, as specified in the Statement of Work and Offer.",
  },
  {
    id: "coach-B-2",
    roleId: "coach",
    group: "leistung",
    textDe:
      "Der AN bringt geeignete Methoden, Modelle und Werkzeuge ein und unterstützt die Beteiligten dabei, eigene Handlungsoptionen zu entwickeln und umzusetzen.",
    textEn:
      "The Contractor introduces suitable methods, models and tools and supports participants in developing and implementing their own courses of action.",
  },

  // C. Mitwirkungspflichten des Auftraggebers (AG)
  {
    id: "coach-C-1",
    roleId: "coach",
    group: "mitwirkung",
    textDe:
      "Der AG stellt sicher, dass die teilnehmenden Personen über die Zielsetzung des Coachings informiert sind und die Teilnahme im vereinbarten Umfang ermöglichen können.",
    textEn:
      "The Client ensures that participants are informed about the objectives of the coaching and are able to participate to the agreed extent.",
  },
  {
    id: "coach-C-2",
    roleId: "coach",
    group: "mitwirkung",
    textDe:
      "Der AG trifft arbeits- und personalrechtliche Entscheidungen eigenverantwortlich; der AN gibt hierzu keine rechtsverbindlichen Empfehlungen.",
    textEn:
      "The Client takes HR- and employment-related decisions on its own responsibility; the Contractor does not provide legally binding recommendations in this respect.",
  },

  // D. Ergebnisse / Deliverables
  {
    id: "coach-D-1",
    roleId: "coach",
    group: "ergebnis",
    textDe:
      "Ergebnisse des Coachings sind in der Regel individuelle Lern- und Handlungsfortschritte der Coachees; diese werden – soweit vereinbart – in aggregierter, nicht personenbezogener Form mit dem AG gespiegelt.",
    textEn:
      "Coaching results are typically individual learning and behavioural progress of coachees; these are reflected back to the Client, where agreed, in aggregated, non-personal form.",
  },

  // E. Zeit, Umfang & Vergütung
  {
    id: "coach-E-1",
    roleId: "coach",
    group: "zeit",
    textDe:
      "Anzahl, Dauer und Taktung der Coaching- und Sparring-Sessions werden in Angebot und Leistungsbeschreibung festgelegt; Anpassungen erfolgen über Change Requests.",
    textEn:
      "Number, duration and cadence of coaching and sparring sessions are defined in the Offer and Statement of Work; changes are agreed via Change Requests.",
  },
  {
    id: "coach-E-2",
    roleId: "coach",
    group: "zeit",
    textDe:
      "Die Vergütung erfolgt gemäß den im Vertrag vereinbarten Honoraren und Zahlungsbedingungen (§ Vergütung); abgerechnete Einheiten sind die tatsächlich durchgeführten Sessions bzw. Beratertage.",
    textEn:
      "Fees are charged according to the rates and payment terms agreed in the Contract (§ Fees); billable units are the sessions or consulting days actually delivered.",
  },

  // F. Kommunikation & Eskalation
  {
    id: "coach-F-1",
    roleId: "coach",
    group: "kommunikation",
    textDe:
      "Der AN wahrt die Vertraulichkeit der Inhalte aus den Coaching-Sessions gegenüber Dritten, informiert den AG jedoch, wenn Risiken sichtbar werden, die den Mandatserfolg oder die Gesundheit Beteiligter ernsthaft gefährden könnten – im Rahmen der gemeinsam vereinbarten Spielregeln.",
    textEn:
      "The Contractor keeps the contents of coaching sessions confidential towards third parties but informs the Client, within the agreed rules of engagement, if risks emerge that may seriously threaten the mandate’s success or the health of participants.",
  },

  // G. Abgrenzung
  {
    id: "coach-G-1",
    roleId: "coach",
    group: "abgrenzung",
    textDe:
      "Coaching-Leistungen ersetzen keine Psychotherapie oder medizinische Behandlung und beinhalten keine Rechts- oder Steuerberatung.",
    textEn:
      "Coaching services do not constitute psychotherapy or medical treatment and do not include legal or tax advice.",
  },
];

// ---------------------------------------------------------------------------
// Zentrale Sammlung & Helper
// ---------------------------------------------------------------------------

const ALL_REQUIREMENTS: RoleRequirement[] = [
  ...SYS_REQUIREMENTS,
  ...OPS_REQUIREMENTS,
  ...RES_REQUIREMENTS,
  ...COACH_REQUIREMENTS,
];

/**
 * Liefert alle Requirements für eine Rolle bereits sprachspezifisch
 * in der Form, die OfferPdf und ContractPage benötigen.
 */
export function getRoleRequirementsFor(
  lang: Lang,
  roleId: RoleId
): RoleRequirementView[] {
  const L: Lang = lang === "en" ? "en" : "de";

  return ALL_REQUIREMENTS.filter((r) => r.roleId === roleId).map((r) => ({
    id: r.id,
    group: r.group,
    text: L === "en" ? r.textEn : r.textDe,
  }));
}

/**
 * Optionaler Helper: sprechende Modul-Bezeichnung pro Rolle,
 * z. B. für Überschriften „Detaillierte Leistungsbeschreibung – Rollenmodul …“
 */
export function getRoleModuleLabel(lang: Lang, roleId: RoleId): string {
  const isEn = lang === "en";
  switch (roleId) {
    case "sys":
      return isEn
        ? "Interim Management & Portfolio Steering (sys)"
        : "Interim Management & Portfolio-Steuerung (sys)";
    case "ops":
      return isEn
        ? "Operating System Performance & Scaling (ops)"
        : "Betriebssystem-Performance & Skalierung (ops)";
    case "res":
      return isEn
        ? "Strategic Resonance & Stakeholder Management (res)"
        : "Strategische Resonanz & Stakeholder-Management (res)";
    case "coach":
      return isEn
        ? "Sparring, Coaching & Enablement (coach)"
        : "Sparring, Coaching & Enablement (coach)";
    default:
      return "";
  }
}
