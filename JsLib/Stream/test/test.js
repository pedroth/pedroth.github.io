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
},{}],3:[function(require,module,exports){
var Function = require("../../Function/main/Function.js");
/**
 * The Stream constructor
 * @param {*} generator is an object that implements hasNext() and next() functions
 * @param {*} mapFunction 
 */
var Stream = function(generator, mapFunction) {
    this.gen = generator;
    this.mapFunction = mapFunction == null ? x => x : mapFunction;
}

Stream.prototype.map = function(f) {
    return new Stream(this.gen, Function.of(f).compose(this.mapFunction).get());
}

Stream.prototype.reduce = function(identity, binaryOp) {
    while (this.gen.hasNext()) identity = binaryOp(identity, this.mapFunction(this.gen.next()));
    return identity;
}
/**
 * ForEach function on stream
 * @param {*} consumer: is a x => void function 
 */
Stream.prototype.forEach = function(consumer) {
    while (this.gen.hasNext()) consumer(this.gen.next());
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
module.exports = Stream;
},{"../../Function/main/Function.js":2}],4:[function(require,module,exports){
var UnitTest = require('../../UnitTest/main/UnitTest.js');
var ArrayUtils = require('../../ArrayUtils/main/ArrayUtils.js');
var Stream = require("../main/Stream.js");

var TestStreams = function() {
    this.mapTest = () => {
        var assert = UnitTest.Assert(this);
        var array = [1, 2, 3, 4, 5];
        assert.assertTrue(Stream.of(array)
                                .map(x => x * x)
                                .reduce(0, (x, y) => x + y) == array.map(x => x * x).reduce((x, y) => x + y, 0)
                         );
        assert.assertTrue(ArrayUtils.arrayEquals(array, Stream.of(Stream.generatorOf(1, s=>s+1, s=>s, s=>s <= 5))
                                                              .map(x=>x*x)
                                                              .map(Math.sqrt)
                                                              .reduce([], (x,y) => x.concat(y))
                                                )
                         );
    }

    this.reduceTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(Stream.range(1,6).map(x => x * x).reduce(0, (x, y) => x + y) == ArrayUtils.range(1,6,1).map(x => x * x).reduce((x, y) => x + y, 0));
        assert.assertTrue(Stream.range(1,6,2).map(x => x * x).reduce(1, (x, y) => x * y) == ArrayUtils.range(1,6,2).map(x => x * x).reduce((x, y) => x * y, 1));
    }
}

UnitTest.builder()
        .addLogger(UnitTest.bodyLogger)
        .push(new TestStreams())
        .test()
},{"../../ArrayUtils/main/ArrayUtils.js":1,"../../UnitTest/main/UnitTest.js":5,"../main/Stream.js":3}],5:[function(require,module,exports){
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
