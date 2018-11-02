(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ArrayUtils = {};

/**
 * Union of array a1 and a2
 * @param {*} a1 
 * @param {*} a2 
 */
ArrayUtils.concat = function(a1, a2) {
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
        return ArrayUtils.concat(ArrayUtils.findJsArrayDim(array[0]), [array.length]); 
    } else {
        return [];
    }
}

ArrayUtils.unpackJsArray = function(array) {
    if(array instanceof Array) {
        var joinIdentity = []
        for(var i = 0; i < array.length; i++) {
            joinIdentity = ArrayUtils.concat(joinIdentity, ArrayUtils.unpackJsArray(array[i]));
        }
        return joinIdentity;
    } else {
        return [array];
    }
}

ArrayUtils.range = function(xmin, xmax, step) {
    var ans = [];
    for(var i = xmin; i < xmax; i += step) ans.push(i);
    return ans;
}

ArrayUtils.binaryOp = function(array1, array2, binaryOp) {
    var smaller = array1.length < array2.length ? array1.slice() : array2.slice();
    for(let i = 0; i < smaller.length; i++) smaller[i] = binaryOp(array1[i], array2[i]);
    return smaller;
}

module.exports = ArrayUtils;
},{}],2:[function(require,module,exports){
var ArrayUtils = require('../../ArrayUtils/main/ArrayUtils.js');
/**
 * N-dimensional array implementation in column major order
 */
 var DenseNDArray = function(dim, array) {
    this.dim = dim;
    this.powers = [];
    // column major array
    this.denseNDArray = [];

    this.powers = computePowers(dim);
    if (array === undefined) {
        for (var i = 0; i < this.powers[this.powers.length - 1]; i++) this.denseNDArray[i] = null;
    } else {
        if(array.length != this.powers[this.powers.length - 1]) throw `Shape/dim doesn't agree with size ${dim}`;
        this.denseNDArray = array.slice();
    }
}

DenseNDArray.prototype.size = function() {
    return this.powers[this.powers.length - 1];
}

DenseNDArray.prototype.shape = function() {
    return this.dim;
}

DenseNDArray.prototype.get = function(x) {
    if(x == null) return this.denseNDArray[0];
    if(typeof x == "number") return this.get([x]);
    if(x.constructor === Array) {
        this.checkIfIndexOutOfBounds(x);
        this.checkIfCoordSizeCompatible(x.length);
        return this.denseNDArray[this.getIndex(x)];
    } 
    if(x.constructor === String) {
        var intervals = this.getIntervalFromStr(x);
        var newDim = this.computeNewDim(intervals);
        
        // string doesn't have any range
        if(newDim.length == 0) {
            var coord = []
            for(var i = 0; i < intervals.length; i++) {
                coord.push(intervals[i][0]);
            }
            return this.get(coord);
        }
        
        var newDenseNDArray = new DenseNDArray(newDim);
        
        var size = newDenseNDArray.size();
        var y = [];
        var dx = [];
        
        for(var i = 0; i < intervals.length; i++) {
            dx[i] = intervals[i][1] - intervals[i][0] + 1;
        }

        var powers = computePowers(dx);

        for (var i = 0; i < size; i++) {
            var k = 0;
            for (var j = 0; j < intervals.length; j++) {
                var index = Math.floor(i % powers[k + 1] / powers[k]);
                y[j] = intervals[j][0] + index;
                k++;
            }
            newDenseNDArray.denseNDArray[i] = this.get(y);
        }
        return newDenseNDArray;
    }
    throw "method 'get' only accepts strings and integer arrays";
}

DenseNDArray.prototype.set = function(x, value) {
    if (typeof x == "number" && value.constructor != Array) return this.set([x], value);
    if(x.constructor === Array && value.constructor != Array) {
        this.checkIfIndexOutOfBounds(x);
        this.checkIfCoordSizeCompatible(x.length);
        this.denseNDArray[this.getIndex(x)] = value;
        return this;
    } 
    if(x.constructor === String && value.constructor === DenseNDArray) {
        var intervals = this.getIntervalFromStr(x);
        
        var size = value.size();
        var y = [];
        var dx = [];

        for(var i = 0; i < intervals.length; i++) {
            dx[i] = intervals[i][1] - intervals[i][0] + 1;
        }

        var powers = computePowers(dx);
        
        for (var i = 0; i < size; i++) {
            var k = 0;
            for (var j = 0; j < intervals.length; j++) {
                var index = Math.floor(i % powers[k + 1] / powers[k]);
                y[j] = intervals[j][0] + index;
                k++;
            }
            this.set(y, value.denseNDArray[i]);
        }
        return this;
    }
    throw "set only accepts strings and integer arrays as the first argument and objects and DenseNDArray as the second";
}

DenseNDArray.prototype.map = function(f) {
    var ans = this.copy();
    var size = this.size();
    for (var i = 0; i < size; i++) {
        ans.denseNDArray[i] = f(this.denseNDArray[i]);
    }
    return ans;
}

/**
 * @param{*} f : a function that receive an element and an index as an array
 */
DenseNDArray.prototype.mapWithIndex = function(f) {
    var ans = this.copy();
    var size = this.size();
    var dim = this.dim;
    var powers = this.powers;
    var coord = [];
    for(let i = 0; i < size; i++){
        for(let j = 0; j < dim.length; j++) {
            var z = Math.floor(i % powers[j + 1] / powers[j]);
            coord[j] = z;
        }
        ans.denseNDArray[i] = f(this.denseNDArray[i], coord);
    }
    return ans;
}

DenseNDArray.prototype.reduce = function(identity, binaryOperator) {
    var size = this.size();
    for (var i = 0; i < size; i++) {
        identity = binaryOperator(identity, this.denseNDArray[i]);
    }
    return identity;
}

DenseNDArray.prototype.forEach = function(f) {
    this.denseNDArray.forEach(f);
}

/**
 * Transforms the same denseNDArray
 */
DenseNDArray.prototype.transform = function(f) {
    var size = this.size();
    for (var i = 0; i < size; i++) {
        this.denseNDArray[i] = f(this.denseNDArray[i]);
    }
    return this;
}

/** Transforms the same denseNDArray
 * @param{*} f : a function that receive an element and an index as an array
 */
DenseNDArray.prototype.transformWithIndex = function (f) {
    var size = this.size();
    var dim = this.dim;
    var powers = this.powers;
    var coord = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < dim.length; j++) {
            var z = Math.floor(i % powers[j + 1] / powers[j]);
            coord[j] = z;
        }
        this.denseNDArray[i] = f(this.denseNDArray[i], coord);
    }
    return this;
}


