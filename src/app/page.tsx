import Link from "next/link";
import styles from "./page.module.css";
import {
  AVATARS_DEFAULT,
  AVATARS_COMMUNITY,
  DEFAULT_SPLAT_SRC,
  searchAmong,
  type Avatar,
} from "@/lib/avatars";
import MyAvatarsClient from "./_sections/MyAvatarsClient";
import HeroGreeter from "@/components/HeroGreeter";

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

  const playbooks = [
    {
      title: "Companion care",
      body: "Pair a photoreal face with memory prompts, mood tracking, and rituals that keep users grounded throughout the day.",
      highlights: ["Daily check-ins with warm recall", "Scriptable empathy cues for caregivers", "Integrations with journaling apps"],
    },
    {
      title: "Creative doubles",
      body: "Capture artists, hosts, or founders once—then remix wardrobe, lighting, and delivery to show up across launches and live streams.",
      highlights: ["Wardrobe + environment presets", "Multi-angle splat captures", "Stage-ready playback controls"],
    },
    {
      title: "On-demand guides",
      body: "Use avatars as coaches for onboarding, product support, or workshops. Blend procedural knowledge with a familiar presence.",
      highlights: ["Context-aware scenes", "Conversational scripting hooks", "Workspace governance + analytics"],
    },
    {
      title: "Live commerce hosts",
      body: "Spin up shoppable streams with a consistent photoreal host that can swap outfits, languages, or brands instantly.",
      highlights: ["Wardrobe + brand presets", "Realtime call-to-action overlays", "Localization packs for new regions"],
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
          <HeroGreeter src={DEFAULT_SPLAT_SRC} disabled />
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
          <p>Launch photoreal AI anywhere</p>
          <h2>Blueprints for your most requested companions</h2>
        </div>
        <div className={styles.testimonialGrid}>
          {playbooks.map((playbook) => (
            <article key={playbook.title} className={styles.testimonialCard}>
              <h3>{playbook.title}</h3>
              <p>{playbook.body}</p>
              <ul className={styles.playbookHighlights}>
                {playbook.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
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
          <Link href="/auth/sign-in" className="btn">
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
