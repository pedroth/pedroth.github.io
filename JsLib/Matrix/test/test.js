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
    if(x.constructor === Array) {
        this.checkIndexDimension(x.length);
        return this.denseNDArray[this.getIndex(x)];
    } else if(x.constructor === String) {
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
    } else {
        throw "method 'get' only accepts strings and integer arrays";
    }
}

DenseNDArray.prototype.set = function(x, value) {
    if(x.constructor === Array && value.constructor != Array) {
        this.checkIndexDimension(x.length);
        this.denseNDArray[this.getIndex(x)] = value;
    } else if(x.constructor === String && value.constructor === DenseNDArray) {
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
    } else {
        throw "set only accepts strings and integer arrays as the first argument and objects and DenseNDArray as the second";
    }
}

DenseNDArray.prototype.map = function(f) {
    var ans = this.copy();
    var size = this.size();
    for (var i = 0; i < size; i++) {
        ans.denseNDArray[i] = f(this.denseNDArray[i]);
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

/**
 * DenseArray to js array in column major order 
 */
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
    
}

DenseNDArray.prototype.getIndex = function(x) {
    var index = 0;
    for (var i = 0; i < this.dim.length; i++) {
        index += x[i] * this.powers[i];
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
    this.checkIndexDimension(split.length);
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
                    throw "empty interval xmax : " + xmax + " < xmin : " + xmin;
                }
                intervals[i] = myInterval;
                break;
            default:
        }
    }
    return intervals;
}

DenseNDArray.prototype.checkIndexDimension = function(d) {
    if (d != this.dim.length) {
        throw "index dimension incorrect : " + d + " correct dimension should be : " + this.dim.length;
    }
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
    var dense = !isNaN(denseNDArray) ? DenseNDArray.of(denseNDArray) : denseNDArray; 
    var s2 = dense.shape();

    var small = s1.length < s2.length ? s1 : s2;
    var large = s1.length < s2.length ? s2 : s1;
    
    var newShape = [];
    for(let i = 0; i < small.length; i++) {
        newShape.push(small[i] == 1 ? large[i] : (large[i]  ));
    }
    for(let i = small.length; i < large.length; i++) {
        newShape.push(large[i]);
    }
    return 1;
    
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

module.exports = DenseNDArray;
},{"../../ArrayUtils/main/ArrayUtils.js":1}],3:[function(require,module,exports){
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
},{"../../ArrayUtils/main/ArrayUtils.js":1,"../../DenseNDArray/main/DenseNDArray.js":2}],4:[function(require,module,exports){
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
 
},{"../../ArrayUtils/main/ArrayUtils.js":1,"../../UnitTest/main/UnitTest.js":5,"../main/Matrix.js":3}],5:[function(require,module,exports){
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
},{}]},{},[4]);
