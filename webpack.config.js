// vim: ts=2:sw=2:et

var path = require('path');
var webpack = require('webpack');

module.exports = {
  // https://webpack.github.io/docs/configuration.html
  // eval modules (some performance trick?) and provide a SourceMap
  devtools: 'eval-source-map',
  entry: [
    './src/main.js',
  ],
  output: {
    path: path.join(__dirname, "build"),
    filename: 'bundle.js',
    publicPath: '/build/',
  },
  plugins: [
    // can't get new watching plugin to work
    new webpack.OldWatchingPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src'),
    }]
  }
}
