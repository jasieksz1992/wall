import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        wall: {
          orange: '#ff4d16',
          graphite: '#11161c',
          ink: '#070a0e',
          soft: '#f4f5f6'
        }
      },
      boxShadow: {
        premium: '0 24px 80px rgba(7, 10, 14, 0.14)',
        dark: '0 24px 80px rgba(0, 0, 0, 0.35)'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
}

export default config
