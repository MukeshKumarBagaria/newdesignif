/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Brand blues - matches IFMIS-NG Figma file
        brand: {
          10: '#F6FAFD',
          25: '#E5F4FF',
          50: '#D4E8F7',
          100: '#A3D3F5',
          300: '#309CE8',
          500: '#1B6498',
          600: '#1B557E',
          700: '#194666',
          800: '#17384F',
          900: '#132939',
        },
        // Purple / lavender accents
        lavender: {
          50:  '#EEF0FF',
          100: '#DDE1FF',
          200: '#C3C9FF',
          500: '#4F5AE0',
          700: '#2E38B8',
          900: '#14316B',
        },
        grey: {
          25: '#F7F7F7',
          50: '#F2F2F2',
          100: '#D9D9D9',
          200: '#BFBFBF',
          300: '#999999',
          400: '#808080',
          500: '#666666',
          600: '#4D4D4D',
          700: '#404040',
          800: '#333333',
          900: '#292929',
        },
        accent: {
          orange: {
            50:  '#FFF0E5',
            100: '#FFE1CC',
            500: '#FF6A00',
            700: '#662A00',
            800: '#4C2000',
          },
          yellow: {
            25: '#FFF9E5',
            50: '#FFF3CC',
            100: '#FFE799',
            200: '#FFDB66',
            500: '#FFC300',
            800: '#664E00',
          },
          green: {
            50:  '#E6F5E1',
            100: '#BDF0A8',
            300: '#7AE052',
            500: '#358217',
            600: '#2C6C13',
          },
          red: {
            500: '#B8141D',
          },
        },
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.06)',
        'soft': '0 4px 16px -4px rgba(19, 41, 57, 0.10), 0 2px 6px -2px rgba(19, 41, 57, 0.06)',
        'panel': '0 1px 2px 0 rgba(20, 49, 107, 0.5)',
        'hover': '0 8px 24px -8px rgba(27, 85, 126, 0.25)',
      },
      backgroundImage: {
        // Exact Figma header gradient — var(--Purple-blue-gradient)
        'brand-gradient': 'linear-gradient(90deg, #369 16.53%, #439 82.15%)',
        'module-purple': 'linear-gradient(135deg, #DDE1FF 0%, #E9ECFF 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(27, 100, 152, 0.35)' },
          '100%': { boxShadow: '0 0 0 12px rgba(27, 100, 152, 0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        'scale-in': 'scale-in 0.22s ease-out both',
        'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
}
