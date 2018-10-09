/**
 * 
 * @param {*} opt1 
 * @param {*} opt2 
 * @param {*} predicate predicate is a function: (opt1, opt2) => {true, false}
 */
var Choice = function(opt1, opt2, predicate) {
    this.opt1 = opt1;
    this.opt2 = opt2;
    this.predicate = predicate == undefined ? () => true : predicate;

    this.chooseFirstIf = function(predicate) {
        this.predicate = predicate;
        return this;
    }

    this.get = function() {
        if(this.predicate(this.opt1, this.opt2)) return this.opt1;
        return this.opt2;
    }
}

Choice.of = function(opt1, opt2) {
    return new Choice(opt1, opt2);
}

module.exports = Choice;