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
      keyframes: {
        /**
         * A dot dropped into a small stage: it lands, bounces three times with
         * the height decaying each go, then the floor lets it through and it
         * falls out of frame — after which it re-enters from the top and the
         * cycle repeats.
         *
         * Each step carries its own timing function because gravity is not
         * symmetrical: falls ease in, rises ease out. The squash on every
         * contact is what sells the weight (paired with `origin-bottom`, so it
         * compresses onto the floor rather than about its middle).
         *
         * Travel is ±84px, so the stage must be h-24 and clip its overflow for
         * the entry and the exit to happen off-frame.
         */
        'bounce-drop': {
          // Entry — falls in from above the stage.
          '0%': {
            transform: 'translateY(-84px) scale(1, 1)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.8, 1)',
          },
          '18%': { transform: 'translateY(0) scale(1, 1)' },
          '20%': {
            transform: 'translateY(0) scale(1.35, 0.65)',
            animationTimingFunction: 'cubic-bezier(0.2, 0, 0.4, 1)',
          },
          '23%': {
            transform: 'translateY(0) scale(1, 1)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.67, 1)',
          },
          // Bounce 1.
          '35%': {
            transform: 'translateY(-46px) scale(1, 1)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.8, 1)',
          },
          '46%': { transform: 'translateY(0) scale(1, 1)' },
          '48%': {
            transform: 'translateY(0) scale(1.28, 0.72)',
            animationTimingFunction: 'cubic-bezier(0.2, 0, 0.4, 1)',
          },
          '51%': {
            transform: 'translateY(0) scale(1, 1)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.67, 1)',
          },
          // Bounce 2.
          '60%': {
            transform: 'translateY(-25px) scale(1, 1)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.8, 1)',
          },
          '68%': { transform: 'translateY(0) scale(1, 1)' },
          '70%': {
            transform: 'translateY(0) scale(1.2, 0.8)',
            animationTimingFunction: 'cubic-bezier(0.2, 0, 0.4, 1)',
          },
          '73%': {
            transform: 'translateY(0) scale(1, 1)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.67, 1)',
          },
          // Bounce 3.
          '79%': {
            transform: 'translateY(-11px) scale(1, 1)',
            animationTimingFunction: 'cubic-bezier(0.33, 0, 0.8, 1)',
          },
          '85%': {
            transform: 'translateY(0) scale(1.12, 0.88)',
            animationTimingFunction: 'cubic-bezier(0.5, 0, 0.75, 0)',
          },
          // The floor gives way — stretches as it drops out of frame.
          '100%': { transform: 'translateY(84px) scale(0.86, 1.14)' },
        },
      },
      animation: {
        // linear: every step sets its own easing above.
        'bounce-drop': 'bounce-drop 2.6s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
