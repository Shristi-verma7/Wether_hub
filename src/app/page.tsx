import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-medium text-teal-400">A calmer way to watch the sky</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-mist-100 sm:text-6xl">
              Every city you care about,
              <br />
              one quiet dashboard.
            </h1>
            <p className="mt-6 max-w-md text-lg text-mist-400">
              Save the places that matter, watch the five-day outlook, and set your own
              thresholds for the conditions worth knowing about — a cold snap, an incoming
              storm, wind strong enough to notice.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/register"
                className="rounded-full bg-sun-500 px-6 py-3 font-medium text-dusk-900 hover:bg-sun-400"
              >
                Get started free
              </Link>
              <Link href="/login" className="text-mist-200 hover:text-sun-400">
                I already have an account
              </Link>
            </div>
          </div>

          <div className="rounded-xl2 border border-dusk-600/60 bg-dusk-800 p-8">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-mist-400">Kyoto</p>
                <p className="font-display text-6xl font-semibold text-mist-100">21°</p>
              </div>
              <p className="text-teal-400">Partly cloudy</p>
            </div>
            <div className="mt-8 grid grid-cols-5 gap-3 text-center text-sm text-mist-400">
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
                <div key={d} className="rounded-xl border border-dusk-600/60 py-3">
                  <p>{d}</p>
                  <p className="mt-2 font-display text-mist-100">{18 + i}°</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-sun-500/30 bg-sun-500/10 px-4 py-3 text-sm text-sun-400">
              Alert armed: notify when wind exceeds 30 km/h
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
