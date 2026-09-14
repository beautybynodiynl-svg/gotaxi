/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#10131C",
          2: "#171B27",
          3: "#1E2333",
        },
        amber: {
          DEFAULT: "#F6B93B",
          deep: "#D9930F",
        },
        text: "#F4F1E9",
        muted: "#A9AFC0",
        line: "rgba(244,241,233,0.12)",
        "line-strong": "rgba(244,241,233,0.22)",
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
  plugins: [],
};
