import { createClient } from "@supabase/supabase-js";

// Fallback zodat een build nooit crasht als de omgevingsvariabelen nog niet
// zijn ingesteld in Vercel — de site valt dan terug op standaardcontent
// totdat de echte Supabase-gegevens zijn toegevoegd.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
