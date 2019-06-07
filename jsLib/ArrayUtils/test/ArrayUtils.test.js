var ArrayUtils = require("../main/ArrayUtils.js");

test("test concat array", () => {
  const a1 = [1, 2, "3"];
  const a2 = ["1", "p", "e"];
  const result = [1, 2, "3", "1", "p", "e"];
  expect(ArrayUtils.concat(a1, a2)).toStrictEqual(result);
});

test("test array equality", () => {
  const a1 = [1, { a: 1 }, 3];
  const a2 = [1, { a: 2 }, 3];
  expect(ArrayUtils.arrayEquals(a1, a2)).toBe(false);
  expect(ArrayUtils.arrayEquals(a1, a1)).toBe(true);
});

test("test array permute", () => {
  const a1 = [0, 1, 2, 3, 4, 5];
  const permuted = [1, 3, 4, 5, 0, 2];
  expect(ArrayUtils.permute(a1, [4, 0, 5, 1, 2, 3])).toStrictEqual(permuted);
});

test("test array swap", () => {
  const a1 = [0, 1, 2, 3, 4, 5];
  const swaped = [4, 1, 2, 3, 0, 5];
  expect(ArrayUtils.swap(a1, 0, 4)).toStrictEqual(swaped);
});

test("test find array dim", () => {
  const a1 = [[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]];
  expect(ArrayUtils.findJsArrayDim(a1)).toStrictEqual([3, 2, 2]);
});

test("test unpack js array", () => {
  const a1 = [[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]];
  const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  expect(ArrayUtils.unpackJsArray(a1)).toStrictEqual(expected);
});

test("test array range", () => {
  expect(ArrayUtils.range(0, 10, 2)).toStrictEqual([0, 2, 4, 6, 8]);
  expect(ArrayUtils.range(0, 10)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test("test array binary operation", () => {
  const v = ArrayUtils.range(0, 10, 1);
  const expected = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];
  expect(ArrayUtils.binaryOp(v, v, (x, y) => x + y)).toStrictEqual(expected);
});
