/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1220',
          800: '#111A2E',
          700: '#1A263D',
        },
        cyber: {
          blue: '#2563EB',
          cyan: '#06B6D4',
        },
        gold: {
          500: '#D4AF37',
          600: '#C9A227',
        },
        appBg: '#F8FAFC',
        appText: '#111827',
        success: '#16A34A',
        error: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
