"use client";

import { useState } from "react";

interface GeocodeResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export default function AddCityForm({ onAdded }: { onAdded: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(data);
      if (data.length === 0) setError("No cities found. Try a different spelling.");
    } catch {
      setError("Search failed. Check your OpenWeatherMap API key is set.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(r: GeocodeResult) {
    const key = `${r.lat},${r.lon}`;
    setAdding(key);
    try {
      const res = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: r.name, country: r.country, lat: r.lat, lon: r.lon })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not add city");
        return;
      }
      setResults([]);
      setQuery("");
      onAdded();
    } finally {
      setAdding(null);
    }
  }

  return (
    <div className="rounded-xl2 border border-dashed border-dusk-500 p-6">
      <h3 className="font-display text-lg font-semibold text-mist-100">Add a city</h3>
      <form onSubmit={handleSearch} className="mt-3 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city name…"
          className="flex-1 rounded-lg border border-dusk-500 bg-dusk-800 px-4 py-2.5 text-mist-100 outline-none focus:border-sun-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-sun-500 px-5 py-2.5 font-medium text-dusk-900 hover:bg-sun-400 disabled:opacity-60"
        >
          {loading ? "…" : "Search"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-storm-500">{error}</p>}

      {results.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {results.map((r) => {
            const key = `${r.lat},${r.lon}`;
            return (
              <li
                key={key}
                className="flex items-center justify-between rounded-lg border border-dusk-600/60 bg-dusk-700 px-4 py-2.5"
              >
                <span className="text-sm text-mist-200">
                  {r.name}
                  {r.state ? `, ${r.state}` : ""}, {r.country}
                </span>
                <button
                  onClick={() => handleAdd(r)}
                  disabled={adding === key}
                  className="text-sm text-sun-400 hover:underline disabled:opacity-60"
                >
                  {adding === key ? "Adding…" : "Add"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
