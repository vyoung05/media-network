import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',         // Electric Violet
        secondary: '#0F0B2E',       // Deep Navy
        accent: '#06F5D6',          // Neon Cyan
        warm: '#FF6B35',            // Sunset Orange
        text: '#F8F8FF',            // Ghost White
        surface: '#1A1035',         // Dark Purple
        // Functional aliases
        'glow-violet': '#8B5CF6',
        'glow-navy': '#0F0B2E',
        'glow-cyan': '#06F5D6',
        'glow-orange': '#FF6B35',
        'glow-white': '#F8F8FF',
        'glow-purple': '#1A1035',
        'glow-deep': '#130E28',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        accent: ['Unbounded', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        shimmer: 'shimmer 2s infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'waveform': 'waveform 1s ease-in-out infinite',
        'gradient-x': 'gradientX 6s ease infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        waveform: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '20px' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glow-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #06F5D6 50%, #FF6B35 100%)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#F8F8FF',
            a: {
              color: '#06F5D6',
              '&:hover': {
                color: '#8B5CF6',
              },
            },
            h1: { fontFamily: 'Space Grotesk, sans-serif', color: '#F8F8FF' },
            h2: { fontFamily: 'Space Grotesk, sans-serif', color: '#F8F8FF' },
            h3: { fontFamily: 'Space Grotesk, sans-serif', color: '#F8F8FF' },
            strong: { color: '#F8F8FF' },
            blockquote: {
              borderLeftColor: '#8B5CF6',
              color: '#F8F8FF',
              opacity: 0.8,
            },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
