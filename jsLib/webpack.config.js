const path = require("path");

module.exports = {
  entry: "./nabla.js",
  output: {
    path: path.resolve("./"),
    filename: "index.js",
    library: "Nabla",
    // Expose the default export.
    libraryExport: "default"
  }
};
