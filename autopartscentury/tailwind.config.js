/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        brand: '#ff6700',
        'brand-dark': '#e65c00',
        ink: '#333333',
        muted: '#757575',
        page: '#f5f5f5',
      },
      maxWidth: {
        wrap: '1226px',
      },
    },
  },
  plugins: [],
}
