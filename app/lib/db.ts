// app/lib/db.ts
"use client";
import { SupabaseClient } from "@supabase/supabase-js";

export type BriefData = Record<string, string>;
export type Change = {
  ts: number;
  kind: "add" | "edit" | "remove";
  field: string;
  note: string;
};

export async function persistOfferV1(
  supabase: SupabaseClient,
  params: {
    brief: BriefData;
    selectedRoles: string[];
    days: number;
    dayRate: number;
    changes: Change[];
  }
) {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user)
    throw new Error("Nicht eingeloggt – bitte per Magic-Link anmelden.");

  // 1) Brief speichern
  const { data: briefIns, error: briefErr } = await supabase
    .from("briefs")
    .insert({
      user_id: user.id,
      data: params.brief,
      selected_roles: params.selectedRoles,
    })
    .select("id")
    .single();

  if (briefErr) throw briefErr;

  // 2) Offer V1 speichern
  const price = Math.round(params.days * params.dayRate);
  const { data: offerIns, error: offerErr } = await supabase
    .from("offers")
    .insert({
      user_id: user.id,
      brief_id: briefIns.id,
      version: 1,
      days: params.days,
      day_rate: params.dayRate,
      price_eur: price,
    })
    .select("id")
    .single();

  if (offerErr) throw offerErr;

  // 3) Change-Log anhängen (falls vorhanden)
  if (params.changes?.length) {
    const rows = params.changes.map((c) => ({
      offer_id: offerIns.id,
      ts: new Date(c.ts).toISOString(),
      kind: c.kind,
      field: c.field,
      note: c.note || null,
    }));
    const { error: chErr } = await supabase.from("offer_changes").insert(rows);
    if (chErr) throw chErr;
  }

  return { briefId: briefIns.id, offerId: offerIns.id };
}

export async function fetchPortalSnapshot(supabase: SupabaseClient) {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return { user: null };

  const [{ data: lastOffer }, { data: deliverables }, { data: invoices }] =
    await Promise.all([
      supabase
        .from("offers")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("deliverables")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
    ]);

  return {
    user,
    lastOffer,
    deliverables: deliverables || [],
    invoices: invoices || [],
  };
}
