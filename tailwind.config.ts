import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "sans-serif"],
        accent: ["var(--font-accent)", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        fg: {
          DEFAULT: "var(--fg)",
          muted: "var(--fg-muted)",
        },
        line: "var(--line)",
        accent: {
          DEFAULT: "var(--accent)",
          2: "var(--accent-2)",
        },
        "on-accent": "var(--on-accent)",
        block: {
          1: "var(--block-1)",
          2: "var(--block-2)",
          3: "var(--block-3)",
          4: "var(--block-4)",
        },
        "on-block": {
          1: "var(--on-block-1)",
          2: "var(--on-block-2)",
          3: "var(--on-block-3)",
          4: "var(--on-block-4)",
        },
      },
      boxShadow: {
        hairline: "0 0 0 1px var(--line)",
        tactile: "0 2px 0 0 var(--line), 0 24px 40px -28px rgba(0, 0, 0, 0.12)",
        "tactile-lg": "0 4px 0 0 var(--line), 0 32px 50px -24px rgba(0, 0, 0, 0.2)",
        stamp: "0 0 0 2px currentColor, 0 8px 16px -4px rgba(0, 0, 0, 0.25)",
      },
      borderRadius: {
        card: "28px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;
