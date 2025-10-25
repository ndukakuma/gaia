import Link from "next/link";
import styles from "./page.module.css";
import {
  AVATARS_DEFAULT,
  AVATARS_COMMUNITY,
  searchAmong,
  type Avatar,
} from "@/lib/avatars";
import MyAvatarsClient from "./_sections/MyAvatarsClient";
import DeformOrb from "@/components/DeformOrb";
import WaveLoader from "@/components/WaveLoader";

export default function Home({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (searchParams?.q ?? "").toString();

  const defaultItems = searchAmong(q, [AVATARS_DEFAULT]);
  const communityItems = searchAmong(q, [AVATARS_COMMUNITY]);

  const highlightCards = [
    {
      title: "Companions who remember",
      body: "Guide users with a photoreal friend who recalls context, rituals, and check-ins. Perfect for wellness, study, or coaching routines.",
    },
    {
      title: "Personalities that adapt",
      body: "Blend wardrobe, tone, and environments to match whatever story you need: confidant, co-worker, caregiver, or creative partner.",
    },
    {
      title: "Share the bond",
      body: "Invite friends, family, or communities to connect with your companion, or re-use the same capture for events and productions.",
    },
  ];

  const testimonials = [
    {
      quote: "We spun up dedicated study buddies for our students. They now sit with a friendly face during late-night review sessions.",
      author: "Mara Chen",
      role: "Founder, Quiet Hours",
    },
    {
      quote: "Our wellness pilots rely on compassionate guides. Gaia let us craft the right tone and visual comfort in just a few hours.",
      author: "Sanjay Patel",
      role: "Program Director, Bloom Lab",
    },
    {
      quote: "My artist community loves the cinematic companions we share before exhibitions. It’s the perfect blend of tech + empathy.",
      author: "Rosa Kim",
      role: "Curator, Vertex",
    },
  ];

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
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.betaTag}>Gaia Studio · Private beta</p>
          <h1>Photoreal companions who feel present, everywhere.</h1>
          <p>
            Craft autonomous companions that mirror real people—captured with splats, grounded in memories, and warm enough to feel truly there.
            Perfect for study buddies, wellness guides, and any moment that needs a familiar face.
          </p>
          <div className={styles.heroActions}>
            <Link href="/create" className="btn btn-primary">Start creating</Link>
            <Link href="/auth/sign-up" className="btn">Create Gaia account</Link>
          </div>
          <ul className={styles.statList}>
            <li>
              <strong>120+</strong>
              <span>Lifelike companions in motion</span>
            </li>
            <li>
              <strong>45 min</strong>
              <span>Average time to meet your buddy</span>
            </li>
            <li>
              <strong>Global</strong>
              <span>Creators across 22 countries</span>
            </li>
          </ul>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <DeformOrb size={160} spin mode="gradient" />
            <div className={styles.visualOverlay}>
              <p>Realtime capture</p>
              <WaveLoader progress={0.65} width={280} height={90} background="rgba(255,255,255,0.06)" />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.highlights}>
        <div className={styles.sectionHeader}>
          <p>Why Gaia</p>
          <h2>Everything you need to ship believable avatars</h2>
        </div>
        <div className={styles.highlightGrid}>
          {highlightCards.map((card) => (
            <article key={card.title} className={styles.highlightCard}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

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

      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <p>Trusted by teams shipping immersive work</p>
          <h2>Field notes from early partners</h2>
        </div>
        <div className={styles.testimonialGrid}>
          {testimonials.map((t) => (
            <figure key={t.author} className={styles.testimonialCard}>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <strong>{t.author}</strong>
                <span>{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <p className={styles.betaTag}>Next up</p>
          <h2>Unlock self-serve capture and publishing.</h2>
          <p style={{ color: "rgba(255,255,255,0.8)" }}>
            Reserve your slot to access advanced capture tooling, batch publishing, and workspace administration.
          </p>
        </div>
        <div className={styles.ctaActions}>
          <Link href="/auth/sign-up" className="btn btn-primary">Join the beta</Link>
          <Link href="/auth/sign-in" className="btn" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
