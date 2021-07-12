module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      // Common typefaces
      'display': ['"Tenor Sans"', 'sans-serif'],
      'body': ['"Inter"', 'sans-serif'],
      // Stylized typefaces
      'style-ipm': ['"IBM Plex Mono"', 'monospace'],
      'style-cn': ['"Comic Neue"', 'cursive'],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
