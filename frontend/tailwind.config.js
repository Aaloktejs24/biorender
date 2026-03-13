/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0c0c0e",
        surface: "#1a1a1f",
        primary: "#6366f1",
        secondary: "#a855f7",
      },
    },
  },
  plugins: [],
}
