/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: {
          primary: '#111827',
          secondary: '#6B7280',
        },
        blue: {
          primary: '#2563EB',
          hover: '#1D4ED8',
          soft: '#DBEAFE',
        },
        border: '#E5E7EB',
        error: '#DC2626',
        success: '#16A34A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

