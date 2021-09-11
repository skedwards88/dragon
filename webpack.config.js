const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    publicPath: "",
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // removes unused files from output dir
  },
  devServer: {
    static: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Need to use template because need 'root' div for react injection. templateContent doesn't play nice with title, so just use a template file instead.
      template: "./src/index.html",
      favicon: "./src/images/favicon.png",
    }),
  ],
};
