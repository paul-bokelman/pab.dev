/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // warm sepia ramp — replaces tailwind's neutral gray entirely
        gray: {
          100: "#fef8f2",
          150: "#f6f0eb",
          200: "#f6ece4",
          250: "#e9dfd7",
          300: "#cfc3b9",
          400: "#b7a89b",
          500: "#948475",
          600: "#6c6158",
          700: "#3b3229",
          800: "#2e2821",
          850: "#28231f",
          900: "#231e1a",
          950: "#13110f",
        },
        yellow: { 500: "#ba9659", 600: "#8e7347" },
        orange: { 300: "#f1b798", 400: "#e89068", 500: "#f1733d" },
        red: { 500: "#b3594f" },
        green: { 500: "#778463" },
        blue: { 400: "#8e9abe", 500: "#647095" },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        fancy: ["var(--font-fancy)", "ui-monospace", "monospace"],
        handwritten: ["var(--font-handwritten)", "cursive"],
      },
      fontSize: {
        // base is 15.5px, not 16
        xs: ["12.1px", { lineHeight: "1.3333" }],
        sm: ["13.7px", { lineHeight: "1.4286" }],
        base: ["15.5px", { lineHeight: "1.5" }],
        lg: ["18.5px", { lineHeight: "1.5556" }],
        xl: ["22.4px", { lineHeight: "1.4" }],
        "2xl": ["28.5px", { lineHeight: "1.3333" }],
        "3xl": ["36.4px", { lineHeight: "1.2" }],
        "4xl": ["44.5px", { lineHeight: "1.1111" }],
      },
      maxWidth: {
        xl: "36rem",
        "5xl": "64rem",
      },
      transitionTimingFunction: {
        "circ-out": "cubic-bezier(0.075, 0.82, 0.165, 1)",
      },
      spacing: {
        4.25: "1.0625rem",
        4.5: "1.125rem",
      },
    },
  },
  plugins: [],
};
