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
        primary: {
          DEFAULT: '#7A1E2E',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: '#E8DCCB',
          foreground: 'var(--secondary-foreground)',
        },
        neutral: '#A7A9AC',
        // Standard colors
        black: '#161616',
        white: '#FFFFFF',
        // shadcn/ui CSS variable-based colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: {
          DEFAULT: 'var(--input)',
          background: 'var(--background)',
        },
        ring: 'var(--ring)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
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

