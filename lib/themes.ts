// Color themes a seller can pick for their storefront. `accent` is the main
// color (buttons/prices), `accentDeep` is a darker shade for text.
export const THEMES: Record<
  string,
  { label: string; accent: string; accentDeep: string }
> = {
  gold: { label: "Gold", accent: "#a5813f", accentDeep: "#7a5c2c" },
  pink: { label: "Pink", accent: "#db5a9a", accentDeep: "#b23c78" },
  rose: { label: "Rose", accent: "#b0416b", accentDeep: "#872f52" },
  navy: { label: "Navy", accent: "#33507f", accentDeep: "#263c60" },
  forest: { label: "Forest", accent: "#2f6b46", accentDeep: "#245237" },
  charcoal: { label: "Charcoal", accent: "#4a4335", accentDeep: "#2b2820" },
  berry: { label: "Berry", accent: "#7b3f9e", accentDeep: "#5d2f79" },
};

export function themeAccent(theme?: string | null) {
  return THEMES[theme || "gold"] || THEMES.gold;
}
