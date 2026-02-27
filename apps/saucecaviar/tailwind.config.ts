import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C9A84C',        // Champagne Gold
        secondary: '#0A0A0A',      // Deep Black
        accent: '#F5F0E8',         // Ivory Cream
        highlight: '#722F37',      // Burgundy
        text: '#FAFAF7',           // Warm White
        surface: '#2D2D2D',        // Charcoal
        // Semantic aliases
        'caviar-gold': '#C9A84C',
        'caviar-black': '#0A0A0A',
        'caviar-cream': '#F5F0E8',
        'caviar-burgundy': '#722F37',
        'caviar-white': '#FAFAF7',
        'caviar-charcoal': '#2D2D2D',
        'caviar-gold-light': '#D4B965',
        'caviar-gold-dark': '#A88A3A',
      },
      fontFamily: {
        headline: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'DM Sans', 'sans-serif'],
        accent: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        shimmer: 'shimmer 2s infinite',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
        'ken-burns': 'kenBurns 20s ease-in-out infinite alternate',
        'page-flip': 'pageFlip 0.6s ease-in-out',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.1) translate(-2%, -1%)' },
        },
        pageFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(-180deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A84C 0%, #D4B965 50%, #A88A3A 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
        'gradient-cream': 'linear-gradient(180deg, #F5F0E8 0%, #EDE5D5 100%)',
        'gradient-burgundy': 'linear-gradient(135deg, #722F37 0%, #8B3A42 50%, #5A252D 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'gold': '0 0 20px rgba(201, 168, 76, 0.15)',
        'gold-lg': '0 0 40px rgba(201, 168, 76, 0.25)',
        'gold-glow': '0 0 60px rgba(201, 168, 76, 0.3)',
        'page': '0 0 30px rgba(0, 0, 0, 0.5)',
        'page-flip': '-5px 0 30px rgba(0, 0, 0, 0.3), 5px 0 30px rgba(0, 0, 0, 0.15)',
        'magazine': '0 25px 50px rgba(0, 0, 0, 0.6)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.25)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#FAFAF7',
            a: {
              color: '#C9A84C',
              '&:hover': { color: '#D4B965' },
            },
            h1: { fontFamily: 'Playfair Display, Georgia, serif', color: '#FAFAF7' },
            h2: { fontFamily: 'Playfair Display, Georgia, serif', color: '#FAFAF7' },
            h3: { fontFamily: 'Playfair Display, Georgia, serif', color: '#FAFAF7' },
            strong: { color: '#FAFAF7' },
            blockquote: {
              borderLeftColor: '#C9A84C',
              color: '#F5F0E8',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontStyle: 'italic',
            },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
