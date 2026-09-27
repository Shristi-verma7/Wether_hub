"use client";

import { useEffect, useState, useCallback } from "react";
import { ALERT_LABELS, type AlertRule } from "@/types";

export default function AlertsPanel({ refreshKey }: { refreshKey: number }) {
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/alerts/check")
      .then((res) => res.json())
      .then((data) => setAlerts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function handleDelete(id: string) {
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  const triggeredCount = alerts.filter((a) => a.triggered).length;

  return (
    <div className="rounded-xl2 border border-dusk-600/60 bg-dusk-800 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-mist-100">Alerts</h3>
        {triggeredCount > 0 && (
          <span className="rounded-full bg-storm-500/15 px-3 py-1 text-xs font-medium text-storm-500">
            {triggeredCount} active
          </span>
        )}
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-mist-400">Checking conditions…</p>
      ) : alerts.length === 0 ? (
        <p className="mt-4 text-sm text-mist-400">
          No alerts yet. Use &ldquo;Set alert&rdquo; on a city card to get notified about
          temperature, rain or wind.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {alerts.map((a) => (
            <li
              key={a.id}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
                a.triggered
                  ? "border-storm-500/50 bg-storm-500/10 text-mist-100"
                  : "border-dusk-600/60 bg-dusk-700 text-mist-300"
              }`}
            >
              <span>
                <strong className="font-medium">{a.city.name}</strong> — {ALERT_LABELS[a.type]}
                {a.threshold != null ? ` ${a.threshold}${a.type === "WIND_ABOVE" ? " m/s" : "°"}` : ""}
                {a.triggered && <span className="ml-2 text-storm-500">● now true</span>}
              </span>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-mist-400 hover:text-storm-500"
                title="Delete alert"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
