const path = require("path");

module.exports = {
  mode: "production",
  target: "web",
  entry: "./src/Pedroth/Pedroth.js",
  devtool: "source-map",
  output: {
    path: path.resolve("./dist/"),
    filename: "index.js",
    library: "Pedroth",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              [
                "@babel/plugin-transform-runtime",
                { useESModules: true, helpers: true }
              ]
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
