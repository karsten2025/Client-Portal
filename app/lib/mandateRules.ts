// app/lib/mandateRules.ts

import type { BehaviorId, PsychoId, CaringId } from "./catalog";

export type SelectionSeverity = "ok" | "warning" | "blocked";

export type SelectionMessage = {
  de: string;
  en: string;
};

type Rule = {
  id: string;
  severity: Exclude<SelectionSeverity, "ok">;
  when: (
    behavior: BehaviorId | "",
    psycho: PsychoId | "",
    caring: CaringId | ""
  ) => boolean;
  message: SelectionMessage;
};

/**
 * Regellogik:
 *
 * - Fokus auf drei Dimensionen:
 *   1) Verhalten / Kontext (BehaviorId)
 *   2) Psychosoziale Tiefe (5a, PsychoId)
 *   3) Caring-Level (5b, CaringId)
 *
 * - "blocked"  = Kombination ist fachlich unplausibel → Weiter-Button gesperrt.
 * - "warning"  = Kombination ist ungewöhnlich → Hinweis, aber technisch erlaubt.
 *
 * - Wenn mehrere Regeln greifen:
 *   - mind. eine "blocked" → Gesamtstatus = blocked
 *   - sonst, mind. eine "warning" → Gesamtstatus = warning
 *   - sonst → ok
 */
const RULES: Rule[] = [
  // ------------------------------------------------------------
  // 1) Verhalten + Psychosoziale Tiefe
  // ------------------------------------------------------------

  {
    id: "turnaround-psych-a",
    severity: "blocked",
    when: (behavior, psycho) =>
      behavior === "turnaround" && psycho === "psych-a",
    message: {
      de: "In einer akuten Krise / einem Turnaround reicht ein reines Transparenz-/Basis-Level (Paket A) nicht aus. Bitte mindestens Paket B oder C wählen.",
      en: "In an acute crisis / turnaround, a pure transparency / base level (package A) is not sufficient. Please choose at least package B or C.",
    },
  },
  {
    id: "chaos-psych-a",
    severity: "warning",
    when: (behavior, psycho) => behavior === "chaos" && psycho === "psych-a",
    message: {
      de: "In einer Wachstums- / Chaosphase ist das reine Basis-Level (Paket A) oft zu flach. Prüfen Sie, ob mindestens Paket B sinnvoll ist, um Teams zu schützen.",
      en: "In a growth / chaos phase, a pure base level (package A) is often too shallow. Consider at least package B to protect teams.",
    },
  },

  // ------------------------------------------------------------
  // 2) Verhalten + Caring-Level
  // ------------------------------------------------------------

  {
    id: "political-care-a",
    severity: "blocked",
    when: (behavior, _psycho, caring) =>
      behavior === "political" && caring === "care-a",
    message: {
      de: "In einem hoch-politischen Umfeld ist reiner Dienst nach Vorschrift (Caring A) unrealistisch. Mindestens professionelle Empathie (Caring B) ist nötig.",
      en: "In a highly political environment, pure duty-only mode (caring A) is unrealistic. At least professional empathy (caring B) is required.",
    },
  },

  {
    id: "turnaround-care-a",
    severity: "blocked",
    when: (behavior, _psycho, caring) =>
      behavior === "turnaround" && caring === "care-a",
    message: {
      de: "In einer akuten Krise / einem Turnaround ist reiner Dienst nach Vorschrift (Caring A) zu wenig. Bitte mindestens Caring B (professionelle Empathie) wählen.",
      en: "In an acute crisis / turnaround, pure duty-only (caring A) is not enough. Please select at least caring B (professional empathy).",
    },
  },

  // ------------------------------------------------------------
  // 3) Reine 5a/5b-Kombinatorik (unabhängig vom Verhalten)
  // ------------------------------------------------------------

  {
    id: "psych-c-care-a",
    severity: "warning",
    when: (_behavior, psycho, caring) =>
      psycho === "psych-c" && caring === "care-a",
    message: {
      de: "Tiefe Systemarbeit (Paket C) mit reinem Dienst nach Vorschrift (Caring A) ist ungewöhnlich. Meist ist mindestens Caring B sinnvoll.",
      en: "Deep system work (package C) combined with duty-only (caring A) is unusual. In most cases at least caring B is advisable.",
    },
  },

  {
    id: "classic-care-c",
    severity: "warning",
    when: (behavior, _psycho, caring) =>
      behavior === "classic" && caring === "care-c",
    message: {
      de: "Im klassischen Marktumfeld kann Total Ownership (Caring C) zu viel emotionale Identifikation bedeuten. Prüfen Sie, ob Caring B ausreichend ist.",
      en: "In a classical market environment, total ownership (caring C) may imply too much emotional identification. Consider whether caring B is sufficient.",
    },
  },
];

/**
 * Prüft die aktuelle Kombination und liefert:
 *  - severity: "ok" | "warning" | "blocked"
 *  - messages: Liste der passenden Hinweise (für DE/EN-Ausgabe im UI)
 */
export function validateSelection(
  behaviorId: BehaviorId | "",
  psychoId: PsychoId | "",
  caringId: CaringId | ""
): { severity: SelectionSeverity; messages: SelectionMessage[] } {
  // Wenn noch nichts oder nur Bruchstücke gewählt sind, keine harte Bewertung
  if (!behaviorId && !psychoId && !caringId) {
    return { severity: "ok", messages: [] };
  }

  const matches = RULES.filter((rule) =>
    rule.when(behaviorId, psychoId, caringId)
  );

  if (matches.length === 0) {
    return { severity: "ok", messages: [] };
  }

  const hasBlocked = matches.some((r) => r.severity === "blocked");
  const severity: SelectionSeverity = hasBlocked ? "blocked" : "warning";

  return {
    severity,
    messages: matches.map((r) => r.message),
  };
}
