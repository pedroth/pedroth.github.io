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

ArrayUtils.range = function(xmin, xmax, step=1) {
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
        assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.range(0, 10, 2), [0, 2, 4, 6, 8]));
        assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.range(0, 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
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
},{"../../Stream/main/Stream.js":4,"../../UnitTest/main/UnitTest.js":5,"../main/ArrayUtils.js":1}],3:[function(require,module,exports){
var Function = function(f) {
    this.f = f;
}

Function.prototype.compose = function(g) {
    return new Function(x => this.f(g(x)));
}

Function.prototype.leftCompose = function(g) {
    return new Function(x => g(this.f(x)))
}

Function.prototype.apply = function(x) {
    return this.f(x);
}

Function.prototype.get = function() {
    return this.f;
}

Function.of = function(f) {
    return new Function(f);
}

module.exports = Function;
},{}],4:[function(require,module,exports){
var Function = require("../../Function/main/Function.js");
/**
 * The Stream constructor
 * @param {*} generator is an object that implements hasNext() and next() functions
 * @param {*} mapFunction 
 */
var Stream = function(generator, mapFunction=x => x, filterPredicate=x => true) {
    this.gen = generator;
    this.mapFunction = mapFunction;
    this.filterPredicate = filterPredicate;
}

Stream.prototype.map = function(f) {
    return new Stream(this.gen, Function.of(f).compose(this.mapFunction).get(), this.filterPredicate);
}

Stream.prototype.reduce = function(identity, binaryOp) {
    while (this.gen.hasNext()) {
        let value = this.gen.next();
        if(this.filterPredicate(value))
            identity = binaryOp(identity, this.mapFunction(value));
    } 
    return identity;
}
/**
 * ForEach function on stream
 * @param {*} consumer: is a x => void function 
 */
Stream.prototype.forEach = function(consumer) {
    while (this.gen.hasNext()) {
        let value = this.gen.next();
        if(this.filterPredicate(value))
            consumer(value);
    }
}

/**
 * 
 * @param {*} collector: is an object with the identity, and reduce attributes
 * 
 *  The collector.reduce is a \lambda (identity, acc) => identity. 
 */
Stream.prototype.collect = function(collector) {
    return this.reduce(collector.identity, collector.reduce);
}

/**
 * @param {*} predicate is a \lambda (x) => {true, false}
 * This function choses the elementes where predicate(x) = true
 */
Stream.prototype.filter = function(predicate) {
    return new Stream(this.gen, this.mapFunction, Function.of(predicate).compose(this.filterPredicate));
}

/**
 * Take first n elements
 */
Stream.prototype.take = function(n) {
    return new Stream(
        Stream.generatorOf({i: 0 , gen: this.gen}, s => {return {i: s.i + 1, gen: s.gen}}, s => s.gen.next(), s => s.gen.hasNext() && s.i < n),
        this.mapFunction,
        this.filterPredicate
    ).collect(Stream.Collectors.toArray());
}

Stream.prototype.takeWhile = function(predicate) {
    new Stream(
        Stream.generatorOf({p: predicate, gen: this.gen, v: null}, s => { return {p: predicate, gen: s.gen, v: s.gen.hasNext() ? gen.next(): null} }, s => s.v, s =>  s.v != null && s.p(s.v)),
        this.mapFunction,
        this.filterPredicate
    ).collect(Stream.Collectors.toArray());
}

Stream.prototype.head = function() {
    return this.gen.next();
}

Stream.prototype.tail = function() {
    this.gen.next();
    return new Stream(this.gen, this.mapFunction, this.filterPredicate);
}

Stream.of = function(iterable) {
    var types = [
        {name:"Array", predicate: x => x.constructor === Array},
        {name: "Generator", predicate: x => typeof x.hasNext === "function" && typeof x.next === "function"}
    ];
    var types2GeneratorMap = {
        "Array": () => new Stream(Stream.generatorOf({ i: 0, array: iterable },
                                                     s => { return { i: s.i + 1, array: s.array}; },
                                                     s => s.array[s.i],
                                                     s => s.i < s.array.length)
                                                    ),
        "Generator" : () => new Stream(iterable)
    }
    for (let i=0; i < types.length; i++) {
        if(types[i].predicate(iterable)) 
            return types2GeneratorMap[types[i].name]();
    }
    throw `Iterable ${iterable} does not have a stream`;
}

Stream.range = function(init, end, step) {
    return new Stream(Stream.generatorOf(init, 
                                         s => s + (step == null ? 1 : step),
                                         s => s,
                                         s => s < end
                                        )
                     );
}

Stream.generatorOf = function(initialState, nextStateFunction, getFromStateFunction, hasNextStateFunction) {
    var s = initialState;
    return {
        hasNext: () => hasNextStateFunction(s),
        next: () => {
            var ans = getFromStateFunction(s);
            s = nextStateFunction(s);
            return ans;
        }
    };
}

Stream.Collectors = {
    toArray: () => new function(){ this.identity = []; this.reduce = (acc, x) => { acc.push(x); return acc;}} 
}
module.exports = Stream;
},{"../../Function/main/Function.js":3}],5:[function(require,module,exports){
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
},{}]},{},[2]);
