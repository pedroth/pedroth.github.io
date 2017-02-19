(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
*
* First implementation doesn't care about type checking, assumes client knows how to use this class
*/
 var DenseNDArray = function(dim) {

    this.dim = dim;
    this.powers = [];
    this.denseNDArray = [];
    var acc = 1;
    this.powers[0] = acc;
    for (var i = 0; i < dim.length; i++) {
        acc *= dim[i];
        this.powers[i + 1] = acc;
    }
    for (var i = 0; i < this.powers[this.powers.length - 1]; i++) {
        this.denseNDArray[i] = null;
    }
}

DenseNDArray.prototype.size = function() {
        return this.powers[this.powers.length - 1];
    }

DenseNDArray.prototype.getIndex = function(x) {
        var index = 0;
        for (var i = 0; i < this.dim.length; i++) {
            index += x[i] * this.powers[i];
        }
        return index;
    }

DenseNDArray.prototype.forEach = function(f) {
        var size = size();
        for (var i = 0; i < size; i++) {
            denseNDArray.set(i, f(denseNDArray.get(i)));
        }
    }

DenseNDArray.prototype.checkIndexDimension = function(d) {
      if (d != this.dim.length) {
          throw "index dimension incorrect : " + d + " correct dimension should be : " + this.dim.length;
      }
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
        var split = x.split(",");
        this.checkIndexDimension(split.length);
        var intervals = [];
        for (var i = 0; i < split.length; i++) {
            var intervalBounds = split[i].split(":");
            intervalBounds = intervalBounds.length > 1 && "" === intervalBounds[0] ? [] : intervalBounds; 
            switch (intervalBounds.length) {
                case 0:
                    intervals[i] = [0, this.dim[i] - 1];
                    break;
                case 1:
                    var integer = parseInt(intervalBounds[0]);
                    intervals[i] = [integer, integer];
                    break;
                case 2:
                    var xmin = Math.max(0, Math.min(this.dim[i]-1, parseInt(intervalBounds[0])));
                    var xmax = Math.max(0, Math.min(this.dim[i]-1, parseInt(intervalBounds[1])));
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

DenseNDArray.prototype.get = function(x) {
        if(x.constructor === Array) {
            this.checkIndexDimension(x.length);
            return this.denseNDArray[this.getIndex(x)];
        } else if(x.constructor === String) {
            var intervals = this.getIntervalFromStr(x);
            var newDim = this.computeNewDim(intervals);
            var newDenseNDArray = new DenseNDArray(newDim);
            var size = newDenseNDArray.size();
            var y = [];
            for (var i = 0; i < size; i++) {
                var k = 0;
                for (var j = 0; j < intervals.length; j++) {
                    var interval = intervals[j];
                    var dx = interval[1] - interval[0];
                    var index = Math.floor(i % newDenseNDArray.powers[k + 1] / newDenseNDArray.powers[k]);
                    k = dx === 0 ? k : k + 1;
                    y[j] = dx === 0 ? interval[0] : interval[0] + index;
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
            for (var i = 0; i < size; i++) {
                var k = 0;
                for (var j = 0; j < intervals.length; j++) {
                    var interval = intervals[j];
                    var dx = interval[1] - interval[0];
                    var index = Math.floor(i % value.powers[k + 1] / value.powers[k]);
                    k = dx === 0 ? k : k + 1;
                    y[j] = dx === 0 ? interval[0] : interval[0] + index;
                }
                this.set(y, value.denseNDArray[i]);
            }
        } else {
            throw "set only accepts strings and integer arrays as the first argument and objects and DenseNDArray as the second";
        }
}

module.exports = DenseNDArray;
},{}],2:[function(require,module,exports){
var DenseNDArray = require('./DenseNDArray.js');

function denseTest() {
        var table = new DenseNDArray([3, 3, 3]);
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 3; k++) {
                    table.set([i, j, k], i + 3 * j + 9 * k);
                }
            }
        }
        for (var k = 0; k < 3; k++) {
            for (var j = 0; j < 3; j++) {
                for (var i = 0; i < 3; i++) {
                    console.log(table.get([i, j, k]));
                }
            }
        }

        console.log(table.get("1,:,:").get([0, 0]) === 1);
        console.log(table.get("1,:,:").get([1, 1]) === 13);
        console.log(table.get("1,:,:").get([2, 2]) === 25);

        var secondTable = table.get("0:1,1:2,:");
        console.log(secondTable.get([1,1,0]) === 7);
        console.log(secondTable.get([1,1,1]) === 16);
        console.log(secondTable.get([1,1,2]) === 25);

        var thirdTable = new DenseNDArray([3, 3]);
        for (var j = 0; j < 3; j++) {
            for (var i = 0; i < 3; i++) {
                thirdTable.set([i, j], 100);
            }
        }

        table.set("1,:,:", thirdTable);

        console.log(table.get( [0, 0, 0 ]) === 0);
        console.log(table.get( [1, 1, 1 ]) === 100 && table.get([1, 2, 1]) === 100);
        console.log(table.get( [2, 2, 2 ]) === 26);
}

denseTest();
},{"./DenseNDArray.js":1}]},{},[2]);
