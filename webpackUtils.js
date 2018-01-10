const webpack = require('webpack');
const getVendorName = entryName => `vendors.${entryName}`;

exports.getVendorsFromEntries = function (entries) {
  return Object
    .keys(entries)
    .map(entryName =>
      new webpack.optimize.CommonsChunkPlugin({
        name: getVendorName(entryName),
        chunks: [entryName],
        minChunks: ({ resource }) => /node_modules/.test(resource),
      }),
    );
};

exports.getExcludedChunkName = function (chunksToBeExcluded) {
  return chunksToBeExcluded.reduce((excluded, chunkName) =>
    excluded.concat(chunkName, getVendorName(chunkName)), []);
};
