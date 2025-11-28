// app/lib/contractSection3.ts

import {
  SKILLS,
  PSYCHO_PACKAGES,
  CARING_PACKAGES,
  type Lang,
  type BehaviorId,
  type PsychoId,
  type CaringId,
} from "./catalog";

export type ContractSection3Input = {
  behaviorId?: BehaviorId | "";
  selectedRoles?: string[]; // aus brief.selected: ["sys","ops","res","coach"]
  skillIds?: string[]; // aus LOCAL_KEYS.skills
  psychoId?: PsychoId | "";
  caringId?: CaringId | "";
};

/**
 * Baut § 3 Leistungsumfang & Vorgehensweise als Plain-Text
 * – DE: Civil Law
 * – EN: Common Law flavour
 */
export function buildContractSection3(
  lang: Lang,
  input: ContractSection3Input
): string {
  const L = lang === "en" ? "en" : "de";

  const selectedRoles = input.selectedRoles ?? [];
  const skillIds = input.skillIds ?? [];
  const psychoId = input.psychoId ?? "";
  const caringId = input.caringId ?? "";

  // -----------------------------
  // 1) Absatz (1)
  // -----------------------------
  const part1 =
    L === "de"
      ? [
          "§ 3 Leistungsumfang & Vorgehensweise",
          "",
          '(1) Der Auftragnehmer ("AN") berät und unterstützt den Auftraggeber ("AG") als externer Spezialist. Die Leistung wird als Dienstvertrag erbracht. Geschuldet ist das professionelle Tätigwerden zur Erreichung der vereinbarten Ziele, nicht ein bestimmter wirtschaftlicher Erfolg. Der AN unterliegt keiner disziplinarischen Weisungsbefugnis des AG.',
        ].join("\n")
      : [
          "§ 3 Scope of Services & Delivery Approach",
          "",
          '(1) The contractor (the "Contractor") advises and supports the client (the "Client") as an external specialist. The Services are provided on a services basis. The Contractor owes professional efforts aimed at achieving the agreed objectives, but does not guarantee any specific commercial result. The Contractor is not subject to the Client’s disciplinary instructions.',
        ].join("\n");

  // -----------------------------
  // 2) Rollen / Rollenset – allgemeiner Absatz + dynamische Module
  // -----------------------------

  const part2General =
    L === "de"
      ? [
          "",
          "(2) Leistungsgegenstand (Rolle und Rollenset)",
          '(a) Der Auftragnehmer ("AN") erbringt seine Leistungen in einer oder mehreren Rollen (zusammen das „Rollenset“), die im Projekt-Briefing und im Angebotsentwurf beschrieben sind. Hierzu können insbesondere gehören:',
          "– fachliche Rolle (z. B. Interim Management, Projekt-/Programm-/Portfolio-Steuerung, Coaching/Sparring),",
          "– verhaltensbezogener Kontext (z. B. klassisches Umfeld, Wachstums-/Chaosphase, hoch-politisches Umfeld, Turnaround),",
          "– psychosoziale Interventions-Tiefe (z. B. Struktur-/Transparenz-Fokus, Resilienz-Fokus, Sensemaking/Systemarbeit),",
          "– Caring-Level / Grad der emotionalen Investition (z. B. professionelle Distanz, aktives Stakeholder-Engagement, unternehmerische Dedikation),",
          "– sowie weitere, im Einzelfall vereinbarte Dimensionen.",
          "",
          "(b) Art und Umfang der jeweils geschuldeten Leistungen ergeben sich aus dem Projekt-Briefing des AG und dem zugehörigen Angebotsentwurf des AN (gemeinsam „Leistungsbeschreibung“). Nur die dort konkret beschriebenen Aufgaben, Verantwortungsbereiche und Interventions-Ebenen gelten als vertraglich geschuldet; darüber hinausgehende Erwartungen oder Rollenbilder sind nur dann Vertragsbestandteil, wenn sie ausdrücklich schriftlich (z. B. per ergänztem Angebot oder Change Request) vereinbart werden.",
          "",
          "(c) Der AN schuldet ein fachgerechtes Tätigwerden innerhalb des vereinbarten Rollensets und der beschriebenen Dimensionen. Eine Erweiterung oder substanzielle Veränderung des Rollensets (z. B. zusätzliche Linienverantwortung, tiefere psychosoziale Interventionen, erweiterte Governance-Aufgaben) bedarf einer gesonderten Vereinbarung und kann als Change Request mit zusätzlicher Vergütung ausgestaltet werden.",
        ].join("\n")
      : [
          "",
          "(2) Scope of Services (Role and Role Set)",
          "(a) The Contractor performs the Services in one or more roles (together, the “Role Set”) as described in the Project Briefing and the Offer Draft (together, the “Service Description”). The Role Set may include, in particular:",
          "– a professional role (e.g. interim management, project / programme / portfolio lead, coaching / sparring),",
          "– a behavioural / context dimension (e.g. classical environment, growth / chaos phase, highly political environment, turnaround),",
          "– a psychosocial intervention depth (e.g. focus on structure and transparency, resilience focus, sensemaking / systemic work),",
          "– a caring level / degree of emotional investment (e.g. professional distance, active stakeholder engagement, entrepreneurial dedication),",
          "– and any further dimensions expressly agreed between the parties.",
          "",
          "(b) The Contractor’s obligations are limited to the tasks, responsibilities and intervention levels expressly set out in the Service Description. Any additional expectations, implicit assumptions or role images shall only form part of the contractual obligations if they have been expressly agreed in writing (for example by an amended offer or a Change Request).",
          "",
          "(c) The Contractor shall exercise due professional care within the agreed Role Set and dimensions. Any extension or material change of the Role Set (for example assuming additional line management responsibility, deeper psychosocial intervention or extended governance duties) requires a separate agreement and may be documented and charged as a Change Request.",
        ].join("\n");

  const roleModulesDe: string[] = [];
  const roleModulesEn: string[] = [];

  if (selectedRoles.includes("sys")) {
    roleModulesDe.push(
      "(2.x.i) Rollenmodul „Interim Management & Portfolio-Steuerung“ (sys / Bube)\n" +
        "Übernahme der operativen Steuerung von Projekten, Programmen oder Portfolios auf Zeit. Der AN schließt temporäre Vakanzen in Leitungs- oder Steuerungsfunktionen, steuert die Umsetzung auf Basis vereinbarter Meilensteine, stellt ein transparentes Reporting sicher und koordiniert die fachliche Zulieferung der beteiligten Teams. Disziplinarische Personalverantwortung wird nur übernommen, wenn dies ausdrücklich und schriftlich vereinbart wurde."
    );
    roleModulesEn.push(
      "(2.x.i) Role module “Interim Management & Portfolio Steering” (sys / Jack)\n" +
        "Temporary assumption of operational steering of projects, programmes or portfolios. The Contractor bridges vacancies in leadership or steering functions, manages delivery against agreed milestones, ensures transparent reporting and coordinates the contribution of the relevant teams. Disciplinary HR responsibility is only assumed if expressly agreed in writing."
    );
  }

  if (selectedRoles.includes("ops")) {
    roleModulesDe.push(
      "(2.x.ii) Rollenmodul „Betriebssystem-Performance & Skalierung“ (ops / Dame)\n" +
        "Analyse und Optimierung der bestehenden Prozess- und Systemlandschaft des AG. Der AN identifiziert Engpässe in den Wertschöpfungsketten, entwickelt Vorschläge zur Gestaltung eines skalierbaren „Betriebssystems“ und unterstützt den AG bei der Priorisierung und Umsetzung vereinbarter Verbesserungsmaßnahmen. Die Verantwortung für die endgültige Entscheidung über Struktur- und Systemänderungen verbleibt beim AG."
    );
    roleModulesEn.push(
      "(2.x.ii) Role module “Operating System Performance & Scaling” (ops / Queen)\n" +
        "Analysis and optimisation of the Client’s existing process and system landscape. The Contractor identifies bottlenecks in value chains, develops proposals for a scalable “operating system” and supports the Client in prioritising and implementing agreed improvement measures. Final decisions on structural or system changes remain with the Client."
    );
  }

  if (selectedRoles.includes("res")) {
    roleModulesDe.push(
      "(2.x.iii) Rollenmodul „Strategische Resonanz & Stakeholder-Management“ (res / König)\n" +
        "Unterstützung des AG bei der Steuerung komplexer Stakeholder-Umfelder. Der AN analysiert Erwartungsbilder relevanter Anspruchsgruppen, bereitet Kommunikations- und Entscheidungsgrundlagen auf, moderiert bei Bedarf Konflikt- und Klärungsgespräche und unterstützt den AG dabei, Interessenlagen auf das vereinbarte Projektziel auszurichten. Der AN trifft keine eigenen rechtsverbindlichen Erklärungen für den AG, sofern dies nicht ausdrücklich schriftlich vereinbart wurde."
    );
    roleModulesEn.push(
      "(2.x.iii) Role module “Strategic Resonance & Stakeholder Management” (res / King)\n" +
        "Support in managing complex stakeholder environments. The Contractor analyses the expectations of relevant stakeholders, prepares communication and decision-making materials, moderates conflict or clarification meetings where appropriate and helps the Client align different interests with the agreed project objectives. The Contractor does not make legally binding declarations on behalf of the Client unless expressly agreed in writing."
    );
  }

  if (selectedRoles.includes("coach")) {
    roleModulesDe.push(
      "(2.x.iv) Rollenmodul „Sparring, Coaching & Enablement“ (coach / Ass)\n" +
        "Methodisches Coaching und Sparring für Führungskräfte und Teams des AG. Der AN agiert als „Thinking Partner“ zur Reflexion von Situationen und Entscheidungen, vermittelt Methoden-Know-how und fördert die eigenständige Lösungsfindung der Beteiligten. Coaching-Leistungen ersetzen keine Therapie und begründen keine arbeits- oder personalrechtlichen Entscheidungen; diese verbleiben in der Verantwortung des AG."
    );
    roleModulesEn.push(
      "(2.x.iv) Role module “Sparring, Coaching & Enablement” (coach / Ace)\n" +
        "Method-based coaching and sparring for the Client’s leaders and teams. The Contractor acts as a thinking partner to reflect on situations and decisions, transfers methodological know-how and encourages independent problem-solving by the participants. Coaching services do not constitute therapy and do not replace the Client’s responsibility for HR or employment decisions."
    );
  }

  let part2Modules = "";
  if (selectedRoles.length > 0) {
    const introDe =
      "Je nach im Projekt-Briefing gewählter Rolle gelten ergänzend die folgenden Leistungsbilder:";
    const introEn =
      "Depending on the roles selected in the Project Briefing, the following role modules apply in addition:";
    part2Modules =
      "\n\n" +
      (L === "de" ? introDe : introEn) +
      "\n\n" +
      (L === "de" ? roleModulesDe.join("\n\n") : roleModulesEn.join("\n\n"));
  }

  // -----------------------------
  // 3) Fachliche Schwerpunkte / Skills
  // -----------------------------
  const selectedSkillTitles =
    skillIds.length > 0
      ? SKILLS.filter((s) => skillIds.includes(s.id)).map((s) => s.title[L])
      : [];

  const skillsListBlock =
    selectedSkillTitles.length > 0
      ? "\n\n" +
        (L === "de"
          ? "Aus dem Projekt-Briefing ergeben sich derzeit insbesondere folgende fachliche Schwerpunkte:"
          : "Based on the Project Briefing, the following professional focus areas currently apply in particular:") +
        "\n\n" +
        selectedSkillTitles.map((t) => `– ${t}`).join("\n")
      : "";

  const part3 =
    L === "de"
      ? [
          "",
          "(3) Fachliche Schwerpunkte (Skills)",
          "(a) Die Leistungserbringung erfolgt unter Einsatz der im Projekt-Briefing ausgewählten fachlichen Schwerpunkte („Skills“). Die Skills beschreiben, in welchen Kompetenzfeldern der AN tätig wird (z. B. Projektmanagement klassisch/agil/hybrid, Organisations- und Prozessdesign, PMO-Ausrichtung, kognitive / KI-Projekte, Engineering-Tätigkeiten).",
          "",
          "(b) Die im Briefing dokumentierte Auswahl der Skills einschließlich etwaiger Kurzbeschreibungen versteht sich als inhaltliche Eingrenzung des Leistungsbildes. Sie dient der Konkretisierung des „Wie“ der Leistungserbringung und begründet keine Erfolgsgarantie für bestimmte wirtschaftliche oder organisatorische Ergebnisse.",
          "",
          "(c) Soweit im Briefing oder in Anlagen zum Angebot eine Aufzählung von Beispielen, Use Cases oder typischen Anwendungsfällen erfolgt, dient diese ausschließlich der Veranschaulichung. Hieraus folgt keine Verpflichtung des AN, sämtliche aufgeführten Beispiele vollumfänglich und gleichzeitig umzusetzen. Verbindlich sind nur diejenigen Maßnahmen, die in Leistungsbeschreibung, Angebotsentwurf oder bestätigten Change Requests ausdrücklich als zu erbringende Leistung bezeichnet sind.",
          "",
          "(d) Erweitert der AG das fachliche Spektrum später wesentlich (z. B. zusätzliche Business-Units, weitere Länder-Roll-outs, zusätzliche Produktlinien oder zusätzliche KI-Use-Cases), kann der AN eine Anpassung des Honorars und der Kapazitäten verlangen. Diese Erweiterungen werden in der Regel als Change Request mit separater Budgetierung vereinbart.",
        ].join("\n") + skillsListBlock
      : [
          "",
          "(3) Professional focus areas (Skills)",
          "(a) The Services are delivered using the professional focus areas (“Skills”) selected in the Project Briefing. The Skills describe the competence domains in which the Contractor will act (for example classical / agile / hybrid project management, organisational and process design, PMO alignment, cognitive / AI projects, engineering services).",
          "",
          "(b) The selection of Skills as documented in the Briefing, including any short descriptions, serves to narrow down and concretise the Service Description. It describes how the Services are rendered but does not constitute a guarantee of any specific commercial or organisational result.",
          "",
          "(c) Any examples, use cases or typical applications listed in the Briefing or in annexes to the Offer are provided for illustration only. They do not oblige the Contractor to implement all such examples in full and at the same time. Only those measures that are expressly designated as Services in the Service Description, the Offer or approved Change Requests shall be contractually binding.",
          "",
          "(d) If the Client substantially widens the professional scope at a later stage (for example by adding further business units, countries, product lines or AI use cases), the Contractor may request an adjustment of fees and capacity. Such extensions will typically be agreed as a Change Request with a separate budget.",
        ].join("\n") + skillsListBlock;

  // -----------------------------
  // 4) Optional: kurzer Hinweis zum aktuellen 5a/5b-Stand (psycho / caring)
  // -----------------------------

  const psychoPackage = psychoId
    ? PSYCHO_PACKAGES.find((p) => p.id === psychoId)
    : undefined;
  const caringPackage = caringId
    ? CARING_PACKAGES.find((c) => c.id === caringId)
    : undefined;

  let part4 = "";
  if (psychoPackage || caringPackage) {
    const psychoLabel =
      psychoPackage?.name[L] ??
      (L === "de" ? "kein Paket gewählt" : "no package selected");
    const caringLabel =
      caringPackage?.name[L] ??
      (L === "de" ? "kein Paket gewählt" : "no package selected");

    part4 =
      "\n\n" +
      (L === "de"
        ? `(4) Interaktions-Level (Kurzüberblick)\nFür das vorliegende Mandat sind aktuell folgende Interventions-Parameter gewählt: psychosoziale Tiefe: ${psychoLabel}; Caring-Level: ${caringLabel}. Die in Briefing und Angebotsentwurf beschriebenen Grenzen (Inklusion/Exklusion) gelten als Vertragsbestandteil.`
        : `(4) Interaction levels (short overview)\nFor the present mandate, the following intervention parameters are currently selected: psychosocial depth: ${psychoLabel}; caring level: ${caringLabel}. The boundaries (inclusion / exclusion) described in the Briefing and Offer Draft form part of this Agreement.`);
  }

  // -----------------------------
  // Zusammenbauen
  // -----------------------------
  const parts = [part1, part2General, part2Modules, part3, part4].filter(
    (p) => p && p.trim().length > 0
  );

  return parts.join("\n\n");
}
