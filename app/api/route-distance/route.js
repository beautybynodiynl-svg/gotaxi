// Routeberekening via OSRM (Open Source Routing Machine), publieke demo-server.
// Gratis en zonder API-key, gebruikt echte wegenstructuur (geen hemelsbrede
// afstand). LET OP: de publieke demo-server is bedoeld voor redelijk gebruik
// (max. ~1 request/seconde) en komt zonder uptime-garantie. Voor een taxibedrijf
// met serieus verkeersvolume is het op termijn verstandig om over te stappen op
// een eigen OSRM-server of een betaalde dienst (Mapbox/Google) — dat is met deze
// architectuur een kwestie van deze ene functie vervangen, de rest blijft gelijk.
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const { originLon, originLat, destLon, destLat } = body;
  if (![originLon, originLat, destLon, destLat].every((v) => typeof v === "number" && Number.isFinite(v))) {
    return Response.json({ ok: false, error: "Ongeldige coördinaten." }, { status: 400 });
  }

  try {
    const url = `${OSRM_URL}/${originLon},${originLat};${destLon},${destLat}?overview=false&alternatives=false&steps=false`;
    const res = await fetch(url, { headers: { "User-Agent": "GoTaxiUtrecht/1.0 (ritprijscalculator)" } });

    if (!res.ok) {
      return Response.json(
        { ok: false, error: "We kunnen deze route niet automatisch berekenen. Neem contact met ons op voor een prijs." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const route = data?.routes?.[0];
    if (data.code !== "Ok" || !route) {
      return Response.json(
        { ok: false, error: "We kunnen deze route niet automatisch berekenen. Neem contact met ons op voor een prijs." },
        { status: 404 }
      );
    }

    return Response.json({
      ok: true,
      distanceKm: route.distance / 1000,
      durationMinutes: route.duration / 60,
    });
  } catch (err) {
    // Externe dienst onbereikbaar — de site mag niet crashen, de calculator-UI
    // vangt deze fout op en biedt de WhatsApp-fallback aan.
    return Response.json(
      { ok: false, error: "We kunnen de prijs nu niet automatisch berekenen. Stuur je ritgegevens via WhatsApp en we helpen je direct verder." },
      { status: 503 }
    );
  }
}
