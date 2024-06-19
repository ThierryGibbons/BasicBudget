/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'text': '#e5ebf3',
      'background': '#0b1017',
      'primary': '#a6b5d5',
      'secondary': '#5e3169',
      'accent': '#b8699f',
      'transparent': 'transparent',
     },
     fontSize: {
      sm: '0.750rem',
      base: '1rem',
      xl: '1.333rem',
      '2xl': '1.777rem',
      '3xl': '2.369rem',
      '4xl': '3.158rem',
      '5xl': '4.210rem',
    },
    fontFamily: {
      heading: 'Poppins',
      body: 'Poppins',
    },
    fontWeight: {
      thin: '200',
      light: '300',
      normal: '400',
      medium: '500',
      bold: '700',
      extraBold: '1000',
    },
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), require("daisyui")
  ],
}

