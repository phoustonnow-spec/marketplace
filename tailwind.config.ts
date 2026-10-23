import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Blush-and-rose palette. The names are historical (this used to be a
        // gold theme) — kept so every existing class picks up the new colors.
        ink: "#3a2230",
        cream: "#fff2f6",
        sand: "#fbe4ec",
        gold: "#e0527d",
        golddeep: "#c43e6b",
        line: "#f6dde5",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
