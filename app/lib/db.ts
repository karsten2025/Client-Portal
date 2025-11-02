// app/lib/db.ts
import type { SupabaseClient } from "@supabase/supabase-js";

export type Change = {
  kind: "snapshot" | "set" | "add" | "edit" | "remove";
  path: string;
  old?: any;
  new?: any;
  at?: string; // ISO-Zeitstempel
};

export async function persistOfferV1(
  supabase: SupabaseClient,
  payload: {
    brief: Record<string, string>;
    selectedRoles: string[];
    days: number;
    dayRate: number;
    changes: Change[];
  }
) {
  const { data: u } = await supabase.auth.getUser();
  if (!u?.user) throw new Error("Nicht eingeloggt");

  // Brief speichern
  const { data: briefRow, error: e1 } = await supabase
    .from("briefs")
    .insert({ user_id: u.user.id, payload: payload.brief })
    .select()
    .single();
  if (e1) throw e1;

  // Offer speichern
  const { data: offerRow, error: e2 } = await supabase
    .from("offers")
    .insert({
      user_id: u.user.id,
      brief_id: briefRow.id,
      roles: payload.selectedRoles,
      days: payload.days,
      day_rate: payload.dayRate,
      total: payload.days * payload.dayRate,
    })
    .select()
    .single();
  if (e2) throw e2;

  return { briefId: briefRow.id, offerId: offerRow.id };
}
