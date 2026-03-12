// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#FDFCF8', // Rice Paper
        foreground: '#2C2C24', // Deep Loam
        primary: {
          DEFAULT: '#5D7052', // Moss Green
          foreground: '#F3F4F1', // Pale Mist
        },
        secondary: {
          DEFAULT: '#C18C5D', // Terracotta
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#E6DCCD', // Sand
          foreground: '#4A4A40', // Bark
        },
        muted: {
          DEFAULT: '#F0EBE5', // Stone
          foreground: '#78786C', // Dried Grass
        },
        border: '#DED8CF', // Raw Timber
        destructive: '#A85448', // Burnt Sienna
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Nunito', 'sans-serif'], // or Quicksand
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(93, 112, 82, 0.15)', // Moss tinted
        'float': '0 10px 40px -10px rgba(193, 140, 93, 0.2)', // Clay tinted
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        // We'll use custom classes for the complex blob percentages
      }
    },
  },
  plugins: [],
}