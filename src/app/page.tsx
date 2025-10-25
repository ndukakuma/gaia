import Link from "next/link";
import styles from "./page.module.css";
import {
  AVATARS_DEFAULT,
  AVATARS_COMMUNITY,
  searchAmong,
  type Avatar,
} from "@/lib/avatars";
import MyAvatarsClient from "./_sections/MyAvatarsClient";

export default function Home({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (searchParams?.q ?? "").toString();

  const defaultItems = searchAmong(q, [AVATARS_DEFAULT]);
  const communityItems = searchAmong(q, [AVATARS_COMMUNITY]);

  const renderGrid = (items: [string, Avatar][]) => (
    <section className={styles.grid}>
      {items.map(([id, a]) => (
        <Link key={id} href={`/a/${id}`} className={styles.card}>
          <div className={styles.thumb} style={{ backgroundImage: a.preview ? `url(${a.preview})` : undefined }} />
          <div className={styles.title}>{a.name}</div>
        </Link>
      ))}
    </section>
  );

  return (
    <main className="container">
      <div className={styles.wrap}>
        <div className={styles.row}>
          <h2 className={styles.sectionTitle}>Featured</h2>
          <Link href="/create" className="btn btn-primary">Create Avatar</Link>
        </div>
        {defaultItems.length ? renderGrid(defaultItems) : <div className={styles.empty}>No matches in defaults.</div>}

        <div style={{ height: 28 }} />

        <h2 className={styles.sectionTitle}>Community</h2>
        {communityItems.length ? renderGrid(communityItems) : <div className={styles.empty}>No community avatars yet.</div>}

        <div style={{ height: 28 }} />

        <h2 className={styles.sectionTitle}>My Avatars</h2>
        <MyAvatarsClient />
      </div>
    </main>
  );
}
