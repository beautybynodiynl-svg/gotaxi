const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

/**
 * Haalt echte routeafstand (km) en geschatte rijtijd (minuten) op via OSRM.
 * Gooit een Error als de route niet berekend kon worden — de aanroepende
 * route handler vangt dit af en toont de juiste fallback-melding.
 */
export async function fetchRoute({ originLon, originLat, destLon, destLat }) {
  const url = `${OSRM_URL}/${originLon},${originLat};${destLon},${destLat}?overview=false&alternatives=false&steps=false`;
  const res = await fetch(url, { headers: { "User-Agent": "GoTaxiUtrecht/1.0 (ritprijscalculator)" } });
  if (!res.ok) throw new Error("route_unavailable");

  const data = await res.json();
  const route = data?.routes?.[0];
  if (data.code !== "Ok" || !route) throw new Error("no_route_found");

  return {
    distanceKm: route.distance / 1000,
    durationMinutes: route.duration / 60,
  };
}
