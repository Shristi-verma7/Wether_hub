"use client";

import { useState } from "react";
import { ALERT_LABELS, type AlertRule } from "@/types";

interface City {
  id: string;
  name: string;
}

const TYPES: AlertRule["type"][] = ["TEMP_ABOVE", "TEMP_BELOW", "RAIN", "WIND_ABOVE"];

export default function AlertForm({
  city,
  onClose,
  onCreated
}: {
  city: City;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [type, setType] = useState<AlertRule["type"]>("TEMP_ABOVE");
  const [threshold, setThreshold] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsThreshold = type !== "RAIN";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        cityId: city.id,
        threshold: needsThreshold ? threshold : null
      })
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create alert");
      return;
    }

    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dusk-900/80 px-6">
      <div className="w-full max-w-sm rounded-xl2 border border-dusk-600/60 bg-dusk-800 p-6">
        <h3 className="font-display text-lg font-semibold text-mist-100">Alert for {city.name}</h3>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-mist-200">
            Condition
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AlertRule["type"])}
              className="rounded-lg border border-dusk-500 bg-dusk-700 px-4 py-2.5 text-mist-100 outline-none focus:border-sun-400"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {ALERT_LABELS[t]}
                </option>
              ))}
            </select>
          </label>

          {needsThreshold && (
            <label className="flex flex-col gap-1.5 text-sm text-mist-200">
              {type === "WIND_ABOVE" ? "Threshold (m/s)" : "Threshold (°C)"}
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="rounded-lg border border-dusk-500 bg-dusk-700 px-4 py-2.5 text-mist-100 outline-none focus:border-sun-400"
              />
            </label>
          )}

          {error && <p className="text-sm text-storm-500">{error}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="text-sm text-mist-400 hover:text-mist-200">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-sun-500 px-5 py-2 text-sm font-medium text-dusk-900 hover:bg-sun-400 disabled:opacity-60"
            >
              {loading ? "Saving…" : "Create alert"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
