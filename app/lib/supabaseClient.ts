"use client";

import { createClient } from "@supabase/supabase-js";

// In Next.js werden Variablen mit NEXT_PUBLIC_* zur Build-Zeit ersetzt.
// Kein direkter Zugriff auf "process" zur Laufzeit nötig.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anon);
