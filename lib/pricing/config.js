// Standaard (commerciële) tarieven van Go Taxi Utrecht.
// Dit zijn BEWUST niet de wettelijke maximumtarieven van de taxameter — dit is
// de eigen, online vaste-ritprijsformule van het bedrijf. Deze waarden zijn
// alleen de STARTWAARDEN; de echte, actuele waarden staan in Supabase
// (tabel `pricing_config`) en zijn aanpasbaar via /admin > Ritprijzen.
export const DEFAULT_PRICING_CONFIG = {
  standard: {
    startFee: 4.0,
    pricePerKm: 2.4,
    pricePerMinute: 0.35,
    minimumFare: 15.0,
  },
  airports: {
    schiphol: {
      enabled: true,
      baseFee: 20.0,
      pricePerKm: 1.5,
      minimumFare: 65.0,
    },
    rotterdam: {
      enabled: false,
      baseFee: 0,
      pricePerKm: 0,
      minimumFare: 0,
    },
    eindhoven: {
      enabled: false,
      baseFee: 0,
      pricePerKm: 0,
      minimumFare: 0,
    },
  },
  // "round" = afronden naar hele euro's. "half" = afronden naar halve euro's.
  roundingMethod: "round",
  maxAutoQuoteDistanceKm: 150,
  requireManualConfirmation: true,
  calculatorEnabled: true,
  surcharges: {
    night: { enabled: false, from: "00:00", to: "06:00", amount: 0 },
    extraStop: { enabled: false, amount: 0 },
    childSeat: { enabled: false, amount: 0 },
  },
};

// Herkenbare luchthaven-codes/namen, gebruikt om te bepalen of een bestemming
// een geconfigureerde luchthaven is. We matchen NIET alleen op tekst zoals
// "bevat schiphol" — we vergelijken tegen bekende IATA-codes en Mapbox
// place-types/namen die de Geocoding API teruggeeft voor deze locaties.
export const AIRPORT_MATCHERS = {
  schiphol: {
    iata: "AMS",
    nameContains: ["schiphol"],
  },
  rotterdam: {
    iata: "RTM",
    nameContains: ["rotterdam the hague airport", "rotterdam airport"],
  },
  eindhoven: {
    iata: "EIN",
    nameContains: ["eindhoven airport"],
  },
};

/**
 * Bepaalt of een geocoded bestemming een geconfigureerde luchthaven is.
 * @param {{ placeName?: string, iata?: string }} destination
 * @returns {string|null} luchthaven-slug of null
 */
export function matchAirport(destination) {
  if (!destination) return null;
  const name = (destination.placeName || "").toLowerCase();
  for (const [slug, matcher] of Object.entries(AIRPORT_MATCHERS)) {
    if (destination.iata && destination.iata === matcher.iata) return slug;
    if (matcher.nameContains.some((needle) => name.includes(needle))) return slug;
  }
  return null;
}
