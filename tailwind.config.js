/* global module */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A56DB',
        secondary: '#4B5563',
        tertiary: '#AD3B00',
        neutral: '#F9FAFB'
      }
    }
  },
  plugins: []
}
