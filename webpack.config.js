const path = require("path");
// eslint-disable-next-line import/no-extraneous-dependencies

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "node",
  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
    "socket.io": "commonjs socket.io",
  },

  devtool: "inline-source-map",
};
