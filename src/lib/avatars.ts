export type Avatar = {
  id: string;
  name: string;
  preview?: string;
  tags?: string[];
  file?: string;
  hasSplat?: boolean;
};

const PERSON_PREVIEWS: Record<string, string> = {
  claire: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  nora: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
  harper: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
  david: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80",
  aria: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
  milo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  akira: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  rhea: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
  zeke: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
};

const portrait = (id: string) =>
  PERSON_PREVIEWS[id] ??
  `https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80&sat=-15&sig=${encodeURIComponent(
    id,
  )}`;
const TRUCK_PREVIEW =
  "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=900&q=80";
export const DEFAULT_SPLAT_SRC = "/splats/point_cloud.ply";

/** Default avatars shown on the homepage */
export const AVATARS_DEFAULT: Record<string, Avatar> = {
  claire: { id: "claire", name: "Claire", preview: portrait("claire"), tags: ["Study", "Calm"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  nora:   { id: "nora",   name: "Nora",   preview: portrait("nora"),   tags: ["Tech", "Witty"],  file: DEFAULT_SPLAT_SRC, hasSplat: true },
  harper: { id: "harper", name: "Harper", preview: portrait("harper"), tags: ["Coach", "Empath"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  david:  { id: "david",  name: "David",  preview: portrait("david"),  tags: ["Mentor", "Research"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  aria:   { id: "aria",   name: "Aria",   preview: portrait("aria"),   tags: ["Creative", "Design"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  milo:   { id: "milo",   name: "Milo",   preview: portrait("milo"),   tags: ["Science", "Curious"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
};

/** Seed community */
export const AVATARS_COMMUNITY: Record<string, Avatar> = {
  akira: { id: "akira", name: "Akira", preview: portrait("akira"), tags: ["Anime", "Creative"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  rhea:  { id: "rhea",  name: "Rhea",  preview: portrait("rhea"),  tags: ["Philosophy", "Debate"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  zeke:  { id: "zeke",  name: "Zeke",  preview: portrait("zeke"),  tags: ["Drama", "Romance"],  file: DEFAULT_SPLAT_SRC, hasSplat: true },
  truck: { id: "truck", name: "Studio Freight Rig", preview: TRUCK_PREVIEW, tags: ["Vehicle", "Capture"], file: "/splats/truck.ply", hasSplat: true },
};

/** Legacy merged export so older imports still compile */
export const AVATARS: Record<string, Avatar> = { ...AVATARS_DEFAULT, ...AVATARS_COMMUNITY };

export function searchAmong(q: string, sets: Record<string, Avatar>[]): [string, Avatar][] {
  const query = q.trim().toLowerCase();
  const merged = Object.entries(Object.assign({}, ...sets));
  if (!query) return merged;
  return merged.filter(([, avatar]) =>
    avatar.name.toLowerCase().includes(query) ||
    (avatar.tags || []).some((tag) => tag.toLowerCase().includes(query))
  );
}
