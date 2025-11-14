// app/offer/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { persistOfferV1, type Change } from "../lib/db";

import { useLanguage } from "../lang/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { ProcessBar } from "../components/ProcessBar";

import { PDFViewer, pdf } from "@react-pdf/renderer";
import { OfferPdf } from "../components/OfferPdf";

import { BEHAVIORS, SKILLS, LOCAL_KEYS, Lang } from "../lib/catalog";

type Brief = Record<string, any>;
const DAY_RATE = 2000;

export default function OfferPage() {
  // Basisdaten
  const [brief, setBrief] = useState<Brief>({});
  const [roles, setRoles] = useState<string[]>([]);
  const [days, setDays] = useState<number>(5);

  // abgeleitete Inhalte aus Briefing (Behavior + Skills)
  const [behaviorResolved, setBehaviorResolved] = useState<{
    ctx: string;
    pkg: string;
    style: string;
    outcome: string;
  } | null>(null);

  const [skillsResolved, setSkillsResolved] = useState<
    {
      id: string;
      title: string;
      offer: string;
      need?: string;
      outcome?: string;
    }[]
  >([]);

  // Session / Aktionen
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const { lang } = useLanguage();
  const L: Lang = (lang as Lang) || "de";
  const total = useMemo(() => days * DAY_RATE, [days]);

  // Supabase-Session beobachten
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionUser(data.session?.user ?? null);
    });
    const sub = supabase.auth.onAuthStateChange((_e, s) =>
      setSessionUser(s?.user ?? null)
    );
    return () => sub.data?.subscription?.unsubscribe();
  }, []);

  // Lokale Daten (Brief & Rollen) laden + Behavior/Skills auflösen
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

    try {
      const form = parseJson<Record<string, any>>(
        localStorage.getItem("brief.form"),
        {}
      );
      const selected = parseJson<string[]>(
        localStorage.getItem("brief.selected"),
        []
      );

      setBrief(form);
      setRoles(Array.isArray(selected) ? selected : []);
    } catch {
      /* tolerant */
    }

    // **NEU – Verhalten + Skills**
    try {
      const behaviorId = localStorage.getItem(LOCAL_KEYS.behavior) || "";
      if (behaviorId) {
        const b = BEHAVIORS.find((x) => x.id === behaviorId);
        if (b) {
          setBehaviorResolved({
            ctx: b.ctx[L],
            pkg: b.pkg[L],
            style: b.style[L],
            outcome: b.outcome[L],
          });
        } else {
          setBehaviorResolved(null);
        }
      } else {
        setBehaviorResolved(null);
      }

      const skillIds = parseJson<string[]>(
        localStorage.getItem(LOCAL_KEYS.skills),
        []
      );
      const notes = parseJson<
        Record<string, { need?: string; outcome?: string }>
      >(localStorage.getItem(LOCAL_KEYS.notes), {});

      const resolved = (skillIds || [])
        .map((id) => {
          const s = SKILLS.find((x) => x.id === id);
          if (!s) return null;
          return {
            id,
            title: s.title[L],
            offer: s.offerShort[L],
            need: notes?.[id]?.need || "",
            outcome: notes?.[id]?.outcome || "",
          };
        })
        .filter(Boolean) as {
        id: string;
        title: string;
        offer: string;
        need?: string;
        outcome?: string;
      }[];

      setSkillsResolved(resolved);
    } catch {
      setBehaviorResolved(null);
      setSkillsResolved([]);
    }
  }, [L]);

  // Change-Log vorbereiten
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

  // Magic-Link Login
  async function saveWithEmail() {
    try {
      setSaving(true);
      setMsg("");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/portal` },
      });
      if (error) throw error;
      setMsg(
        L === "en"
          ? "Login link sent. Please check your email."
          : "Login-Link gesendet. Bitte E-Mail prüfen."
      );
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
        changes: buildChanges(),
      });
      const briefId = (res as any).briefId ?? (res as any).brief_id ?? "—";
      const offerId = (res as any).offerId ?? (res as any).offer_id ?? "—";
      setMsg(
        (L === "en" ? "Saved: Brief " : "Gespeichert: Brief ") +
          briefId +
          ", Offer " +
          offerId
      );
    } catch (e: any) {
      setMsg(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  // PDF herunterladen
  async function downloadPdf() {
    try {
      setSaving(true);
      setMsg("");
      const blob = await pdf(
        <OfferPdf
          brief={brief}
          roles={roles}
          days={days}
          dayRate={DAY_RATE}
          total={total}
          lang={L}
          behavior={behaviorResolved}
          skills={skillsResolved}
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

      setMsg(
        L === "en"
          ? "PDF downloaded (non-binding draft)."
          : "PDF heruntergeladen (unverbindlicher Entwurf)."
      );
    } catch (e: any) {
      setMsg(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  // Preisoptionen (gehen ins PDF – optional)
  const priceOptions = [
    {
      label: L === "en" ? "Starter (3 days)" : "Starter (3 WT)",
      days: 3,
      total: 3 * DAY_RATE,
    },
    {
      label: L === "en" ? "Core (5 days)" : "Kern (5 WT)",
      days: 5,
      total: 5 * DAY_RATE,
    },
    {
      label: L === "en" ? "Plus (8 days)" : "Plus (8 WT)",
      days: 8,
      total: 8 * DAY_RATE,
    },
  ];

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">
          {L === "en" ? "Offer draft" : "Angebots-Entwurf"}
        </h1>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-2">
            <Link
              href={`/explore?lang=${L}`}
              className="rounded-full border px-3 py-1.5 text-xs sm:text-sm hover:bg-gray-50"
            >
              {L === "en" ? "Choose roles" : "Rollen wählen"}
            </Link>
            <Link
              href={`/brief?lang=${L}`}
              className="rounded-full border px-3 py-1.5 text-xs sm:text-sm hover:bg-gray-50"
            >
              {L === "en" ? "Edit briefing" : "Brief bearbeiten"}
            </Link>
            <button
              type="button"
              onClick={() => setPreviewOpen((v) => !v)}
              className="rounded-full border px-3 py-1.5 text-xs sm:text-sm hover:bg-gray-50"
            >
              {previewOpen
                ? L === "en"
                  ? "Close preview"
                  : "Vorschau schließen"
                : L === "en"
                ? "Open preview"
                : "Vorschau öffnen"}
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              className="rounded-full border px-3 py-1.5 text-xs sm:text-sm hover:bg-gray-900 hover:text-white disabled:opacity-50"
              disabled={saving}
            >
              {L === "en" ? "Download PDF" : "PDF herunterladen"}
            </button>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Prozess */}
      <ProcessBar current="offer" />

      {/* Zusammenfassung */}
      <section className="rounded-xl border p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <b>{L === "en" ? "Roles:" : "Rollen:"}</b>{" "}
            {roles.length ? roles.join(", ") : "—"}
          </div>
          <div>
            <b>{L === "en" ? "Days:" : "Tage:"}</b> {days}
          </div>
          <div>
            <b>{L === "en" ? "Rate/day:" : "Satz/Tag:"}</b>{" "}
            {DAY_RATE.toLocaleString(L === "en" ? "en-US" : "de-DE")} €
          </div>
          <div>
            <b>{L === "en" ? "Total:" : "Summe:"}</b>{" "}
            {total.toLocaleString(L === "en" ? "en-US" : "de-DE")} €
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 text-sm">
          <span>{L === "en" ? "Days:" : "Tage:"}</span>
          <input
            type="number"
            min={1}
            className="w-24 border rounded-lg p-2"
            value={days}
            onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
          />
          <span className="text-gray-700">
            {L === "en"
              ? `Rate: ${DAY_RATE.toLocaleString("en-US")} € / day`
              : `Satz: ${DAY_RATE.toLocaleString("de-DE")} € / Tag`}
          </span>
        </div>
      </section>

      {/* Inline-PDF-Vorschau */}
      {previewOpen && (
        <section className="rounded-xl border p-4 space-y-3">
          <h2 className="font-medium text-sm">
            {L === "en"
              ? "Preview (draft, non-binding)"
              : "Vorschau (Entwurf, unverbindlich)"}
          </h2>
          <div className="h-[600px] border rounded-lg overflow-hidden">
            <PDFViewer width="100%" height="100%">
              <OfferPdf
                brief={brief}
                roles={roles}
                days={days}
                dayRate={DAY_RATE}
                total={total}
                options={priceOptions}
                lang={L}
                behavior={behaviorResolved}
                skills={skillsResolved}
              />
            </PDFViewer>
          </div>
        </section>
      )}

      {/* Fortsetzen & speichern */}
      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-medium">
          {L === "en" ? "Continue & save" : "Fortsetzen & speichern"}
        </h2>

        {!sessionUser && (
          <>
            <input
              type="email"
              placeholder={L === "en" ? "Your email" : "Ihre E-Mail"}
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
              {saving
                ? L === "en"
                  ? "Sending…"
                  : "Sende…"
                : L === "en"
                ? "Send login link"
                : "Login-Link senden"}
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
            {saving
              ? L === "en"
                ? "Saving…"
                : "Speichere…"
              : L === "en"
              ? "Save in my account"
              : "In meinem Konto speichern"}
          </button>
        )}

        {msg && <p className="text-sm text-gray-700 mt-2">{msg}</p>}

        <p className="text-xs text-gray-500">
          {L === "en"
            ? "By logging in you accept staged payments, a structured acceptance process (5 working days) and data protection notes."
            : "Mit Login akzeptieren Sie Abschlagszahlungen, Abnahmeprozess (5 WT) und DSGVO-Hinweise."}
        </p>
      </section>
    </main>
  );
}
