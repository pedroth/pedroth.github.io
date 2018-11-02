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