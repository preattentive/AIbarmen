/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff8f0',
          100: '#ffedda',
          200: '#ffd8b4',
          300: '#ffbc80',
          400: '#ff9540',
          500: '#ff7510',
          600: '#e85c00',
          700: '#c04600',
          800: '#9a3800',
          900: '#7d2e00',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
