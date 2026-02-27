import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E63946',      // Signal Red
        secondary: '#111111',    // Ink Black
        accent: '#1DA1F2',       // Electric Blue
        neutral: '#8D99AE',      // Steel Gray
        surface: '#1B1B2F',      // Dark Slate
        // Functional
        'wire-red': '#E63946',
        'wire-black': '#111111',
        'wire-blue': '#1DA1F2',
        'wire-gray': '#8D99AE',
        'wire-slate': '#1B1B2F',
      },
      fontFamily: {
        headline: ['Archivo Black', 'sans-serif'],
        body: ['Source Sans Pro', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#FFFFFF',
            a: {
              color: '#1DA1F2',
              '&:hover': {
                color: '#E63946',
              },
            },
            h1: { fontFamily: 'Archivo Black, sans-serif' },
            h2: { fontFamily: 'Archivo Black, sans-serif' },
            h3: { fontFamily: 'Archivo Black, sans-serif' },
            strong: { color: '#FFFFFF' },
            blockquote: {
              borderLeftColor: '#E63946',
              color: '#8D99AE',
            },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
