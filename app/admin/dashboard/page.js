"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const CONTENT_FIELDS = [
  { key: "hero_title", label: "Titel op de homepage", type: "text" },
  { key: "hero_subtitle", label: "Ondertitel op de homepage", type: "textarea" },
  { key: "phone", label: "Telefoonnummer", type: "text" },
  { key: "whatsapp_number", label: "WhatsApp-nummer (alleen cijfers, met landcode, bv. 31612345678)", type: "text" },
  { key: "email", label: "E-mailadres", type: "text" },
  { key: "kvk_nummer", label: "KvK-nummer", type: "text" },
  { key: "vergunning_nummer", label: "Vergunningnummer (taxivergunning)", type: "text" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("teksten");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/admin");
      else setChecking(false);
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin");
  }

  if (checking) return <p className="p-8 text-muted">Bezig met laden…</p>;

  return (
    <main className="min-h-screen bg-night">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Beheerpaneel</h1>
          <button onClick={handleLogout} className="rounded-full border border-line-strong px-4 py-2 text-sm hover:border-amber">
            Uitloggen
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-line">
          {["teksten", "werkgebieden", "ritprijzen", "reserveringen", "berichten"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm capitalize ${tab === t ? "border-b-2 border-amber text-text" : "text-muted hover:text-text"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "teksten" && <ContentEditor />}
          {tab === "werkgebieden" && <AreasEditor />}
          {tab === "ritprijzen" && <PricingEditor />}
          {tab === "reserveringen" && <BookingsList />}
          {tab === "berichten" && <MessagesList />}
        </div>
      </div>
    </main>
  );
}

function SavedBadge({ visible }) {
  if (!visible) return null;
  return <span className="ml-3 text-sm text-amber">Opgeslagen ✓</span>;
}

function ContentEditor() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [savedKey, setSavedKey] = useState("");

  useEffect(() => {
    supabase.from("site_content").select("key, value").then(({ data }) => {
      const map = {};
      (data || []).forEach((row) => (map[row.key] = row.value));
      setValues(map);
      setLoading(false);
    });
  }, []);

  const [errorKey, setErrorKey] = useState("");

  async function saveField(key) {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value: values[key] || "", updated_at: new Date().toISOString() });
    if (error) {
      setErrorKey(key);
      setTimeout(() => setErrorKey(""), 3000);
      return;
    }
    setSavedKey(key);
    setTimeout(() => setSavedKey(""), 2000);
  }

  if (loading) return <p className="text-muted">Bezig met laden…</p>;

  return (
    <div className="space-y-8">
      {CONTENT_FIELDS.map((field) => (
        <div key={field.key} className="rounded-2xl border border-line-strong bg-night-2 p-6">
          <label className="mb-2 block text-sm font-medium text-muted">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea rows={4} value={values[field.key] || ""} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} className="w-full rounded-lg border border-line-strong bg-night px-4 py-3 text-[15px] focus:border-amber" />
          ) : (
            <input type="text" value={values[field.key] || ""} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} className="w-full rounded-lg border border-line-strong bg-night px-4 py-2.5 text-[15px] focus:border-amber" />
          )}
          <div className="mt-3 flex items-center">
            <button onClick={() => saveField(field.key)} className="rounded-full bg-amber px-5 py-2 text-sm font-semibold text-[#171207] hover:bg-amber-deep">
              Opslaan
            </button>
            <SavedBadge visible={savedKey === field.key} />
            {errorKey === field.key && <span className="ml-3 text-sm text-red-400">Opslaan mislukt, probeer opnieuw</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

const EMPTY_AREA = { slug: "", name: "", intro: "", travel_time: "", highlights: "", sort_order: 0 };

function slugify(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AreasEditor() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newArea, setNewArea] = useState(EMPTY_AREA);

  async function load() {
    const { data } = await supabase.from("service_areas").select("*").order("sort_order");
    setAreas(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function updateLocal(id, field, value) {
    setAreas((rows) => rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  async function saveRow(row) {
    await supabase.from("service_areas").update({
      slug: row.slug, name: row.name, intro: row.intro, content: row.content,
      travel_time: row.travel_time, highlights: row.highlights, sort_order: row.sort_order,
    }).eq("id", row.id);
  }

  async function deleteRow(id) {
    if (!confirm("Dit werkgebied verwijderen? De landingspagina verdwijnt dan ook.")) return;
    await supabase.from("service_areas").delete().eq("id", id);
    load();
  }

  async function addArea() {
    if (!newArea.name) return;
    const slug = newArea.slug || slugify(newArea.name);
    await supabase.from("service_areas").insert({ ...newArea, slug, sort_order: Number(newArea.sort_order) || 0 });
    setNewArea(EMPTY_AREA);
    load();
  }

  if (loading) return <p className="text-muted">Bezig met laden…</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line-strong bg-night-2 p-6">
        <h2 className="font-display text-lg font-semibold">Nieuw werkgebied toevoegen</h2>
        <p className="mt-1 text-sm text-muted">Elk werkgebied krijgt automatisch een eigen landingspagina op /gebied/&lt;plaatsnaam&gt;.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input placeholder="Plaatsnaam (bv. Driebergen)" value={newArea.name} onChange={(e) => setNewArea((v) => ({ ...v, name: e.target.value }))} className="rounded-lg border border-line-strong bg-night px-3 py-2 text-sm" />
          <input placeholder="URL-slug (optioneel, wordt automatisch gemaakt)" value={newArea.slug} onChange={(e) => setNewArea((v) => ({ ...v, slug: e.target.value }))} className="rounded-lg border border-line-strong bg-night px-3 py-2 text-sm" />
          <input placeholder="Reistijd (bv. 20 minuten naar Utrecht Centraal)" value={newArea.travel_time} onChange={(e) => setNewArea((v) => ({ ...v, travel_time: e.target.value }))} className="rounded-lg border border-line-strong bg-night px-3 py-2 text-sm" />
          <input placeholder="Bekende plekken, komma-gescheiden" value={newArea.highlights} onChange={(e) => setNewArea((v) => ({ ...v, highlights: e.target.value }))} className="rounded-lg border border-line-strong bg-night px-3 py-2 text-sm" />
          <textarea placeholder="Korte, unieke introductietekst voor deze plaats" value={newArea.intro} onChange={(e) => setNewArea((v) => ({ ...v, intro: e.target.value }))} className="rounded-lg border border-line-strong bg-night px-3 py-2 text-sm sm:col-span-2" rows={3} />
        </div>
        <button onClick={addArea} className="mt-4 rounded-full bg-amber px-5 py-2 text-sm font-semibold text-[#171207] hover:bg-amber-deep">
          Toevoegen
        </button>
      </div>

      <div className="space-y-3">
        {areas.map((row) => (
          <div key={row.id} className="rounded-2xl border border-line-strong bg-night-2 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={row.name} onChange={(e) => updateLocal(row.id, "name", e.target.value)} className="rounded-lg border border-line-strong bg-night px-3 py-2 text-sm" />
              <input value={row.slug} onChange={(e) => updateLocal(row.id, "slug", e.target.value)} className="rounded-lg border border-line-strong bg-night px-3 py-2 text-sm" />
              <input value={row.travel_time || ""} onChange={(e) => updateLocal(row.id, "travel_time", e.target.value)} className="rounded-lg border border-line-strong bg-night px-3 py-2 text-sm" />
              <input value={row.highlights || ""} onChange={(e) => updateLocal(row.id, "highlights", e.target.value)} className="rounded-lg border border-line-strong bg-night px-3 py-2 text-sm" />
              <textarea value={row.intro || ""} onChange={(e) => updateLocal(row.id, "intro", e.target.value)} className="rounded-lg border border-line-strong bg-night px-3 py-2 text-sm sm:col-span-2" rows={3} placeholder="Korte introductietekst (hero)" />
              <textarea
                value={row.content || ""}
                onChange={(e) => updateLocal(row.id, "content", e.target.value)}
                className="rounded-lg border border-line-strong bg-night px-3 py-2 text-sm sm:col-span-2"
                rows={10}
                placeholder="Uitgebreide tekst (500-800 woorden). Laat een lege regel tussen alinea's."
              />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button onClick={() => saveRow(row)} className="rounded-full bg-amber px-4 py-1.5 text-sm font-semibold text-[#171207] hover:bg-amber-deep">Opslaan</button>
              <button onClick={() => deleteRow(row.id)} className="rounded-full border border-red-400/50 px-4 py-1.5 text-sm text-red-400 hover:bg-red-400/10">Verwijderen</button>
              <a href={`/gebied/${row.slug}`} target="_blank" rel="noreferrer" className="text-sm text-muted hover:text-amber">Bekijk pagina →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError("Kon reserveringen niet laden.");
    else {
      setBookings(data || []);
      setError("");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (!error) setBookings((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  if (loading) return <p className="text-muted">Bezig met laden…</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (bookings.length === 0) return <p className="text-muted">Nog geen reserveringen binnengekomen.</p>;

  const STATUS_STYLES = {
    nieuw: "bg-amber/15 text-amber",
    bekeken: "bg-blue-400/15 text-blue-300",
    afgehandeld: "bg-green-400/15 text-green-300",
  };

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div key={b.id} className="rounded-2xl border border-line-strong bg-night-2 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">{b.name} — {b.phone}</p>
              <p className="mt-1 text-sm text-muted">{b.origin_label} → {b.destination_label}</p>
              <p className="text-sm text-muted">
                {b.ride_date} {b.ride_time} · {b.passengers} {b.passengers === 1 ? "persoon" : "personen"}
                {b.return_trip && " · retour"}
              </p>
              {b.calculated_fare != null && (
                <p className="mt-1 font-display text-lg font-semibold text-amber">
                  €{b.calculated_fare},- <span className="text-xs font-normal text-muted">({b.route_km} km · {b.pricing_type})</span>
                </p>
              )}
              {b.notes && <p className="mt-1 text-sm text-muted">"{b.notes}"</p>}
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[b.status] || STATUS_STYLES.nieuw}`}>
              {b.status}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            {["nieuw", "bekeken", "afgehandeld"].map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(b.id, s)}
                disabled={b.status === s}
                className="rounded-full border border-line-strong px-3 py-1.5 text-xs capitalize hover:border-amber disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">{new Date(b.created_at).toLocaleString("nl-NL")}</p>
        </div>
      ))}
    </div>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full rounded-lg border border-line-strong bg-night px-3 py-2 text-sm"
      />
    </label>
  );
}

function PricingEditor() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(""); // "" | "saved" | "error"

  useEffect(() => {
    supabase
      .from("pricing_config")
      .select("config")
      .eq("id", "default")
      .single()
      .then(({ data, error }) => {
        if (!error && data?.config) setConfig(data.config);
        setLoading(false);
      });
  }, []);

  function updateStandard(field, value) {
    setConfig((c) => ({ ...c, standard: { ...c.standard, [field]: value } }));
  }
  function updateAirport(field, value) {
    setConfig((c) => ({
      ...c,
      airports: { ...c.airports, schiphol: { ...c.airports.schiphol, [field]: value } },
    }));
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from("pricing_config")
      .upsert({ id: "default", config, updated_at: new Date().toISOString() });
    setSaving(false);
    setStatus(error ? "error" : "saved");
    setTimeout(() => setStatus(""), 3000);
  }

  if (loading) return <p className="text-muted">Bezig met laden…</p>;
  if (!config) return <p className="text-red-400">Kon prijsconfiguratie niet laden.</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-line-strong bg-night-2 p-6">
        <h2 className="font-display text-lg font-semibold">Standaard ritten</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <NumberField label="Starttarief (€)" value={config.standard.startFee} onChange={(v) => updateStandard("startFee", v)} />
          <NumberField label="Per kilometer (€)" value={config.standard.pricePerKm} onChange={(v) => updateStandard("pricePerKm", v)} />
          <NumberField label="Per minuut (€)" value={config.standard.pricePerMinute} onChange={(v) => updateStandard("pricePerMinute", v)} />
          <NumberField label="Minimum ritprijs (€)" value={config.standard.minimumFare} onChange={(v) => updateStandard("minimumFare", v)} />
        </div>
      </div>

      <div className="rounded-2xl border border-line-strong bg-night-2 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Schiphol</h2>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={config.airports.schiphol.enabled} onChange={(e) => updateAirport("enabled", e.target.checked)} className="h-4 w-4 accent-amber" />
            Actief
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <NumberField label="Basistarief (€)" value={config.airports.schiphol.baseFee} onChange={(v) => updateAirport("baseFee", v)} />
          <NumberField label="Per kilometer (€)" value={config.airports.schiphol.pricePerKm} onChange={(v) => updateAirport("pricePerKm", v)} />
          <NumberField label="Minimum ritprijs (€)" value={config.airports.schiphol.minimumFare} onChange={(v) => updateAirport("minimumFare", v)} />
        </div>
      </div>

      <div className="rounded-2xl border border-line-strong bg-night-2 p-6">
        <h2 className="font-display text-lg font-semibold">Automatische offertes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Maximale afstand (km)"
            value={config.maxAutoQuoteDistanceKm}
            onChange={(v) => setConfig((c) => ({ ...c, maxAutoQuoteDistanceKm: v }))}
          />
          <label className="flex items-center gap-2 pt-6 text-sm text-muted">
            <input
              type="checkbox"
              checked={config.requireManualConfirmation}
              onChange={(e) => setConfig((c) => ({ ...c, requireManualConfirmation: e.target.checked }))}
              className="h-4 w-4 accent-amber"
            />
            Handmatige bevestiging na aanvraag
          </label>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={config.calculatorEnabled}
            onChange={(e) => setConfig((c) => ({ ...c, calculatorEnabled: e.target.checked }))}
            className="h-4 w-4 accent-amber"
          />
          Ritprijscalculator actief op de site
        </label>
      </div>

      <div className="rounded-2xl border border-line-strong bg-night-2 p-6 text-sm text-muted">
        <p className="font-medium text-text">Ter informatie — landelijke maximumtarieven taxameter (2026)</p>
        <p className="mt-1">Starttarief € 4,31 · Kilometertarief € 3,17 · Tijdtarief € 0,52/min</p>
        <p className="mt-2 text-xs">
          Dit zijn de wettelijke maximumtarieven, niet je eigen commerciële online tarief hierboven. Gebruik dit alleen als referentie.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="rounded-full bg-amber px-6 py-2.5 text-sm font-semibold text-[#171207] hover:bg-amber-deep disabled:opacity-60">
          {saving ? "Bezig…" : "Tarieven opslaan"}
        </button>
        {status === "saved" && <span className="text-sm text-amber">Opgeslagen ✓</span>}
        {status === "error" && <span className="text-sm text-red-400">Opslaan mislukt, probeer opnieuw</span>}
      </div>
    </div>
  );
}

function MessagesList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setMessages(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-muted">Bezig met laden…</p>;
  if (messages.length === 0) return <p className="text-muted">Nog geen berichten binnengekomen.</p>;

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div key={m.id} className="rounded-2xl border border-line-strong bg-night-2 p-5">
          <div className="flex items-baseline justify-between">
            <p className="font-medium">{m.name}</p>
            <p className="text-xs text-muted">{new Date(m.created_at).toLocaleString("nl-NL")}</p>
          </div>
          <p className="text-sm text-amber">{m.phone}{m.email ? ` · ${m.email}` : ""}</p>
          {m.message && <p className="mt-2 text-sm text-muted">{m.message}</p>}
        </div>
      ))}
    </div>
  );
}
