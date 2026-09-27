import { NextResponse } from "next/server";
import { getCurrentWeather, getForecast } from "@/lib/openweather";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: "lat and lon query params are required" }, { status: 400 });
  }

  try {
    const [current, forecast] = await Promise.all([
      getCurrentWeather(lat, lon),
      getForecast(lat, lon)
    ]);
    return NextResponse.json({ current, forecast });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not fetch weather data" }, { status: 502 });
  }
}
