import { createClient } from "@supabase/supabase-js";
import { DEFAULT_PRICING_CONFIG } from "./config.js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Haalt de actuele prijsconfiguratie op uit Supabase (tabel `pricing_config`,
 * één rij met id 'default'). Ontbreekt de rij of lukt de call niet, dan valt
 * dit terug op DEFAULT_PRICING_CONFIG — de calculator blijft dus altijd werken,
 * ook voordat er ooit iets via het beheerpaneel is aangepast.
 */
export async function getPricingConfig() {
  try {
    const { data, error } = await supabase
      .from("pricing_config")
      .select("config")
      .eq("id", "default")
      .single();
    if (error || !data?.config) return DEFAULT_PRICING_CONFIG;
    // Merge ondiep zodat ontbrekende (bv. nieuw toegevoegde) velden altijd
    // een geldige standaardwaarde hebben, ook als de opgeslagen config ouder is.
    return {
      ...DEFAULT_PRICING_CONFIG,
      ...data.config,
      standard: { ...DEFAULT_PRICING_CONFIG.standard, ...(data.config.standard || {}) },
      airports: { ...DEFAULT_PRICING_CONFIG.airports, ...(data.config.airports || {}) },
      surcharges: { ...DEFAULT_PRICING_CONFIG.surcharges, ...(data.config.surcharges || {}) },
    };
  } catch {
    return DEFAULT_PRICING_CONFIG;
  }
}
