"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: form.message,
    });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    setForm({ name: "", phone: "", email: "", message: "" });
  }

  if (status === "sent") {
    return (
      <div>
        <p className="font-display text-lg font-semibold text-amber">Bedankt voor je bericht!</p>
        <p className="mt-2 text-sm text-muted">We nemen zo snel mogelijk contact met je op.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Je naam">
        <input required type="text" value={form.name} onChange={update("name")} className="w-full rounded-lg border border-line-strong bg-night px-4 py-2.5 text-[15px] focus:border-amber" />
      </Field>
      <Field label="Telefoonnummer">
        <input required type="tel" value={form.phone} onChange={update("phone")} className="w-full rounded-lg border border-line-strong bg-night px-4 py-2.5 text-[15px] focus:border-amber" />
      </Field>
      <Field label="E-mailadres (optioneel)">
        <input type="email" value={form.email} onChange={update("email")} className="w-full rounded-lg border border-line-strong bg-night px-4 py-2.5 text-[15px] focus:border-amber" />
      </Field>
      <Field label="Je bericht">
        <textarea required rows={4} value={form.message} onChange={update("message")} className="w-full rounded-lg border border-line-strong bg-night px-4 py-2.5 text-[15px] focus:border-amber" />
      </Field>
      <button type="submit" disabled={status === "sending"} className="w-full rounded-full bg-amber px-6 py-3 text-sm font-semibold text-[#171207] hover:bg-amber-deep disabled:opacity-60">
        {status === "sending" ? "Bezig met versturen…" : "Verstuur bericht"}
      </button>
      {status === "error" && <p className="text-sm text-red-400">Er ging iets mis. Bel ons anders direct.</p>}
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}
