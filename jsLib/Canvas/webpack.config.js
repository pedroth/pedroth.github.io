const path = require("path");

var testConfig = {
  mode: "production",
  entry: "./test/Canvas.test.js",
  output: {
    path: path.resolve("./test"),
    filename: "test.js",
    library: "test",
    //Expose the default export.
    libraryExport: "default"
  }
};

// Return Array of Configurations
module.exports = [testConfig];
