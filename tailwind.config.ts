import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        openai: "#10a37f",
        anthropic: "#5436DA",
        meta: "#0668E1",
        google: "#4285f4",
        deepseek: "#2D3748",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "color-shift": {
          "0%": { backgroundColor: "#22c55e" },
          "50%": { backgroundColor: "#eab308" },
          "100%": { backgroundColor: "#ef4444" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "color-shift": "color-shift 60s linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
