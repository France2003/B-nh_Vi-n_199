/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hospital: {
          50: '#f0f7fc',
          100: '#dceef9',
          200: '#b9def3',
          300: '#8fcde9',
          400: '#5ab9dd',
          500: '#35a4d0',
          600: '#2a7bb7',
          700: '#1e5b8d',
          800: '#0d4a73',
          900: '#081f2e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
