"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet's default marker icons reference files that don't resolve under bundlers;
// point them at the CDN copies instead.
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface City {
  id: string;
  name: string;
  country: string | null;
  lat: number;
  lon: number;
}

export default function MapView({ cities }: { cities: City[] }) {
  const [temps, setTemps] = useState<Record<string, number>>({});

  useEffect(() => {
    cities.forEach((city) => {
      fetch(`/api/weather?lat=${city.lat}&lon=${city.lon}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.current?.temp != null) {
            setTemps((prev) => ({ ...prev, [city.id]: data.current.temp }));
          }
        })
        .catch(() => {});
    });
  }, [cities]);

  const center: [number, number] =
    cities.length > 0 ? [cities[0].lat, cities[0].lon] : [20, 0];

  return (
    <MapContainer
      center={center}
      zoom={cities.length > 0 ? 3 : 2}
      scrollWheelZoom
      style={{ height: "560px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cities.map((city) => (
        <Marker key={city.id} position={[city.lat, city.lon]} icon={icon}>
          <Popup>
            <strong>{city.name}</strong>
            {city.country ? `, ${city.country}` : ""}
            <br />
            {temps[city.id] != null ? `${temps[city.id]}°C` : "Loading…"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
