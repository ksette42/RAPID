/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        rapid: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5bafd",
          400: "#8196fa",
          500: "#6172f4",
          600: "#4f52e8",
          700: "#4240cf",
          800: "#3737a7",
          900: "#313584",
          950: "#1e1e4f",
        },
      },
    },
  },
  plugins: [],
};
