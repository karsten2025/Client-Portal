// app/lib/i18n.ts
export type Lang = "de" | "en";

export const fallbackLang: Lang = "de";

export const messages: Record<Lang, Record<string, string>> = {
  de: {
    // Explore
    "explore.title": "Was passt zu Ihrem Anliegen?",
    "explore.subtitle":
      "Wählen Sie 1–2 Rollen aus. Sie können die Beschreibung später im Brief anpassen.",
    "explore.add": "Zum Brief hinzufügen",
    "explore.remove": "Entfernen",
    "explore.next": "Weiter: Brief erstellen",

    // Offer / Brief (Placeholder, falls noch nicht gepflegt)
    "nav.offer": "Angebots-Entwurf",
    "nav.brief": "Projekt-Briefing",
    "offer.download": "PDF herunterladen",
    "offer.preview.open": "Vorschau öffnen",
    "offer.preview.close": "Vorschau schließen",
    "offer.save": "In meinem Konto speichern",
  },
  en: {
    // Explore
    "explore.title": "What fits your challenge?",
    "explore.subtitle":
      "Select 1–2 roles. You can adjust the wording later in the briefing.",
    "explore.add": "Add to brief",
    "explore.remove": "Remove",
    "explore.next": "Next: Create briefing",

    // Offer / Brief (Placeholder, needs wiring where used)
    "nav.offer": "Offer draft",
    "nav.brief": "Project briefing",
    "offer.download": "Download PDF",
    "offer.preview.open": "Open preview",
    "offer.preview.close": "Close preview",
    "offer.save": "Save to my account",
  },
};

export function normalizeLang(input?: string | null): Lang {
  return input === "en" ? "en" : "de";
}

export function t(lang: Lang, key: string): string {
  return messages[lang][key] ?? messages[fallbackLang][key] ?? key;
}
export function tPair(lang: Lang, de: string, en: string): string {
  // Einfacher Helfer für direkte Texte:
  // tPair(lang, "Deutsch", "English")
  return lang === "en" ? en : de;
}