DenseNDArray.prototype.toArray = function() {
    return this.toArrayRecursive([]);
}

DenseNDArray.prototype.toArrayRecursive = function(coord) {
    var array = [];
    var size = coord.length;
    if(size != this.dim.length) {
        for (var j = 0; j < this.dim[this.dim.length - 1 - size]; j++) {
            array.push(this.toArrayRecursive(ArrayUtils.concat([j], coord)));
        }
        return array;
    } else  {
        return this.get(coord);
    }
}

DenseNDArray.prototype.toString = function() {
    return this.toStringRecursive([]);
}

DenseNDArray.prototype.toStringRecursive = function(coord) {
    var stringBuilder = [];
    var size = coord.length;
    if(size != this.dim.length) {
        stringBuilder.push("[");
        for(var j = 0; j < this.dim[this.dim.length - 1 - size]; j++) {
            stringBuilder.push(this.toStringRecursive(ArrayUtils.concat([j], coord)));
        }
        stringBuilder.push("]");
    } else {
        stringBuilder.push(`${this.get(coord)}, `);
    }
    return stringBuilder.join("");
}

DenseNDArray.prototype.copy = function() {
    return DenseNDArray.of(this.denseNDArray, this.dim);
}

DenseNDArray.prototype.equals = function(o) {
    if (this == o) return true;
    if (o == null || this.prototype != o.prototype) return false;
    return ArrayUtils.arrayEquals(this.denseNDArray, o.denseNDArray) &&
           ArrayUtils.arrayEquals(this.powers, o.powers) &&
           ArrayUtils.arrayEquals(this.dim, o.dim);
}

