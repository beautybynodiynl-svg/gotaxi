import { createClient } from "@supabase/supabase-js";
import { fetchRoute } from "@/lib/pricing/routeService";
import { getPricingConfig } from "@/lib/pricing/pricingConfigService";
import { calculateQuote } from "@/lib/pricing/pricingEngine";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function isNonEmptyString(v, maxLen = 300) {
  return typeof v === "string" && v.trim().length > 0 && v.length <= maxLen;
}

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

  // Honeypot
  if (body.website) {
    return Response.json({ ok: true });
  }

  const {
    name, phone, email, originLon, originLat, originLabel,
    destLon, destLat, destLabel, destIata,
    date, time, passengers, luggage, returnTrip, notes,
  } = body;

  if (!isNonEmptyString(name) || !isNonEmptyString(phone) || !isNonEmptyString(originLabel) || !isNonEmptyString(destLabel)) {
    return Response.json({ ok: false, error: "Vul alle verplichte velden in." }, { status: 400 });
  }
  const coords = [originLon, originLat, destLon, destLat];
  if (!coords.every((v) => typeof v === "number" && Number.isFinite(v))) {
    return Response.json({ ok: false, error: "Ongeldig vertrek- of bestemmingsadres." }, { status: 400 });
  }
  const passengerCount = Number(passengers);
  if (!Number.isFinite(passengerCount) || passengerCount < 1 || passengerCount > 8) {
    return Response.json({ ok: false, error: "Ongeldig aantal personen." }, { status: 400 });
  }

  // BELANGRIJK: de prijs wordt hier altijd opnieuw berekend, op basis van een
  // verse routeopvraging en de actuele config — nooit op basis van een prijs
  // die de browser meestuurt. Zo kan niemand de prijs manipuleren.
  const config = await getPricingConfig();
  let route;
  try {
    route = await fetchRoute({ originLon, originLat, destLon, destLat });
  } catch {
    return Response.json(
      { ok: false, error: "We kunnen de rit nu niet automatisch bevestigen. Bel of app ons voor een handmatige bevestiging." },
      { status: 503 }
    );
  }

  const quote = calculateQuote({
    distanceKm: route.distanceKm,
    durationMinutes: route.durationMinutes,
    destination: { placeName: destLabel, iata: destIata },
    rideTime: time,
    config,
  });

  const { data: inserted, error } = await supabase
    .from("bookings")
    .insert({
      name: name.trim().slice(0, 200),
      phone: phone.trim().slice(0, 50),
      email: (email || "").trim().slice(0, 200) || null,
      origin_label: originLabel.trim().slice(0, 300),
      origin_lon: originLon,
      origin_lat: originLat,
      destination_label: destLabel.trim().slice(0, 300),
      destination_lon: destLon,
      destination_lat: destLat,
      ride_date: date || null,
      ride_time: time || null,
      passengers: passengerCount,
      luggage: luggage ? Number(luggage) : null,
      return_trip: Boolean(returnTrip),
      notes: (notes || "").trim().slice(0, 1000) || null,
      route_km: quote.ok ? quote.distanceKm : route.distanceKm,
      route_minutes: quote.ok ? quote.durationMinutes : route.durationMinutes,
      calculated_fare: quote.ok ? quote.totalFare : null,
      pricing_type: quote.ok ? quote.pricingType : "manual",
      status: "nieuw",
    })
    .select()
    .single();

  if (error) {
    return Response.json({ ok: false, error: "Opslaan is niet gelukt." }, { status: 500 });
  }

  return Response.json({
    ok: true,
    bookingId: inserted.id,
    totalFare: quote.ok ? quote.totalFare : null,
    requireManualConfirmation: config.requireManualConfirmation || !quote.ok,
  });
}
