// Color themes a seller can pick for their storefront. `accent` is the main
// color (banner/buttons/prices), `accentDeep` a darker shade, `bg` a soft page
// background tint.
export const THEMES: Record<
  string,
  { label: string; accent: string; accentDeep: string; bg: string }
> = {
  gold: { label: "Gold", accent: "#a5813f", accentDeep: "#7a5c2c", bg: "#faf6ec" },
  pink: { label: "Pink", accent: "#db5a9a", accentDeep: "#b23c78", bg: "#fdeef5" },
  rose: { label: "Rose", accent: "#b0416b", accentDeep: "#872f52", bg: "#fbecf1" },
  navy: { label: "Navy", accent: "#33507f", accentDeep: "#263c60", bg: "#eef1f8" },
  forest: { label: "Forest", accent: "#2f6b46", accentDeep: "#245237", bg: "#eef5ef" },
  charcoal: { label: "Charcoal", accent: "#4a4335", accentDeep: "#2b2820", bg: "#f3f1ed" },
  berry: { label: "Berry", accent: "#7b3f9e", accentDeep: "#5d2f79", bg: "#f6eefb" },
};

export function themeAccent(theme?: string | null) {
  return THEMES[theme || "gold"] || THEMES.gold;
}
