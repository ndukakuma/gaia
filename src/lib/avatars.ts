export type Avatar = {
  id: string;
  name: string;
  preview?: string;
  tags?: string[];
  file?: string;
  hasSplat?: boolean;
};

const pic = (id: string) => `https://picsum.photos/seed/${encodeURIComponent(id)}/800/600`;
export const DEFAULT_SPLAT_SRC = "/splats/point_cloud.ply";

/** Default avatars shown on the homepage */
export const AVATARS_DEFAULT: Record<string, Avatar> = {
  claire: { id: "claire", name: "Claire", preview: pic("claire"), tags: ["Study", "Calm"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  nora:   { id: "nora",   name: "Nora",   preview: pic("nora"),   tags: ["Tech", "Witty"],  file: DEFAULT_SPLAT_SRC, hasSplat: true },
  harper: { id: "harper", name: "Harper", preview: pic("harper"), tags: ["Coach", "Empath"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  david:  { id: "david",  name: "David",  preview: pic("david"),  tags: ["Mentor", "Research"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  aria:   { id: "aria",   name: "Aria",   preview: pic("aria"),   tags: ["Creative", "Design"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  milo:   { id: "milo",   name: "Milo",   preview: pic("milo"),   tags: ["Science", "Curious"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
};

/** Seed community */
export const AVATARS_COMMUNITY: Record<string, Avatar> = {
  akira: { id: "akira", name: "Akira", preview: pic("akira"), tags: ["Anime", "Creative"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  rhea:  { id: "rhea",  name: "Rhea",  preview: pic("rhea"),  tags: ["Philosophy", "Debate"], file: DEFAULT_SPLAT_SRC, hasSplat: true },
  zeke:  { id: "zeke",  name: "Zeke",  preview: pic("zeke"),  tags: ["Drama", "Romance"],  file: DEFAULT_SPLAT_SRC, hasSplat: true },
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
