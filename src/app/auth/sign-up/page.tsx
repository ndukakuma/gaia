"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("success");
    setMessage("Check your inbox to verify your Gaia account. Once confirmed you can sign in.");
    setEmail("");
    setPassword("");
    setFullName("");
  }

  return (
    <main className="container" style={{ padding: "48px 0 72px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", display: "grid", gap: 24 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 6 }}>Gaia Accounts</p>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Create an account</h1>
          <p style={{ color: "#6b7280", marginTop: 12 }}>
            Build, manage, and launch photoreal companions. Give users a friend who listens, encourages, and adapts across mediums.
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <label>
            <div style={{ fontSize: 14, marginBottom: 6 }}>Full name</div>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ada Lovelace" />
          </label>

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
              minLength={6}
              autoComplete="new-password"
            />
          </label>

          <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div style={{ borderRadius: 16, border: "1px dashed #d1d5db", padding: 18 }}>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>Coming soon</p>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#4b5563", fontSize: 14 }}>
            <li>Apple / Google single sign-on</li>
            <li>Team & workspace invites</li>
            <li>2FA + device approvals</li>
          </ul>
        </div>

        <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center" }}>
          Already have an account? <Link className="nav-link" href="/auth/sign-in">Sign in</Link>
        </p>

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
