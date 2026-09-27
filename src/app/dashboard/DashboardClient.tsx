"use client";

import { useCallback, useEffect, useState } from "react";
import CityCard from "@/components/CityCard";
import AddCityForm from "@/components/AddCityForm";
import AlertForm from "@/components/AlertForm";
import AlertsPanel from "@/components/AlertsPanel";

interface City {
  id: string;
  name: string;
  country: string | null;
  lat: number;
  lon: number;
}

export default function DashboardClient() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertCity, setAlertCity] = useState<City | null>(null);
  const [alertsRefreshKey, setAlertsRefreshKey] = useState(0);

  const loadCities = useCallback(() => {
    setLoading(true);
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  async function handleDelete(id: string) {
    setCities((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/cities/${id}`, { method: "DELETE" });
    setAlertsRefreshKey((k) => k + 1);
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        {loading ? (
          <p className="text-mist-400">Loading your cities…</p>
        ) : cities.length === 0 ? (
          <p className="text-mist-400">
            You haven&apos;t saved any cities yet — add one below to see live weather.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} onDelete={handleDelete} onSetAlert={setAlertCity} />
            ))}
          </div>
        )}

        <AddCityForm onAdded={loadCities} />
      </div>

      <div className="flex flex-col gap-6">
        <AlertsPanel refreshKey={alertsRefreshKey} />
      </div>

      {alertCity && (
        <AlertForm
          city={alertCity}
          onClose={() => setAlertCity(null)}
          onCreated={() => setAlertsRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
