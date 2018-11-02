var Function = require("../../Function/main/Function.js");
/**
 * The Stream constructor
 * @param {*} generator is an object that implements hasNext() and next() functions
 * @param {*} mapFunction 
 */
var Stream = function(generator, mapFunction) {
    this.gen = generator;
    this.mapFunction = mapFunction == null ? x => x : mapFunction;
}

Stream.prototype.map = function(f) {
    return new Stream(this.gen, Function.of(f).compose(this.mapFunction).get());
}

Stream.prototype.reduce = function(identity, binaryOp) {
    while (this.gen.hasNext()) identity = binaryOp(identity, this.mapFunction(this.gen.next()));
    return identity;
}
/**
 * ForEach function on stream
 * @param {*} consumer: is a x => void function 
 */
Stream.prototype.forEach = function(consumer) {
    while (this.gen.hasNext()) consumer(this.gen.next());
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

Stream.range = function(init, end, step) {
    return new Stream(Stream.generatorOf(init, 
                                         s => s + (step == null ? 1 : step),
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
module.exports = Stream;