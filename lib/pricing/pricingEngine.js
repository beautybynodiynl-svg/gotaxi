import { matchAirport } from "./config.js";

/**
 * Rondt een prijs af volgens de geconfigureerde methode.
 * "round" -> hele euro's (€34,44 -> €34, €34,60 -> €35)
 * "half"  -> halve euro's (€34,20 -> €34,50)
 */
export function roundFare(amount, method = "round") {
  if (method === "half") {
    // Rondt naar BOVEN af op het dichtstbijzijnde halve euro-bedrag
    // (bv. €34,20 -> €34,50), zoals commercieel gebruikelijk is.
    return Math.ceil(amount * 2) / 2;
  }
  return Math.round(amount);
}

/**
 * Standaard ritprijs: starttarief + (km × kmprijs) + (minuten × minuutprijs),
 * met een minimumritprijs als ondergrens.
 */
export function calculateStandardFare(distanceKm, durationMinutes, standardConfig) {
  const km = Math.max(0, Number(distanceKm) || 0);
  const min = Math.max(0, Number(durationMinutes) || 0);
  const raw =
    standardConfig.startFee + km * standardConfig.pricePerKm + min * standardConfig.pricePerMinute;
  return Math.max(raw, standardConfig.minimumFare);
}

/**
 * Luchthaven-ritprijs: basistarief + (km × luchthaven-kmprijs), met eigen minimum.
 * Onafhankelijk van de standaardformule — luchthaventarieven hebben hun eigen,
 * eenvoudigere opbouw (geen tijdcomponent, want de rit is doorgaans grotendeels snelweg).
 */
export function calculateAirportFare(distanceKm, airportConfig) {
  const km = Math.max(0, Number(distanceKm) || 0);
  const raw = airportConfig.baseFee + km * airportConfig.pricePerKm;
  return Math.max(raw, airportConfig.minimumFare);
}

/**
 * Bepaalt eventuele actieve toeslagen voor deze rit. Toeslagen zijn standaard
 * uitgeschakeld (enabled: false) totdat expliciet aangezet in de config.
 */
export function calculateSurcharges(rideTime, surchargesConfig) {
  const applied = [];
  if (!surchargesConfig) return applied;

  const night = surchargesConfig.night;
  if (night?.enabled && rideTime) {
    const [h, m] = rideTime.split(":").map(Number);
    const rideMinutes = h * 60 + m;
    const [fh, fm] = night.from.split(":").map(Number);
    const [th, tm] = night.to.split(":").map(Number);
    const fromMinutes = fh * 60 + fm;
    const toMinutes = th * 60 + tm;
    const isNight =
      fromMinutes <= toMinutes
        ? rideMinutes >= fromMinutes && rideMinutes < toMinutes
        : rideMinutes >= fromMinutes || rideMinutes < toMinutes; // over middernacht heen
    if (isNight) applied.push({ key: "night", label: "Nachttoeslag", amount: night.amount });
  }

  return applied;
}

/**
 * Hoofdfunctie: berekent een volledige offerte op basis van route-afstand/tijd,
 * bestemming (voor luchthaven-detectie) en de actieve pricing-config.
 *
 * @param {Object} params
 * @param {number} params.distanceKm
 * @param {number} params.durationMinutes
 * @param {{ placeName?: string, iata?: string }} [params.destination]
 * @param {string} [params.rideTime]  "HH:MM", voor eventuele nachttoeslag
 * @param {import('./types.js').PricingConfig} params.config
 * @returns {{
 *   ok: boolean,
 *   reason?: "too_far" | "airport_disabled",
 *   pricingType?: "standard" | "airport",
 *   airportSlug?: string|null,
 *   baseFare?: number,
 *   surcharges?: Array<{key:string,label:string,amount:number}>,
 *   totalFare?: number,
 *   distanceKm?: number,
 *   durationMinutes?: number
 * }}
 */
export function calculateQuote({ distanceKm, durationMinutes, destination, rideTime, config }) {
  const km = Number(distanceKm);
  const min = Number(durationMinutes);

  if (!Number.isFinite(km) || km < 0 || !Number.isFinite(min) || min < 0) {
    return { ok: false, reason: "invalid_route" };
  }

  // Bijzondere ritten: boven de ingestelde maximumafstand geven we geen
  // automatische prijs, maar vragen we om een offerte op maat.
  if (km > config.maxAutoQuoteDistanceKm) {
    return { ok: false, reason: "too_far", distanceKm: km, durationMinutes: min };
  }

  const airportSlug = matchAirport(destination);
  let pricingType = "standard";
  let baseFare;

  if (airportSlug) {
    const airportConfig = config.airports[airportSlug];
    if (airportConfig && airportConfig.enabled) {
      pricingType = "airport";
      baseFare = calculateAirportFare(km, airportConfig);
    } else {
      // Luchthaven herkend, maar (nog) geen tarief geconfigureerd — val terug
      // op de standaardformule in plaats van een niet-bestaand tarief te gebruiken.
      baseFare = calculateStandardFare(km, min, config.standard);
    }
  } else {
    baseFare = calculateStandardFare(km, min, config.standard);
  }

  const surcharges = calculateSurcharges(rideTime, config.surcharges);
  const surchargeTotal = surcharges.reduce((sum, s) => sum + s.amount, 0);
  const totalFare = roundFare(baseFare + surchargeTotal, config.roundingMethod);

  return {
    ok: true,
    pricingType,
    airportSlug,
    baseFare: roundFare(baseFare, config.roundingMethod),
    surcharges,
    totalFare,
    distanceKm: km,
    durationMinutes: min,
  };
}
