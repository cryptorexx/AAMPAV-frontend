/** @type {import('tailwindcss').Config} */
import path from 'path';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // <- Required for Tailwind to scan all your React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
