"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-dusk-600/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-mist-100">
          Weather Hub
        </Link>

        <div className="flex items-center gap-6 text-sm">
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard" className="text-mist-200 hover:text-sun-400">
                Dashboard
              </Link>
              <Link href="/map" className="text-mist-200 hover:text-sun-400">
                Map
              </Link>
              <span className="hidden text-mist-400 sm:inline">{session.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-dusk-500 px-4 py-1.5 text-mist-100 hover:border-sun-400 hover:text-sun-400"
              >
                Sign out
              </button>
            </>
          ) : status === "loading" ? (
            <span className="text-mist-400">…</span>
          ) : (
            <>
              <Link href="/login" className="text-mist-200 hover:text-sun-400">
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-sun-500 px-4 py-1.5 font-medium text-dusk-900 hover:bg-sun-400"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
