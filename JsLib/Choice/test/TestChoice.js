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