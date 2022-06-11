const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const publicPath = isProduction ? 'https://ryoikarashi.com' : '/';

module.exports = {
    entry: './src/index.ts',

    mode: isProduction ? 'production' : 'development',

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath,
        filename: '[name].[fullhash].js',
        chunkFilename: '[name].[fullhash].js',
    },

    devtool: isProduction ? 'nosources-source-map' : 'inline-source-map',

    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 8000,
        proxy: {
            '/.netlify/functions': {
                target: 'http://localhost:9000',
                pathRewrite: { '^/.netlify/functions': '' },
            },
        },
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
                            minimize: true,
                            sources: {
                                list: [
                                    {
                                        tag: 'meta',
                                        attribute: 'content',
                                        type: 'src',
                                        filter: (_tag, _attribute, attributes) =>
                                            attributes.property === 'og:image' || attributes.name === 'twitter:image',
                                    },
                                    {
                                        tag: 'img',
                                        attribute: 'src',
                                        type: 'src',
                                        filter: (_tag, _attribute, attributes) => {
                                            return attributes.filter(
                                                (attr) => attr.name === 'src' && attr.value.length,
                                            )?.[0];
                                        },
                                    },
                                    {
                                        tag: 'audio',
                                        attribute: 'src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'source',
                                        attribute: 'src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'iframe',
                                        attribute: 'src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'link',
                                        attribute: 'href',
                                        type: 'src',
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
                test: /\.(jpe?g|png|gif|ico|ogg|mp3|wav|mpe?g)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
        new HTMLWebpackPlugin({
            template: './src/404.html',
            filename: '404.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[fullhash].css',
            chunkFilename: '[id].[fullhash].css',
        }),
        new FaviconsWebpackPlugin({
            publicPath: '/',
            // Your source logo
            logo: path.resolve(__dirname, 'src', 'assets', 'favicon.png'),
            // The prefix for all image files (might be a folder or a name)
            prefix: 'icons/',
            // Emit all stats of the generated icons
            emitStats: false,
            // The name of the json containing all favicon information
            statsFilename: 'iconstats-[fullhash].json',
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
    ],
};
