const webpack = require('webpack');
const PostCssSmartImport = require('postcss-smart-import');
const PreCss = require('precss');
const Autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const mqpacker = require('css-mqpacker');

module.exports = {
  plugins: [
    PostCssSmartImport({
      addDependencyTo: webpack,
    }),
    PreCss(),
    Autoprefixer({
      browsers: ['last 2 versions', 'IE >= 9'],
    }),
    mqpacker(),
    cssnano(),
  ],
};
