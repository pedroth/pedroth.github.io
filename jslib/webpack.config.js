const path = require("path");

module.exports = {
  entry: "./src/VisualExp/main/VisualExp.js",
  mode: "development",
  output: {
    path: path.resolve("./"),
    filename: "index.js",
    library: "VisualExp"
  }
};
