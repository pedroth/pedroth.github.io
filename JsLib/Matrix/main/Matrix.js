var DenseNDArray = require('./DenseNDArray.js');

var Matrix = function(array, rows, columns) {
    if(rows == null || columns == null) {

    } else {
        this.matrix = DenseNDArray.call(this, [rows, columns]);
    }
}

