"use client";

import { useEffect, useState } from "react";
import type { CityWeather } from "@/types";
import ForecastChart from "./ForecastChart";

interface City {
  id: string;
  name: string;
  country: string | null;
  lat: number;
  lon: number;
}

export default function CityCard({
  city,
  onDelete,
  onSetAlert
}: {
  city: City;
  onDelete: (id: string) => void;
  onSetAlert: (city: City) => void;
}) {
  const [weather, setWeather] = useState<CityWeather["current"] | null>(null);
  const [forecast, setForecast] = useState<CityWeather["forecast"]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/weather?lat=${city.lat}&lon=${city.lon}`)
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setWeather(data.current);
        setForecast(data.forecast);
      })
      .catch(() => !cancelled && setError("Could not load weather"));

    return () => {
      cancelled = true;
    };
  }, [city.lat, city.lon]);

  return (
    <div className="rounded-xl2 border border-dusk-600/60 bg-dusk-800 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-mist-100">{city.name}</h3>
          {city.country && <p className="text-sm text-mist-400">{city.country}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetAlert(city)}
            title="Set an alert for this city"
            className="rounded-full border border-dusk-500 px-3 py-1 text-xs text-mist-200 hover:border-teal-400 hover:text-teal-400"
          >
            Set alert
          </button>
          <button
            onClick={() => onDelete(city.id)}
            title="Remove this city"
            className="rounded-full border border-dusk-500 px-3 py-1 text-xs text-mist-200 hover:border-storm-500 hover:text-storm-500"
          >
            Remove
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-storm-500">{error}</p>}

      {weather ? (
        <>
          <div className="mt-4 flex items-end justify-between">
            <p className="font-display text-5xl font-semibold text-mist-100">{weather.temp}°</p>
            <div className="text-right">
              <p className="text-teal-400">{weather.description}</p>
              <p className="text-sm text-mist-400">Feels like {weather.feelsLike}°</p>
            </div>
          </div>
          <div className="mt-4 flex gap-6 text-sm text-mist-400">
            <span>Humidity {weather.humidity}%</span>
            <span>Wind {weather.windSpeed} m/s</span>
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 text-sm text-sun-400 hover:underline"
          >
            {expanded ? "Hide 5-day forecast" : "Show 5-day forecast"}
          </button>

          {expanded && forecast.length > 0 && (
            <div className="mt-3">
              <ForecastChart data={forecast} />
            </div>
          )}
        </>
      ) : !error ? (
        <p className="mt-6 text-sm text-mist-400">Loading weather…</p>
      ) : null}
    </div>
  );
}
