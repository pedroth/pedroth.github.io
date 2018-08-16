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
    var size = this.size();
    for (var i = 0; i < size; i++) {
        f(this.denseNDArray[i]);
    }
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
            array.push(this.toArrayRecursive(ArrayUtils.join([j], coord)));
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
            stringBuilder.push(this.toStringRecursive(ArrayUtils.join([j], coord)));
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

function findJsArrayDim(array) {
    var dim = [];
    if(array instanceof Array) {
        return ArrayUtils.join(findJsArrayDim(array[0]), [array.length]); 
    } else {
        return [];
    }
}

function unpackJsArray(array) {
    if(array instanceof Array) {
        var joinIdentity = []
        for(var i = 0; i < array.length; i++) {
            joinIdentity = ArrayUtils.join(joinIdentity, unpackJsArray(array[i]));
        }
        return joinIdentity;
    } else {
        return [array];
    }
}

function buildDenseFromJsArray(array) {
    var dim = findJsArrayDim(array);
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