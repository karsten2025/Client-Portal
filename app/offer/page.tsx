"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { persistOfferV1, type Change } from "../lib/db";

type Brief = Record<string, string>;
const DAY_RATE = 2000;

export default function OfferPage() {
  // Basis-State
  const [brief, setBrief] = useState<Brief>({});
  const [roles, setRoles] = useState<string[]>([]);
  const [days, setDays] = useState<number>(5);

  // Session / Aktionen
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [changes, setChanges] = useState<Change[]>([]); // Reserve für spätere Change-Logs
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Supabase-Session beobachten
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSessionUser(data.session?.user ?? null));
    const sub = supabase.auth.onAuthStateChange((_e, s) =>
      setSessionUser(s?.user ?? null)
    );
    return () => sub.data?.subscription?.unsubscribe();
  }, []);

  // Lokale Daten laden (Explore/Brief)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setBrief(JSON.parse(localStorage.getItem("brief.form") || "{}"));
      setRoles(JSON.parse(localStorage.getItem("brief.selected") || "[]"));
    } catch {}
  }, []);

  // E-Mail Login (Magic Link)
  async function saveWithEmail() {
    try {
      setSaving(true);
      setMsg("");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/portal` },
      });
      if (error) throw error;
      setMsg("Login-Link gesendet. Bitte E-Mail prüfen.");
    } catch (e: any) {
      setMsg(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  // Direkt ins Konto speichern (eingeloggt)
  async function saveToAccount() {
    try {
      setSaving(true);
      setMsg("");
      const res = await persistOfferV1(supabase, {
        brief,
        selectedRoles: roles,
        days,
        dayRate: DAY_RATE,
        changes,
      });
      setMsg(`Gespeichert: Brief ${res.briefId}, Offer ${res.offerId}`);
    } catch (e: any) {
      setMsg(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Angebots-Entwurf</h1>

      <section className="rounded-xl border p-4 space-y-2">
        <div className="text-sm">
          <div>
            <b>Rollen:</b> {roles.length ? roles.join(", ") : "—"}
          </div>
          <div>
            <b>Ziel:</b> {brief.ziel || "—"}
          </div>
          <div>
            <b>Hebel:</b> {brief.hebel || "—"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm">Tage:</label>
          <input
            type="number"
            min={1}
            className="w-24 border rounded-lg p-2"
            value={days}
            onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
          />
          <div className="text-sm text-gray-700">
            Satz: {DAY_RATE.toLocaleString("de-DE")} € / Tag
          </div>
        </div>
      </section>

      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-medium">Fortsetzen & speichern</h2>

        {!sessionUser && (
          <>
            <input
              type="email"
              placeholder="Ihre E-Mail"
              className="w-full border rounded-lg p-2 mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              className="w-full rounded-lg bg-black text-white py-2 disabled:opacity-50"
              onClick={saveWithEmail}
              disabled={saving || !email}
            >
              {saving ? "Sende…" : "Login-Link senden"}
            </button>
          </>
        )}

        {sessionUser && (
          <button
            type="button"
            className="w-full rounded-lg border py-2 disabled:opacity-50"
            onClick={saveToAccount}
            disabled={saving}
          >
            {saving ? "Speichere…" : "In meinem Konto speichern"}
          </button>
        )}

        {msg && <p className="text-sm text-gray-700 mt-2">{msg}</p>}
        <p className="text-xs text-gray-500">
          Mit Login akzeptieren Sie Abschlagszahlungen, Abnahmeprozess (5 WT)
          und DSGVO-Hinweise.
        </p>
      </section>
    </main>
  );
}
