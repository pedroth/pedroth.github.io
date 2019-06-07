var UnitTest = require("../../UnitTest/main/UnitTest.js");
var ArrayUtils = require("../../ArrayUtils/main/ArrayUtils.js");
var Matrix = require("../main/Matrix.js");

test("test matrix creation", () => {
  let matrix = new Matrix([1, 2, 3]);
  expect(matrix.shape()).toStrictEqual([3]);
  expect(matrix.get([1])).toBe(2);

  matrix = new Matrix([[1, 0], [0, 1]]);
  expect(matrix.shape()).toStrictEqual([2, 2]);
  expect(matrix.get("1, 1")).toBe(1);
  expect(matrix.get([0, 0])).toBe(1);

  const eye = Matrix.identity(3);
  expect(eye.get("0:1, 0:1").equals(matrix)).toBe(true);
});

test("test fail matrix creation", () => {
  try {
    new Matrix([[[1, 1]], [[1, 1]]]);
  } catch (error) {
    expect(true).toBe(true);
  }
});
