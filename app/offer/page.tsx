"use client";
import { persistOfferV1, type Change } from "../lib/db";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const [sessionUser, setSessionUser] = useState<any>(null);
useEffect(() => {
  supabase.auth
    .getSession()
    .then(({ data }) => setSessionUser(data.session?.user ?? null));
  const sub = supabase.auth.onAuthStateChange((_e, s) =>
    setSessionUser(s?.user ?? null)
  );
  return () => sub.data?.subscription?.unsubscribe();
}, []);

const DAY_RATE = 2000; // € brutto (dein gewünschter Tagessatz)

export default function OfferDraft() {
  const [brief, setBrief] = useState<Record<string, string>>({});
  const [roles, setRoles] = useState<string[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setBrief(JSON.parse(localStorage.getItem("brief.form") || "{}"));
    setRoles(JSON.parse(localStorage.getItem("brief.selected") || "[]"));
    setChanges(JSON.parse(localStorage.getItem("offer.changes") || "[]"));
  }, []);

  function log(kind: Change["kind"], field: string, note: string) {
    const c = [...changes, { ts: Date.now(), kind, field, note }];
    setChanges(c);
    localStorage.setItem("offer.changes", JSON.stringify(c));
  }

  // einfache Heuristik: Aufwandsschätzung aus Freitext (manuell veränderbar)
  const [days, setDays] = useState(5);
  const price = useMemo(() => days * DAY_RATE, [days]);

  async function persistToSupabase() {
    if (!email) return alert("Bitte E-Mail eintragen.");
    // anonyme Drafts -> User mit Magic-Link verbinden
    const { error: authErr } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    });
    if (authErr) return alert(authErr.message);

    // optional: Draft in Tabelle 'offers' schreiben, sobald Session existiert (später)
    alert(
      "Magic-Link gesendet. Nach Login ist der Entwurf in Ihrem Portal sichtbar."
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Angebot – Entwurf</h1>
        <div className="text-sm text-gray-600">V1 (wird versioniert)</div>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card title="Kurzbrief">
            <Field
              name="Ziel & Nutzen"
              value={brief.ziel}
              onEdit={(v) => {
                setBrief({ ...brief, ziel: v });
                localStorage.setItem(
                  "brief.form",
                  JSON.stringify({ ...brief, ziel: v })
                );
                log("edit", "ziel", "Ziel angepasst");
              }}
            />
            <Field
              name="Hebel"
              value={brief.hebel}
              onEdit={(v) => {
                setBrief({ ...brief, hebel: v });
                localStorage.setItem(
                  "brief.form",
                  JSON.stringify({ ...brief, hebel: v })
                );
                log("edit", "hebel", "Hebel angepasst");
              }}
            />
            <Field
              name="Zeitfenster"
              value={brief.zeit}
              onEdit={(v) => {
                setBrief({ ...brief, zeit: v });
                localStorage.setItem(
                  "brief.form",
                  JSON.stringify({ ...brief, zeit: v })
                );
                log("edit", "zeit", "Zeitfenster angepasst");
              }}
            />
            <Field
              name="Rollen (Ihre Worte)"
              value={brief.rollen || roles.join(", ")}
              onEdit={(v) => {
                setBrief({ ...brief, rollen: v });
                localStorage.setItem(
                  "brief.form",
                  JSON.stringify({ ...brief, rollen: v })
                );
                log("edit", "rollen", "Rollenbeschreibung angepasst");
              }}
            />
          </Card>

          <Card title="Aufwandsschätzung">
            <div className="flex items-center gap-3">
              <input
                type="number"
                className="border rounded-lg p-2 w-28"
                min={1}
                value={days}
                onChange={(e) => {
                  setDays(parseInt(e.target.value || "1"));
                  log("edit", "days", "Tage angepasst");
                }}
              />
              <span className="text-sm text-gray-600">
                Tage · Richtwert {DAY_RATE} € / Tag
              </span>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Preis (Richtwert)">
            <div className="text-2xl font-semibold">
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(price)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Hinweis: final je nach Scope. Änderungswünsche werden versioniert.
            </p>
          </Card>

          <Card title="Änderungs-Historie">
            <input
              type="email"
              placeholder="Ihre E-Mail"
              className="w-full border rounded-lg p-2 mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* 1) Magic-Link schicken (ohne Login) */}
            <button
              className="w-full rounded-lg bg-black text-white py-2"
              onClick={persistToSupabase}
            >
              Mit E-Mail fortsetzen
            </button>

            {/* 2) Nur sichtbar, wenn bereits eingeloggt */}
            {sessionUser && (
              <button
                className="w-full rounded-lg border py-2 mt-2"
                onClick={async () => {
                  try {
                    const res = await persistOfferV1(supabase, {
                      brief,
                      selectedRoles: roles,
                      days,
                      dayRate: DAY_RATE,
                      changes,
                    });
                    alert(
                      `Gespeichert. Brief ${res.briefId}, Offer ${res.offerId}.`
                    );
                  } catch (e: any) {
                    alert(`Fehler beim Speichern: ${e.message || e}`);
                  }
                }}
              >
                In meinem Konto speichern
              </button>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Sie bekommen einen Login-Link. Danach sehen Sie den Entwurf in
              Ihrem Portal und wir stimmen Versionen (V2/V3) gemeinsam ab.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm">
      <div className="font-semibold mb-2">{title}</div>
      {children}
    </div>
  );
}

function Field({
  name,
  value,
  onEdit,
}: {
  name: string;
  value?: string;
  onEdit: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{name}</label>
      <textarea
        rows={4}
        className="w-full border rounded-xl p-3 text-sm"
        value={value || ""}
        onChange={(e) => onEdit(e.target.value)}
      />
    </div>
  );
}
