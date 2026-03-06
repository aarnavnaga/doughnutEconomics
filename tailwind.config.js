/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        coral: '#FF6B6B',
        mint: '#4ECDC4',
        sunny: '#FFE66D',
        lavender: '#A8D8EA',
        peach: '#FFB5A7',
        sky: '#95E1D3',
        grape: '#C7CEEA',
        honey: '#FFD93D',
      },
    },
  },
  plugins: [],
}
