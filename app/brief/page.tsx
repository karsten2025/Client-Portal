"use client";
import { useEffect, useState } from "react";

/* ========== Fragen (wie zuvor) ========== */
const QUESTIONS: {
  id: string;
  label: string;
  rows?: number;
  placeholder?: string;
}[] = [
  {
    id: "dod",
    label: "Definition of Done (Wenn wir fertig sind, dann …)",
    rows: 6,
    placeholder:
      "Beispiel:\n• Die Durchlaufzeit von X -> Y Tagen reduziert (Basis/Target/Korridor)\n• Die Schnittstellen A,B sind geklärt; Verantwortung in RACI verankert\n• Entscheider-Board trifft monatlich faktenbasierte Entscheidungen (Agenda, KPIs)\n• Go-Live erfolgreich: Abnahme, Schulung, Doku",
  },
  {
    id: "ziel",
    label: "Zielbild & Wirkung (Business Outcome, nicht Aktivität)",
    rows: 5,
    placeholder:
      "Was verändert sich messbar? (Kosten, Zeit, Qualität, Risiko, Zufriedenheit, Umsatz …)\nWelche Stakeholder merken das zuerst?",
  },
  {
    id: "hebel",
    label: "Größter Hebel & Prioritäten",
    rows: 5,
    placeholder:
      "Wo liegt aktuell die meiste Reibung? (z. B. Durchlaufzeit, Qualität, Führung, Klarheit)\nWas wäre die 1. Maßnahme mit 80/20-Effekt?",
  },
  {
    id: "zeit",
    label: "Zeitfenster & Randbedingungen",
    rows: 4,
    placeholder:
      "Meilensteine, harte Deadlines, Abhängigkeiten, Budgets, Systeme, Standorte …",
  },
  {
    id: "rollen",
    label: "Rollen & Verantwortungen (in Ihren Worten)",
    rows: 4,
    placeholder:
      "Welche Rolle wünschen Sie sich von mir/uns? (Interim, Beratung, Sparring …)\nWer entscheidet? Wer liefert zu? (gern grob als RACI)",
  },
  {
    id: "risiken",
    label: "Risiken & Annahmen",
    rows: 4,
    placeholder:
      "Worauf müssen wir achten? Welche Annahmen gelten aktuell und sollten wir testen?",
  },
  {
    id: "messung",
    label: "Erfolgsmessung (KPI, Baseline → Zielwert, Messrhythmus)",
    rows: 4,
    placeholder:
      "Welche KPIs nutzen wir? Was ist die aktuelle Basis (t0) und was ist das Ziel (t1)? Wie oft messen wir?",
  },
];

/* ========== DoD-Checkliste (vorgeschlagen) ========== */
const DOD_ITEMS = [
  "KPI & Baseline definiert",
  "Zielwerte & Korridor vereinbart",
  "Governance/Board steht (Agenda, Rhythmus)",
  "Rollen geklärt (RACI bestätigt)",
  "Risiken adressiert / Fallbacks definiert",
  "Prozess/Tool Go-Live-Kriterien erfüllt",
  "Schulung & Doku abgeschlossen",
  "Abnahme erfolgt",
  "Post-Go-Live Review terminiert",
];

/* ========== Typen ========== */
type FormState = Record<string, string>;

type RaciRow = {
  id: string;
  thema: string;
  owner: string; // Responsible/Owner
  accountable: string; // Accountable
  consulted: string; // Consulted
  informed: string; // Informed
};

