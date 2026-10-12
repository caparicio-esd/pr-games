/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fun: {
          purple: '#7C3AED',
          pink: '#EC4899',
          yellow: '#FBBF24',
          green: '#10B981',
          blue: '#3B82F6',
          orange: '#F97316'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
