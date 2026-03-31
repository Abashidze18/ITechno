/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      fontFamily: {
        lgv: ['var(--font-lgv)', 'sans-serif'],
        firaGo400: ['var(--font-firaGo-400)', 'sans-serif'],
        firaGo600: ['var(--font-firaGo-600)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
