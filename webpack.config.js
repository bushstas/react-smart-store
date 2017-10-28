let path = require("path");
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [path.resolve(__dirname, "/node_modules/")],
        loader: "babel-loader",
        options: {
          presets: ["es2015", "es2017", "react", "stage-0"]
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx']
  }
};