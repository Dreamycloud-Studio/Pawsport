/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
          },
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
          },
          purple: {
            50: '#faf5ff',
            200: '#e9d5ff',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
          },
          yellow: {
            50: '#fefce8',
            400: '#facc15',
          },
          blue: {
            50: '#eff6ff',
          },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #fb923c, #f472b6)',
        'gradient-hero': 'linear-gradient(to bottom right, #fdf2f8, #fed7aa, #fefce8)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

