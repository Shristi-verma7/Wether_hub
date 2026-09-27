"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);

    if (signInRes?.error) {
      setError("Account created — please sign in.");
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col px-6 py-20">
        <h1 className="font-display text-3xl font-semibold text-mist-100">Create your account</h1>
        <p className="mt-2 text-mist-400">Save cities, track forecasts, set alerts.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-mist-200">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-dusk-500 bg-dusk-800 px-4 py-2.5 text-mist-100 outline-none focus:border-sun-400"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-mist-200">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-dusk-500 bg-dusk-800 px-4 py-2.5 text-mist-100 outline-none focus:border-sun-400"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-mist-200">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-dusk-500 bg-dusk-800 px-4 py-2.5 text-mist-100 outline-none focus:border-sun-400"
            />
            <span className="text-xs text-mist-400">At least 6 characters</span>
          </label>

          {error && <p className="text-sm text-storm-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-sun-500 px-6 py-2.5 font-medium text-dusk-900 hover:bg-sun-400 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-mist-400">
          Already have an account?{" "}
          <Link href="/login" className="text-sun-400 hover:underline">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}
