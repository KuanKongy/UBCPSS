import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pss: {
          50:  '#E8F4FA',
          100: '#D0E8F5',
          200: '#B8D4EC',
          300: '#A4C4E0',
          400: '#7AAFC8',
          500: '#4A7A9B',
          600: '#2E5F82',
          700: '#1A3A5C',
          800: '#0F2A48',
          900: '#0F1E2E',
        },
        teal:  '#7DD4CC',
        gold:  '#F0C060',
        sblue: '#6BB8D4',
      },
      fontFamily: {
        syne: ['Syne Variable', 'Syne', 'Impact', 'Arial Black', 'sans-serif'],
        sans: ['DM Sans Variable', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        spk: {
          '0%,100%': { opacity: '0.9', transform: 'scale(1) rotate(0deg)' },
          '50%':      { opacity: '0.35', transform: 'scale(.65) rotate(18deg)' },
        },
        tltr: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        trtl: {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        eyePulse: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '0.5', transform: 'scale(1.4)' },
        },
        accordionDown: {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        accordionUp: {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
      },
      animation: {
        sparkle:          'spk 2.5s ease-in-out infinite',
        'ticker-ltr':     'tltr 35s linear infinite',
        'ticker-rtl':     'trtl 40s linear infinite',
        'eye-pulse':      'eyePulse 2s ease-in-out infinite',
        'accordion-down': 'accordionDown 250ms ease-out',
        'accordion-up':   'accordionUp 250ms ease-in',
      },
    },
  },
  plugins: [],
}

export default config
