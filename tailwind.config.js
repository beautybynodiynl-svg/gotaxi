/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "rgb(var(--color-night) / <alpha-value>)",
          2: "rgb(var(--color-night-2) / <alpha-value>)",
          3: "rgb(var(--color-night-3) / <alpha-value>)",
        },
        amber: {
          DEFAULT: "rgb(var(--color-amber) / <alpha-value>)",
          deep: "rgb(var(--color-amber-deep) / <alpha-value>)",
        },
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line-base) / 0.12)",
        "line-strong": "rgb(var(--color-line-base) / 0.22)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        pulse2: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.7)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulse2: "pulse2 1.8s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [
    // Custom variant zodat we components/afbeeldingen specifiek voor light mode
    // kunnen tonen/verbergen met bv. className="light:hidden" of "hidden light:block".
    function ({ addVariant }) {
      addVariant("light", ".light &");
    },
  ],
};
