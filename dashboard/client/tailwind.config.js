/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // השורה הזו סופר קריטית! היא אומרת לו לסרוק את כל תיקיית src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}