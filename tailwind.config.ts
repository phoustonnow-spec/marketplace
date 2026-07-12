import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f1b16",
        cream: "#f6f2ea",
        sand: "#efe8dc",
        gold: "#a5813f",
        golddeep: "#7a5c2c",
        line: "#e3dbcb",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
