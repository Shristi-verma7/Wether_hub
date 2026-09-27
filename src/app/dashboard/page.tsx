import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-mist-100">
          Hi {session.user?.name || session.user?.email}
        </h1>
        <p className="mt-1 text-mist-400">Your saved cities, forecasts and alerts.</p>

        <DashboardClient />
      </main>
    </div>
  );
}
