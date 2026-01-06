/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tokens de cor padronizados - iOS-like, suaves
        background: '#F9FAFB',
        'background-dark': '#0F172A', // slate-900
        surface: '#FFFFFF',
        'surface-dark': '#1E293B', // slate-800
        text: {
          primary: '#111827',
          'primary-dark': '#F1F5F9', // slate-100
          secondary: '#6B7280',
          'secondary-dark': '#94A3B8', // slate-400
        },
        blue: {
          primary: '#2563EB',
          hover: '#1D4ED8',
          soft: '#DBEAFE',
        },
        border: '#E5E7EB',
        'border-dark': '#334155', // slate-700
        error: '#DC2626',
        success: '#16A34A',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        // Tokens de borda consistentes
        xl: '0.75rem', // 12px
        '2xl': '1rem', // 16px - padrão para cards
        '3xl': '1.5rem', // 24px
      },
      boxShadow: {
        // Sombras suaves, iOS-like
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
      },
      maxWidth: {
        app: '960px', // 960px padrão
      },
      spacing: {
        // Espaçamentos consistentes (opcional, já temos os padrões do Tailwind)
      },
      transitionDuration: {
        // Durações de transição padronizadas
        150: '150ms',
        200: '200ms',
        300: '300ms',
        400: '400ms',
        500: '500ms',
      },
    },
  },
  plugins: [],
};
