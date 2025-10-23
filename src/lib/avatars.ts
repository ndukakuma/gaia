export type Avatar = {
  id: string;
  name: string;
  preview?: string;
  tags?: string[];
};

const pic = (id: string) => `https://picsum.photos/seed/${encodeURIComponent(id)}/800/600`;

/** Default avatars shown on the homepage */
export const AVATARS_DEFAULT: Record<string, Avatar> = {
  claire: { id: "claire", name: "Claire", preview: pic("claire"), tags: ["Study", "Calm"] },
  nora:   { id: "nora",   name: "Nora",   preview: pic("nora"),   tags: ["Tech", "Witty"] },
  harper: { id: "harper", name: "Harper", preview: pic("harper"), tags: ["Coach", "Empath"] },
  david:  { id: "david",  name: "David",  preview: pic("david"),  tags: ["Mentor", "Research"] },
};

/** Seed community */
export const AVATARS_COMMUNITY: Record<string, Avatar> = {
  akira: { id: "akira", name: "Akira", preview: pic("akira"), tags: ["Anime", "Creative"] },
  rhea:  { id: "rhea",  name: "Rhea",  preview: pic("rhea"),  tags: ["Philosophy", "Debate"] },
  zeke:  { id: "zeke",  name: "Zeke",  preview: pic("zeke"),  tags: ["Drama", "Romance"] },
};

/** Legacy merged export so older imports still compile */
export const AVATARS: Record<string, Avatar> = { ...AVATARS_DEFAULT, ...AVATARS_COMMUNITY };

export function searchAmong(q: string, sets: Record<string, Avatar>[]): [string, Avatar][] {
  const query = q.trim().toLowerCase();
  const merged = Object.entries(Object.assign({}, ...sets));
  if (!query) return merged;
  return merged.filter(([_, a]) =>
    a.name.toLowerCase().includes(query) ||
    (a.tags || []).some(t => t.toLowerCase().includes(query))
  );
}
