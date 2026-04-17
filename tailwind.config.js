/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        sidebar: {
          DEFAULT: '#405189',
          dark: '#3a4a7e',
          hover: 'rgba(255,255,255,0.08)',
          active: 'rgba(255,255,255,0.15)',
          border: 'rgba(255,255,255,0.07)',
          text: 'rgba(255,255,255,0.85)',
          muted: 'rgba(255,255,255,0.45)',
          icon: 'rgba(255,255,255,0.70)',
        },
        primary: {
          50: '#eef0f8',
          100: '#d5d9ee',
          200: '#b3bade',
          300: '#8a96ca',
          400: '#6878ba',
          500: '#4f5fa8',
          600: '#405189',
          700: '#364475',
          800: '#2d3861',
          900: '#232c4e',
          DEFAULT: '#405189',
        },
        teal: {
          DEFAULT: '#405189',
          light: '#4a5fa0',
          accent: '#5568b0',
        },
        surface: '#F8FAFC',
        'card-bg': '#FFFFFF',
        border: '#E2E8F0',
        'text-primary': '#1E293B',
        'text-secondary': '#64748B',
        'text-muted': '#94A3B8',
        success: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
          text: '#15803D',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
          text: '#B45309',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
          text: '#B91C1C',
        },
        info: {
          DEFAULT: '#0EA5E9',
          light: '#E0F2FE',
          text: '#0369A1',
        },
      },
      borderRadius: {
        'card': '10px',
        'badge': '6px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-md': '0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.08)',
        'sidebar': '4px 0 24px rgba(0,0,0,0.15)',
        'topbar': '0 1px 0 #E2E8F0, 0 2px 8px rgba(0,0,0,0.04)',
        'dropdown': '0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
        'modal': '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
    },
  },
  plugins: [],
};