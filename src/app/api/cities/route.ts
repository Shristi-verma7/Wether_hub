import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const cities = await prisma.city.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json(cities);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name, country, lat, lon } = await req.json();

  if (!name || typeof lat !== "number" || typeof lon !== "number") {
    return NextResponse.json({ error: "name, lat and lon are required" }, { status: 400 });
  }

  try {
    const city = await prisma.city.create({
      data: { name, country, lat, lon, userId: session.user.id }
    });
    return NextResponse.json(city, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "You already saved this city" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Could not save city" }, { status: 500 });
  }
}
