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
    var aux = [1, 0];
    var acc = 1;
    powers[0] = acc;
    // special case
    if(dim.length == 1) {
        powers[1] = dim[0];
        return powers;
    }
    for (var i = 0; i < dim.length; i++) {
        // to be row major like numpy
        var j = i < 2 ? aux[i] : i;
        acc *= dim[j];
        powers[i + 1] = acc;
    }
    return powers;
}
/****/
/*
 * First implementation doesn't care about type checking, assumes client knows how to use this class
 */
 var DenseNDArray = function(dim, array) {
    this.dim = dim;
    this.powers = [];
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

DenseNDArray.prototype.getIndex = function(x) {
        var aux = [1, 0];
        var index = 0;
        //special case
        if(x.length == 1) return x[0];
        for (var i = 0; i < this.dim.length; i++) {
            // to be row major like numpy
            var j = i < 2 ? aux[i] : i;
            index += x[j] * this.powers[i];
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

DenseNDArray.prototype.copy = function() {
    return DenseNDArray.of(this.dim, this.denseNDArray);
}

DenseNDArray.prototype.map = function(lambda) {
    var ans = this.copy();
    ans.forEach(lambda);
    return ans;
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

module.exports = DenseNDArray;