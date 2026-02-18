/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#0f8a2d',
          dark: '#0a6b22',
          light: '#e9f7ef',
          accent: '#1db954',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(135deg, #0f8a2d 0%, #1db954 100%)',
      },
    },
  },
  plugins: [],
}