/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Stitch Surface Palette
        "surface": "#0f131d",
        "surface-dim": "#0f131d",
        "surface-bright": "#353944",
        "surface-container-lowest": "#0a0e18",
        "surface-container-low": "#171b26",
        "surface-container": "#1c1f2a",
        "surface-container-high": "#262a35",
        "surface-container-highest": "#313540",
        "on-surface": "#dfe2f1",
        "on-surface-variant": "#e0c0b1",
        "inverse-surface": "#dfe2f1",
        "inverse-on-surface": "#2c303b",
        "outline": "#a78b7d",
        "outline-variant": "#584237",
        "surface-tint": "#ffb690",
        
        // Brand & Accent Colors
        "primary": "#ffb690",
        "on-primary": "#552100",
        "primary-container": "#f97316",
        "on-primary-container": "#582200",
        "inverse-primary": "#9d4300",
        
        "secondary": "#c0c1ff",
        "on-secondary": "#1000a9",
        "secondary-container": "#3131c0",
        "on-secondary-container": "#b0b2ff",
        
        "tertiary": "#4cd7f6",
        "on-tertiary": "#003640",
        "tertiary-container": "#00a9c5",
        "on-tertiary-container": "#003842",
        
        "error": "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        
        "primary-fixed": "#ffdbca",
        "primary-fixed-dim": "#ffb690",
        "secondary-fixed": "#e1e0ff",
        "secondary-fixed-dim": "#c0c1ff",
        "tertiary-fixed": "#acedff",
        "tertiary-fixed-dim": "#4cd7f6",
        
        // Brand Orange shades
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          dark: '#2c1e19',
        },
        mascot: {
          cream: '#fbe9db',
          bead: '#5c3a21',
          robe: '#ff6720',
          leaf: '#b4d33c',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        'headline-lg': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-md': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-sm': ['"Plus Jakarta Sans"', 'sans-serif'],
        'title-md': ['"Plus Jakarta Sans"', 'sans-serif'],
        'body-lg': ['"Inter"', 'sans-serif'],
        'body-md': ['"Inter"', 'sans-serif'],
        'body-sm': ['"Inter"', 'sans-serif'],
        'label-md': ['"Inter"', 'sans-serif'],
        'label-sm': ['"Inter"', 'sans-serif'],
        'code-mono': ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass': '0 20px 50px -12px rgba(234, 88, 12, 0.12), 0 8px 24px -4px rgba(0, 0, 0, 0.04)',
        'mascot': '0 25px 50px -12px rgba(180, 83, 9, 0.3)',
        'btn': '0 10px 25px -5px rgba(234, 88, 12, 0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        leafSway: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(12deg)' },
        },
        wingFlapLeft: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        wingFlapRight: {
          '0%, 100%': { transform: 'rotate(4deg)' },
          '50%': { transform: 'rotate(-2deg)' },
        }
      },
      animation: {
        'float-mascot': 'float 5s ease-in-out infinite',
        'sway-leaf': 'leafSway 4s ease-in-out infinite',
        'wing-left': 'wingFlapLeft 3.5s ease-in-out infinite',
        'wing-right': 'wingFlapRight 3.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