DenseNDArray.prototype.hashCode = function() {
    throw "To be implemented in near future";
}

DenseNDArray.prototype.getIndex = function(x) {
    var index = 0;
    var size = Math.min(x.length, this.dim.length);
    // this strange loop is for the case where |x| < |dim|
    for (var i = 0; i < size; i++) {
        index += x[x.length - i - 1] * this.powers[this.dim.length - i - 1];
    }
    return index;
}

DenseNDArray.prototype.computeNewDim = function(intervals) {
    var dimBuff = [];
    for (var i = 0; i < intervals.length; i++) {
        var dx = intervals[i][1] - intervals[i][0];
        if (dx !== 0) {
            dimBuff.push(dx + 1);
        }
    }
    var newDim = [];
    for (var i = 0; i < dimBuff.length; i++) {
        newDim[i] = dimBuff[i];
    }
    return newDim;
}

DenseNDArray.prototype.getIntervalFromStr = function(x) {
    var split = x.split(" ").join("").split(",");
    this.checkIfCoordSizeCompatible(split.length);
    var intervals = [];
    for (var i = 0; i < split.length; i++) {
        var intervalBounds = split[i].split(":");
        switch (intervalBounds.length) {
            case 1:
                var integer = parseInt(intervalBounds[0]);
                intervals[i] = [integer, integer];
                break;
            case 2:
                var xmin = Math.max(0, Math.min(this.dim[i]-1, "" == intervalBounds[0] ? 0 : parseInt(intervalBounds[0])));
                var xmax = Math.max(0, Math.min(this.dim[i]-1, "" == intervalBounds[1] ? this.dim[i] - 1 : parseInt(intervalBounds[1])));
                var myInterval = [xmin, xmax];
                if (xmax - xmin === 0) {
                    throw `empty interval xmax : ${xmax} < xmin : ${xmin}`;
                }
                intervals[i] = myInterval;
                break;
            default:
        }
    }
    return intervals;
}

DenseNDArray.prototype.checkIfIndexOutOfBounds = function(coord) {
    let isZeroDimOutOfBounds = (this.dim.length == 0 && coord[0] > 0);
    let isOutOfBounds = this.dim.length != 0 && ArrayUtils.binaryOp(coord, this.dim, (x, y) => x >= 0 && x < y ? 0 : 1).reduce((e, x) => e + x) > 0;
    if (isZeroDimOutOfBounds || isOutOfBounds) throw `index out of bounds ${coord}, actual shape is ${this.dim}` 
}

DenseNDArray.prototype.checkIfCoordSizeCompatible = function(size) {
    if (this.dim.length != 0 && size > this.dim.length) throw `Size dimension incorrect : ${size}. Correct size dimension should be less or equal ${this.dim.length}`;
}

DenseNDArray.prototype.reshape = function(newShape) {
    return DenseNDArray.of(this, newShape);
}

/**
 * Binary operation between two dense arrays with broadcasting.
 * @param {*} denseNDArray 
 * @param {*} binaryOperator 
 */
