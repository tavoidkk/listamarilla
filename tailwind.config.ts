import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease',
        'float-y': 'floatY 4s ease-in-out infinite',
        'pulse-yellow': 'pulseYellow 2s ease-in-out infinite',
        'spin-slow': 'spin 0.7s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
        'slide-right': 'slideRight 4s linear infinite',
        'flash': 'flash 2s ease-in-out infinite',
        'flash-vertical': 'flashVertical 2.5s ease-in-out infinite',
        'line-shoot-h': 'lineShootH 4s linear infinite',
        'line-shoot-v': 'lineShootV 5s linear infinite',
        'line-sweep': 'lineSweep 6s linear infinite',
        'dash-flow': 'dashFlow 1.2s linear infinite',
        'badge-pulse': 'badgePulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseYellow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(250 204 21 / 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgb(250 204 21 / 0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateX(calc(100vw + 100px))', opacity: '0' },
        },
        flash: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        flashVertical: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        lineShootH: {
          '0%': { transform: 'translateX(-200px)' },
          '100%': { transform: 'translateX(calc(100vw + 200px))' },
        },
        lineShootV: {
          '0%': { transform: 'translateY(-200px)' },
          '100%': { transform: 'translateY(calc(100vh + 200px))' },
        },
        lineSweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        dashFlow: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-40' },
        },
        badgePulse: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgb(251 191 36 / 0)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 6px rgb(251 191 36 / 0.15)' },
        },
      },
    },
  },
  plugins: [],
}

export default config