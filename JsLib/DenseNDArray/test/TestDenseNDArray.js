var UnitTest = require('../../UnitTest/main/UnitTest.js');
var DenseNDArray = require('../main/DenseNDArray.js');
var ArrayUtils = require('../../ArrayUtils/main/ArrayUtils.js');

var TestDenseNDArray = function() {

    this.testBasic = function () {
        var assert = UnitTest.Assert(this);

        var denseNDArray = new DenseNDArray([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.assertTrue(denseNDArray.get([0, 0]) == 1);
        assert.assertTrue(denseNDArray.get([1, 2]) == 8);
        assert.assertTrue(denseNDArray.get([0, 2]) == 7);
        assert.assertTrue(denseNDArray.get([2, 1]) == 6);
        assert.assertTrue(denseNDArray.get([1, 1]) == 5);

        var denseNDArray1 = DenseNDArray.of(denseNDArray, [9, 1]);
        assert.assertTrue(denseNDArray1.get([0, 0]) == 1);
        assert.assertTrue(denseNDArray1.get([4, 0]) == 5);
        assert.assertTrue(denseNDArray1.get([8, 0]) == 9);

        var denseNDArray2 = DenseNDArray.of(denseNDArray, [9]);
        assert.assertTrue(denseNDArray2.get([0]) == 1);
        assert.assertTrue(denseNDArray2.get([4]) == 5);
        assert.assertTrue(denseNDArray2.get([8]) == 9);

        assert.assertTrue(denseNDArray.get("1,2") == 8.0);
        assert.assertTrue(denseNDArray.get("1,1") == 5.0);

        assert.assertTrue(DenseNDArray.of([[1, 2], [3, 4], [5, 6]]).get([0, 1]) == 3);
        assert.assertTrue(DenseNDArray.of([[1, 2], [3, 4], [5, 6]]).get([1, 2]) == 6);
        assert.assertTrue(DenseNDArray.of([[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]], [[13, 14], [15, 16], [17, 18]]]).get([1, 2, 2]) == 18);
        assert.assertTrue(DenseNDArray.of([[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]], [[13, 14], [15, 16], [17, 18]]]).get("1,1,1") == 10);
        assert.assertTrue(DenseNDArray.of([[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11, 12]], [[13, 14], [15, 16], [17, 18]]]).get("0,1,0") == 3);
    }

    this.testDense = function () {
        var assert = UnitTest.Assert(this);
        var table = new DenseNDArray([3, 3, 3]);
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 3; k++) {
                    table.set([i, j, k], i + 3 * j + 9 * k);
                }
            }
        }
        console.log(`table : ${table.toString()}`);

        assert.assertTrue(table.get("1,:,:").get([0, 0]) === 1);
        assert.assertTrue(table.get("1,:,:").get([1, 1]) === 13);
        assert.assertTrue(table.get("1,:,:").get([2, 2]) === 25);
        assert.assertTrue(table.get("1,:,:").get([2, 1]) === 16);

        var secondTable = table.get("0 : 1, 1 : 2, : ");
        console.log(`secondTable : ${secondTable.toString()}`);

        assert.assertTrue(secondTable.get([1, 1, 0]) === 7);
        assert.assertTrue(secondTable.get([1, 1, 1]) === 16);
        assert.assertTrue(secondTable.get([1, 1, 2]) === 25);

        var thirdTable = new DenseNDArray([3, 3]);
        for (var j = 0; j < 3; j++) {
            for (var i = 0; i < 3; i++) {
                thirdTable.set([i, j], 100);
            }
        }

        table.set("1,:,:", thirdTable);

        assert.assertTrue(table.get([1, 0, 0]) === 100);
        assert.assertTrue(table.get([1, 1, 1]) === 100);
        assert.assertTrue(table.get([1, 1, 2]) === 100);
        assert.assertTrue(table.get([1, 2, 2]) === 100);
        assert.assertTrue(table.get([0, 2, 2]) === 24);

        var denseNDArray = table.get("1:,0:,:1");

        console.log(table.toArray());
        console.log(table.toString());

        assert.assertTrue(denseNDArray.dim[0] == 2 && denseNDArray.dim[1] == 3 && denseNDArray.dim[2] == 2);
        assert.assertTrue(denseNDArray.get([0, 0, 1]) == 100);
        assert.assertTrue(denseNDArray.get([1, 1, 0]) == 5);
        assert.assertTrue(denseNDArray.get([1, 2, 1]) == 17);
    }

    this.testDenseCreation = function () {
        var assert = UnitTest.Assert(this);
        var d1 = new DenseNDArray([2, 3], [1, 2, 3, 4, 5, 6]);
        var d2 = DenseNDArray.of([[1, 2], [3, 4], [5, 6]]);
        assert.assertTrue(d1.equals(d2));
        assert.assertTrue(d1.equals(DenseNDArray.of(d1.toArray())));
    }

    this.testMap = function () {
        var assert = UnitTest.Assert(this);
        var array = new DenseNDArray([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        var arraySq = new DenseNDArray([3, 3], [1, 4, 9, 16, 25, 36, 49, 64, 81]);
        assert.assertTrue(array.map(x => x * x).equals(arraySq));
    }

    this.testReduce = function () {
        var assert = UnitTest.Assert(this);
        var n = 10;
        var sum = n * (n - 1) / 2.0;
        var array = new DenseNDArray([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.assertTrue(array.reduce(0.0, (x, y) => x + y) == sum);
        var acc = 0;
        array.forEach(x => acc += x);
        assert.assertTrue(acc == sum);
    }

    this.testReshape = function () {
        var assert = UnitTest.Assert(this);
        var dense = DenseNDArray.of([[1, 2, 3], [4, 5, 6]]);
        var denseReshape = DenseNDArray.of([[1, 2], [3, 4], [5, 6]]);
        assert.assertTrue(dense.reshape([2, 3]).equals(denseReshape));
    }

    this.testBroadcast = function () {
        var assert = UnitTest.Assert(this);
        var mult = (x, y) => x * y;
        var dense = DenseNDArray.of([[[1, 2], [3, 4]], [[5, 6], [7, 8]], [[9, 10], [11, 12]]]);
        var out = dense.binaryOp(DenseNDArray.of([1, 2, 3]), mult);

        var denseExpected = DenseNDArray.of([[[1, 2], [3, 4]], [[10, 12], [14, 16]], [[27, 30], [33, 36]]]);
        
        assert.assertTrue(ArrayUtils.arrayEquals([2, 2, 3], out.shape()))
        assert.assertTrue(denseExpected.equals(out));
        
        dense = DenseNDArray.of([1,1,1]);
        out = dense.binaryOp(DenseNDArray.of([1,2,3], [3,1]), mult);
        denseExpected = DenseNDArray.of([[1,2,3],[1,2,3],[1,2,3]]);
        assert.assertTrue(out.equals(denseExpected));

        out = dense.binaryOp(1, (x,y) => x + y);
        assert.assertTrue(out.equals(DenseNDArray.of([2,2,2]))); 
    }

    this.testMapWithIndex = function() {
        var assert = UnitTest.Assert(this);
        var array = new DenseNDArray([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        var arrayExpected = new DenseNDArray([3, 3], [0, 0, 0, 0, 5, 12, 0, 16, 36]);
        assert.assertTrue(array.mapWithIndex((x, index) => x * index.reduce((x, y)=> x * y, 1)).equals(arrayExpected));
        array.transformWithIndex((x, index) => x * index.reduce((x, y) => x * y, 1));
        assert.assertTrue(array.equals(arrayExpected));
    }

    this.testIndexOutOfBounds = function() {
        try{
            DenseNDArray.of([1,2,3]).get(3);
            UnitTest.Assert(this).assertTrue(false);
        } catch(e) {
            UnitTest.Assert(this).assertTrue(true);
        }
    }

    this.testGetLowIndexSize = function() {
        UnitTest.Assert(this).assertTrue(DenseNDArray.of([[1, 2], [3, 4]]).get(1) == 3);
    }
}


UnitTest.builder()
        .addLogger(UnitTest.bodyLogger)
        .push(new TestDenseNDArray())
        .test()
