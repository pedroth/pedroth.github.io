var UnitTest = require('../../UnitTest/main/UnitTest.js');
var Choice = require("../main/Choice.js");

var testChoice = function() {
    var assertion = UnitTest.Assert(this);
    var samples = 100;
    var i = 0;

    var opt1 = "choice_1";
    var opt2 = "choice_2";

    var choice = new Choice(opt1, opt2, () => i % 2 == 0);
    for(; i < samples; i++) {
        if(i % 2 == 0) {
            assertion.assertTrue(opt1 === choice.get());
        } else {
            assertion.assertTrue(opt2 === choice.get());
        }
    }

    var small = Choice.of("small", "large").chooseFirstIf(() => true).get();
    var large = Choice.of("small", "large").chooseFirstIf(() => false).get();
    assertion.assertTrue(small == "small");
    assertion.assertTrue(large == "large");
}


UnitTest.builder()
        .addLogger(UnitTest.bodyLogger)
        .push(testChoice)
        .test()