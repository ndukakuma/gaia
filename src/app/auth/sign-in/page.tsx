"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function SignInPage() {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("success");
    setMessage("Welcome back! You are signed in. Redirect yourself to continue building.");
  }

  async function handleSignInWithOtp() {
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("success");
    setMessage("We sent you a magic link. Check your inbox to finish signing in.");
  }

  return (
    <main className="container" style={{ padding: "48px 0 72px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", display: "grid", gap: 24 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 6 }}>Gaia Accounts</p>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Sign in</h1>
          <p style={{ color: "#6b7280", marginTop: 12 }}>
            Use your Gaia account credentials. Companion syncing, shared memories, and richer feelings are coming online soon.
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <label>
            <div style={{ fontSize: 14, marginBottom: 6 }}>Email</div>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>

          <label>
            <div style={{ fontSize: 14, marginBottom: 6 }}>Password</div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div style={{ display: "grid", gap: 8 }}>
          <button
            className="btn"
            onClick={handleSignInWithOtp}
            disabled={status === "loading" || !email}
            type="button"
            style={{ justifyContent: "center" }}
          >
            {status === "loading" ? "Sending link..." : "Email me a magic link"}
          </button>
          <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center" }}>
            Don&apos;t have an account? <Link href="/auth/sign-up" className="nav-link">Create one</Link>
          </p>
        </div>

        {message && (
          <div
            style={{
              borderRadius: 12,
              padding: "12px 14px",
              background: status === "error" ? "#fef2f2" : "#f0fdf4",
              color: status === "error" ? "#b91c1c" : "#15803d",
              fontSize: 14,
            }}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
