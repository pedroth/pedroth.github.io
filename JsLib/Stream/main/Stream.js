var Function = require("../../Function/main/Function.js");
/**
 * The Stream constructor
 * @param {*} generator is an object that implements hasNext(), next() and peek() functions and have a initial state
 * @param {*} mapFunction the mapping function
 */
var Stream = function(
  generator,
  mapFunction = x => x,
  filterPredicate = x => true
) {
  this.gen = generator;
  this.mapFunction = mapFunction;
  this.filterPredicate = filterPredicate;
};

/**
 * Gets the state of the generator.
 */
Stream.prototype.state = function() {
  return this.gen.state;
};

/**
 * Returns true if stream has more elements, false otherwise.
 */
Stream.prototype.hasNext = function() {
  return this.gen.hasNext(this.filteredState());
};

/**
 * Return next filtered state.
 */
Stream.prototype.filteredState = function() {
  var state = this.state();
  while (
    this.gen.hasNext(state) &&
    !this.filterPredicate(this.gen.peek(state))
  ) {
    state = this.gen.next(state);
  }
  return state;
};

/**
 * Gets first element of the generator, filtered.
 */
Stream.prototype.head = function() {
  let state = this.filteredState();
  if (this.gen.hasNext(state)) return this.gen.peek(state);
  throw `No head element exception`;
};

/**
 * Gets stream without the first element.
 */
Stream.prototype.tail = function() {
  return new Stream(
    Stream.generatorOf(
      this.gen.next(this.filteredState()),
      this.gen.next,
      this.gen.peek,
      this.gen.hasNext
    ),
    this.mapFunction,
    this.filterPredicate
  );
};

/**
 * Returns stream with mapping function f
 * @param {*} f, mapping function.
 */
Stream.prototype.map = function(f) {
  return new Stream(
    this.gen,
    Function.of(f)
      .compose(this.mapFunction)
      .get(),
    this.filterPredicate
  );
};

/**
 * Reducing operation.
 * @param {*} identity, identity of binaryOperation used as initial value.
 * @param {*} binaryOp, binary operation of the reduce.
 */
Stream.prototype.reduce = function(identity, binaryOp) {
  var stream = this;
  while (stream.hasNext()) {
    let value = stream.head();
    identity = binaryOp(identity, stream.mapFunction(value));
    stream = stream.tail();
  }
  return identity;
};
/**
 * ForEach function on stream
 * @param {*} consumer: is a x => void function
 */
Stream.prototype.forEach = function(consumer) {
  var stream = this;
  while (stream.hasNext()) {
    let value = stream.head();
    consumer(stream.mapFunction(value));
    stream = stream.tail();
  }
};

/**
 *
 * @param {*} collector: is an object with the identity, and reduce attributes
 *
 *  The collector.reduce is a \lambda (identity, acc) => identity.
 */
Stream.prototype.collect = function(collector) {
  return this.reduce(collector.identity, collector.reduce);
};

/**
 * @param {*} predicate is a \lambda (x) => {true, false}
 * This function choses the elementes where predicate(x) = true
 */
Stream.prototype.filter = function(predicate) {
  return new Stream(
    this.gen,
    this.mapFunction,
    x => this.filterPredicate(x) && predicate(x)
  );
};

/**
 * Take first n elements
 */
Stream.prototype.take = function(n) {
  return new Stream(
    Stream.generatorOf(
      { i: 0, stream: this },
      s => {
        return { i: s.i + 1, stream: s.stream.tail() };
      },
      s => s.stream.head(),
      s => s.stream.hasNext() && s.i < n
    ),
    this.mapFunction,
    this.filterPredicate
  ).collect(Stream.Collectors.toArray());
};

Stream.prototype.takeWhile = function(predicate) {
  return new Stream(
    Stream.generatorOf(
      this,
      s => s.tail(),
      s => s.head(),
      s => s.hasNext() && predicate(s.head())
    ),
    this.mapFunction,
    this.filterPredicate
  ).collect(Stream.Collectors.toArray());
};

Stream.prototype.zip = function(stream) {
  return new Stream(
    Stream.generatorOf(
      [this, stream],
      s => [s[0].tail(), s[1].tail()],
      s => [s[0].head(), s[1].head()],
      s => s[0].hasNext() && s[1].hasNext()
    )
  );
};

Stream.prototype.flatMap = function(toStreamLambda) {
  return new Stream(
    Stream.generatorOf(
      { baseStream: this, flatStream: null },
      s => {
        if (!s.flatStream || !s.flatStream.hasNext()) {
          let stream = s.baseStream;
          return {
            baseStream: stream.tail(),
            flatStream: toStreamLambda(stream.head()).tail()
          };
        }
        return { baseStream: s.baseStream, flatStream: s.flatStream.tail() };
      },
      s => {
        if (!s.flatStream || !s.flatStream.hasNext()) {
          return toStreamLambda(s.baseStream.head()).head();
        }
        return s.flatStream.head();
      },
      s => {
        if (!s.flatStream) {
          return (
            s.baseStream.hasNext() &&
            toStreamLambda(s.baseStream.head()).hasNext()
          );
        }
        return s.baseStream.hasNext() || s.flatStream.hasNext();
      }
    )
  );
};

Stream.ofHeadTail = function(head, tailSupplier) {
  return new Stream(
    Stream.generatorOf(
      { h: head, supplier: tailSupplier },
      s => {
        let stream = s.supplier();
        if (stream.hasNext())
          return { h: stream.head(), supplier: () => stream.tail() };
        // empty state
        return { h: null, supplier: null };
      },
      s => s.h,
      s => s.h != null
    )
  );
};

Stream.of = function(iterable) {
  var types = [
    { name: "Array", predicate: x => x.constructor === Array },
    {
      name: "Generator",
      predicate: x =>
        typeof x.hasNext === "function" &&
        typeof x.next === "function" &&
        typeof x.peek == "function"
    },
    { name: "Stream", predicate: x => x.__proto__ == Stream.prototype }
  ];
  var types2GeneratorMap = {
    Array: ite =>
      new Stream(
        Stream.generatorOf(
          { i: 0, array: ite },
          s => {
            return { i: s.i + 1, array: s.array };
          },
          s => s.array[s.i],
          s => s.i < s.array.length
        )
      ),
    Generator: ite => new Stream(ite),
    Stream: ite => new Stream(ite.gen, ite.mapFunction, ite.filterPredicate)
  };
  for (let i = 0; i < types.length; i++) {
    if (types[i].predicate(iterable)) {
      return types2GeneratorMap[types[i].name](iterable);
    }
  }
  throw `Iterable ${iterable} does not have a stream`;
};

Stream.range = function(init, end, step = 1) {
  return new Stream(
    Stream.generatorOf(
      init,
      s => s + step,
      s => s,
      s => (end == null ? true : s < end)
    )
  );
};

Stream.generatorOf = function(
  initialState,
  nextStateFunction,
  getFromStateFunction,
  hasNextStateFunction
) {
  return new (function() {
    this.state = initialState;
    this.next = nextStateFunction;
    this.peek = getFromStateFunction;
    this.hasNext = hasNextStateFunction;
  })();
};

Stream.Collectors = {
  toArray: () =>
    new (function() {
      this.identity = [];
      this.reduce = (acc, x) => {
        acc.push(x);
        return acc;
      };
    })()
};
module.exports = Stream;
