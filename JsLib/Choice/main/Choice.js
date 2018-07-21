var Choice = function(opt1, opt2, predicate) {
    this.opt1 = opt1;
    this.opt2 = opt2;

    this.get = function() {
        if(predicate()) return this.opt1;
        return this.opt2;
    }
}

module.exports = Choice;