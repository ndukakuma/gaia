"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function CreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [preview, setPreview] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;

    const entry = {
      id: `my-${uid()}`,
      name: name.trim(),
      preview: preview.trim() || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const raw = localStorage.getItem("gaia-my-avatars");
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(entry);
      localStorage.setItem("gaia-my-avatars", JSON.stringify(arr));
    } catch {
      /* ignore */
    }

    router.push("/my");
  }

  return (
    <main className="container" style={{ padding: "32px 0 72px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Create a new avatar</h1>
      <p style={{ color: "#4b5563", marginBottom: 24, maxWidth: 640 }}>
        Start with the essentials below. We’re focused on heartfelt companions first, but these controls preview the richer tooling we’re rolling out.
      </p>
      <form onSubmit={onSubmit} style={{ maxWidth: 720, display: "grid", gap: 16 }}>
        <label>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Name *</div>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Tags (comma separated)</div>
          <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="mentor, calm, study" />
        </label>

        <label>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Preview image URL (optional)</div>
          <input className="input" value={preview} onChange={(e) => setPreview(e.target.value)} placeholder="https://..." />
        </label>

        <section style={{ border: "1px dashed #d1d5db", borderRadius: 16, padding: 20, display: "grid", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Reference photos</div>
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
              Drag & drop portrait, profile, and motion shots. Automated background cleanup and capture are in progress.
            </p>
          </div>
          <div
            style={{
              minHeight: 120,
              borderRadius: 14,
              border: "2px dashed #e5e7eb",
              background: "#fafafa",
              display: "grid",
              placeItems: "center",
              padding: 16,
            }}
          >
            <button type="button" className="btn" disabled style={{ cursor: "not-allowed", opacity: 0.7 }}>
              Upload photos (coming soon)
            </button>
          </div>
        </section>

        <section style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, display: "grid", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Feature presets</div>
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
              Choose facial structure, lighting, and wardrobe templates. These will feed into generation once the editor ships.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Studio", "Outdoor", "Cinematic"].map((preset) => (
              <button key={preset} type="button" className="btn" disabled style={{ cursor: "not-allowed", opacity: 0.75 }}>
                {preset}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Smiling", "Neutral", "Action", "Close-up"].map((pose) => (
              <span
                key={pose}
                style={{
                  borderRadius: 9999,
                  border: "1px dashed #d1d5db",
                  padding: "6px 14px",
                  fontSize: 13,
                  color: "#6b7280",
                }}
              >
                {pose}
              </span>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, display: "grid", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Text description</div>
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
              Provide a rich prompt. We&apos;ll wire this into the diffusion pipeline next.
            </p>
          </div>
          <textarea
            className="input"
            style={{ minHeight: 120, resize: "vertical", fontFamily: "inherit" }}
            placeholder="Describe voice, demeanor, camera, styling, etc. (coming soon)"
            disabled
          />
        </section>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn btn-primary" type="submit">
            Save
          </button>
          <button className="btn" type="button" onClick={() => history.back()}>
            Cancel
          </button>
        </div>

        <p style={{ color: "#6b7280", fontSize: 13 }}>
          This saves to your browser for now. Media uploads, feature presets, and prompts are placeholders until backed services are ready.
        </p>
      </form>
    </main>
  );
}
