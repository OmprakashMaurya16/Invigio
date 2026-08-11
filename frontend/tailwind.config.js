/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: '#2563eb',
          50: '#dbe1ff',
          100: '#c5d4ff',
          200: '#b4c5ff',
          300: '#8fa6ff',
          400: '#6b87ff',
          500: '#4768ff',
          600: '#2563eb',
          700: '#004ac6',
          800: '#003ea8',
          900: '#00174b',
        },
        
        // Surface & Tonal Colors
        surface: {
          DEFAULT: '#ffffff',
          dim: '#ccdbf4',
          bright: '#f8f9ff',
          lowest: '#ffffff',
          low: '#eff4ff',
          DEFAULT: '#e6eeff',
          high: '#dde9ff',
          highest: '#d5e3fd',
        },
        
        // On-Surface (Text colors)
        'on-surface': '#0d1c2f',
        'on-surface-variant': '#434655',
        
        // Inverse
        'inverse-surface': '#233144',
        'inverse-on-surface': '#ebf1ff',
        
        // Outlines & Borders
        outline: '#737686',
        'outline-variant': '#c3c6d7',
        
        // Secondary
        secondary: {
          DEFAULT: '#505f76',
          container: '#d0e1fb',
        },
        'on-secondary': '#ffffff',
        'on-secondary-container': '#54647a',
        
        // Tertiary
        tertiary: {
          DEFAULT: '#525657',
          container: '#6b6e70',
        },
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#eff1f3',
        
        // Error States
        error: {
          50: '#ffdad6',
          500: '#ba1a1a',
          600: '#ba1a1a',
          700: '#ba1a1a',
        },
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        
        // Success
        success: {
          50: '#e6f9e6',
          100: '#ccf3cc',
          500: '#22c55e',
          600: '#16a34a',
        },
        
        // Warning
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        
        // Background
        background: '#f8f9ff',
        'on-background': '#0d1c2f',
        
        // Utility - Slate grays
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
      
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
      
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
      },
      
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'none': 'none',
      },
      
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
