import { NextResponse } from "next/server";
import { geocodeCity } from "@/lib/openweather";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 });
  }

  try {
    const results = await geocodeCity(q.trim());
    return NextResponse.json(results);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not search for that city" }, { status: 502 });
  }
}
