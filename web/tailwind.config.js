/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C8102E',
          light: '#E53E3E',
          dark: '#9B2C2C',
        },
        secondary: {
          DEFAULT: '#D4AF37',
          light: '#ECC94B',
          dark: '#B7791F',
        }
      }
    },
  },
  plugins: [],
}
