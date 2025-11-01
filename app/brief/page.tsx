"use client";
import { useEffect, useState } from "react";

const QUESTIONS = [
  {
    id: "ziel",
    label: "Worum geht es wirklich? (Zielbild, „fertig“, nicht „busy“)",
  },
  {
    id: "hebel",
    label:
      "Wo vermuten Sie den größten Hebel? (z. B. Durchlaufzeit, Qualität, Führung, Klarheit)",
  },
  { id: "zeit", label: "Zeitfenster & Randbedingungen" },
  { id: "rollen", label: "Welche Rollen wünschen Sie (in Ihren Worten)?" },
];

export default function Brief() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSelected(JSON.parse(localStorage.getItem("brief.selected") || "[]"));
    setForm(JSON.parse(localStorage.getItem("brief.form") || "{}"));
  }, []);
  useEffect(() => {
    localStorage.setItem("brief.form", JSON.stringify(form));
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 800);
    return () => clearTimeout(t);
  }, [form]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Brief (Entwurf)</h1>
        <div className="text-xs text-gray-500">
          {saved ? "gespeichert" : " "}
        </div>
      </header>

      {!!selected.length && (
        <div className="text-sm text-gray-700">
          Ausgewählte Rollen:&nbsp;
          {selected.map((id) => (
            <span
              key={id}
              className="inline-block rounded-full border px-2 py-0.5 mr-1"
            >
              {id}
            </span>
          ))}
          <a className="ml-2 underline" href="/explore">
            ändern
          </a>
        </div>
      )}

      {QUESTIONS.map((q) => (
        <div key={q.id}>
          <label className="block text-sm font-medium mb-1">{q.label}</label>
          <textarea
            rows={q.id === "rollen" ? 4 : 5}
            className="w-full border rounded-xl p-3 text-sm"
            placeholder="Ihre Worte hier …"
            value={form[q.id] || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [q.id]: e.target.value }))
            }
          />
        </div>
      ))}

      <div className="flex items-center gap-2">
        <a href="/offer" className="rounded-lg bg-black text-white px-4 py-2">
          Angebots-Entwurf erstellen
        </a>
        <span className="text-xs text-gray-500">
          Kein Login nötig. Sie können später per E-Mail fortsetzen.
        </span>
      </div>
    </main>
  );
}
