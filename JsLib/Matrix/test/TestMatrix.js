var UnitTest = require('../../UnitTest/main/UnitTest.js');
var ArrayUtils = require('../../ArrayUtils/main/ArrayUtils.js');
var Matrix = require('../main/Matrix.js');

var MatrixTest = function() {
    
    this.testMatrixCreation = function() {
        var assert = UnitTest.Assert(this);
        var matrix = new Matrix([1, 2, 3]);
        assert.assertTrue(ArrayUtils.arrayEquals(matrix.shape(), [3]));
        assert.assertTrue(matrix.get([1]) == 2);

        matrix = new Matrix([[1, 0], [0, 1]]);
        assert.assertTrue(ArrayUtils.arrayEquals(matrix.shape(), [2, 2]));
        assert.assertTrue(matrix.get("1, 1") == 1);
        assert.assertTrue(matrix.get([0, 0]) == 1);

        var eye = Matrix.identity(3);
        assert.assertTrue(eye.get("0:1, 0:1").equals(matrix));
    }

    this.testFailMatrixCreation = function(){
        var assert = UnitTest.Assert(this);
        try {
            var matrix = new Matrix([[[1,1]],[[1,1]]]);
        } catch (error) {
            assert.assertTrue(true);
        }
    }
}

UnitTest.builder()
        .addLogger(UnitTest.bodyLogger)
        .push(new MatrixTest())
        .test()
 