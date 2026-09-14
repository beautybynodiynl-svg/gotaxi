import { supabase } from "@/lib/supabaseClient";

// Fallback content, gebruikt zolang Supabase nog niet is ingesteld of leeg is.
const FALLBACK = {
  hero_title: "Waar je ook moet zijn, wij staan al klaar.",
  hero_subtitle:
    "Vul je vertrekadres en bestemming in en bekijk direct je geschatte vaste ritprijs. Of bel ons als je meteen een taxi nodig hebt.",
  phone: "06 14 52 95 05",
  whatsapp_number: "31614529505",
  email: "info@gotaxiutrecht.nl",
  kvk_nummer: "nog invullen",
  vergunning_nummer: "nog invullen",
};

export async function getSiteContent() {
  try {
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data || data.length === 0) return FALLBACK;
    const map = { ...FALLBACK };
    for (const row of data) map[row.key] = row.value;
    return map;
  } catch {
    return FALLBACK;
  }
}

export async function getServiceAreas() {
  try {
    const { data, error } = await supabase
      .from("service_areas")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function getServiceAreaBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from("service_areas")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export function phoneHref(phone) {
  return `tel:${(phone || "").replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(number) {
  return `https://wa.me/${(number || "").replace(/[^\d]/g, "")}`;
}
