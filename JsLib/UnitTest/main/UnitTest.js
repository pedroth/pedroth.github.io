var UnitTest = {};

UnitTest.Assertion = function(test) {
        this.testFunction = test;
        this.index = 0;
    
        this.assertTrue = function(boolean) {
            if(!boolean) throw "Assertion failed : " + [this.testFunction, this.index];
            console.log("Assertion successful : " + [this.testFunction, this.index]);
            this.index++;
        }
};

UnitTest.builder = function() {
    return new UnitTest.UnitTestBuilder();
}

UnitTest.UnitTestBuilder = function(){
    this.tests = [];

    this.push = function(test){
        this.tests.push(test);
    }

    this.test = function(){
        this.test.forEach(x => x());
    }
}

module.exports = UnitTest;