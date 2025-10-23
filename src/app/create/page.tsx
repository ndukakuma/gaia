"use client";

import { useRouter } from "next/navigation";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function CreatePage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [preview, setPreview] = React.useState("");

  function onSubmit(e: React.FormEvent) {
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
    } catch { /* ignore */ }

    router.push("/my");
  }

  return (
    <main className="container" style={{ padding: "24px 0 56px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Create a new avatar</h1>
      <form onSubmit={onSubmit} style={{ maxWidth: 560, display: "grid", gap: 12 }}>
        <label>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Name *</div>
          <input className="input" value={name} onChange={(e)=>setName(e.target.value)} required />
        </label>

        <label>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Tags (comma separated)</div>
          <input className="input" value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="mentor, calm, study" />
        </label>

        <label>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Preview image URL (optional)</div>
          <input className="input" value={preview} onChange={(e)=>setPreview(e.target.value)} placeholder="https://…" />
        </label>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn btn-primary" type="submit">Save</button>
          <button className="btn" type="button" onClick={()=>history.back()}>Cancel</button>
        </div>

        <p style={{ color: "#6b7280", fontSize: 13 }}>
          This saves to your browser for now. When you add a backend,
          persist to a database and file storage, then show the same UI.
        </p>
      </form>
    </main>
  );
}
