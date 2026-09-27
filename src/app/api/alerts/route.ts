import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = ["TEMP_ABOVE", "TEMP_BELOW", "RAIN", "WIND_ABOVE"];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    include: { city: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(alerts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { type, threshold, cityId } = await req.json();

  if (!VALID_TYPES.includes(type) || !cityId) {
    return NextResponse.json({ error: "A valid type and cityId are required" }, { status: 400 });
  }

  if ((type === "TEMP_ABOVE" || type === "TEMP_BELOW" || type === "WIND_ABOVE") && typeof threshold !== "number") {
    return NextResponse.json({ error: "This alert type needs a numeric threshold" }, { status: 400 });
  }

  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (!city || city.userId !== session.user.id) {
    return NextResponse.json({ error: "City not found" }, { status: 404 });
  }

  const alert = await prisma.alert.create({
    data: {
      type,
      threshold: threshold ?? null,
      cityId,
      userId: session.user.id
    },
    include: { city: { select: { id: true, name: true } } }
  });

  return NextResponse.json(alert, { status: 201 });
}
