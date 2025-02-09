/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          1: "#ff9900",
          2: "#f57d00",
        },
        light: {
          1: "#f5f5f5",
          2: "#b0c0c7",
          3: "#e3f2fd",
        },
        dark: {
          1: "#212121",
          2: "#263238",
          3: "#455a64",
        }
      },
    },
  },
  plugins: [],
}
