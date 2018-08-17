var DenseNDArray = require('../DenseNDArray/main/DenseNDArray.js');

var Matrix = function(array) {
    var map = {}
    map[DenseNDArray] = () => { 
                                if(array.shape() > 2) {
                                    
                                }
                                 DenseNDArray.of(array)
                              }
    if(array instanceof DenseNDArray) {
        this.matrix = DenseNDArray.of(array)
    }
}

