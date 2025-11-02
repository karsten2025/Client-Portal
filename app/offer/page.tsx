"use client";
export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import NextDynamic from "next/dynamic";
import Link from "next/link"; // ⬅️ neu
import { supabase } from "../lib/supabaseClient";
import { persistOfferV1, type Change } from "../lib/db";
import { OfferPdf } from "../components/OfferPdf";

const PDFViewer = NextDynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  { ssr: false }
);

type Brief = Record<string, any>;
const DAY_RATE = 2000;

export default function OfferPage() {
  const [brief, setBrief] = useState<Brief>({});
  const [roles, setRoles] = useState<string[]>([]);
  const [days, setDays] = useState<number>(5);

  const [sessionUser, setSessionUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const total = useMemo(() => days * DAY_RATE, [days]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionUser(data.session?.user ?? null);
    });
    const sub = supabase.auth.onAuthStateChange((_e, s) =>
      setSessionUser(s?.user ?? null)
    );
    return () => sub.data?.subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const parseJson = <T,>(v: string | null, fallback: T): T => {
      if (!v) return fallback;
      try {
        return JSON.parse(v) as T;
      } catch {
        return fallback;
      }
    };
    const form = parseJson<Record<string, any>>(
      localStorage.getItem("brief.form"),
      {}
    );
    const selected = parseJson<string[]>(
      localStorage.getItem("brief.selected"),
      []
    );
    const dodChecks = parseJson<Record<string, boolean>>(
      localStorage.getItem("brief.dodChecks"),
      {}
    );
    const raci = parseJson<Record<string, string | Record<string, string>>>(
      localStorage.getItem("brief.raci"),
      {}
    );
    setBrief({ ...form, dodChecks, raci });
    setRoles(Array.isArray(selected) ? selected : []);
  }, []);

  function buildChanges(): Change[] {
    const now = new Date().toISOString();
    return [
      { kind: "snapshot", path: "/brief", new: brief, at: now },
      { kind: "set", path: "/selectedRoles", new: roles, at: now },
      { kind: "set", path: "/days", new: days, at: now },
      { kind: "set", path: "/dayRate", new: DAY_RATE, at: now },
      { kind: "set", path: "/total", new: total, at: now },
    ];
  }

  async function downloadPdf() {
    const { pdf } = await import("@react-pdf/renderer");
    const blob = await pdf(
      <OfferPdf
        brief={brief}
        roles={roles}
        days={days}
        dayRate={DAY_RATE}
        total={total}
        options={[
          { label: "Starter (3 WT)", days: 3, total: 3 * DAY_RATE },
          { label: "Kern (5 WT)", days: 5, total: 5 * DAY_RATE },
          { label: "Plus (8 WT)", days: 8, total: 8 * DAY_RATE },
        ]}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const file = `Angebotsentwurf_${(brief?.kunde || "Unbenannt")
      .toString()
      .replace(/\s+/g, "_")}.pdf`;
    a.href = url;
    a.download = file;
    a.click();
    URL.revokeObjectURL(url);
  }

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

  async function saveToAccount() {
    try {
      setSaving(true);
      setMsg("");
      const res = await persistOfferV1(supabase, {
        brief,
        selectedRoles: roles,
        days,
        dayRate: DAY_RATE,
        changes: buildChanges(),
      });
      const briefId = (res as any).briefId ?? (res as any).brief_id ?? "—";
      const offerId = (res as any).offerId ?? (res as any).offer_id ?? "—";
      setMsg(`Gespeichert: Brief ${briefId}, Offer ${offerId}`);
    } catch (e: any) {
      setMsg(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Angebots-Entwurf</h1>

      {/* kleine Toolbar zum Hin- und Herspringen */}
      <div className="flex flex-wrap gap-3">
        <Link href="/explore" className="rounded-lg border px-3 py-1.5">
          Rollen wählen
        </Link>
        <Link href="/brief" className="rounded-lg border px-3 py-1.5">
          Brief bearbeiten (DoD/RACI)
        </Link>
        <button
          type="button"
          className="rounded-lg border px-3 py-1.5"
          onClick={() => setShowPreview((v) => !v)}
        >
          {showPreview ? "Vorschau schließen" : "Vorschau öffnen"}
        </button>
        <button
          type="button"
          className="rounded-lg border px-3 py-1.5"
          onClick={downloadPdf}
        >
          PDF herunterladen
        </button>
      </div>

      {/* Info-Box + Editfelder */}
      <section className="rounded-xl border p-4 space-y-4">
        <div className="text-sm grid grid-cols-2 gap-2">
          <div>
            <b>Rollen:</b> {roles.length ? roles.join(", ") : "—"}
          </div>
          <div>
            <b>Tage:</b> {days}
          </div>
          <div>
            <b>Satz/Tag:</b> {DAY_RATE.toLocaleString("de-DE")} €
          </div>
          <div>
            <b>Summe:</b> {total.toLocaleString("de-DE")} €
          </div>
        </div>

        {/* Kundensprache */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm block mb-1">
              Ergebnis (so sieht „fertig“ aus)
            </label>
            <input
              className="w-full border rounded-lg p-2"
              value={brief?.ziel ?? ""}
              onChange={(e) =>
                setBrief((b) => ({ ...b, ziel: e.target.value }))
              }
              placeholder="z. B. messbares Ergebnis in 5 WT"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Wichtigster Hebel</label>
            <input
              className="w-full border rounded-lg p-2"
              value={brief?.hebel ?? ""}
              onChange={(e) =>
                setBrief((b) => ({ ...b, hebel: e.target.value }))
              }
              placeholder="z. B. Durchlaufzeit, Qualität, Klarheit…"
            />
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

        {showPreview && (
          <div className="h-[70vh] border rounded-lg overflow-hidden">
            <PDFViewer width="100%" height="100%">
              <OfferPdf
                brief={brief}
                roles={roles}
                days={days}
                dayRate={DAY_RATE}
                total={total}
                options={[
                  { label: "Starter (3 WT)", days: 3, total: 3 * DAY_RATE },
                  { label: "Kern (5 WT)", days: 5, total: 5 * DAY_RATE },
                  { label: "Plus (8 WT)", days: 8, total: 8 * DAY_RATE },
                ]}
              />
            </PDFViewer>
          </div>
        )}
      </section>

      {/* Login / Speichern */}
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
