"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adresveld met autocomplete via /api/geocode (PDOK). Geeft bij selectie de
 * volledige locatie (label + lon/lat) door via onSelect.
 */
export default function AddressAutocomplete({ label, placeholder, value, onSelect, showLocationButton = false, initialQuery = "" }) {
  const [query, setQuery] = useState(value?.placeName || initialQuery || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value?.placeName || "");
  }, [value?.placeName]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e) {
    const q = e.target.value;
    setQuery(q);
    onSelect(null); // eerdere selectie ongeldig maken zodra iemand weer gaat typen

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }

  async function handlePick(suggestion) {
    setOpen(false);
    setQuery(suggestion.label);
    try {
      const res = await fetch(`/api/geocode?id=${encodeURIComponent(suggestion.id)}`);
      const data = await res.json();
      if (data.ok) {
        onSelect({ placeName: data.placeName, lon: data.lon, lat: data.lat });
      }
    } catch {
      onSelect(null);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const loc = { placeName: "Huidige locatie", lon: pos.coords.longitude, lat: pos.coords.latitude };
        setQuery(loc.placeName);
        onSelect(loc);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-lg border border-line-strong bg-night px-3.5 py-2.5 text-[15px] focus:border-amber focus:outline-none"
        />
        {showLocationButton && (
          <button
            type="button"
            onClick={useCurrentLocation}
            title="Gebruik mijn huidige locatie"
            className="shrink-0 rounded-lg border border-line-strong px-3 text-muted hover:border-amber hover:text-amber"
          >
            {locating ? "…" : "📍"}
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-line-strong bg-night-2 shadow-lg">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => handlePick(s)}
                className="block w-full px-3.5 py-2.5 text-left text-sm hover:bg-night"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
