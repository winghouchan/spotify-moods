require("dotenv").config();

const path = require("path");
const DotenvWebpack = require("dotenv-webpack");
const webpackNodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

if (
  typeof process.env.NODE_ENV === "undefined" &&
  process.env.NODE_ENV !== "development" &&
  process.env.NODE_ENV !== "production"
) {
  throw new Error(
    `NODE_ENV invalid value. Currently set to ${process.env.NODE_ENV}. It should be one of "development" or "production".`
  );
}

module.exports = {
  mode: process.env.NODE_ENV,

  target: "node",

  externals: [webpackNodeExternals()],

  externalsPresets: {
    node: true,
  },

  entry: "./src/index.ts",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new DotenvWebpack({
      systemvars: true,
    }),
    new webpack.SourceMapDevToolPlugin({ filename: "index.js.map" }),
  ],

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  output: {
    filename: "index.js",
    library: {
      type: "commonjs",
    },
    path: path.resolve(__dirname, "lib"),
    clean: true,
  },
};
