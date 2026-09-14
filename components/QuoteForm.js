"use client";

import { useState } from "react";

export default function QuoteForm({ whatsappNumber, compact = false }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [form, setForm] = useState({
    name: "",
    phone: "",
    from: "",
    to: "",
    date: "",
    time: "",
    passengers: "1",
    flightNumber: "",
    notes: "",
    // honeypot-veld: onzichtbaar voor mensen, spam-bots vullen dit vaak automatisch in
    website: "",
  });

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function buildWhatsappMessage() {
    const lines = [
      "Hallo Go Taxi Utrecht,",
      "",
      "Ik wil graag een ritprijs aanvragen.",
      "",
      `Van: ${form.from || "-"}`,
      `Naar: ${form.to || "-"}`,
      `Datum: ${form.date || "-"}`,
      `Tijd: ${form.time || "-"}`,
      `Aantal personen: ${form.passengers || "-"}`,
    ];
    if (form.flightNumber) lines.push(`Vluchtnummer: ${form.flightNumber}`);
    if (form.notes) lines.push(`Opmerking: ${form.notes}`);
    lines.push("", "Kunnen jullie mij een prijs sturen?");
    return lines.join("\n");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Onbekende fout");
      setStatus("sent");

      // Open ook meteen WhatsApp met de vooringevulde gegevens, zodat de
      // aanvraag direct en persoonlijk bevestigd kan worden.
      const message = encodeURIComponent(buildWhatsappMessage());
      const waNumber = (whatsappNumber || "").replace(/[^\d]/g, "");
      window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank");
    } catch (err) {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-amber/40 bg-amber/10 p-6">
        <p className="font-display text-lg font-semibold text-amber">Aanvraag ontvangen</p>
        <p className="mt-2 text-sm text-muted">
          Bedankt! We hebben je aanvraag ontvangen. We nemen zo snel mogelijk contact met je op. We hebben ook alvast een WhatsApp-bericht voor je klaargezet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      {/* Honeypot: onzichtbaar voor mensen, vangt eenvoudige spam-bots */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={update("website")}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Ophaaladres">
          <input required type="text" autoComplete="address-line1" value={form.from} onChange={update("from")} placeholder="Bijv. Utrecht Centraal" className={inputClass} />
        </Field>
        <Field label="Bestemming">
          <input required type="text" value={form.to} onChange={update("to")} placeholder="Bijv. Schiphol" className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Datum">
          <input required type="date" value={form.date} onChange={update("date")} className={inputClass} />
        </Field>
        <Field label="Tijd">
          <input required type="time" value={form.time} onChange={update("time")} className={inputClass} />
        </Field>
        <Field label="Personen">
          <input required type="number" min="1" max="8" value={form.passengers} onChange={update("passengers")} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Je naam">
          <input required type="text" autoComplete="name" value={form.name} onChange={update("name")} className={inputClass} />
        </Field>
        <Field label="Telefoonnummer">
          <input required type="tel" autoComplete="tel" value={form.phone} onChange={update("phone")} className={inputClass} />
        </Field>
      </div>

      {!compact && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Vluchtnummer (optioneel)">
            <input type="text" value={form.flightNumber} onChange={update("flightNumber")} className={inputClass} />
          </Field>
          <Field label="Opmerking (optioneel)">
            <input type="text" value={form.notes} onChange={update("notes")} className={inputClass} />
          </Field>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-amber px-6 py-3.5 text-[15px] font-semibold text-[#171207] transition-colors hover:bg-amber-deep disabled:opacity-60"
      >
        {status === "sending" ? "Aanvraag versturen…" : "Vraag ritprijs aan"}
      </button>
      <p className="text-center text-xs text-muted">Vrijblijvend aanvragen — je zit nergens aan vast.</p>

      {status === "error" && (
        <p className="text-sm text-red-400">Er ging iets mis bij het versturen. Bel of app ons anders direct.</p>
      )}
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-line-strong bg-night px-3.5 py-2.5 text-[15px] focus:border-amber focus:outline-none";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      {children}
    </label>
  );
}
