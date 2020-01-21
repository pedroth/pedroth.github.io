const path = require("path");

module.exports = {
  entry: "./src/Pedroth/Pedroth.js",
  mode: "development",
  output: {
    path: path.resolve("./dist/"),
    filename: "index.js",
    library: "Pedroth",
    libraryTarget: "umd"
  }
};
