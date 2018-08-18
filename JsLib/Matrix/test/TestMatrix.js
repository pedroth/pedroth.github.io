var UnitTest = require('../../UnitTest/main/UnitTest.js');
var UnitTest = require('../../ArrayUtils/main/ArrayUtils.js');
var Matrix = require('../main/Matrix.js');

var MatrixTest = function() {
    var assert = UnitTest.Assert(this);

    this.testMatrixCreation = function() {
        var matrix = Matrix([1,2,3]);
        assert.assertTrue(ArrayUtils.arrayEquals(matrix.shape(), [3]))
    }
}

UnitTest.builder()
        .addLogger(UnitTest.bodyLogger)
        .push(testBasic)
        .push(testDense)
        .push(testDenseCreation)
        .push(testMap)
        .push(testReduce)
        .test()
