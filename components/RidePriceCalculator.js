"use client";

import { useState } from "react";
import AddressAutocomplete from "@/components/AddressAutocomplete";

const SCHIPHOL_PRESET = { placeName: "Schiphol Airport", lon: 4.7639, lat: 52.3086, iata: "AMS" };

function track(event, params) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({ event, ...params });
  }
}

export default function RidePriceCalculator({ presetOriginQuery, presetDestination, whatsappNumber }) {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(presetDestination || null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [returnTrip, setReturnTrip] = useState(false);
  const [luggage, setLuggage] = useState("");
  const [notes, setNotes] = useState("");
  const [flightNumber, setFlightNumber] = useState("");

  const [stage, setStage] = useState("form"); // form | calculating | result | too_far | error | booking | booked
  const [quote, setQuote] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingContact, setBookingContact] = useState({ name: "", phone: "", email: "", website: "" });

  const isAirportDestination = destination?.iata || /schiphol|eindhoven airport|rotterdam.*airport/i.test(destination?.placeName || "");

  async function handleCalculate(e) {
    e.preventDefault();
    if (!origin || !destination) return;
    setStage("calculating");
    setErrorMessage("");
    track("quote_started");

    try {
      const res = await fetch("/api/quote-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originLon: origin.lon,
          originLat: origin.lat,
          destLon: destination.lon,
          destLat: destination.lat,
          destLabel: destination.placeName,
          destIata: destination.iata,
          rideTime: time,
        }),
      });
      const data = await res.json();

      if (data.reason === "too_far") {
        setQuote(data);
        setStage("too_far");
        return;
      }
      if (!data.ok) {
        setErrorMessage(data.error || "We kunnen de prijs nu niet automatisch berekenen.");
        setStage("error");
        track("quote_failed");
        return;
      }

      setQuote(data);
      setStage("result");
      track("quote_calculated", { pricing_type: data.pricingType, fare: data.totalFare });
      if (data.pricingType === "airport") track("airport_quote_calculated", { fare: data.totalFare });
    } catch {
      setErrorMessage("We kunnen de prijs nu niet automatisch berekenen. Stuur je ritgegevens via WhatsApp en we helpen je direct verder.");
      setStage("error");
      track("quote_failed");
    }
  }

  function buildWhatsappMessage(withPrice) {
    const lines = [
      "Hallo Go Taxi Utrecht,",
      "",
      withPrice ? "Ik wil graag deze rit aanvragen:" : "Ik wil graag een ritprijs aanvragen.",
      "",
      `Van: ${origin?.placeName || "-"}`,
      `Naar: ${destination?.placeName || "-"}`,
      `Datum: ${date || "-"}`,
      `Tijd: ${time || "-"}`,
      `Personen: ${passengers || "-"}`,
    ];
    if (flightNumber) lines.push(`Vluchtnummer: ${flightNumber}`);
    if (withPrice && quote?.totalFare) lines.push("", `Berekende ritprijs: €${quote.totalFare}`);
    lines.push("", withPrice ? "Kunnen jullie deze rit bevestigen?" : "Kunnen jullie mij een prijs sturen?");
    return lines.join("\n");
  }

  function openWhatsapp(withPrice) {
    track("quote_whatsapp_clicked");
    const message = encodeURIComponent(buildWhatsappMessage(withPrice));
    const number = (whatsappNumber || "").replace(/[^\d]/g, "");
    window.open(`https://wa.me/${number}?text=${message}`, "_blank");
  }

  async function handleBookingSubmit(e) {
    e.preventDefault();
    if (bookingContact.website) return; // honeypot
    setStage("booking");
    track("quote_booking_started");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingContact.name,
          phone: bookingContact.phone,
          email: bookingContact.email,
          originLon: origin.lon,
          originLat: origin.lat,
          originLabel: origin.placeName,
          destLon: destination.lon,
          destLat: destination.lat,
          destLabel: destination.placeName,
          destIata: destination.iata,
          date, time, passengers: Number(passengers),
          luggage: luggage ? Number(luggage) : null,
          returnTrip, notes,
          website: bookingContact.website,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setErrorMessage(data.error || "Aanvraag versturen is niet gelukt.");
        setStage("result");
        return;
      }
      setStage("booked");
      track("quote_submitted", { fare: data.totalFare });
    } catch {
      setErrorMessage("Aanvraag versturen is niet gelukt. Bel of app ons anders direct.");
      setStage("result");
    }
  }

  const inputClass = "w-full rounded-lg border border-line-strong bg-night px-3.5 py-2.5 text-[15px] focus:border-amber focus:outline-none";

  // --- Resultaatscherm ---
  if (stage === "result" && quote) {
    return (
      <div className="rounded-2xl border border-amber/40 bg-amber/5 p-6 sm:p-7">
        <p className="text-sm text-muted">Jouw geschatte vaste ritprijs</p>
        <p className="mt-1 font-display text-5xl font-bold text-amber">€{quote.totalFare},-</p>
        <p className="mt-2 text-sm text-muted">
          {origin?.placeName} → {destination?.placeName}
        </p>
        <p className="text-sm text-muted">circa {quote.distanceKm} km · {quote.durationMinutes} min</p>

        <ul className="mt-5 space-y-1.5 text-sm text-muted">
          <li>✓ Vooraf duidelijkheid</li>
          <li>✓ Rechtstreeks naar je bestemming</li>
          <li>✓ Bevestiging na aanvraag</li>
        </ul>
        <p className="mt-4 text-xs text-muted">
          De weergegeven prijs is gebaseerd op de opgegeven route. Bij wijzigingen in de rit kan de prijs veranderen.
        </p>

        {stage === "result" && (
          <form onSubmit={handleBookingSubmit} className="mt-6 space-y-3 border-t border-line pt-5">
            <input type="text" value={bookingContact.website} onChange={(e) => setBookingContact((c) => ({ ...c, website: e.target.value }))} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="Je naam" value={bookingContact.name} onChange={(e) => setBookingContact((c) => ({ ...c, name: e.target.value }))} className={inputClass} />
              <input required type="tel" placeholder="Telefoonnummer" value={bookingContact.phone} onChange={(e) => setBookingContact((c) => ({ ...c, phone: e.target.value }))} className={inputClass} />
            </div>
            <button type="submit" className="w-full rounded-full bg-amber px-6 py-3.5 text-[15px] font-semibold text-[#171207] hover:bg-amber-deep">
              Reserveer deze rit
            </button>
          </form>
        )}
        <button type="button" onClick={() => openWhatsapp(true)} className="mt-3 w-full rounded-full border border-line-strong px-6 py-3 text-[15px] font-semibold hover:border-amber">
          Via WhatsApp aanvragen
        </button>
        {errorMessage && <p className="mt-3 text-sm text-red-400">{errorMessage}</p>}
        <button type="button" onClick={() => { setStage("form"); setQuote(null); }} className="mt-3 text-sm text-muted underline">
          Opnieuw berekenen
        </button>
      </div>
    );
  }

  if (stage === "booking") {
    return (
      <div className="rounded-2xl border border-line-strong bg-night-2 p-6 text-center">
        <p className="text-[15px]">Aanvraag versturen…</p>
      </div>
    );
  }

  if (stage === "booked") {
    return (
      <div className="rounded-2xl border border-amber/40 bg-amber/10 p-6">
        <p className="font-display text-lg font-semibold text-amber">Aanvraag ontvangen</p>
        <p className="mt-2 text-sm text-muted">
          Bedankt! We bevestigen de rit en prijs na je aanvraag. We nemen zo snel mogelijk contact met je op.
        </p>
        <button type="button" onClick={() => openWhatsapp(true)} className="mt-4 w-full rounded-full border border-line-strong px-6 py-3 text-[15px] font-semibold hover:border-amber">
          Ook via WhatsApp bevestigen
        </button>
      </div>
    );
  }

  // --- Te-ver / niet-automatisch scherm ---
  if (stage === "too_far") {
    return (
      <div className="rounded-2xl border border-line-strong bg-night-2 p-6">
        <p className="font-display text-lg font-semibold">Voor deze rit maken we graag een prijs op maat.</p>
        <p className="mt-2 text-sm text-muted">
          Deze route is langer dan we automatisch kunnen inschatten (circa {Math.round(quote?.distanceKm || 0)} km). Vraag een prijs aan en we nemen snel contact op.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/contact" className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-[#171207] hover:bg-amber-deep">Vraag prijs aan</a>
          <button type="button" onClick={() => openWhatsapp(false)} className="rounded-full border border-line-strong px-6 py-3 text-sm font-semibold hover:border-amber">WhatsApp ons</button>
        </div>
        <button type="button" onClick={() => setStage("form")} className="mt-4 text-sm text-muted underline">Opnieuw proberen</button>
      </div>
    );
  }

  // --- Foutscherm / API-uitval ---
  if (stage === "error") {
    return (
      <div className="rounded-2xl border border-line-strong bg-night-2 p-6">
        <p className="text-[15px]">{errorMessage}</p>
        <button type="button" onClick={() => openWhatsapp(false)} className="mt-4 w-full rounded-full bg-amber px-6 py-3 text-sm font-semibold text-[#171207] hover:bg-amber-deep">
          WhatsApp ons
        </button>
        <button type="button" onClick={() => setStage("form")} className="mt-3 text-sm text-muted underline">Opnieuw proberen</button>
      </div>
    );
  }

  // --- Formulier (standaard) ---
  return (
    <form onSubmit={handleCalculate} className="space-y-3">
      <AddressAutocomplete label="Van" placeholder="Ophaaladres" value={origin} onSelect={setOrigin} showLocationButton initialQuery={presetOriginQuery} />
      <AddressAutocomplete label="Naar" placeholder="Bestemming" value={destination} onSelect={setDestination} />

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Datum</span>
          <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Tijd</span>
          <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Personen</span>
          <input required type="number" min="1" max="8" value={passengers} onChange={(e) => setPassengers(e.target.value)} className={inputClass} />
        </label>
      </div>

      {isAirportDestination && (
        <label className="block">
          <span className="mb-1 block text-xs text-muted">Vluchtnummer (optioneel)</span>
          <input type="text" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} className={inputClass} />
        </label>
      )}

      <div className="flex items-center gap-2 text-sm text-muted">
        <input id="returnTrip" type="checkbox" checked={returnTrip} onChange={(e) => setReturnTrip(e.target.checked)} className="h-4 w-4 accent-amber" />
        <label htmlFor="returnTrip">Retourrit</label>
      </div>

      <button
        type="submit"
        disabled={!origin || !destination || stage === "calculating"}
        className="w-full rounded-full bg-amber px-6 py-3.5 text-[15px] font-semibold text-[#171207] transition-colors hover:bg-amber-deep disabled:opacity-50"
      >
        {stage === "calculating" ? "Ritprijs berekenen…" : "Bereken ritprijs"}
      </button>
      <p className="text-center text-xs text-muted">Vrijblijvend — je zit nergens aan vast.</p>
    </form>
  );
}
