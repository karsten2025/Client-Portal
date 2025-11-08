"use client";

import { useLanguage } from "../lang/LanguageContext";

type StepId = "explore" | "brief" | "offer" | "confirm" | "delivery";

type Step = {
  id: StepId;
  labelDe: string;
  labelEn: string;
  helperDe: string;
  helperEn: string;
};

const STEPS: Step[] = [
  {
    id: "explore",
    labelDe: "Rollen wählen",
    labelEn: "Choose roles",
    helperDe: "1–2 Rollen anklicken",
    helperEn: "Pick 1–2 roles",
  },
  {
    id: "brief",
    labelDe: "Projekt-Briefing",
    labelEn: "Project briefing",
    helperDe: "Rahmen & Ziele klären",
    helperEn: "Align scope & outcome",
  },
  {
    id: "offer",
    labelDe: "Angebotsentwurf",
    labelEn: "Offer draft",
    helperDe: "Leistungen & Konditionen prüfen",
    helperEn: "Review scope & terms",
  },
  {
    id: "confirm",
    labelDe: "Freigabe",
    labelEn: "Confirmation",
    helperDe: "Digital bestätigen",
    helperEn: "Confirm to start",
  },
  {
    id: "delivery",
    labelDe: "Durchführung",
    labelEn: "Delivery",
    helperDe: "Gemeinsam umsetzen",
    helperEn: "Work in focused sprints",
  },
];

// kleine lokale Helper-Funktion statt clsx
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function ProcessBar({ current }: { current: StepId }) {
  const { lang } = useLanguage();
  const isDe = lang === "de";

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 flex flex-col gap-2 text-xs sm:text-sm">
      <div className="flex items-baseline justify-between gap-2">
        <div className="font-medium text-gray-800">
          {isDe
            ? "Ablauf: Von der Idee zum klaren Angebot"
            : "Flow: From idea to clear offer"}
        </div>
        <div className="text-[10px] sm:text-xs text-gray-500">
          {isDe
            ? "Sie sehen jederzeit, wo wir im Prozess stehen."
            : "You always see where we are in the process."}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STEPS.map((step, idx) => {
          const done = STEPS.findIndex((s) => s.id === current) > idx;
          const active = step.id === current;

          return (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex flex-col px-2 py-1 rounded-xl border transition-colors min-w-[90px]",
                  active && "border-black bg-white text-black shadow-sm",
                  done &&
                    !active &&
                    "border-emerald-500/60 bg-emerald-50 text-emerald-800",
                  !active && !done && "border-gray-200 text-gray-500 bg-gray-50"
                )}
              >
                <span className="font-semibold leading-tight">
                  {isDe ? step.labelDe : step.labelEn}
                </span>
                <span className="text-[9px] leading-tight">
                  {isDe ? step.helperDe : step.helperEn}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="h-px w-4 sm:w-6 bg-gray-300 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
