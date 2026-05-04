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
        sage: {
          50: "#f4f7f4",
          100: "#e3ece3",
          200: "#c7d9c7",
          300: "#9dbf9d",
          400: "#6e9f6e",
          500: "#4d824d",
          600: "#3a673a",
          700: "#2f522f",
          800: "#274227",
          900: "#213621",
        },
        warm: {
          50: "#faf8f5",
          100: "#f3ede4",
          200: "#e8daca",
          300: "#d8c3a5",
          400: "#c4a47c",
          500: "#b48a5e",
          600: "#9f7350",
          700: "#855e43",
          800: "#6d4e3a",
          900: "#5a4031",
        },
        slate: {
          750: "#2d3a4a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
