(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

DenseNDArray.prototype.forEach = function(f) {
    var size = size();
    for (var i = 0; i < size; i++) {
        f(this.denseNDArray[i]);
    }
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
        throw "get only accepts strings and integer arrays";
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

DenseNDArray.prototype.toArray = function() {
    return this.toArrayRecursive([]);
}

DenseNDArray.prototype.toArrayRecursive = function(coord) {
    var array = [];
    var size = coord.length;
    if(size != this.dim.length) {
        for (var j = 0; j < this.dim[this.dim.length - 1 - size]; j++) {
            array.push(this.toArrayRecursive(join([j], coord)));
        }
        return array;
    } else  {
        return this.get(coord);
    }
}

DenseNDArray.prototype.toString = function() {
    return this.toArrayRecursive([]);
}

DenseNDArray.prototype.toStringRecursive = function(coord) {
    var stringBuilder = [];
    var size = coord.length;
    if(size != this.dim.length) {
        stringBuilder.push("[");
        for(var j = 0; j < this.dim[this.dim.length - 1 - size]; j++) {
            stringBuilder.append(this.toStringRecursive(join([j], coord)));
        }
        stringBuilder.push("]");
    } else {
        stringBuilder.push(`${this.get(coord)}, `);
    }
    return stringBuilder.join("");
}

DenseNDArray.prototype.copy = function() {
    return DenseNDArray.of(this.dim, this.denseNDArray);
}

DenseNDArray.prototype.map = function(lambda) {
    var ans = this.copy();
    var size = size();
    for (var i = 0; i < size; i++) {
        ans.denseNDArray[i] = f(this.denseNDArray[i]);
    }
    return ans;
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
    var split = x.replace(" ", "").split(",");
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
function join(a1, a2) {
    var copy = [];
    for(var i = 0; i < a1.length; i++) copy.push(a1[i]);
    for(var i = 0; i < a2.length; i++) copy.push(a2[i]);
    return copy;
}

function checkIfArrayIsLinear(array) {
    return array.length > 0 && array[0].length === undefined;
}

function unpackJsArray(array) {
    if(array instanceof Array) {
        var joinIdentity = []
        for(var i = 0; i < array.length; i++) {
            joinIdentity = join(joinIdentity, unpackJsArray(array[i]));
        }
        return joinIdentity;
    } else {
        return [array];
    }
}

function findJsArrayDim(array) {
    var dim = [];
    if(array instanceof Array) {
        return join(findJsArrayDim(array[0]), [array.length]); 
    } else {
        return [];
    }
}

function buildDenseFromJsArray(array) {
    var dim = findJsArrayDim(array);
    if(dim.length >= 2) {
        // exchange index 0 with index 1, to maintain row major
        dim[0] = dim[0] + dim[1];
        dim[1] = dim[0] - dim[1];
        dim[0] = dim[0] - dim[1];
    }
    var ans = unpackJsArray(array);
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
},{}],2:[function(require,module,exports){
var DenseNDArray = require('../main/DenseNDArray.js');

var Assertion = function(test) {
    this.testFunction = test;
    this.index = 0;

    this.assertTrue = function(boolean) {
        if(!boolean) throw "Assertion failed : " + [this.testFunction, this.index];
        console.log("Assertion successful : " + [this.testFunction, this.index]);
        this.index++;
    }
};

function Tester() {
    this.basicTest = function() {
        var assert = new Assertion(this.basicTest);
        
        var denseNDArray = new DenseNDArray([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.assertTrue(denseNDArray.get([0,0]) == 1);
        assert.assertTrue(denseNDArray.get([1,2]) == 8);
        assert.assertTrue(denseNDArray.get([0,2]) == 7);
        assert.assertTrue(denseNDArray.get([2,1]) == 6);
        assert.assertTrue(denseNDArray.get([1,1]) == 5);

        var denseNDArray1 = DenseNDArray.of(denseNDArray, [9,1]);
        assert.assertTrue(denseNDArray1.get([0,0]) == 1);
        assert.assertTrue(denseNDArray1.get([4,0]) == 5);
        assert.assertTrue(denseNDArray1.get([8,0]) == 9);

        var denseNDArray2 = DenseNDArray.of(denseNDArray, [9]);
        assert.assertTrue(denseNDArray2.get([0]) == 1);
        assert.assertTrue(denseNDArray2.get([4]) == 5);
        assert.assertTrue(denseNDArray2.get([8]) == 9);
        
        assert.assertTrue(denseNDArray.get("1,2") == 8.0);
        assert.assertTrue(denseNDArray.get("1,1") == 5.0);
        
        assert.assertTrue(DenseNDArray.of([[1,2],[3,4],[5,6]]).get([1,0]) == 3);
        assert.assertTrue(DenseNDArray.of([[1,2],[3,4],[5,6]]).get([2,1]) == 6);
        assert.assertTrue(DenseNDArray.of([[[1, 2], [3, 4], [5, 6]],[[7, 8], [9, 10], [11, 12]],[[13, 14], [15, 16], [17, 18]]]).get([2,1,2]) == 18);
        assert.assertTrue(DenseNDArray.of([[[1, 2], [3, 4], [5, 6]],[[7, 8], [9, 10], [11, 12]],[[13, 14], [15, 16], [17, 18]]]).get("1,1,1") == 10);
        
    }

    this.denseTest = function() {
        var assert = new Assertion(this.denseTest);
        var table = new DenseNDArray([3, 3, 3]);
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 3; k++) {
                    table.set([i, j, k], i + 3 * j + 9 * k);
                }
            }
        }
        console.log(table);

        assert.assertTrue(table.get("1,:,:").get([0, 0]) === 1);
        assert.assertTrue(table.get("1,:,:").get([1, 1]) === 13);
        assert.assertTrue(table.get("1,:,:").get([2, 2]) === 25);

        var secondTable = table.get("0:1,1:2,:");
        assert.assertTrue(secondTable.get([1,1,0]) === 7);
        assert.assertTrue(secondTable.get([1,1,1]) === 16);
        assert.assertTrue(secondTable.get([1,1,2]) === 25);

        var thirdTable = new DenseNDArray([3, 3]);
        for (var j = 0; j < 3; j++) {
            for (var i = 0; i < 3; i++) {
                thirdTable.set([i, j], 100);
            }
        }

        table.set("1,:,:", thirdTable);

        assert.assertTrue(table.get( [0, 0, 0 ]) === 0);
        assert.assertTrue(table.get( [1, 1, 1 ]) === 100 && table.get([1, 2, 1]) === 100);
        assert.assertTrue(table.get( [2, 2, 2 ]) === 26);

        var denseNDArray = table.get("1:,0:,:1");
        console.log(table.toArray());
        assert.assertTrue(denseNDArray.dim[0] == 2 && denseNDArray.dim[1] == 3 && denseNDArray.dim[2] == 2);
        assert.assertTrue(11 == denseNDArray.get([1, 1, 1]));
    }

    for(key in this) {
        this[key]();
    }
}

new Tester();

},{"../main/DenseNDArray.js":1}]},{},[2]);