export default function Brief() {
  /* Freitext-Form */
  const [form, setForm] = useState<FormState>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  /* RACI & DoD-Checks */
  const [raci, setRaci] = useState<RaciRow[]>([
    {
      id: crypto.randomUUID(),
      thema: "",
      owner: "",
      accountable: "",
      consulted: "",
      informed: "",
    },
  ]);
  const [dodChecks, setDodChecks] = useState<Record<string, boolean>>({});

  /* ===== Laden ===== */
  useEffect(() => {
    setSelected(JSON.parse(localStorage.getItem("brief.selected") || "[]"));
    setForm(JSON.parse(localStorage.getItem("brief.form") || "{}"));

    const raciSaved = JSON.parse(localStorage.getItem("brief.raci") || "null");
    if (Array.isArray(raciSaved) && raciSaved.length) setRaci(raciSaved);

    const checksSaved = JSON.parse(
      localStorage.getItem("brief.dodChecks") || "null"
    );
    if (checksSaved && typeof checksSaved === "object")
      setDodChecks(checksSaved);
  }, []);

  /* ===== Speichern ===== */
  useEffect(() => {
    localStorage.setItem("brief.form", JSON.stringify(form));
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 800);
    return () => clearTimeout(t);
  }, [form]);

  useEffect(() => {
    localStorage.setItem("brief.raci", JSON.stringify(raci));
  }, [raci]);

  useEffect(() => {
    localStorage.setItem("brief.dodChecks", JSON.stringify(dodChecks));
  }, [dodChecks]);

  /* ===== Helpers ===== */
  function insertDoDTemplate() {
    const key = "dod";
    const existing = form[key] || "";
    const template =
      `Wenn wir fertig sind, dann …\n` +
      `• [Kern-Outcome] ist erreicht (Baseline → Ziel, Korridor, Messpunkt)\n` +
      `• [Prozess-/System-Änderung] ist aktiv (Go-Live, Schulung, Doku, Ownership)\n` +
      `• Verantwortungen sind verbindlich geklärt (RACI; Entscheiderkreis steht)\n` +
      `• Risiken/Blocker sind adressiert (Maßnahmen, Fallbacks)\n`;
    setForm((prev) => ({ ...prev, [key]: existing ? existing : template }));
  }

  function updateRaciRow(id: string, key: keyof RaciRow, value: string) {
    setRaci((rows) =>
      rows.map((r) => (r.id === id ? { ...r, [key]: value } : r))
    );
  }
  function addRaciRow() {
    setRaci((rows) => [
      ...rows,
      {
        id: crypto.randomUUID(),
        thema: "",
        owner: "",
        accountable: "",
        consulted: "",
        informed: "",
      },
    ]);
  }
  function removeRaciRow(id: string) {
    setRaci((rows) =>
      rows.length > 1 ? rows.filter((r) => r.id !== id) : rows
    );
  }

  function toggleCheck(label: string) {
    setDodChecks((m) => ({ ...m, [label]: !m[label] }));
  }

  /* ===== UI ===== */
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Brief (Entwurf)</h1>
        <div className="text-xs text-gray-500">
          {saved ? "gespeichert" : "\u00A0"}
        </div>
      </header>

      {!!selected.length && (
        <div className="text-sm text-gray-700">
          Ausgewählte Rollen:&nbsp;
          {selected.map((id) => (
            <span
              key={id}
              className="inline-block rounded-full border px-2 py-0.5 mr-1"
              title={id}
            >
              {id}
            </span>
          ))}
          <a className="ml-2 underline" href="/explore">
            ändern
          </a>
        </div>
      )}

      {/* DoD: prominentes Feld + Vorlage */}
      <section className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label className="block text-sm font-medium">
            Definition of Done
          </label>
          <button
            onClick={insertDoDTemplate}
            className="text-xs rounded-lg border px-2 py-1 hover:bg-gray-50"
            title="Vorlage einfügen"
          >
            Vorlage einsetzen
          </button>
        </div>
        <textarea
          rows={6}
          className="w-full border rounded-xl p-3 text-sm"
          placeholder={QUESTIONS.find((q) => q.id === "dod")?.placeholder}
          value={form["dod"] || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, dod: e.target.value }))
          }
        />
      </section>

      {/* DoD-Checkliste */}
      <section className="rounded-xl border p-4">
        <h2 className="text-sm font-medium mb-3">DoD-Checkliste</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {DOD_ITEMS.map((label) => (
            <label key={label} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={!!dodChecks[label]}
                onChange={() => toggleCheck(label)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Freitext-Blöcke */}
      {QUESTIONS.filter((q) => q.id !== "dod").map((q) => (
        <section key={q.id} className="rounded-xl border p-4">
          <label className="block text-sm font-medium mb-2">{q.label}</label>
          <textarea
            rows={q.rows ?? 5}
            className="w-full border rounded-xl p-3 text-sm"
            placeholder={q.placeholder || "Ihre Worte hier …"}
            value={form[q.id] || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [q.id]: e.target.value }))
            }
          />
        </section>
      ))}

      {/* RACI-Mini-Tabelle */}
      <section className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">RACI (kurz)</h2>
          <button
            onClick={addRaciRow}
            className="text-xs rounded-lg border px-2 py-1 hover:bg-gray-50"
            title="Zeile hinzufügen"
          >
            + Zeile
          </button>
        </div>

        <div className="hidden md:grid md:grid-cols-[2fr,1fr,1fr,1fr,1fr,auto] gap-2 text-xs font-medium text-gray-600">
          <div>Thema / Arbeitspaket</div>
          <div>Owner (R)</div>
          <div>Accountable (A)</div>
          <div>Consulted (C)</div>
          <div>Informed (I)</div>
          <div></div>
        </div>

        <div className="space-y-2">
          {raci.map((row) => (
            <div
              key={row.id}
              className="grid md:grid-cols-[2fr,1fr,1fr,1fr,1fr,auto] grid-cols-1 gap-2 items-start"
            >
              <input
                className="border rounded-lg p-2 text-sm"
                placeholder="Thema / Arbeitspaket"
                value={row.thema}
                onChange={(e) => updateRaciRow(row.id, "thema", e.target.value)}
              />
              <input
                className="border rounded-lg p-2 text-sm"
                placeholder="Owner (R)"
                value={row.owner}
                onChange={(e) => updateRaciRow(row.id, "owner", e.target.value)}
              />
              <input
                className="border rounded-lg p-2 text-sm"
                placeholder="Accountable (A)"
                value={row.accountable}
                onChange={(e) =>
                  updateRaciRow(row.id, "accountable", e.target.value)
                }
              />
              <input
                className="border rounded-lg p-2 text-sm"
                placeholder="Consulted (C)"
                value={row.consulted}
                onChange={(e) =>
                  updateRaciRow(row.id, "consulted", e.target.value)
                }
              />
              <input
                className="border rounded-lg p-2 text-sm"
                placeholder="Informed (I)"
                value={row.informed}
                onChange={(e) =>
                  updateRaciRow(row.id, "informed", e.target.value)
                }
              />
              <button
                onClick={() => removeRaciRow(row.id)}
                className="text-xs rounded-lg border px-2 py-2 hover:bg-gray-50"
                title="Zeile entfernen"
              >
                Entfernen
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          Tipp: Kürzel reichen (z. B. „AB“, „HR“, „IT-Ops“). Details klären wir
          im ersten Workshop.
        </p>
      </section>

      <p className="text-xs text-gray-500">
        Hinweis: Der Entwurf wird nur auf diesem Gerät gespeichert. „Weiter“
        folgt nach Login.
      </p>

      <div className="flex justify-end">
        <a href="/offer" className="rounded-lg bg-black text-white px-4 py-2">
          Weiter: Angebots-Entwurf
        </a>
      </div>
    </main>
  );
}
