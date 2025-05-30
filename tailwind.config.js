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
        'quantify': ['Quantify', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#1a1a1a',
          text: '#ffffff',
          primary: '#3b82f6',
          secondary: '#6b7280',
        }
      }
    },
  },
  plugins: [],
}

