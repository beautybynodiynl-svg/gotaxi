// Adres-autocomplete via PDOK Locatieserver — de gratis, sleutelloze
// geocodeerdienst van de Nederlandse overheid (Kadaster). Geen API-key nodig.
// Documentatie: https://github.com/PDOK/locatieserver

const PDOK_SUGGEST_URL = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest";
const PDOK_LOOKUP_URL = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const id = searchParams.get("id");

  try {
    // Met een 'id' vragen we de exacte coördinaten van een eerder gekozen
    // suggestie op (nodig voordat we een route kunnen berekenen).
    if (id) {
      const url = `${PDOK_LOOKUP_URL}?id=${encodeURIComponent(id)}&fl=id,weergavenaam,centroide_ll`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("PDOK lookup mislukt");
      const data = await res.json();
      const doc = data?.response?.docs?.[0];
      if (!doc) return Response.json({ ok: false, error: "Adres niet gevonden." }, { status: 404 });

      // centroide_ll heeft het formaat "POINT(lon lat)"
      const match = doc.centroide_ll?.match(/POINT\(([^ ]+) ([^)]+)\)/);
      if (!match) return Response.json({ ok: false, error: "Geen coördinaten gevonden." }, { status: 500 });

      return Response.json({
        ok: true,
        placeName: doc.weergavenaam,
        lon: parseFloat(match[1]),
        lat: parseFloat(match[2]),
      });
    }

    if (!q || q.trim().length < 2) {
      return Response.json({ ok: true, suggestions: [] });
    }

    // fq beperkt tot adressen en woonplaatsen — geen percelen e.d.
    const url = `${PDOK_SUGGEST_URL}?q=${encodeURIComponent(q)}&fq=type:(adres OR woonplaats)&rows=6`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("PDOK suggest mislukt");
    const data = await res.json();
    const suggestions = (data?.response?.docs || []).map((d) => ({
      id: d.id,
      label: d.weergavenaam,
    }));

    return Response.json({ ok: true, suggestions });
  } catch (err) {
    // Site mag nooit crashen op een externe-API-storing (zie ook /api/route-distance).
    return Response.json({ ok: false, error: "Adres opzoeken is nu niet beschikbaar." }, { status: 503 });
  }
}
