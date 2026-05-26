/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        head: ['Poppins', 'sans-serif'],
      },
      colors: {
        orange: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        blue: {
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        },
        surface: {
          light: '#f9f9fb',
          dark: '#0a0a0f',
        },
        text: {
          light: '#0f0f14',
          dark: '#f0f0f5',
        },
        muted: '#6b7280',
        border: {
          light: '#e5e7eb',
          dark: 'rgba(255,255,255,0.07)',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}