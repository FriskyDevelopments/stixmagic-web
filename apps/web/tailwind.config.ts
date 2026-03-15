import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#080c18',
        panel: '#0d1222',
        'panel-secondary': '#12192e',
        text: '#e0f0ff',
        muted: '#4a6080',
        'accent-primary': '#6366f1',
        'accent-cyan': '#00d4ff',
        'accent-indigo': '#818cf8',
        'accent-violet': '#a855f7',
        'accent-pink': '#ec4899',
        'accent-teal': '#2dd4bf',
        'accent-orange': '#f97316'
      }
    }
  },
  plugins: []
};

export default config;
