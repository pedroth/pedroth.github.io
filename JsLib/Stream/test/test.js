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
 * @param {*} generator is an object that implements hasNext(), next() and peek() functions
 * @param {*} mapFunction 
 */
var Stream = function(generator, mapFunction=x => x, filterPredicate=x => true) {
    this.gen = generator;
    this.mapFunction = mapFunction;
    this.filterPredicate = filterPredicate;
}

Stream.prototype.state = function () {
    return this.gen.state;
}

Stream.prototype.hasNext = function() {
    return this.gen.hasNext(this.state());
}

Stream.prototype.head = function () {
    return this.gen.peek(this.state());
}

Stream.prototype.tail = function () {
    return new Stream(
        Stream.generatorOf(
            this.gen.next(this.state()),
            this.gen.next,
            this.gen.peek,
            this.gen.hasNext
        ),
        this.mapFunction,
        this.filterPredicate
    )
}

Stream.prototype.map = function(f) {
    return new Stream(this.gen, Function.of(f).compose(this.mapFunction).get(), this.filterPredicate);
}

Stream.prototype.reduce = function(identity, binaryOp) {
    var stream =  this;
    while (stream.hasNext()) {
        let value = stream.head();
        if(stream.filterPredicate(value)) {
            identity = binaryOp(identity, stream.mapFunction(value));
        }
        stream = stream.tail();
    } 
    return identity;
}
/**
 * ForEach function on stream
 * @param {*} consumer: is a x => void function 
 */
Stream.prototype.forEach = function(consumer) {
    var stream = this;
    while (stream.hasNext()) {
        let value = stream.head();
        if(stream.filterPredicate(value)) {
            consumer(stream.mapFunction(value));
        }
        stream = stream.tail();
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
    return new Stream(this.gen, this.mapFunction, x => this.filterPredicate(x) && predicate(x));
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
    return new Stream(
        Stream.generatorOf({gen: this.gen, val: null}, 
                            s => s,
                            s => s.val,
                            s => {
                                if(s.gen.hasNext()){
                                    s.val = s.gen.next();
                                    return predicate(s.val);
                                }
                                return false;
                            }
        ),
        this.mapFunction,
        this.filterPredicate
    ).collect(Stream.Collectors.toArray());
}

Stream.pair = function(head, tail) {
    return new Stream(
        Stream.generatorOf(
            [tail, head],
             s => {
                 let value = s.pop();
                 if(value.__proto__ == Stream.prototype) s.push(value);
                 return s;
             },
             s => {
                 let value = s[s.length - 1];
                 if (value.__proto__ == Stream.prototype) return value.head(); 
                 return value;
             },
             s => s.length > 1 || s[0].gen.hasNext() 
        ),
        tail.mapFunction,
        tail.filterPredicate
    );   
}

Stream.of = function(iterable) {
    var types = [
        {name:"Array", predicate: x => x.constructor === Array},
        {name: "Generator", predicate: x => typeof x.hasNext === "function" && typeof x.next === "function" && typeof x.peek == "function"},
        {name: "Stream", predicate: x => x.__proto__ == Stream.prototype}
    ];
    var types2GeneratorMap = {
        "Array": ite => new Stream(Stream.generatorOf(
                                                     { i: 0, array: ite },
                                                     s => { return { i: s.i + 1, array: s.array}; },
                                                     s => s.array[s.i],
                                                     s => s.i < s.array.length)
                                                    ),
        "Generator" : ite => new Stream(ite),
        "Stream": ite => new Stream(ite.gen, ite.mapFunction, ite.filterPredicate)
    }
    for (let i=0; i < types.length; i++) {
        if(types[i].predicate(iterable)) {
            return types2GeneratorMap[types[i].name](iterable);
        }
    }
    throw `Iterable ${iterable} does not have a stream`;
}

Stream.range = function(init, end, step=1) {
    return new Stream(Stream.generatorOf(
                                         init, 
                                         s => s + step,
                                         s => s,
                                         s => end == null ? true : s < end
                                        )
                     );
}

Stream.generatorOf = function(initialState, nextStateFunction, getFromStateFunction, hasNextStateFunction) {
    return new function() {
        this.state = initialState;
        this.hasNext = hasNextStateFunction;
        this.next = nextStateFunction;
        this.peek = getFromStateFunction;
    };
}

Stream.Collectors = {
    toArray: () => new function(){ 
        this.identity = []; 
        this.reduce = (acc, x) => { acc.push(x); return acc;}
    } 
}
module.exports = Stream;
},{"../../Function/main/Function.js":2}],4:[function(require,module,exports){
var UnitTest = require('../../UnitTest/main/UnitTest.js');
var ArrayUtils = require('../../ArrayUtils/main/ArrayUtils.js');
var Stream = require("../main/Stream.js");

function primesSieveRecursive(stream) {
    let p = stream.head();
    return Stream.of(Stream.pair(p, stream.tail().filter(x => x % p != 0)));
}

function primesSieve() {
    return primesSieveRecursive(Stream.range(2));
}

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

    this.collectTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(ArrayUtils.arrayEquals(Stream.range(0,10).collect(Stream.Collectors.toArray()), ArrayUtils.range(0,10)));
    }

    this.headTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(Stream.range(0,100).head() == 0)
    }

    this.tailTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(ArrayUtils.arrayEquals(Stream.range(0,100).tail().collect(Stream.Collectors.toArray()), ArrayUtils.range(1,100)));
    }

    this.takeTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(ArrayUtils.arrayEquals(Stream.range(0,100).take(10), ArrayUtils.range(0,10)));
        assert.assertTrue(ArrayUtils.arrayEquals(Stream.range(0,100).takeWhile(x => x < 10), ArrayUtils.range(0,10)));
    }

    this.filterTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(ArrayUtils.arrayEquals(Stream.range(0, 100)
                                                       .filter(x => x % 2 == 0)
                                                       .collect(Stream.Collectors.toArray()),
                                                 ArrayUtils.range(0, 100).filter(x => x % 2 == 0)
        ));
    }

    this.forEachTest = () => {
        var assert = UnitTest.Assert(this);
        let stack = [];
        Stream.range(0, 10).map(x => x * x).filter(x => x % 2 == 0).forEach(x => stack.push(x));
        assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.range(0,10).map(x => x * x).filter(x=>x % 2 == 0), stack));
    }

    this.ofTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(ArrayUtils.arrayEquals(
                            ArrayUtils.range(0, 10),
                            Stream.of(ArrayUtils.range(0, 10)).collect(Stream.Collectors.toArray())
                         ));
        assert.assertTrue(ArrayUtils.arrayEquals(
                            Stream.range(0,10).collect(Stream.Collectors.toArray()),
                            Stream.of(Stream.range(0, 10)).collect(Stream.Collectors.toArray())
                        ));
        assert.assertTrue(ArrayUtils.arrayEquals(
                            Stream.of(Stream.generatorOf(0, s => s + 1, s=>String.fromCharCode(s), s => s < 10)).collect(Stream.Collectors.toArray()),
                            ArrayUtils.range(0,10).map(x => String.fromCharCode(x))
        ));
    }

    this.primeSieveTest = () => {
        let primes =  [2, 3, 5, 7, 11, 13];
        var assert = UnitTest.Assert(this);
        assert.assertTrue(ArrayUtils.arrayEquals(
            primes,
            primesSieve().take(6)
        ));
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
},{}]},{},[4]);
