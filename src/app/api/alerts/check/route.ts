import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentWeather } from "@/lib/openweather";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    include: { city: { select: { id: true, name: true, lat: true, lon: true } } }
  });

  const results = await Promise.all(
    alerts.map(async (alert) => {
      try {
        const weather = await getCurrentWeather(alert.city.lat, alert.city.lon);

        let triggered = false;
        let currentValue: number | undefined;

        switch (alert.type) {
          case "TEMP_ABOVE":
            currentValue = weather.temp;
            triggered = alert.threshold != null && weather.temp > alert.threshold;
            break;
          case "TEMP_BELOW":
            currentValue = weather.temp;
            triggered = alert.threshold != null && weather.temp < alert.threshold;
            break;
          case "WIND_ABOVE":
            currentValue = weather.windSpeed;
            triggered = alert.threshold != null && weather.windSpeed > alert.threshold;
            break;
          case "RAIN":
            triggered = weather.isRaining;
            break;
        }

        return {
          id: alert.id,
          type: alert.type,
          threshold: alert.threshold,
          cityId: alert.cityId,
          city: alert.city,
          triggered,
          currentValue
        };
      } catch {
        return {
          id: alert.id,
          type: alert.type,
          threshold: alert.threshold,
          cityId: alert.cityId,
          city: alert.city,
          triggered: false,
          currentValue: undefined
        };
      }
    })
  );

  return NextResponse.json(results);
}
