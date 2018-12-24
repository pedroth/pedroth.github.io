var Function = require("../../Function/main/Function.js");
/**
 * The Stream constructor
 * @param {*} generator is an object that implements hasNext(), next() and peek() functions
 * @param {*} mapFunction 
 */
var Stream = function(generator, mapFunction=x => x, filterPredicate=x => true) {
    this.gen = generator;
    this.mapFunction = mapFunction;
    this.filterPredicate = filterPredicate;
}

Stream.prototype.state = function () {
    return this.gen.state;
}

Stream.prototype.hasNext = function() {
    return this.gen.hasNext(this.state());
}

Stream.prototype.head = function () {
    return this.gen.peek(this.state());
}

Stream.prototype.tail = function () {
    return new Stream(
        Stream.generatorOf(
            this.gen.next(this.state()),
            this.gen.next,
            this.gen.peek,
            this.gen.hasNext
        ),
        this.mapFunction,
        this.filterPredicate
    )
}

Stream.prototype.map = function(f) {
    return new Stream(this.gen, Function.of(f).compose(this.mapFunction).get(), this.filterPredicate);
}

Stream.prototype.reduce = function(identity, binaryOp) {
    var stream =  this;
    while (stream.hasNext()) {
        let value = stream.head();
        if(stream.filterPredicate(value)) {
            identity = binaryOp(identity, stream.mapFunction(value));
        }
        stream = stream.tail();
    } 
    return identity;
}
/**
 * ForEach function on stream
 * @param {*} consumer: is a x => void function 
 */
Stream.prototype.forEach = function(consumer) {
    var stream = this;
    while (stream.hasNext()) {
        let value = stream.head();
        if(stream.filterPredicate(value)) {
            consumer(stream.mapFunction(value));
        }
        stream = stream.tail();
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

Stream.pair = function(head, tail) {
    return new Stream(
        Stream.generatorOf(
            [tail, head],
             s => {
                 let value = s.pop();
                 if(value.__proto__ == Stream.prototype) s.push(value);
                 return s;
             },
             s => {
                 let value = s[s.length - 1];
                 if (value.__proto__ == Stream.prototype) return value.head(); 
                 return value;
             },
             s => s.length > 1 || s[0].gen.hasNext() 
        ),
        tail.mapFunction,
        tail.filterPredicate
    );   
}

Stream.of = function(iterable) {
    var types = [
        {name:"Array", predicate: x => x.constructor === Array},
        {name: "Generator", predicate: x => typeof x.hasNext === "function" && typeof x.next === "function" && typeof x.peek == "function"},
        {name: "Stream", predicate: x => x.__proto__ == Stream.prototype}
    ];
    var types2GeneratorMap = {
        "Array": ite => new Stream(Stream.generatorOf(
                                                     { i: 0, array: ite },
                                                     s => { return { i: s.i + 1, array: s.array}; },
                                                     s => s.array[s.i],
                                                     s => s.i < s.array.length)
                                                    ),
        "Generator" : ite => new Stream(ite),
        "Stream": ite => new Stream(ite.gen, ite.mapFunction, ite.filterPredicate)
    }
    for (let i=0; i < types.length; i++) {
        if(types[i].predicate(iterable)) {
            return types2GeneratorMap[types[i].name](iterable);
        }
    }
    throw `Iterable ${iterable} does not have a stream`;
}

Stream.range = function(init, end, step=1) {
    return new Stream(Stream.generatorOf(
                                         init, 
                                         s => s + step,
                                         s => s,
                                         s => end == null ? true : s < end
                                        )
                     );
}

Stream.generatorOf = function(initialState, nextStateFunction, getFromStateFunction, hasNextStateFunction) {
    return new function() {
        this.state = initialState;
        this.hasNext = hasNextStateFunction;
        this.next = nextStateFunction;
        this.peek = getFromStateFunction;
    };
}

Stream.Collectors = {
    toArray: () => new function(){ 
        this.identity = []; 
        this.reduce = (acc, x) => { acc.push(x); return acc;}
    } 
}
module.exports = Stream;