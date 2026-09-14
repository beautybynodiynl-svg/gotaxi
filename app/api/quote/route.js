import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function isNonEmptyString(v, maxLen = 300) {
  return typeof v === "string" && v.trim().length > 0 && v.length <= maxLen;
}

// Zeer eenvoudige in-memory rate limit: max 5 aanvragen per IP per 10 minuten.
// Dit is geen vervanging voor een echte rate-limiter (bv. Upstash) op schaal,
// maar voorkomt de meest simpele misbruik-pogingen zonder extra dependencies.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ ok: false, error: "Te veel aanvragen, probeer het over een paar minuten opnieuw." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Ongeldige aanvraag." }, { status: 400 });
  }

  // Honeypot: als dit verborgen veld is ingevuld, is het (bijna zeker) een bot.
  // We doen alsof het gelukt is, zodat de bot niet doorleert, maar slaan niets op.
  if (body.website) {
    return Response.json({ ok: true });
  }

  const { name, phone, from, to, date, time, passengers, flightNumber, notes } = body;

  // Server-side validatie — vertrouw nooit alleen op client-side checks.
  if (!isNonEmptyString(name) || !isNonEmptyString(phone) || !isNonEmptyString(from) || !isNonEmptyString(to)) {
    return Response.json({ ok: false, error: "Vul alle verplichte velden in." }, { status: 400 });
  }
  if (!isNonEmptyString(date, 20) || !isNonEmptyString(time, 20)) {
    return Response.json({ ok: false, error: "Vul een geldige datum en tijd in." }, { status: 400 });
  }
  const passengerCount = Number(passengers);
  if (!Number.isFinite(passengerCount) || passengerCount < 1 || passengerCount > 8) {
    return Response.json({ ok: false, error: "Ongeldig aantal personen." }, { status: 400 });
  }

  const { error } = await supabase.from("quote_requests").insert({
    name: name.trim().slice(0, 200),
    phone: phone.trim().slice(0, 50),
    from_address: from.trim().slice(0, 300),
    to_address: to.trim().slice(0, 300),
    ride_date: date,
    ride_time: time,
    passengers: passengerCount,
    flight_number: (flightNumber || "").trim().slice(0, 50) || null,
    notes: (notes || "").trim().slice(0, 1000) || null,
  });

  if (error) {
    return Response.json({ ok: false, error: "Opslaan is niet gelukt." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
