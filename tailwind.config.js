/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './index.tsx', './components/**/*.{ts,tsx}', './services/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: '#0F766E', // Teal 700
        secondary: '#F59E0B', // Amber 500
      },
    },
  },
  plugins: [],
};
