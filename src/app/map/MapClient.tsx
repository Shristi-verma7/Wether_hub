"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] items-center justify-center rounded-xl2 border border-dusk-600/60 bg-dusk-800 text-mist-400">
      Loading map…
    </div>
  )
});

interface City {
  id: string;
  name: string;
  country: string | null;
  lat: number;
  lon: number;
}

export default function MapClient() {
  const [cities, setCities] = useState<City[] | null>(null);

  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(Array.isArray(data) ? data : []));
  }, []);

  if (cities === null) {
    return <p className="mt-8 text-mist-400">Loading your cities…</p>;
  }

  if (cities.length === 0) {
    return (
      <p className="mt-8 text-mist-400">
        You haven&apos;t saved any cities yet — add some from the dashboard to see them here.
      </p>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-xl2 border border-dusk-600/60">
      <MapView cities={cities} />
    </div>
  );
}
