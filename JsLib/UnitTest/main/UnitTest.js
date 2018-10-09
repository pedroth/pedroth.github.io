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