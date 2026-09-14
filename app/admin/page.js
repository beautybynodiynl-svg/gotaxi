"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Inloggen mislukt. Controleer je e-mailadres en wachtwoord.");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-night px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-line-strong bg-night-2 p-8">
        <h1 className="font-display text-2xl font-bold">Beheerpaneel</h1>
        <p className="mt-1 text-sm text-muted">Log in om de site te bewerken.</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-muted">E-mailadres</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-line-strong bg-night px-4 py-2.5 text-[15px] focus:border-amber" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-muted">Wachtwoord</span>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-line-strong bg-night px-4 py-2.5 text-[15px] focus:border-amber" />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-amber px-6 py-2.5 text-sm font-semibold text-[#171207] hover:bg-amber-deep disabled:opacity-60">
          {loading ? "Bezig…" : "Inloggen"}
        </button>
      </form>
    </main>
  );
}
