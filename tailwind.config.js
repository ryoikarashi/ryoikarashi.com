/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        dotsDark: 'dotsDark 1s steps(5, end) infinite',
        dotsLight: 'dotsLight 1s steps(5, end) infinite',
      },
      keyframes: {
        dotsDark: {
          '0%, 20%': {
            color: '#333',
            'text-shadow': '0.25em 0 0 #333, 0.5em 0 0 #333',
          },
          '40%': {
            color: '#333',
            'text-shadow': '0.25em 0 0 #333, 0.5em 0 0 #333',
          },
          '60%': {
            'text-shadow': '0.25em 0 0 #fff, 0.5em 0 0 #333',
          },
          '80%, 100%': {
            'text-shadow': '0.25em 0 0 #fff, 0.5em 0 0 #fff',
          },
        },
        dotsLight: {
          '0%, 20%': {
            color: '#fff',
            'text-shadow': '0.25em 0 0 #fff, 0.5em 0 0 #fff',
          },
          '40%': {
            color: '#fff',
            'text-shadow': '0.25em 0 0 #fff, 0.5em 0 0 #fff',
          },
          '60%': {
            'text-shadow': '0.25em 0 0 #333, 0.5em 0 0 #fff',
          },
          '80%, 100%': {
            'text-shadow': '0.25em 0 0 #333, 0.5em 0 0 #333',
          },
        },
      },
    },
    colors: {
      black: '#111',
      white: '#fff',
    },
  },
  plugins: [],
};
