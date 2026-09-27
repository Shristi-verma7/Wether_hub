import axios from "axios";
import type { CurrentWeather, ForecastPoint } from "@/types";

const BASE = "https://api.openweathermap.org";

function getKey() {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    throw new Error(
      "OPENWEATHER_API_KEY is not set. Add it to your .env file (see .env.example)."
    );
  }
  return key;
}

export interface GeocodeResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export async function geocodeCity(query: string): Promise<GeocodeResult[]> {
  const { data } = await axios.get(`${BASE}/geo/1.0/direct`, {
    params: { q: query, limit: 5, appid: getKey() }
  });

  return (data as GeocodeResult[]).map((d) => ({
    name: d.name,
    country: d.country,
    state: d.state,
    lat: d.lat,
    lon: d.lon
  }));
}

export async function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  const { data } = await axios.get(`${BASE}/data/2.5/weather`, {
    params: { lat, lon, units: "metric", appid: getKey() }
  });

  const conditionMain: string = data.weather?.[0]?.main ?? "Clear";

  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind?.speed ?? 0,
    condition: conditionMain,
    description: data.weather?.[0]?.description ?? "",
    icon: data.weather?.[0]?.icon ?? "01d",
    isRaining: /rain|drizzle|thunderstorm/i.test(conditionMain)
  };
}

export async function getForecast(lat: number, lon: number): Promise<ForecastPoint[]> {
  const { data } = await axios.get(`${BASE}/data/2.5/forecast`, {
    params: { lat, lon, units: "metric", appid: getKey() }
  });

  // API returns 3-hour steps for 5 days; take one reading per day (around midday)
  const list = data.list as Array<{
    dt: number;
    dt_txt: string;
    main: { temp: number };
    weather: { main: string; icon: string }[];
  }>;

  const daily = list.filter((item) => item.dt_txt.includes("12:00:00"));
  const source = daily.length > 0 ? daily : list.filter((_, i) => i % 8 === 0);

  return source.slice(0, 5).map((item) => ({
    dt: item.dt,
    label: new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: "short" }),
    temp: Math.round(item.main.temp),
    condition: item.weather?.[0]?.main ?? "Clear",
    icon: item.weather?.[0]?.icon ?? "01d"
  }));
}
