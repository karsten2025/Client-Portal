"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PortalPage() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function sendMagicLink() {
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    });
    setLoading(false);
    setMsg(
      error
        ? `Fehler: ${error.message}`
        : "Check deine E-Mails (Magic-Link gesendet)."
    );
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow">
          <h1 className="text-xl font-semibold mb-2">Client-Portal</h1>
          <p className="text-sm text-gray-600 mb-4">
            Login mit Magic-Link (ohne Passwort)
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
            {loading ? "Sende…" : "Login-Link senden"}
          </button>
          {msg && <p className="text-sm mt-3">{msg}</p>}
          <p className="text-xs text-gray-500 mt-4">
            Mit Login akzeptieren Sie Abschlagszahlungen, Abnahmeprozess (5 WT)
            und DSGVO-Hinweise.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="rounded-2xl border bg-white p-4 shadow">
          <h2 className="text-lg font-semibold">Status</h2>
          <p className="text-sm text-gray-700 mt-1">
            Eingeloggt als <span className="font-mono">{user.email}</span>
          </p>
          <ul className="list-disc ml-5 mt-3 text-sm">
            <li>Angebot: erstellt</li>
            <li>Vertrag: eSign ausstehend</li>
            <li>Abnahme: 5-WT-Fenster nach Fertigstellungsanzeige</li>
          </ul>
          <div className="mt-4 flex gap-2">
            <button
              className="rounded-lg border px-3 py-2"
              onClick={() => alert("Angebot-PDF (später)")}
            >
              Angebot
            </button>
            <button
              className="rounded-lg border px-3 py-2"
              onClick={() => alert("Vertrag eSign (später)")}
            >
              Vertrag eSign
            </button>
            <button
              className="rounded-lg border px-3 py-2"
              onClick={() => alert("Rechnung (später)")}
            >
              Rechnung
            </button>
            <button
              className="rounded-lg bg-black text-white px-3 py-2 ml-auto"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
