(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var UnitTest = require('../../UnitTest/main/UnitTest.js');
var Function = require("../main/Function.js");

var FunctionTest = function() {
    this.testComposition = function() {
        var assert = UnitTest.Assert(this);
        var h = Function.of(x=> x * x).compose(Math.sqrt);
        var j = Function.of(Math.sqrt).compose(x => x * x);
        assert.assertTrue(Math.abs(h.f(2) - 2) < 1E-6);
        assert.assertTrue(Math.abs(j.apply(2) - 2) < 1E-6);
        assert.assertTrue(Math.abs(j.get()(2) - 2) < 1E-6);
    }
}

UnitTest.builder()
        .addLogger(UnitTest.bodyLogger)
        .push(new FunctionTest)
        .test()
},{"../../UnitTest/main/UnitTest.js":3,"../main/Function.js":1}],3:[function(require,module,exports){
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
},{}]},{},[2]);
