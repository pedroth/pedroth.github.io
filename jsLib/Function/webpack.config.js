const path = require('path');

module.exports = {
  entry: './main/Function.js',
  output: {
  	path: path.resolve('./'),
    filename: 'index.js',
    library: 'Function',
    // Expose the default export.
    libraryExport: "default"
  }
};