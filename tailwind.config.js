/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080B14',
        surface: '#0F1420',
        border: '#1A2035',
        accent: '#FF6B35',
        violet: '#C084FC',
        cream: '#F8F4EF',
        muted: '#6B7280',
        lightbg: '#F5F1EC',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
