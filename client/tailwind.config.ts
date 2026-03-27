import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core dark backgrounds
        void: {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1a1a25',
          600: '#222230',
        },
        // Accent - neon blue (primary actions, XP bars)
        neon: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          glow: 'rgba(59, 130, 246, 0.4)',
        },
        // Accent - purple (rare/epic elements)
        arcane: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          glow: 'rgba(139, 92, 246, 0.4)',
        },
        // Status colors
        hp: '#ef4444',
        mp: '#3b82f6',
        xp: '#fbbf24',
        // Rank colors
        rank: {
          E: '#9ca3af',
          D: '#60a5fa',
          C: '#34d399',
          B: '#fbbf24',
          A: '#f97316',
          S: '#ef4444',
          S2: '#f43f5e',
          S3: '#d946ef',
          S4: '#8b5cf6',
          S5: '#eab308',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(59, 130, 246, 0.3)',
        arcane: '0 0 20px rgba(139, 92, 246, 0.3)',
        glow: '0 0 40px rgba(59, 130, 246, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
