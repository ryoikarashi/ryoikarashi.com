import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import InlineChunkWebpackPlugin from 'html-webpack-inline-chunk-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { getVendorsFromEntries /* ,getExcludedChunkName */ } from './webpackUtils';
import data from './data';

const entries = {
  top: ['babel-polyfill', './src/top/index.js'],
};

const entryVendorChunks = getVendorsFromEntries(entries);

module.exports = {

  entry: entries,

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'assets/[name].[chunkhash].js',
    chunkFilename: 'assets/[name].[chunkhash].js',
  },

  // Good for production because it simplifies the Source Maps to a single mapping per line.
  // ref: https://webpack.js.org/guides/production-build/#source-maps
  devtool: 'cheap-module-source-map',

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        loader: 'eslint-loader',
        options: {
          configFile: '.eslintrc',
        },
        exclude: /(node_modules)/,
      },
      {
        test: /\.pug/,
        use: [
          {
            loader: 'html-loader',
            query: {
              interpolate: 'require',
            },
          },
          {
            loader: 'pug-html-loader',
            options: { data },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            // { loader: 'resolve-url-loader' },
            { loader: 'postcss-loader', options: { sourceMap: true } },
          ],
        }),
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['es2015', { modules: false }],
              ],
            },
          },
        ],
      },
      // Images
      // First use Base64 Encoded images if it is smaller than 10kb
      // Otherwise use hashed images and optimize the image
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash].[ext]',
              limit: '10000',
              publicPath: '/',
              outputPath: 'assets/images/',
            },
          },
        ],
      },
      // Fonts
      {
        test: /\.(eot|ttf|woff|woff2|svg|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash].[ext]',
              limit: '10000',
              publicPath: '/',
              outputPath: 'assets/fonts/',
            },
          },
        ],
      },
    ],
  },

  plugins: entryVendorChunks.concat([

    new webpack.optimize.OccurrenceOrderPlugin(),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),

    new StyleLintPlugin({
      configFile: '.stylelintrc',
      context: './src',
      files: '**/*.css',
    }),

    new ExtractTextPlugin({
      filename: 'assets/[name].[contenthash].css',
    }),

    // Top page
    new HtmlWebpackPlugin({
      // excludeChunks: getExcludedChunkName(['about']),
      template: path.resolve(__dirname, 'src', 'top', 'index.pug'),
      filename: 'index.html',
      chunksSortMode: 'dependency',
    }),

    // generate favicons
    new FaviconsWebpackPlugin({
      // Your source logo
      logo: path.resolve(__dirname, 'src', 'assets', 'hero.png'),
      // The prefix for all image files (might be a folder or a name)
      prefix: 'assets/icons-[hash]/',
      // Emit all stats of the generated icons
      emitStats: false,
      // The name of the json containing all favicon information
      statsFilename: 'iconstats-[hash].json',
      // Generate a cache file with control hashes and
      // don't rebuild the favicons until those hashes change
      persistentCache: true,
      // Inject the html into the html-webpack-plugin
      inject: true,
      // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
      background: '#fff',
      // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
      title: 'Ryo Ikarashi',

      // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: true,
        favicons: true,
        firefox: true,
        opengraph: true,
        twitter: true,
        yandex: true,
        windows: true,
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['commons', 'bootstrap'],
    }),

    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),

    new InlineChunkWebpackPlugin({
      inlineChunks: ['bootstrap'],
    }),

    new webpack.optimize.UglifyJsPlugin(),

    new WebpackMd5Hash(),

    new CopyWebpackPlugin([
      { from: './.htaccess' },
    ]),

  ]),
};
