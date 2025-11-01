// app/portal/page.tsx
// Portal UI: Timeline + Tabs (ohne zusätzliche UI-Libraries; nur Tailwind v4)
// – behält Magic‑Link‑Login bei
// – zeigt klaren Prozessfluss: Angebot → Vertrag (eSign) → In Arbeit → Abnahme & Rechnung
// – client‑safe: nutzt NEXT_PUBLIC_ Variablen (compile‑time)

"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// -----------------------------
// Helper‑Typen
// -----------------------------
interface Offer {
  id: string;
  package: "diagnose" | "umsetzung" | "retainer";
  price_eur: number;
  valid_until: string;
  pdf_url?: string;
}

interface Acceptance {
  id: string;
  deliverable: string;
  requested_at: string;
  due_at: string;
  status: "open" | "accepted" | "rejected";
}

// -----------------------------
// Hauptkomponente
// -----------------------------
export default function PortalPage() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "status" | "docs" | "cr" | "accept" | "invoices"
  >("status");

  // Dummy‑Daten fürs erste Rendern (kann später via DB ersetzt werden)
  const offer: Offer = useMemo(
    () => ({
      id: "OFF-2025-001",
      package: "diagnose",
      price_eur: 15000,
      valid_until: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 30
      ).toISOString(),
      pdf_url: "#",
    }),
    []
  );

  const [acceptances, setAcceptances] = useState<Acceptance[]>([
    {
      id: "ACC-001",
      deliverable: "Entscheidungs-Deck v1",
      requested_at: new Date().toISOString(),
      due_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
      status: "open",
    },
  ]);

  // Session herstellen + Tab‑Intent aus URL lesen
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user ?? null));
    const sub = supabase.auth.onAuthStateChange((_e, s) =>
      setUser(s?.user ?? null)
    );

    const params = new URLSearchParams(window.location.search);
    const intent = params.get("intent");
    if (intent === "offer") setActiveTab("status");

    return () => sub.data?.subscription?.unsubscribe();
  }, []);

  // -----------------------------
  // Auth: Magic Link
  // -----------------------------
  async function sendMagicLink() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    });
    setLoading(false);
    alert(
      error
        ? `Fehler: ${error.message}`
        : "Check deine E‑Mails (Magic‑Link gesendet)."
    );
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  // -----------------------------
  // Nicht eingeloggt → Loginform
  // -----------------------------
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <section className="w-full max-w-md rounded-2xl border bg-white p-6 shadow">
          <h1 className="text-xl font-semibold mb-2">Client‑Portal</h1>
          <p className="text-sm text-gray-600 mb-4">
            Login mit Magic‑Link (ohne Passwort)
          </p>
          <input
            type="email"
            placeholder="name@firma.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2 mb-3"
          />
          <button
            onClick={sendMagicLink}
            disabled={!email || loading}
            className="w-full rounded-lg bg-black text-white py-2 disabled:opacity-50"
          >
            {loading ? "Sende…" : "Login‑Link senden"}
          </button>
          <p className="text-xs text-gray-500 mt-4">
            Mit Login akzeptieren Sie Abschlagszahlungen, Abnahmeprozess (5 WT)
            und DSGVO‑Hinweise.
          </p>
        </section>
      </main>
    );
  }

  // -----------------------------
  // Eingeloggt → Prozess‑UI
  // -----------------------------
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Timeline */}
        <div className="grid md:grid-cols-4 gap-3">
          <Step title="Angebot" state="done" />
          <Step title="Vertrag (eSign)" state="done" />
          <Step title="In Arbeit" state="active" />
          <Step title="Abnahme & Rechnung" state="todo" />
        </div>

        {/* Tabs */}
        <section className="rounded-2xl border bg-white shadow">
          <div className="border-b px-4 pt-4">
            <div className="flex flex-wrap gap-2">
              <TabButton
                active={activeTab === "status"}
                onClick={() => setActiveTab("status")}
              >
                Status
              </TabButton>
              <TabButton
                active={activeTab === "docs"}
                onClick={() => setActiveTab("docs")}
              >
                Dokumente
              </TabButton>
              <TabButton
                active={activeTab === "cr"}
                onClick={() => setActiveTab("cr")}
              >
                Change‑Requests
              </TabButton>
              <TabButton
                active={activeTab === "accept"}
                onClick={() => setActiveTab("accept")}
              >
                Abnahme
              </TabButton>
              <TabButton
                active={activeTab === "invoices"}
                onClick={() => setActiveTab("invoices")}
              >
                Rechnungen
              </TabButton>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "status" && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="font-semibold mb-1">📄 Angebot</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Paket: Diagnose‑Sprint · Preis: {formatEUR(offer.price_eur)}{" "}
                    · gültig bis{" "}
                    {new Date(offer.valid_until).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="btn"
                      onClick={() =>
                        window.open(offer.pdf_url || "#", "_blank")
                      }
                    >
                      Angebot als PDF
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        alert("Klarstellungscall buchen (Calendly/Cal.com)")
                      }
                    >
                      Klarstellungscall
                    </button>
                  </div>
                </Card>

                <Card>
                  <h3 className="font-semibold mb-1">⏰ Nächster Termin</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Kick‑off nach eSign. Abschlagsrechnung 40 % vor Start (gem.
                    §5).
                  </p>
                  <button
                    className="btn-outline"
                    onClick={() => alert("eSign öffnen (DocuSign/Adobe Sign)")}
                  >
                    Vertrag eSign
                  </button>
                </Card>
              </div>
            )}

            {activeTab === "docs" && (
              <div className="space-y-3">
                <DocRow
                  label="Leistungsnachweis (Monat)"
                  onOpen={() => alert("Download Leistungsnachweis PDF")}
                />
                <DocRow
                  label="CR‑Log (A‑1)"
                  onOpen={() => alert("CR‑Übersicht öffnen")}
                />
                <DocRow
                  label="Abnahmeprotokoll"
                  onOpen={() => alert("Abnahmeprotokoll öffnen/hochladen")}
                />
              </div>
            )}

            {activeTab === "cr" && (
              <CRForm
                onSave={(payload) => {
                  console.log("CR gespeichert", payload);
                  alert("CR gespeichert – Ticketnummer vergeben (Demo).");
                }}
              />
            )}

            {activeTab === "accept" && (
              <AcceptanceList
                items={acceptances}
                onAccept={(id) => {
                  setAcceptances((prev) =>
                    prev.map((i) =>
                      i.id === id ? { ...i, status: "accepted" } : i
                    )
                  );
                  alert("Abnahme erteilt – Rechnung wird vorbereitet.");
                }}
                onReject={(id) => {
                  setAcceptances((prev) =>
                    prev.map((i) =>
                      i.id === id ? { ...i, status: "rejected" } : i
                    )
                  );
                  alert("Mangel protokolliert – Nachbesserung folgt (10 WT).");
                }}
              />
            )}

            {activeTab === "invoices" && (
              <div className="space-y-3">
                <DocRow
                  label="Rechnung März 2025 (Z&M)"
                  onOpen={() => alert("Rechnung öffnen")}
                />
                <DocRow
                  label="Abschlagsrechnung 40 % (Paket)"
                  onOpen={() => alert("Rechnung öffnen")}
                />
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end">
          <button className="btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}

// -----------------------------
// UI‑Helpers (pur Tailwind)
// -----------------------------
function Step({
  title,
  state,
}: {
  title: string;
  state: "done" | "active" | "todo";
}) {
  const base =
    "rounded-2xl border p-3 text-sm font-medium flex items-center gap-2";
  if (state === "done")
    return (
      <div className={`${base} bg-green-50 border-green-200`}>✅ {title}</div>
    );
  if (state === "active")
    return (
      <div className={`${base} bg-amber-50 border-amber-200`}>🟡 {title}</div>
    );
  return <div className={`${base} bg-white`}>⬜ {title}</div>;
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-t-lg text-sm border-b-2 ${
        active
          ? "border-black font-semibold"
          : "border-transparent text-gray-600 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white">{children}</div>
  );
}

function DocRow({ label, onOpen }: { label: string; onOpen: () => void }) {
  return (
    <div className="flex items-center justify-between border rounded-xl p-3">
      <div className="text-sm">📎 {label}</div>
      <button className="btn-secondary" onClick={onOpen}>
        Öffnen
      </button>
    </div>
  );
}

function CRForm({
  onSave,
}: {
  onSave: (payload: {
    title: string;
    desc: string;
    acceptBudget: boolean;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [acceptBudget, setAcceptBudget] = useState(true);
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Kurzbeschreibung</label>
        <input
          className="w-full border rounded-lg p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="z. B. zusätzliche Auswertung …"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="cr-accept"
          type="checkbox"
          checked={acceptBudget}
          onChange={(e) => setAcceptBudget(e.target.checked)}
        />
        <label htmlFor="cr-accept" className="text-sm">
          Mehraufwand zu 2.000 €/PT akzeptieren (Z&M, §5)
        </label>
      </div>
      <div>
        <label className="block text-sm mb-1">Details</label>
        <textarea
          className="w-full border rounded-lg p-2 text-sm"
          rows={4}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Scope, Ziel, Deadline, Abhängigkeiten…"
        />
      </div>
      <button
        className="btn"
        onClick={() => onSave({ title, desc, acceptBudget })}
      >
        CR speichern
      </button>
    </div>
  );
}

function AcceptanceList({
  items,
  onAccept,
  onReject,
}: {
  items: Acceptance[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  if (!items.length)
    return <p className="text-sm text-gray-600">Keine offenen Abnahmen.</p>;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border rounded-xl p-3"
        >
          <div className="text-sm">
            <div className="font-medium">✅ {item.deliverable}</div>
            <div className="text-xs text-gray-600">
              Abnahme bis {new Date(item.due_at).toLocaleDateString()} (5 WT
              Frist gemäß Vertrag)
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn" onClick={() => onAccept(item.id)}>
              Abnehmen
            </button>
            <button className="btn-outline" onClick={() => onReject(item.id)}>
              Mangel rügen
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// -----------------------------
// kleine Utilities
// -----------------------------
function formatEUR(v: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);
}

// -----------------------------
// Tailwind Button Utilities (Utility‑Klassen als CSS‑Mixins via className)
// -----------------------------
declare module "react" {
  interface HTMLAttributes<T> {}
}

// btn‑Klassen (als string zusammengesetzt)
const baseBtn =
  "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm";
const ring = "focus:outline-none focus:ring-2 focus:ring-black/20";
(globalThis as any).btn = undefined; // nur um TS still zu halten, hat keine Wirkung

// Globale CSS‑Hilfsklassen per JS nicht möglich – wir nutzen Strings:
//  btn          => schwarze Primär‑Taste
//  btn-secondary=> graue Taste
//  btn-outline  => Umriss‑Taste
//  btn-danger   => rote Taste

// Wir definieren kleine Wrapper‑Komponenten für Buttons, damit die Klassen wiederverwendbar sind.
function Btn({ children, className, ...props }: any) {
  return (
    <button className={`${baseBtn} ${ring} ${className}`} {...props}>
      {children}
    </button>
  );
}
(globalThis as any).Btn = Btn;

// Shortcuts als Klassenkombinationen
//  -> in JSX direkt als className verwenden (siehe oben)
// Primär
// className="btn"  (wir schreiben die Klassen inline bei Verwendung)

// Damit das ohne globale CSS klappt, belassen wir die Klassen direkt in den Stellen oben:
//  btn         => "bg-black text-white hover:opacity-90"
//  btn-secondary => "bg-gray-100 hover:bg-gray-200"
//  btn-outline => "border hover:bg-gray-50"
//  btn-danger  => "bg-red-600 text-white hover:bg-red-700"

// Hinweis: Wir haben die Klassennamen (btn, btn-secondary, …) oben als Literalstrings verwendet.
// Zentrale Definition wäre mit Tailwind Plugins möglich – für Einfachheit inline belassen.
