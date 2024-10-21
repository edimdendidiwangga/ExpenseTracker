/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        background: '#F3F4F6',
        inputBg: '#E5E7EB',
      },
    },
  },
  plugins: [],
};
