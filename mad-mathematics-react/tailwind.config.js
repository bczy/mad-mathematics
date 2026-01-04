/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#ffd700',
          light: '#ffed4e'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dark-magic':
          'linear-gradient(135deg, #1a0033 0%, #2d1b4e 50%, #1a0033 100%)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
