module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    './src/**/*.{html,js,ts}',
  ],
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: ['hover'],
    textColor: ['hover'],
  },
  plugins: [],
}
