const ArrayUtils = require("../../ArrayUtils/main/ArrayUtils.js");
const Stream = require("../main/Stream.js");

function primesSieveRecursive(stream) {
  let p = stream.head();
  return Stream.ofHeadTail(p, () =>
    primesSieveRecursive(stream.tail().filter(x => x % p != 0))
  );
}

function primesSieve() {
  return primesSieveRecursive(Stream.range(2));
}

function twin(x, y) {
  return y == x + 2;
}

function primeTwins() {
  let primes = primesSieve();
  return primes.zip(primes.tail()).filter(x => twin(x[0], x[1]));
}

test("test map", () => {
  const array = [1, 2, 3, 4, 5];
  expect(
    Stream.of(array)
      .map(x => x * x)
      .reduce(0, (x, y) => x + y)
  ).toBe(array.map(x => x * x).reduce((x, y) => x + y, 0));
  expect(
    Stream.of(Stream.generatorOf(1, s => s + 1, s => s, s => s <= 5))
      .map(x => x * x)
      .map(Math.sqrt)
      .reduce([], (x, y) => x.concat(y))
  ).toStrictEqual(array);
});

test("test reduce", () => {
  expect(
    Stream.range(1, 6)
      .map(x => x * x)
      .reduce(0, (x, y) => x + y)
  ).toBe(
    ArrayUtils.range(1, 6, 1)
      .map(x => x * x)
      .reduce((x, y) => x + y, 0)
  );
  expect(
    Stream.range(1, 6, 2)
      .map(x => x * x)
      .reduce(1, (x, y) => x * y)
  ).toBe(
    ArrayUtils.range(1, 6, 2)
      .map(x => x * x)
      .reduce((x, y) => x * y, 1)
  );
});

test("test collect", () => {
  expect(
    Stream.range(0, 10).collect(Stream.Collectors.toArray())
  ).toStrictEqual(ArrayUtils.range(0, 10));
});

test("test head", () => {
  expect(Stream.range(0, 100).head()).toBe(0);
  expect(Stream.range(0, 100).head()).toBe(0);
});

test("test tail", () => {
  expect(
    Stream.range(0, 100)
      .tail()
      .collect(Stream.Collectors.toArray())
  ).toStrictEqual(ArrayUtils.range(1, 100));
  expect(
    Stream.range(0, 100)
      .tail()
      .collect(Stream.Collectors.toArray())
  ).toStrictEqual(ArrayUtils.range(1, 100));
});

test("test take", () => {
  expect(Stream.range(0, 100).take(10)).toStrictEqual(ArrayUtils.range(0, 10));
  expect(Stream.range(0, 100).takeWhile(x => x < 10)).toStrictEqual(
    ArrayUtils.range(0, 10)
  );
  expect(
    Stream.range(1)
      .filter(x => x % 2 == 0)
      .take(10)
  ).toStrictEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
});

test("test filter", () => {
  expect(
    Stream.range(0, 10)
      .map(x => x * x)
      .filter(x => x % 2 == 0)
      .collect(Stream.Collectors.toArray())
  ).toStrictEqual(
    ArrayUtils.range(0, 10)
      .map(x => x * x)
      .filter(x => x % 2 == 0)
  );
});

test("test for each", () => {
  let stack = [];
  Stream.range(0, 10)
    .map(x => x * x)
    .filter(x => x % 2 == 0)
    .forEach(x => stack.push(x));
  expect(stack).toStrictEqual(
    ArrayUtils.range(0, 10)
      .map(x => x * x)
      .filter(x => x % 2 == 0)
  );
});

test("test of creation,", () => {
  expect(
    Stream.of(ArrayUtils.range(0, 10)).collect(Stream.Collectors.toArray())
  ).toStrictEqual(ArrayUtils.range(0, 10));

  expect(
    Stream.range(0, 10).collect(Stream.Collectors.toArray())
  ).toStrictEqual(
    Stream.of(Stream.range(0, 10)).collect(Stream.Collectors.toArray())
  );
  expect(
    Stream.of(
      Stream.generatorOf(
        0,
        s => s + 1,
        s => String.fromCharCode(s),
        s => s < 10
      )
    ).collect(Stream.Collectors.toArray())
  ).toStrictEqual(ArrayUtils.range(0, 10).map(x => String.fromCharCode(x)));
});

test("test prime sieve", () => {
  const primes = [2, 3, 5, 7, 11, 13];
  expect(primesSieve().take(6)).toStrictEqual(primes);
});

test("test twin prime", () => {
  const twinPrimes = [[3, 5], [5, 7], [11, 13], [17, 19], [29, 31], [41, 43]];
  expect(
    primeTwins()
      .map(x => x[0])
      .take(6)
  ).toStrictEqual(twinPrimes.map(x => x[0]));
});

test("test flat map", () => {
  const twinPrimes = [[3, 5], [5, 7], [11, 13], [17, 19], [29, 31], [41, 43]];
  const expectedAns = [3, 5, 5, 7, 11, 13, 17, 19, 29, 31, 41, 43];
  const ans = Stream.of(twinPrimes)
    .flatMap(x => Stream.of(x))
    .collect(Stream.Collectors.toArray());
  expect(ans).toStrictEqual(expectedAns);
});

test("test flat map 2", () => {
  const input = [[[1, 2], [3]], [[4, 5]], [[6, 7], [8, 9, 10]]];
  const expectedAns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const ans = Stream.of(input)
    .flatMap(Stream.of)
    .flatMap(Stream.of)
    .collect(Stream.Collectors.toArray());
  expect(ans).toStrictEqual(expectedAns);
});
