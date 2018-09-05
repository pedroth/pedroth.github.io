var DenseNDArray = require('../DenseNDArray/main/DenseNDArray.js');

var Matrix = function(array) {
    var map = {};
    if(array instanceof DenseNDArray) {
        this.matrix = DenseNDArray.of(array)
    }
}

