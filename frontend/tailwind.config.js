/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#060B18',
          800: '#0B1329',
          700: '#131E3D',
          600: '#1D2D5A',
        },
        teal: {
          400: '#00E5AC',
          500: '#00D49F',
          600: '#00B386',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
