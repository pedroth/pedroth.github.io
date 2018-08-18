var UnitTest = require('../../UnitTest/main/UnitTest.js');
var ArrayUtils = require("../main/ArrayUtils.js");

var testJoinArray = function() {
    var assert = UnitTest.Assert(this);
    var a1 = [1, 2, "3"];
    var a2 = ["1", "p", "e"];
    var result = [1, 2, "3", "1", "p", "e"];
    assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.join(a1, a2), result));
}

var testArrayEquals = function() {
    var assert = UnitTest.Assert(this);
    var a1 = [1, {"a": 1}, 3]
    var a2 = [1, {"a": 2}, 3]
    assert.assertTrue(ArrayUtils.arrayEquals(a1, a2) == false);
    assert.assertTrue(ArrayUtils.arrayEquals(a1, a1));
}

var testArrayPermute = function() {
    var assert = UnitTest.Assert(this);
    var a1 = [0, 1, 2, 3, 4, 5];
    var permuted = [1, 3, 4, 5, 0, 2];
    assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.permute(a1, [4, 0, 5, 1, 2, 3]), permuted));
}


var testArraySwap = function() {
    var assert = UnitTest.Assert(this);
    var a1 = [0, 1, 2, 3, 4, 5];
    var swaped = [4, 1, 2, 3, 0, 5];
    assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.swap(a1, 0, 4), swaped));
}

var testFindArrayDim = function() {
    var assert = UnitTest.Assert(this);
    var a1 = [[[1, 2, 3],[4, 5, 6]], [[7, 8, 9], [10, 11, 12]]];
    assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.findJsArrayDim(a1), [3, 2, 2]));
}

var testUnpackJsArray = function() {
    var assert = UnitTest.Assert(this);
    var a1 = [[[1, 2, 3],[4, 5, 6]], [[7, 8, 9], [10, 11, 12]]];
    assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.unpackJsArray(a1), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
}

UnitTest.builder()
        .addLogger(UnitTest.bodyLogger)
        .push(testJoinArray)
        .push(testArrayEquals)
        .push(testArrayPermute)
        .push(testArraySwap)
        .push(testFindArrayDim)
        .push(testUnpackJsArray)
        .test()