/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      tablet: '481px',
      desktop: '1025px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          dark: '#0A84FF',
        },
        surface: {
          DEFAULT: '#FBFBF9',
          dark: '#131826',
        },
        canvas: {
          DEFAULT: '#F2F2F7',
          dark: '#0A0D16',
        },
        bubble: {
          agent: '#E6EBE7',
          'agent-dark': '#1F2922',
        },
        error: {
          DEFAULT: '#FF3B30',
          dark: '#FF453A',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      keyframes: {
        'message-in': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'dot-pulse': {
          '0%, 60%, 100%': { opacity: '0.3', transform: 'scale(0.85)' },
          '30%': { opacity: '1', transform: 'scale(1)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'message-in': 'message-in 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        'dot-pulse': 'dot-pulse 1.2s ease-in-out infinite',
        'pop-in': 'pop-in 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
