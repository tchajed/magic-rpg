var webpack = require('webpack');

module.exports = {
  devtools: 'eval-source-map',
  entry: './src/',
  output: {
    path: 'dist',
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.OldWatchingPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.yaml/,
        loader: 'json!yaml',
      },
      {
        test: /\.js/,
        loader: 'babel',
        include: __dirname + '/src',
      },
      {
        test: /\.css/,
        loaders: ['style', 'css'],
      },
      {
        test: /\.html/,
        loader: 'html',
      }
    ],
  },
};
