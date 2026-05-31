import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: { center: true, padding: '1.5rem' },
    extend: {
      colors: {
        primary: '#4F5BFF',
        'primary-700': '#3A46E8',
        'primary-50': '#EEF0FF',
        accentBlue: '#1E5BFF',
        accentYellow: '#FFCE2E',
        accentCoral: '#FF5C7C',
        navy: '#15172E',
        slatebody: '#7A7A8C',
        soft: '#F7F8FD',
      },
      fontFamily: {
        heading: ['var(--font-quicksand)', 'ui-sans-serif', 'sans-serif'],
        body: ['var(--font-open-sans)', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 40px -12px rgba(21,23,46,0.12)',
        float: '0 24px 60px -20px rgba(79,91,255,0.35)',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}

export default config
