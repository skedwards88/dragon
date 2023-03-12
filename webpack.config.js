const path = require("path");
const WorkboxPlugin = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    console.log("RUNNING IN DEV MODE. Service worker will not generate.");
  } else {
    console.log("RUNNING IN NON-DEV MODE. Service worker will generate.");
  }

  const htmlPlugin = new HtmlWebpackPlugin({
    // Need to use template because need 'root' div for react injection. templateContent doesn't play nice with title, so just use a template file instead.
    template: "./src/index.html",
  });

  const copyPlugin = new CopyPlugin({
    patterns: [
      { from: "./src/images/favicon.svg", to: "./assets/favicon.svg" },
      { from: "./src/images/favicon.png", to: "./assets/favicon.png" },
      { from: "./src/images/icon_192.png", to: "./assets/icon_192.png" },
      { from: "./src/images/icon_512.png", to: "./assets/icon_512.png" },
      {
        from: "./src/images/maskable_icon.png",
        to: "./assets/maskable_icon.png",
      },
      { from: "./src/manifest.json", to: "./assets/manifest.json" },
      { from: "./src/privacy.html", to: "./privacy.html" },
      { from: "./src/assetlinks.json", to: "./.well-known/assetlinks.json" },
      { from: "./src/images/screenshot_cave_phone.png", to: "./assets/screenshot_cave_phone.png" },
      { from: "./src/images/screenshot_cave_tablet.png", to: "./assets/screenshot_cave_tablet.png" },
      { from: "./src/images/screenshot_inventory_phone.png", to: "./assets/screenshot_inventory_phone.png" },
      { from: "./src/images/screenshot_inventory_tablet.png", to: "./assets/screenshot_inventory_tablet.png" },
      { from: "./src/images/screenshot_newGame_phone.png", to: "./assets/screenshot_newGame_phone.png" },
      { from: "./src/images/screenshot_newGame_tablet.png", to: "./assets/screenshot_newGame_tablet.png" },
      { from: "./src/images/screenshot_window_phone.png", to: "./assets/screenshot_window_phone.png" },
      { from: "./src/images/screenshot_window_tablet.png", to: "./assets/screenshot_window_tablet.png" },
    ],
    options: {
      concurrency: 100,
    },
  });

  const serviceWorkerPlugin = new WorkboxPlugin.GenerateSW({
    // these options encourage the ServiceWorkers to get in there fast
    // and not allow any straggling "old" SWs to hang around
    clientsClaim: true,
    skipWaiting: true,
  });

  const plugins =
    argv.mode === "development"
      ? [htmlPlugin, copyPlugin]
      : [htmlPlugin, copyPlugin, serviceWorkerPlugin];

  return {
    entry: "./src/index.js",
    mode: "production",
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
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: "asset/resource",
        },
      ],
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
      publicPath: "",
      filename: "bundle.[fullhash].js",
      path: path.resolve(__dirname, "dist"),
      clean: true, // removes unused files from output dir
    },
    devServer: {
      static: "./dist",
      historyApiFallback: true,
    },
    plugins: plugins,
  };
};
