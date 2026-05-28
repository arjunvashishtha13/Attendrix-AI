/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        attendrix: {
          rose: '#e11d48',
          'rose-light': '#fb7185',
          'rose-dark': '#be123c',
          slate: '#0f172a',
          'slate-light': '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(15, 23, 42, 0.12)',
        'card-dark': '0 4px 24px -4px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
