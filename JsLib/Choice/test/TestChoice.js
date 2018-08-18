var UnitTest = require('../../UnitTest/main/UnitTest.js');
var Choice = require("../main/Choice.js");

var testChoice = function() {
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