var DenseNDArray = require('../../DenseNDArray/main/DenseNDArray.js');
var ArrayUtils = require('../../ArrayUtils/main/ArrayUtils.js');

var Matrix = function(array) {
    this.matrix = array instanceof Matrix ? array.matrix : DenseNDArray.of(array);
    if (this.matrix.shape().length > 2) throw `Matrix must have dimension below 3, your array as dimension ${this.matrix.shape.length}`
}
/**
 * Creates new identity matrix with size n
 * 
 * @param {*} n size of the n times n identity matrix 
 */
Matrix.identity = function(n) {
    var dense = new DenseNDArray([n, n]);
    dense.transform(e => 0);
    for(var i = 0; i < n; i++) {
        dense.set([i, i], 1);
    }
    return new Matrix(dense);
}

Matrix.prototype.shape = function() {
    return this.matrix.shape(); 
}

Matrix.prototype.dim = function() {
    return this.matrix.dim();
}

Matrix.prototype.equals = function (o) {
        if (this == o) return true;
        if (o == null || this.prototype != o.prototype) return false;
        return this.matrix.equals(o.matrix);
}

/**
 * Returns a copy of the selection 
 * @param {*} x 
 */
Matrix.prototype.get = function(x) {
    var ans = this.matrix.get(x);
    if(ans instanceof DenseNDArray) return new Matrix(ans);
    return ans;
}

Matrix.prototype.copy = function() {
    return new Matrix(this);
}

Matrix.prototype.map = function(f) {
    return new Matrix(this.matrix.map(f));
}

Matrix.prototype.forEach = function (f) {
    this.matrix.forEach(f);
}

Matrix.prototype.transform = function(f) {
    this.matrix.transform(f);
}

Matrix.prototype.reduce = function (identity, binaryOperator) {
    return this.matrix.reduce(identity, binaryOperation);
}

Matrix.prototype.binaryOperation = function (matrix, operation) {
    
    var ans = this.matrix.denseNDArray.slice();
    for (let i = 0; i < ans.length; i++) {
        ans[i] = operation(ans[i], matrix.matrix.denseNDArray[i]);
    }
    return new Matrix(ans);
}

Matrix.prototype.sum = function (matrix) {
    
}

Matrix.prototype.sub = function (matrix) {

}

Matrix.prototype.mult = function (matrix) {

}

Matrix.prototype.div = function (matrix) {

}

Matrix.prototype.prod = function (matrix) {

}

Matrix.prototype.inner = function (matrix) {

}

Matrix.prototype.solve = function(b) {

}

Matrix.prototype.T = function () {

}

module.exports = Matrix;