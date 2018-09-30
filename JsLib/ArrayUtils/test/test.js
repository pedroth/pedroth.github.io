(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ArrayUtils = {};

/**
 * Union of array a1 and a2
 * @param {*} a1 
 * @param {*} a2 
 */
ArrayUtils.join = function(a1, a2) {
    var copy = [];
    for(var i = 0; i < a1.length; i++) copy.push(a1[i]);
    for(var i = 0; i < a2.length; i++) copy.push(a2[i]);
    return copy;
}

/**
 *  Test if linear arrays are equal
 * @param {*} a1 
 * @param {*} a2 
 */
ArrayUtils.arrayEquals = function(a1, a2) {
    if(a1.length != a2.length) return false;
    for(var i = 0; i < a1.length; i++) {
        if (a1[i] != a2[i]) return false;
    }
    return true;
}

/**
 * Return a new array permutation
 * @param {*} array 
 * @param {*} permutation is an array with length <= array.length that has the new indexes
 */
ArrayUtils.permute = function(array, permutation) {
    if(permutation.length > array.length ){
        throw `permutation array length > array length[${array.length}]`
    }
    var copy = array.slice();
    for(var i = 0; i < permutation.length; i++) {
        copy[permutation[i]] = array[i];
    }
    return copy;
}

/**
 * return swap array indexes
 */
ArrayUtils.swap = function(array, i, j) {
    var t = array[i];
    array[i] = array[j];
    array[j] = t;
    return array;
}

ArrayUtils.findJsArrayDim = function(array) {
    if(array instanceof Array) {
        return ArrayUtils.join(ArrayUtils.findJsArrayDim(array[0]), [array.length]); 
    } else {
        return [];
    }
}

ArrayUtils.unpackJsArray = function(array) {
    if(array instanceof Array) {
        var joinIdentity = []
        for(var i = 0; i < array.length; i++) {
            joinIdentity = ArrayUtils.join(joinIdentity, ArrayUtils.unpackJsArray(array[i]));
        }
        return joinIdentity;
    } else {
        return [array];
    }
}

ArrayUtils.map = function(array, f) {
    var ans = [];
    for(var i = 0; i < array.length; i++) ans[i] = f(array[i]);
    return ans;
}

ArrayUtils.range = function(xmin, xmax, step) {
    var ans = [];
    for(var i = xmin; i < xmax; i += step) ans.push(i);
    return ans;
}

ArrayUtils.reduce = function(array, identity, binaryOperator) {
    for(var i = 0; i < array.length; i++) identity = binaryOperator(identity, array[i]);
    return identity;
}

module.exports = ArrayUtils;
},{}],2:[function(require,module,exports){
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

var testArrayMap = function() {
    var assert = UnitTest.Assert(this);
    var s = [1, 2, 3, 4, 5];
    var sMap = ArrayUtils.map(s, x => x*x);
    assert.assertTrue(ArrayUtils.arrayEquals(s, ArrayUtils.map(sMap, x => Math.sqrt(x))));
}

var testArrayRange = function() {
    var assert = UnitTest.Assert(this);
    var control = [0, 2, 4, 6, 8];
    assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.range(0, 10, 2), control));
}

var testArrayReduce = function() {
    var n = 10;
    UnitTest.Assert(this).assertTrue(ArrayUtils.reduce(ArrayUtils.range(0, n, 1), 0, (x, y) => x + y) == (n * (n - 1) / 2));
}

UnitTest.builder()
        .addLogger(UnitTest.bodyLogger)
        .push(testJoinArray)
        .push(testArrayEquals)
        .push(testArrayPermute)
        .push(testArraySwap)
        .push(testFindArrayDim)
        .push(testUnpackJsArray)
        .push(testArrayMap)
        .push(testArrayRange)
        .push(testArrayReduce)
        .test()
},{"../../UnitTest/main/UnitTest.js":3,"../main/ArrayUtils.js":1}],3:[function(require,module,exports){
var UnitTest = {};

UnitTest.Assert = function(test) {
    return new function() {
        this.testFunction = test;
        this.index = 0;
    
        this.assertTrue = function(boolean) {
            if(!boolean) throw "Assertion failed : " + [this.testFunction, this.index];
            this.index++;
        }
    }
};

UnitTest.builder = function() {
    return new UnitTest.UnitTestBuilder();
}

UnitTest.bodyLogger = x => document.write(`<p>${x}</p>`)

UnitTest.UnitTestBuilder = function(){
    this.log = x => console.log(x);
    this.tests = [];
    this.asserts = [];

    this.addLogger = function(logger) {
        this.log = logger;
        return this;
    }

    this.push = function(test){
        var types = [
                     ["Function", Function],
                     ["Object", Object]
                    ];
        var map  = {
            "Function": () => this.tests.push(test),
            "Object": () => {
                for(var f in test) {
                    if(f instanceof Function) this.tests.push(f);
                }
            }
        }
        types.forEach(x => {
            if(test instanceof x[1]) map[x[0]]();
        });
        return this;
    }

    this.test = function() {
        this.tests.forEach(x => {
            try {
                x();
                this.asserts.push([true]);
            } catch(err) {
                this.asserts.push([false, err]);
            }
        });
        var passedTests = 0;
        var failedTests = 0;
        this.asserts.forEach(x => {
            passedTests += x[0] ? 1 : 0;
            failedTests += x[0] ? 0 : 1;
        });

        this.log(`Passed Test: ${passedTests} / ${this.tests.length}`)
        this.log(`Failed Test: ${failedTests} / ${this.tests.length}`)
        for(var i = 0; i < this.asserts.length; i++) {
            this.log(`Test ${i}, ${this.asserts[i][0] ? "Passed" : "Failed"}`);
            if(!this.asserts[i][0]) this.log(`\t ${this.asserts[i][1]}`);
        }
    }
}

module.exports = UnitTest;
},{}]},{},[2]);
