/**
 * @typedef {Object} StandardPricingConfig
 * @property {number} startFee        Starttarief in euro's
 * @property {number} pricePerKm      Prijs per kilometer
 * @property {number} pricePerMinute  Prijs per minuut geschatte rijtijd
 * @property {number} minimumFare     Minimum ritprijs, ongeacht formule-uitkomst
 *
 * @typedef {Object} AirportPricingConfig
 * @property {boolean} enabled        Of dit luchthaventarief actief is
 * @property {number} baseFee         Basistarief
 * @property {number} pricePerKm      Prijs per kilometer (los van standaardtarief)
 * @property {number} minimumFare     Minimum ritprijs voor deze luchthaven
 *
 * @typedef {Object} SurchargeConfig
 * @property {boolean} enabled
 * @property {number} amount
 * @property {string} [from]  Alleen bij tijdgebonden toeslagen, bv. "00:00"
 * @property {string} [to]
 *
 * @typedef {Object} PricingConfig
 * @property {StandardPricingConfig} standard
 * @property {Object<string, AirportPricingConfig>} airports  Sleutel = luchthaven-slug, bv. "schiphol"
 * @property {"round" | "half"} roundingMethod
 * @property {number} maxAutoQuoteDistanceKm  Boven deze afstand geen automatische prijs
 * @property {boolean} requireManualConfirmation
 * @property {boolean} calculatorEnabled
 * @property {Object<string, SurchargeConfig>} surcharges
 */

export {};
