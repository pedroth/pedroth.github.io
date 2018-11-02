var UnitTest = require('../../UnitTest/main/UnitTest.js');
var Stream = require('../../Stream/main/Stream.js');
var ArrayUtils = require("../main/ArrayUtils.js");

var TestArrayUtils = function() {
    this.testConcatArray = function () {
        var assert = UnitTest.Assert(this);
        var a1 = [1, 2, "3"];
        var a2 = ["1", "p", "e"];
        var result = [1, 2, "3", "1", "p", "e"];
        assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.concat(a1, a2), result));
    }

    this.testArrayEquals = function () {
        var assert = UnitTest.Assert(this);
        var a1 = [1, { "a": 1 }, 3]
        var a2 = [1, { "a": 2 }, 3]
        assert.assertTrue(ArrayUtils.arrayEquals(a1, a2) == false);
        assert.assertTrue(ArrayUtils.arrayEquals(a1, a1));
    }

    this.testArrayPermute = function () {
        var assert = UnitTest.Assert(this);
        var a1 = [0, 1, 2, 3, 4, 5];
        var permuted = [1, 3, 4, 5, 0, 2];
        assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.permute(a1, [4, 0, 5, 1, 2, 3]), permuted));
    }


    this.testArraySwap = function () {
        var assert = UnitTest.Assert(this);
        var a1 = [0, 1, 2, 3, 4, 5];
        var swaped = [4, 1, 2, 3, 0, 5];
        assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.swap(a1, 0, 4), swaped));
    }

    this.testFindArrayDim = function () {
        var assert = UnitTest.Assert(this);
        var a1 = [[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]];
        assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.findJsArrayDim(a1), [3, 2, 2]));
    }

    this.testUnpackJsArray = function () {
        var assert = UnitTest.Assert(this);
        var a1 = [[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]];
        assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.unpackJsArray(a1), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
    }

    this.testArrayMap = function () {
        var assert = UnitTest.Assert(this);
        var s = [1, 2, 3, 4, 5];
        assert.assertTrue(ArrayUtils.arrayEquals(s, Stream.of(s).map(x => x * x).map(Math.sqrt).reduce([], (x, y) => x.concat(y))));
    }

    this.testArrayRange = function () {
        var assert = UnitTest.Assert(this);
        var control = [0, 2, 4, 6, 8];
        assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.range(0, 10, 2), control));
    }

    this.testArrayReduce = function () {
        var n = 10;
        UnitTest.Assert(this).assertTrue(Stream.of(ArrayUtils.range(0, n, 1)).reduce(0, (x, y) => x + y) == (n * (n - 1) / 2));
    }

    this.testArrayBinaryOp = function() {
        var v = ArrayUtils.range(0, 10, 1);
        var expected = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];
        UnitTest.Assert(this).assertTrue(ArrayUtils.arrayEquals(expected, ArrayUtils.binaryOp(v,v, (x,y) => x + y)));
    }
}


UnitTest.builder()
        .addLogger(UnitTest.bodyLogger)
        .push(new TestArrayUtils())
        .test()