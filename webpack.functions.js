const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  externals: [nodeExternals()],
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'serviceAccountKey.json', to: `${__dirname}/functions/serviceAccountKey.json` },
      ],
    }),
  ]
};
