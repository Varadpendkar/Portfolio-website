/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0A1929",
        "primary-alt": "#0D1117",
        accent: "#00D9FF",
        secondary: "#FF6B35",
        success: "#00E676",
        warning: "#FFB800",
      },
      fontFamily: {
        heading: ["JetBrains Mono", "monospace"],
        body: ["Inter", "sans-serif"],
        code: ["Fira Code", "monospace"],
      },
      boxShadow: {
        neon: "0 0 30px rgba(0, 217, 255, 0.3)",
        glass: "0 10px 40px rgba(0, 0, 0, 0.35)",
      },
      animation: {
        glow: "glow 2.5s ease-in-out infinite alternate",
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          from: { boxShadow: "0 0 8px rgba(0, 217, 255, 0.25)" },
          to: { boxShadow: "0 0 24px rgba(0, 217, 255, 0.55)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
