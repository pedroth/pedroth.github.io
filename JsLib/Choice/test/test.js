(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Choice = function(opt1, opt2, predicate) {
    this.opt1 = opt1;
    this.opt2 = opt2;

    this.get = function() {
        if(predicate()) return this.opt1;
        return this.opt2;
    }
}

module.exports = Choice;
},{}],2:[function(require,module,exports){
var UnitTest = require('../../UnitTest/main/UnitTest.js');
var Choice = require("../main/Choice.js");

testChoice = function() {
    var assertion = UnitTest.Assert(this);
    var samples = 100;
    var i = 0;

    var opt1 = "choice_1";
    var opt2 = "choice_2";

    var choice = new Choice(opt1, opt2, function() { return i % 2 == 0; });
    for(; i < samples; i++) {
        if(i % 2 == 0) {
            assertion.assertTrue(opt1 === choice.get());
        } else {
            assertion.assertTrue(opt2 === choice.get());
        }
    }
}


UnitTest.builder()
        .addLogger(UnitTest.bodyLogger)
        .push(testChoice)
        .test()
},{"../../UnitTest/main/UnitTest.js":3,"../main/Choice.js":1}],3:[function(require,module,exports){
var UnitTest = {};

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
        this.tests.push(test);
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
            if(!this.asserts[i][0]) this.log(this.asserts[i][1]);
        }
    }
}

module.exports = UnitTest;
},{}]},{},[2]);
