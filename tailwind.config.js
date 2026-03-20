/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          900: '#022D1E', // Kept for Admin or legacy but overridden
          950: '#011A11',
        },
        maroon: {
          800: '#9B1B30',
          900: '#7A102E', // Deep Crimson / Kumkum
          950: '#4A081B', // Darkest Maroon
        },
        gold: {
          400: '#E5C058',
          500: '#D4AF37', // Champagne Gold
          600: '#B08D2B',
        },
        cream: {
          50: '#FFFDF5', // High-end handmade off-white paper
          100: '#FFF6E5', // Warm cream base
          200: '#F5E6CC', // Deep paper texture
        },
        ivory: '#FFFFF0'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
