import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sd: "426px",
      },
      fontFamily: {
        salsa: "var(--font-1)",
        roboto: "var(--font-2)",
        bangla: "var(--font-3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
