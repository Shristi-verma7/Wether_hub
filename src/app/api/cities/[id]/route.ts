import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const city = await prisma.city.findUnique({ where: { id: params.id } });
  if (!city || city.userId !== session.user.id) {
    return NextResponse.json({ error: "City not found" }, { status: 404 });
  }

  await prisma.city.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
