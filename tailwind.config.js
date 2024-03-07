module.exports = {
  mode: "jit",
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    darkMode: "selector",
    extend: {
      colors: {
        dark: "#101010",
        "dark-sub": "#808080",
        "dark-main": "#D3D3D3",
        "dark-hover": "#1B1B1B",
        "dark-box-border": "#292929",
        "dark-box-bg": "#1B1B1B40",
        "dark-active": "#2B2B2B",
        // "dark-primary": "#A591FF",
        "dark-primary": "#F7B32B", // yellow
      },
      fontFamily: {
        charter: ["Charter"],
      },
    },
  },
  plugins: [],
};