DenseNDArray.prototype.binaryOp =function(denseNDArray, binaryOperator) {
    var s1 = this.shape();

    // if denseNDArray is a number 
    var dense = typeof denseNDArray == "number" ? DenseNDArray.of(denseNDArray) : denseNDArray; 
    var s2 = dense.shape();

    var small = s1.length < s2.length ? s1 : s2;
    var large = s1.length < s2.length ? s2 : s1;
    
    var newShape = [];
    for(let i = 0; i < small.length; i++) {
       try{
           newShape.push(auxBroadCast(small[small.length - i - 1], large[large.length - i - 1]));
       } catch(e) {
           throw `Dimensions ${s1} and ${s2} are not compatible for brodcast`;
       }
    }
    for(let i = small.length; i < large.length; i++) {
        newShape.push(large[large.length - i - 1]);
    }
    newShape = newShape.reverse();
    var ans = new DenseNDArray(newShape);
    return ans.transformWithIndex((x, index) => {
        let a = this.get(getBroadCastIndex(this, index));
        let b = dense.get(getBroadCastIndex(dense, index));
        return binaryOperator(a,b);
    });
}

/**
 * Static functions
 */
/**
 * Create DenseArray from old DenseArray or JsArray, it can also reshape
 */
DenseNDArray.of = function(array, dim) {
    if(array instanceof DenseNDArray) {
        return dim === undefined ? new DenseNDArray(array.dim, array.denseNDArray) : new DenseNDArray(dim, array.denseNDArray)
    }
    if(!checkIfArrayIsLinear(array)) return buildDenseFromJsArray(array);
    if(array.length > 0 && dim === undefined) return new DenseNDArray([array.length], array);
    return new DenseNDArray(dim, array);
}

/**
 * Auxiliar functions 
 */
function checkIfArrayIsLinear(array) {
    return array.length > 0 && array[0].length === undefined;
}


function buildDenseFromJsArray(array) {
    var dim = ArrayUtils.findJsArrayDim(array);
    var ans = ArrayUtils.unpackJsArray(array);
    return DenseNDArray.of(ans, dim);
}

function computePowers(dim) {
    var powers = [];
    var acc = 1;
    powers[0] = acc;
    for (var i = 0; i < dim.length; i++) {
        acc *= dim[i];
        powers[i + 1] = acc;
    }
    return powers;
}

/**
 * @param {*} a 
 * @param {*} b 
 */
function auxBroadCast(a,b) {
    if(a == b) return a;
    if(a == 1 || b == 1) return a * b;
    throw "values are not one and they are different ";
}

function getBroadCastIndex(dense, coord) {
    let shape = dense.shape();
    var ans = [];
    for(let i = 0; i < shape.length; i++) {
        ans.unshift(shape[shape.length - 1 - i] == 1 ? 0 : coord[coord.length - 1 - i]);
    }
    //if shape is empty (0-dim array) => ans is empty need to add trivial value
    return ans.length == 0 ? ans.concat(0) : ans;
}

module.exports = DenseNDArray;
},{"../../ArrayUtils/main/ArrayUtils.js":1}],3:[function(require,module,exports){
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

},{"../../ArrayUtils/main/ArrayUtils.js":1,"../../UnitTest/main/UnitTest.js":4,"../main/DenseNDArray.js":2}],4:[function(require,module,exports){
var UnitTest = {};

function countFieldsInObj(objFunction) {
    var count = 0;
    for (var key in objFunction)
        if (objFunction.hasOwnProperty(key)) count++;
    return count;
}

UnitTest.Assert = function(test) {
    return new function() {
        this.testFunction = test;
        this.index = 0;
    
        this.assertTrue = function(boolean) {
            if(!boolean) throw "Assertion failed : " + [this.testFunction, this.testFunction.name, this.index];
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
                     {name : "Function", predicate: x => countFieldsInObj(x) == 0},
                     {name : "Object", predicate: x => countFieldsInObj(x) > 0}
                    ];
        var map  = {
            "Function": () => this.tests.push(test),
            "Object": () => {
                for(var f in test) {
                    if(typeof test[f] == "function") this.tests.push(test[f]);
                }
            }
        }
        types.forEach(type => {
            if(type.predicate(test)) map[type.name]();
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
},{}]},{},[3]);
