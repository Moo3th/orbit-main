/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ORBIT Brand Colors (Verified from PDF)
        primary: '#7A1E2E', // Burgundy - Main brand color
        secondary: '#E8DCCB', // Beige - Complementary color
        neutral: '#A7A9AC', // Cool Gray - Balance color
        // Standard colors
        black: '#161616', // ORBIT Black
        white: '#FFFFFF',
      },
      fontFamily: {
        // ORBIT Brand Fonts - IBM Plex Sans for both English and Arabic
        sans: ['var(--font-ibm-plex)', 'IBM Plex Sans', 'sans-serif'], // Default - English text (body, headings, UI)
        heading: ['var(--font-ibm-plex)', 'IBM Plex Sans', 'sans-serif'], // Headings (h1-h6) - English
        'ibm-plex': ['var(--font-ibm-plex)', 'IBM Plex Sans', 'sans-serif'], // IBM Plex utility - English
        'ibm-plex-arabic': ['var(--font-ibm-plex-arabic)', 'IBM Plex Sans Arabic', 'var(--font-ibm-plex)', 'sans-serif'], // IBM Plex utility - Arabic/RTL
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.02em',
        wider: '0.03em',
        widest: '0.05em',
      },
      fontSize: {
        'display-xl': ['5.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

