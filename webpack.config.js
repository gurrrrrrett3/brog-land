const path = require("path");

module.exports = {
  entry: path.resolve("./webSrc/index.ts"),
  devtool: "inline-source-map",
  output: {
    filename: "bundle.js",
    path: path.resolve("./public/js/"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  mode: "development",
};
