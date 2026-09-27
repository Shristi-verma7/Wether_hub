import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import MapClient from "./MapClient";

export default async function MapPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-mist-100">Your cities on the map</h1>
        <p className="mt-1 text-mist-400">Tap a marker for the current temperature.</p>
        <MapClient />
      </main>
    </div>
  );
}
