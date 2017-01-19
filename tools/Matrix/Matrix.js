var DenseNDArray = require('./DenseNDArray.js');

var Matrix = function(rows, columns) {
    DenseNDArray.call(this, [rows, columns]);
}
var Matrix.prototype = Object.create(DenseNDArray.prototype);

