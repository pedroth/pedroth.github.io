var DenseNDArray = require('./DenseNDArray.js');

var Matrix = function(rows, columns) {
    DenseNDArray.call(this, [rows, columns]);
}

Matrix.prototype = Object.create(DenseNDArray.prototype);

