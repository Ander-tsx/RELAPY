import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:      "#0d0d0d",
        surface: "#141414",
        border:  "rgba(110,231,183,0.15)",
        fg:      "#e8e8e8",
        muted:   "#6b7280",
        accent:  "#6ee7b7",
        accent2: "#818cf8",
      },
      fontFamily: {
        mono:  ["JetBrains Mono", "monospace"],
        sans:  ["Inter", "sans-serif"],
      },
      animation: {
        "fade-in":   "fadeIn 0.4s ease-in-out",
        "slide-up":  "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
