import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  isRaining: boolean;
}

export interface ForecastPoint {
  dt: number;
  label: string;
  temp: number;
  condition: string;
  icon: string;
}

export interface CityWeather {
  city: {
    id: string;
    name: string;
    country: string | null;
    lat: number;
    lon: number;
  };
  current: CurrentWeather;
  forecast: ForecastPoint[];
}

export interface AlertRule {
  id: string;
  type: "TEMP_ABOVE" | "TEMP_BELOW" | "RAIN" | "WIND_ABOVE";
  threshold: number | null;
  cityId: string;
  city: { id: string; name: string };
  triggered?: boolean;
  currentValue?: number;
}

export const ALERT_LABELS: Record<AlertRule["type"], string> = {
  TEMP_ABOVE: "Temperature rises above",
  TEMP_BELOW: "Temperature drops below",
  RAIN: "Rain is expected",
  WIND_ABOVE: "Wind speed exceeds"
};
