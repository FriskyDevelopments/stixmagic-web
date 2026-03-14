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
        background: '#05060b',
        panel: '#0b0d14',
        'panel-secondary': '#10131d',
        text: '#f5f7ff',
        muted: '#aeb6cf',
        'accent-primary': '#4d86ff',
        'accent-cyan': '#7cf2ff',
        'accent-violet': '#9d7dff',
        'accent-pink': '#ff7fdc'
      }
    }
  },
  plugins: []
};

export default config;
