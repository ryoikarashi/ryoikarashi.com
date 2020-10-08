const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  mode: 'production',

  entry: './src/index.ts',

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'assets/[name].[chunkhash].js',
    chunkFilename: 'assets/[name].[chunkhash].js',
  },

  devtool: 'inline-source-map',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8000,
  },

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
        test: /\.html$/i,
        use: [
          {
            loader: 'html-loader',
            options: {
              attributes: {
                list: [
                  {
                    tag: 'meta',
                    attribute: 'content',
                    type: 'src',
                    /**
                     * @docs https://github.com/webpack-contrib/html-loader#list
                     */
                    filter: (_tag, _attribute, attributes, _resourcePath) => {
                      if (
                        attributes.property === 'og:image' ||
                        attributes.name === 'twitter:image'
                      ) {
                        return true
                      }
                      return false
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash].[ext]',
              limit: '10000',
              publicPath: '/assets/images',
              outputPath: '/assets/images',
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash].[ext]',
              limit: '10000',
              publicPath: '/assets/fonts',
              outputPath: '/assets/fonts',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js'],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
      chunkFilename: '[id].[chunkhash].css',
    }),
    new FaviconsWebpackPlugin({
      // Your source logo
      logo: path.resolve(__dirname, 'src', 'assets', 'favicon.png'),
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
  ]
};
