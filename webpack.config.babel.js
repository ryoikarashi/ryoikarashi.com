import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import fs from 'fs';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import data from './data.development';

const entries = {
  top: './src/top/index.js',
};

module.exports = {

  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: true,
    timings: true,
    chunks: true,
    chunkModules: true,
  },

  entry: entries,

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'assets/[name].js',
  },

  devtool: 'source-map',

  devServer: {
    port: 8000,
    host: 'ryoikarashi.dev',
    historyApiFallback: true,
    noInfo: false,
    stats: 'minimal',
    contentBase: 'src',
    watchContentBase: true,
    hot: true,
    inline: true,
    https: true,
    open: true,
    cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'ryoikarashi.dev.crt')),
    key: fs.readFileSync(path.resolve(__dirname, 'certs', 'ryoikarashi.dev.key')),
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              configFile: '.eslintrc',
            },
          },
        ],
        exclude: /(node_modules)/,
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.pug/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'pug-html-loader',
            options: { data },
          },
        ],
      },
      {
        test: /\.modernizrrc.js$/,
        use: ['modernizr-loader'],
      },
      {
        test: /\.modernizrrc(\.json)?$/,
        use: ['modernizr-loader', 'json-loader'],
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/],
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
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: '10000',
              publicPath: '/',
              outputPath: 'assets/images/',
              name: '[name].[hash].[ext]',
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

  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, '.modernizrrc'),
    },
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NamedModulesPlugin(),

    new StyleLintPlugin({
      configFile: '.stylelintrc',
      context: './src',
      files: '**/*.css',
    }),

    new ExtractTextPlugin({
      filename: 'assets/[name].css',
      disable: process.env.NODE_ENV !== 'production',
    }),

    // Top page
    new HtmlWebpackPlugin({
      // excludeChunks: ['about'],
      template: path.resolve(__dirname, 'src', 'top', 'index.pug'),
      filename: 'index.html',
      chunksSortMode: 'dependency',
    }),

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
      title: 'Sakishiraz',

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
  ],
};
