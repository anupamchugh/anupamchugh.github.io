import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
      },
      colors: {
        background: 'var(--bg)',
        foreground: 'var(--fg)',
        primary: 'var(--fg)',
        secondary: 'var(--fg-muted)',
        tertiary: 'var(--fg-subtle)',
        border: 'var(--border)',
      },
      textColor: {
        primary: 'var(--fg)',
        secondary: 'var(--fg-muted)',
        tertiary: 'var(--fg-subtle)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px -5px rgba(56, 189, 248, 0.4)' },
          '100%': { boxShadow: '0 0 30px -5px rgba(56, 189, 248, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
