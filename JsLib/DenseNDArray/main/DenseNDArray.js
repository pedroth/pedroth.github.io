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