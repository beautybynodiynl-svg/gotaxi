// Simpel, afhankelijkheidsloos testscript voor de pricing-engine.
// Draai met: node scripts/test-pricing.mjs
import {
  calculateStandardFare,
  calculateAirportFare,
  roundFare,
  calculateQuote,
} from "../lib/pricing/pricingEngine.js";
import { DEFAULT_PRICING_CONFIG } from "../lib/pricing/config.js";

let passed = 0;
let failed = 0;

function assertEqual(label, actual, expected) {
  const ok = Math.abs(actual - expected) < 0.001;
  console.log(`${ok ? "✓" : "✗"} ${label} — verwacht ${expected}, kreeg ${actual}`);
  if (ok) passed++;
  else failed++;
}

function assertTrue(label, condition) {
  console.log(`${condition ? "✓" : "✗"} ${label}`);
  if (condition) passed++;
  else failed++;
}

console.log("=== STANDAARD TARIEF ===");
assertEqual(
  "0 km / 0 min -> minimumtarief",
  calculateStandardFare(0, 0, DEFAULT_PRICING_CONFIG.standard),
  15.0
);
assertEqual(
  "10 km / 20 min -> €35 volgens huidige config",
  calculateStandardFare(10, 20, DEFAULT_PRICING_CONFIG.standard),
  35.0 // 4.00 + 10*2.40 + 20*0.35 = 4 + 24 + 7 = 35
);

console.log("\n=== SCHIPHOL TARIEF ===");
assertEqual(
  "48 km Schiphol -> €92 volgens huidige config",
  calculateAirportFare(48, DEFAULT_PRICING_CONFIG.airports.schiphol),
  92.0 // 20 + 48*1.50 = 20 + 72 = 92
);

console.log("\n=== AFRONDING ===");
assertEqual("€34,44 rond af naar €34 (round)", roundFare(34.44, "round"), 34);
assertEqual("€34,60 rond af naar €35 (round)", roundFare(34.6, "round"), 35);
assertEqual("€34,20 rond af naar €34,50 (half)", roundFare(34.2, "half"), 34.5);

console.log("\n=== VOLLEDIGE OFFERTE (calculateQuote) ===");
const standardQuote = calculateQuote({
  distanceKm: 10,
  durationMinutes: 20,
  destination: { placeName: "Utrecht Centraal" },
  config: DEFAULT_PRICING_CONFIG,
});
assertTrue("Standaardrit wordt herkend als 'standard'", standardQuote.pricingType === "standard");
assertEqual("Standaardrit totaalprijs", standardQuote.totalFare, 35);

const airportQuote = calculateQuote({
  distanceKm: 48,
  durationMinutes: 40,
  destination: { placeName: "Schiphol Airport", iata: "AMS" },
  config: DEFAULT_PRICING_CONFIG,
});
assertTrue("Schipholrit wordt herkend als 'airport'", airportQuote.pricingType === "airport");
assertEqual("Schipholrit totaalprijs", airportQuote.totalFare, 92);

const disabledAirportConfig = {
  ...DEFAULT_PRICING_CONFIG,
  airports: { ...DEFAULT_PRICING_CONFIG.airports, schiphol: { ...DEFAULT_PRICING_CONFIG.airports.schiphol, enabled: false } },
};
const disabledAirportQuote = calculateQuote({
  distanceKm: 48,
  durationMinutes: 40,
  destination: { placeName: "Schiphol Airport", iata: "AMS" },
  config: disabledAirportConfig,
});
assertTrue(
  "Uitgeschakeld Schipholtarief valt terug op standaardformule",
  disabledAirportQuote.pricingType === "standard"
);

const tooFarQuote = calculateQuote({
  distanceKm: 200,
  durationMinutes: 150,
  destination: { placeName: "Berlijn" },
  config: DEFAULT_PRICING_CONFIG,
});
assertTrue("Rit boven maxAutoQuoteDistanceKm krijgt geen automatische prijs", !tooFarQuote.ok && tooFarQuote.reason === "too_far");

const invalidQuote = calculateQuote({
  distanceKm: -5,
  durationMinutes: NaN,
  destination: {},
  config: DEFAULT_PRICING_CONFIG,
});
assertTrue("Ongeldige afstand/tijd wordt afgewezen", !invalidQuote.ok && invalidQuote.reason === "invalid_route");

console.log(`\n${passed} geslaagd, ${failed} mislukt`);
process.exit(failed > 0 ? 1 : 0);
