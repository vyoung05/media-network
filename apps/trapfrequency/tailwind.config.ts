import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#39FF14',       // Frequency Green
        secondary: '#0D0D0D',     // Studio Black
        accent: '#FFB800',        // Amber
        cool: '#4361EE',          // Waveform Blue
        neutral: '#E0E0E0',       // Light Gray
        surface: '#1A1A2E',       // Mixer Dark
        // Functional aliases
        'freq-green': '#39FF14',
        'studio-black': '#0D0D0D',
        'amber': '#FFB800',
        'waveform-blue': '#4361EE',
        'mixer-dark': '#1A1A2E',
        'light-gray': '#E0E0E0',
      },
      fontFamily: {
        headline: ['Orbitron', 'sans-serif'],
        body: ['Rubik', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'eq-bar-1': 'eqBar1 0.8s ease-in-out infinite',
        'eq-bar-2': 'eqBar2 0.6s ease-in-out infinite 0.1s',
        'eq-bar-3': 'eqBar3 0.9s ease-in-out infinite 0.2s',
        'eq-bar-4': 'eqBar4 0.7s ease-in-out infinite 0.3s',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(57, 255, 20, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(57, 255, 20, 0.6), 0 0 40px rgba(57, 255, 20, 0.2)' },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
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
        glow: {
          '0%': { textShadow: '0 0 5px rgba(57, 255, 20, 0.5)' },
          '100%': { textShadow: '0 0 20px rgba(57, 255, 20, 0.8), 0 0 40px rgba(57, 255, 20, 0.3)' },
        },
        eqBar1: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '24px' },
        },
        eqBar2: {
          '0%, 100%': { height: '16px' },
          '50%': { height: '8px' },
        },
        eqBar3: {
          '0%, 100%': { height: '12px' },
          '50%': { height: '28px' },
        },
        eqBar4: {
          '0%, 100%': { height: '20px' },
          '50%': { height: '12px' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(57, 255, 20, 0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(57, 255, 20, 0.03) 1px, transparent 1px)`,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#E0E0E0',
            a: {
              color: '#39FF14',
              '&:hover': {
                color: '#FFB800',
              },
            },
            h1: { fontFamily: 'Orbitron, sans-serif', color: '#FFFFFF' },
            h2: { fontFamily: 'Orbitron, sans-serif', color: '#FFFFFF' },
            h3: { fontFamily: 'Orbitron, sans-serif', color: '#FFFFFF' },
            strong: { color: '#FFFFFF' },
            code: { fontFamily: 'Fira Code, monospace', color: '#39FF14' },
            blockquote: {
              borderLeftColor: '#39FF14',
              color: '#E0E0E0',
            },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
