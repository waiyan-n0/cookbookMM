/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shrink: {
          '0%': {width: '100%'},
          '100%': {width: '100%'},
        }
      }
    },
  },
  plugins: [],
}

