/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FAF6F0',
          paper: '#F5EFE6',
          warm: '#EFE7DA',
          deep: '#E5D9C5',
        },
        blush: {
          light: '#F9F1EF',
          DEFAULT: '#F2E2DF',
          warm: '#E9D1CD',
        },
        rose: {
          dusty: '#C89B98',
          muted: '#B3827F',
          deep: '#946260',
        },
        burgundy: {
          light: '#7A2E37',
          DEFAULT: '#5C1D24',
          deep: '#421218',
          dark: '#2D0B10',
        },
        sage: {
          light: '#E3EAE0',
          DEFAULT: '#8A9A86',
          deep: '#647560',
        },
        champagne: {
          light: '#F3E7C9',
          DEFAULT: '#D4AF37',
          muted: '#C5A059',
          deep: '#9E7B32',
        },
        ink: {
          DEFAULT: '#2B2121',
          muted: '#5A4A4A',
          soft: '#7D6B6B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', ' Cambria', 'serif'],
        handwritten: ['"Caveat"', 'cursive'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'paper': '0 10px 30px -5px rgba(43, 33, 33, 0.08), 0 4px 12px -2px rgba(43, 33, 33, 0.04)',
        'paper-lg': '0 20px 45px -10px rgba(43, 33, 33, 0.12), 0 8px 20px -4px rgba(43, 33, 33, 0.06)',
        'polaroid': '0 14px 28px -6px rgba(43, 33, 33, 0.14), 0 4px 10px -2px rgba(43, 33, 33, 0.07)',
        'wax': '0 6px 16px rgba(66, 18, 24, 0.38), inset 0 2px 4px rgba(255, 255, 255, 0.22)',
        'invitation': '0 25px 60px -12px rgba(92, 29, 36, 0.14), 0 10px 24px -6px rgba(43, 33, 33, 0.08)',
      },
      backgroundImage: {
        'paper-grain': 'radial-gradient(rgba(197, 160, 89, 0.07) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};

