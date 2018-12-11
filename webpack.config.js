const path = require("path");
const webpack = require("webpack");
const slsw = require("serverless-webpack");

const entries = {};

Object.keys(slsw.lib.entries).forEach(key => (
  entries[key] = ["./source-map-install.js", slsw.lib.entries[key]]
));

module.exports = {
  entry: entries,
  devtool: "source-map",
  resolve: {
    extensions: [
      ".js",
      ".json",
      ".ts",
    ]
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  target: "node",
  module: {
    loaders: [
      { test: /\.ts(x?)$/, loader: "ts-loader" },
    ],
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin(),
    // new webpack.optimize.AggressiveMergingPlugin(),
  ]
};
