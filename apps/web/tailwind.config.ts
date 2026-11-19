import type { Config } from 'tailwindcss';

/**
 * Stix Magic brand tokens (brand book §6.2).
 * Dark glass on navy, one accent at a time. Violet is the voice.
 */
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
        'panel-raised': '#10131d',
        text: '#f5f7ff',
        muted: '#aeb6cf',
        line: 'rgba(174,182,207,.14)',
        'line-strong': '#1d2232',
        'accent-primary': '#9d7dff',
        'accent-violet': '#9d7dff',
        'accent-blue': '#4d86ff',
        'accent-indigo': '#4d86ff',
        'accent-cyan': '#7cf2ff',
        'accent-pink': '#ff7fdc',
        'accent-teal': '#7cf2ff',
        'accent-orange': '#ff7fdc'
      },
      fontFamily: {
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      maxWidth: {
        site: '1280px'
      }
    }
  },
  plugins: []
};

export default config;
