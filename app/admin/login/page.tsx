"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-[#1c2b1c] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span
            className="text-2xl font-semibold text-[#c7d9c7]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            PSYConnect
          </span>
          <p className="text-[#6e9f6e] text-sm mt-1">Panel interno</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#2f522f] rounded-2xl p-8 space-y-4">
          <div>
            <label className="text-xs text-[#9dbf9d] block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#1c2b1c] text-[#c7d9c7] border border-[#4d824d] focus:outline-none focus:ring-2 focus:ring-[#6e9f6e] placeholder-[#3a673a] text-sm"
              placeholder="admin@psyconnect.es"
              required
            />
          </div>
          <div>
            <label className="text-xs text-[#9dbf9d] block mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#1c2b1c] text-[#c7d9c7] border border-[#4d824d] focus:outline-none focus:ring-2 focus:ring-[#6e9f6e] text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#4d824d] text-white font-medium hover:bg-[#3a673a] transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
