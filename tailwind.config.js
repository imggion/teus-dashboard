/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand color (keeping user's existing purple)
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Main brand color
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },

        // Dark theme backgrounds
        'dark-bg': '#0f0f0f',
        'dark-card': '#1e1e1e',
        'dark-elevated': '#2a2a2a',
        'dark-hover': '#3a3a3a',

        // Text colors
        'light-text': '#f8fafc',
        'secondary-text': '#e2e8f0',
        'muted-text': '#94a3b8',
        'disabled-text': '#64748b',

        // Border colors
        'border-default': '#374151',
        'border-light': '#4b5563',
        'border-subtle': '#1f2937',

        // Trading/Financial specific colors
        trading: {
          // Buy/Success states
          buy: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e', // Main buy/success color
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },

          // Sell/Danger states
          sell: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444', // Main sell/danger color
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },

          // Neutral/Hold states
          neutral: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b', // Main neutral color
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
        },

        // Crypto/Asset specific colors
        crypto: {
          btc: '#f7931a', // Bitcoin orange
          eth: '#627eea', // Ethereum blue
          bnb: '#f3ba2f', // Binance yellow
          sol: '#9945ff', // Solana purple
          ada: '#0033ad', // Cardano blue
          dot: '#e6007a', // Polkadot pink
        },

        // Status colors
        status: {
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },

        // Chart colors for financial data visualization
        chart: {
          bullish: '#22c55e', // Green for up/positive
          bearish: '#ef4444', // Red for down/negative
          neutral: '#64748b', // Gray for neutral
          volume: '#8b5cf6', // Purple for volume bars
          grid: '#374151', // Grid lines
          axis: '#6b7280', // Axis text
        },
      },

      // Typography scale
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Monaco',
          'Cascadia Code',
          'Roboto Mono',
          'Courier New',
          'monospace',
        ],
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },

      // Spacing scale
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },

      // Border radius scale
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        default: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        full: '9999px',
      },

      // Shadow scale for depth
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        primary: '0 4px 14px 0 rgba(168, 85, 247, 0.2)',
        'primary-hover': '0 8px 25px 0 rgba(168, 85, 247, 0.3)',
        'trading-buy': '0 4px 14px 0 rgba(34, 197, 94, 0.2)',
        'trading-sell': '0 4px 14px 0 rgba(239, 68, 68, 0.2)',
      },

      // Animation utilities
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-in-out',
        'fade-in-down': 'fadeInDown 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-in-out',
        'slide-in-left': 'slideInLeft 0.3s ease-in-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'chart-bar': 'chartBar 0.8s ease-out',
        'price-up': 'priceUp 0.6s ease-out',
        'price-down': 'priceDown 0.6s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 0 0 rgba(168, 85, 247, 0.4)' },
          '100%': { boxShadow: '0 0 0 20px rgba(168, 85, 247, 0)' },
        },
        chartBar: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
        priceUp: {
          '0%': { color: '#22c55e', transform: 'scale(1)' },
          '50%': { color: '#16a34a', transform: 'scale(1.05)' },
          '100%': { color: '#22c55e', transform: 'scale(1)' },
        },
        priceDown: {
          '0%': { color: '#ef4444', transform: 'scale(1)' },
          '50%': { color: '#dc2626', transform: 'scale(1.05)' },
          '100%': { color: '#ef4444', transform: 'scale(1)' },
        },
      },

      // Backdrop blur utilities
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}
