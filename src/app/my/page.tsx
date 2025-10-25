"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

type MyAvatar = { id: string; name: string; preview?: string; tags?: string[] };

export default function MyPage() {
  const [items, setItems] = useState<MyAvatar[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gaia-my-avatars");
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  function remove(id: string) {
    const next = items.filter((a) => a.id !== id);
    setItems(next);
    try {
      localStorage.setItem("gaia-my-avatars", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  return (
    <main className="container">
      <div style={{ padding: "24px 0 56px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>My Avatars</h1>
          <Link href="/create" className="btn btn-primary">Create Avatar</Link>
        </div>

        {!items.length ? (
          <div className={styles.empty}>
            Nothing here yet. <Link href="/create" className="nav-link" style={{ fontWeight:600 }}>Create one</Link>.
          </div>
        ) : (
          <section className={styles.grid}>
            {items.map((a) => (
              <div key={a.id} className={styles.card}>
                <div
                  className={styles.thumb}
                  style={{ backgroundImage: a.preview ? `url(${a.preview})` : undefined }}
                />
                <div className={styles.title} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span>{a.name}</span>
                  <button className="btn" onClick={()=>remove(a.id)}>Remove</button>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
