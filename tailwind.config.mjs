/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // Central brand palette — change these to re-skin the template for a
        // different restaurant. See src/data/restaurant.config.ts for the
        // rest of the replaceable brand content.
        cream: {
          50: '#fdfbf7',
          100: '#faf5ec',
          200: '#f3e9d7',
        },
        charcoal: {
          800: '#2a2622',
          900: '#1c1a17',
        },
        tomato: {
          50: '#fdf1ee',
          100: '#fbe0da',
          400: '#e2604a',
          500: '#c33c2b',
          600: '#a92f21',
          700: '#8a2519',
        },
        basil: {
          50: '#eef3ea',
          100: '#dbe7d3',
          500: '#3f6b3f',
          600: '#335933',
          700: '#274327',
        },
        gold: {
          400: '#d9a441',
          500: '#c48e2c',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(28, 26, 23, 0.06), 0 1px 2px rgba(28, 26, 23, 0.05)',
        lifted: '0 20px 40px -12px rgba(28, 26, 23, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'slide-up': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'slide-in-right': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'slide-in-bottom': { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        'pulse-slow': { '0%, 100%': { boxShadow: '0 0 0 0 rgba(195,60,43,0.35)' }, '50%': { boxShadow: '0 0 0 6px rgba(195,60,43,0)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out both',
        'slide-up': 'slide-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slide-in-right 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-bottom': 'slide-in-bottom 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
