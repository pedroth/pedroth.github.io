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
var Choice = require("../main/Choice.js");

var Assertion = function(test) {
    this.testFunction = test;
    this.index = 0;

    this.assertTrue = function(boolean) {
        if(!boolean) throw "Assertion failed : " + [this.testFunction, this.index];
        console.log("Assertion successful : " + [this.testFunction, this.index]);
        this.index++;
    }
};


var Test1 = function() {
    this.test = function() {
        var assertion = new Assertion(this.test);
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
}


var tests = [
    new Test1()
]

for(var i = 0; i < tests.length; i++) {
    tests[i].test();
}
},{"../main/Choice.js":1}]},{},[2]);
