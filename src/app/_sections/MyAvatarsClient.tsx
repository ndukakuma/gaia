"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

type MyAvatar = { id: string; name: string; preview?: string; tags?: string[] };

export default function MyAvatarsClient() {
  const [items, setItems] = useState<MyAvatar[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gaia-my-avatars");
      setItems(raw ? (JSON.parse(raw) as MyAvatar[]) : []);
    } catch {
      setItems([]);
    }
  }, []);

  if (!items.length) {
    return (
      <div className={styles.empty}>
        You haven&apos;t created any avatars yet.{" "}
        <Link href="/create" className="nav-link" style={{ fontWeight: 600 }}>
          Create one
        </Link>
        .
      </div>
    );
  }

  return (
    <section className={styles.grid}>
      {items.map((a) => (
        <Link key={a.id} href={`/a/${a.id}`} className={styles.card}>
          <div
            className={styles.thumb}
            style={{ backgroundImage: a.preview ? `url(${a.preview})` : undefined }}
          />
          <div className={styles.title}>{a.name}</div>
        </Link>
      ))}
    </section>
  );
}
