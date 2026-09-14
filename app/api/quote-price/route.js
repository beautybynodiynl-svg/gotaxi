import { fetchRoute } from "@/lib/pricing/routeService";
import { getPricingConfig } from "@/lib/pricing/pricingConfigService";
import { calculateQuote } from "@/lib/pricing/pricingEngine";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const { originLon, originLat, destLon, destLat, destLabel, destIata, rideTime } = body;
  const coords = [originLon, originLat, destLon, destLat];
  if (!coords.every((v) => typeof v === "number" && Number.isFinite(v))) {
    return Response.json({ ok: false, error: "Vul een geldig vertrek- en bestemmingsadres in." }, { status: 400 });
  }
  if (originLon === destLon && originLat === destLat) {
    return Response.json({ ok: false, error: "Vertrek en bestemming zijn hetzelfde." }, { status: 400 });
  }

  const config = await getPricingConfig();
  if (!config.calculatorEnabled) {
    return Response.json({ ok: false, error: "De ritprijscalculator is momenteel niet beschikbaar." }, { status: 503 });
  }

  let route;
  try {
    route = await fetchRoute({ originLon, originLat, destLon, destLat });
  } catch {
    return Response.json(
      { ok: false, error: "We kunnen de prijs nu niet automatisch berekenen. Stuur je ritgegevens via WhatsApp en we helpen je direct verder." },
      { status: 503 }
    );
  }

  const quote = calculateQuote({
    distanceKm: route.distanceKm,
    durationMinutes: route.durationMinutes,
    destination: { placeName: destLabel, iata: destIata },
    rideTime,
    config,
  });

  if (!quote.ok && quote.reason === "too_far") {
    return Response.json({
      ok: false,
      reason: "too_far",
      distanceKm: quote.distanceKm,
      durationMinutes: quote.durationMinutes,
      message: "Voor deze rit maken we graag een prijs op maat.",
    });
  }

  if (!quote.ok) {
    return Response.json({ ok: false, error: "We kunnen deze route niet automatisch berekenen. Neem contact met ons op voor een prijs." }, { status: 422 });
  }

  return Response.json({
    ok: true,
    distanceKm: Math.round(quote.distanceKm * 10) / 10,
    durationMinutes: Math.round(quote.durationMinutes),
    pricingType: quote.pricingType,
    totalFare: quote.totalFare,
    surcharges: quote.surcharges,
    requireManualConfirmation: config.requireManualConfirmation,
  });
}
