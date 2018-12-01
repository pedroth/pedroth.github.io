var Function = require("../../Function/main/Function.js");
/**
 * The Stream constructor
 * @param {*} generator is an object that implements hasNext() and next() functions
 * @param {*} mapFunction 
 */
var Stream = function(generator, mapFunction=x => x, filterPredicate=x => true) {
    this.gen = generator;
    this.mapFunction = mapFunction;
    this.filterPredicate = filterPredicate;
}

Stream.prototype.map = function(f) {
    return new Stream(this.gen, Function.of(f).compose(this.mapFunction).get(), this.filterPredicate);
}

Stream.prototype.reduce = function(identity, binaryOp) {
    while (this.gen.hasNext()) {
        let value = this.gen.next();
        if(this.filterPredicate(value))
            identity = binaryOp(identity, this.mapFunction(value));
    } 
    return identity;
}
/**
 * ForEach function on stream
 * @param {*} consumer: is a x => void function 
 */
Stream.prototype.forEach = function(consumer) {
    while (this.gen.hasNext()) {
        let value = this.gen.next();
        if(this.filterPredicate(value))
            consumer(value);
    }
}

/**
 * 
 * @param {*} collector: is an object with the identity, and reduce attributes
 * 
 *  The collector.reduce is a \lambda (identity, acc) => identity. 
 */
Stream.prototype.collect = function(collector) {
    return this.reduce(collector.identity, collector.reduce);
}

/**
 * @param {*} predicate is a \lambda (x) => {true, false}
 * This function choses the elementes where predicate(x) = true
 */
Stream.prototype.filter = function(predicate) {
    return new Stream(this.gen, this.mapFunction, x => this.filterPredicate(x) && predicate(x));
}

/**
 * Take first n elements
 */
Stream.prototype.take = function(n) {
    return new Stream(
        Stream.generatorOf({i: 0 , gen: this.gen}, s => {return {i: s.i + 1, gen: s.gen}}, s => s.gen.next(), s => s.gen.hasNext() && s.i < n),
        this.mapFunction,
        this.filterPredicate
    ).collect(Stream.Collectors.toArray());
}

Stream.prototype.takeWhile = function(predicate) {
    return new Stream(
        Stream.generatorOf({gen: this.gen, val: null}, 
                            s => s,
                            s => s.val,
                            s => {
                                    if(s.gen.hasNext()){
                                        s.val = s.gen.next();
                                        return predicate(s.val);
                                    }
                                    return false;
                            }
        ),
        this.mapFunction,
        this.filterPredicate
    ).collect(Stream.Collectors.toArray());
}

Stream.prototype.head = function() {
    return this.gen.next();
}

Stream.prototype.tail = function() {
    this.gen.next();
    return new Stream(this.gen, this.mapFunction, this.filterPredicate);
}

Stream.of = function(iterable) {
    var types = [
        {name:"Array", predicate: x => x.constructor === Array},
        {name: "Generator", predicate: x => typeof x.hasNext === "function" && typeof x.next === "function"}
    ];
    var types2GeneratorMap = {
        "Array": () => new Stream(Stream.generatorOf({ i: 0, array: iterable },
                                                     s => { return { i: s.i + 1, array: s.array}; },
                                                     s => s.array[s.i],
                                                     s => s.i < s.array.length)
                                                    ),
        "Generator" : () => new Stream(iterable)
    }
    for (let i=0; i < types.length; i++) {
        if(types[i].predicate(iterable)) 
            return types2GeneratorMap[types[i].name]();
    }
    throw `Iterable ${iterable} does not have a stream`;
}

Stream.range = function(init, end, step=1) {
    return new Stream(Stream.generatorOf(init, 
                                         s => s + step,
                                         s => s,
                                         s => s < end
                                        )
                     );
}

Stream.generatorOf = function(initialState, nextStateFunction, getFromStateFunction, hasNextStateFunction) {
    var s = initialState;
    return {
        hasNext: () => hasNextStateFunction(s),
        next: () => {
            var ans = getFromStateFunction(s);
            s = nextStateFunction(s);
            return ans;
        }
    };
}

Stream.Collectors = {
    toArray: () => new function(){ this.identity = []; this.reduce = (acc, x) => { acc.push(x); return acc;}} 
}
module.exports = Stream;