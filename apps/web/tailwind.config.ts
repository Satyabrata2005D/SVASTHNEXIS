import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'warm-ivory': '#F8F7F3',
        'warm-light-grey': '#F1F0EC',
        'soft-grey': '#E7E5E0',
        coral: {
          DEFAULT: '#FF5B47',
          deep: '#C94132',
          soft: '#FCEAE7',
          glow: 'rgba(255, 91, 71, 0.4)',
        },
        navy: {
          DEFAULT: '#171C2C',
          light: '#252B3B',
          dark: '#111522',
        },
        slate: {
          DEFAULT: '#6B7280',
          light: '#93A2B9',
        },
        emerald: {
          DEFAULT: '#10B981',
          soft: '#EAF8F1',
          glow: 'rgba(16, 185, 129, 0.4)',
        },
        amber: {
          DEFAULT: '#FBC024',
          soft: '#FEF8E8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(110deg, #F9EBE8 0%, #F4EEF0 52%, #EEF0F4 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(12,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,85%,65%,0.1) 0px, transparent 50%)',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.375rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(23, 28, 44, 0.04), 0 4px 12px rgba(23, 28, 44, 0.02)',
        popover: '0 4px 6px -1px rgba(23, 28, 44, 0.06), 0 10px 24px -3px rgba(23, 28, 44, 0.08)',
        modal: '0 20px 32px -4px rgba(23, 28, 44, 0.16)',
        'glow-coral': '0 0 30px -5px rgba(255, 91, 71, 0.35)',
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.35)',
        'glow-navy': '0 0 30px -5px rgba(23, 28, 44, 0.25)',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        ecg: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        radar: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
      },
      animation: {
        blob: 'blob 10s infinite cubic-bezier(0.4, 0, 0.2, 1)',
        'blob-delayed': 'blob 12s infinite 3s cubic-bezier(0.4, 0, 0.2, 1)',
        float: 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        ecg: 'ecg 3s linear infinite',
        radar: 'radar 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
