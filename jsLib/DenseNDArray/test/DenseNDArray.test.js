var DenseNDArray = require("../main/DenseNDArray.js");
var ArrayUtils = require("../../ArrayUtils/main/ArrayUtils.js");

test("test getter", () => {
  const denseNDArray = new DenseNDArray([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  expect(denseNDArray.get([0, 0])).toBe(1);
  expect(denseNDArray.get([1, 2])).toBe(8);
  expect(denseNDArray.get([0, 2])).toBe(7);
  expect(denseNDArray.get([2, 1])).toBe(6);
  expect(denseNDArray.get([1, 1])).toBe(5);

  const denseNDArray1 = DenseNDArray.of(denseNDArray, [9, 1]);
  expect(denseNDArray1.get([0, 0])).toBe(1);
  expect(denseNDArray1.get([4, 0])).toBe(5);
  expect(denseNDArray1.get([8, 0])).toBe(9);

  const denseNDArray2 = DenseNDArray.of(denseNDArray, [9]);
  expect(denseNDArray2.get([0])).toBe(1);
  expect(denseNDArray2.get([4])).toBe(5);
  expect(denseNDArray2.get([8])).toBe(9);

  expect(denseNDArray.get("1,2")).toBe(8.0);
  expect(denseNDArray.get("1,1")).toBe(5.0);

  expect(DenseNDArray.of([[1, 2], [3, 4], [5, 6]]).get([0, 1])).toBe(3);
  expect(DenseNDArray.of([[1, 2], [3, 4], [5, 6]]).get([1, 2])).toBe(6);
  expect(
    DenseNDArray.of([
      [[1, 2], [3, 4], [5, 6]],
      [[7, 8], [9, 10], [11, 12]],
      [[13, 14], [15, 16], [17, 18]]
    ]).get([1, 2, 2])
  ).toBe(18);
  expect(
    DenseNDArray.of([
      [[1, 2], [3, 4], [5, 6]],
      [[7, 8], [9, 10], [11, 12]],
      [[13, 14], [15, 16], [17, 18]]
    ]).get("1,1,1")
  ).toBe(10);
  expect(
    DenseNDArray.of([
      [[1, 2], [3, 4], [5, 6]],
      [[7, 8], [9, 10], [11, 12]],
      [[13, 14], [15, 16], [17, 18]]
    ]).get("0,1,0")
  ).toBe(3);
});

test("test setter", () => {
  const table = new DenseNDArray([3, 3, 3]);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        table.set([i, j, k], i + 3 * j + 9 * k);
      }
    }
  }
  console.log(`table : ${table.toString()}`);

  expect(table.get("1,:,:").get([0, 0])).toBe(1);
  expect(table.get("1,:,:").get([1, 1])).toBe(13);
  expect(table.get("1,:,:").get([2, 2])).toBe(25);
  expect(table.get("1,:,:").get([2, 1])).toBe(16);

  const secondTable = table.get("0 : 1, 1 : 2, : ");
  console.log(`secondTable : ${secondTable.toString()}`);

  expect(secondTable.get([1, 1, 0])).toBe(7);
  expect(secondTable.get([1, 1, 1])).toBe(16);
  expect(secondTable.get([1, 1, 2])).toBe(25);

  const thirdTable = new DenseNDArray([3, 3]);
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      thirdTable.set([i, j], 100);
    }
  }

  table.set("1,:,:", thirdTable);

  expect(table.get([1, 0, 0])).toBe(100);
  expect(table.get([1, 1, 1])).toBe(100);
  expect(table.get([1, 1, 2])).toBe(100);
  expect(table.get([1, 2, 2])).toBe(100);
  expect(table.get([0, 2, 2])).toBe(24);

  const denseNDArray = table.get("1:,0:,:1");

  console.log(table.toArray());
  console.log(table.toString());

  expect(denseNDArray.dim[0]).toBe(2);
  expect(denseNDArray.dim[1]).toBe(3);
  expect(denseNDArray.dim[2]).toBe(2);
  expect(denseNDArray.get([0, 0, 1])).toBe(100);
  expect(denseNDArray.get([1, 1, 0])).toBe(5);
  expect(denseNDArray.get([1, 2, 1])).toBe(17);
});

test("test dense creation", () => {
  const d1 = new DenseNDArray([2, 3], [1, 2, 3, 4, 5, 6]);
  const d2 = DenseNDArray.of([[1, 2], [3, 4], [5, 6]]);
  expect(d1.equals(d2)).toBe(true);
  expect(d1.equals(DenseNDArray.of(d1.toArray()))).toBe(true);
});

test("test map array", () => {
  const array = new DenseNDArray([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const arraySq = new DenseNDArray([3, 3], [1, 4, 9, 16, 25, 36, 49, 64, 81]);
  expect(array.map(x => x * x).equals(arraySq)).toBe(true);
});

test("test reduce", () => {
  const n = 10;
  const sum = (n * (n - 1)) / 2.0;
  const array = new DenseNDArray([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  expect(array.reduce(0.0, (x, y) => x + y)).toBe(sum);
});

test("test for each", () => {
  const n = 10;
  const sum = (n * (n - 1)) / 2.0;
  const array = new DenseNDArray([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let acc = 0;
  array.forEach(x => (acc += x));
  expect(acc).toBe(sum);
});

test("test reshape", () => {
  const dense = DenseNDArray.of([[1, 2, 3], [4, 5, 6]]);
  const denseReshape = DenseNDArray.of([[1, 2], [3, 4], [5, 6]]);
  expect(dense.reshape([2, 3]).equals(denseReshape)).toBe(true);
});

test("test broadcast", () => {
  const mult = (x, y) => x * y;
  let dense = DenseNDArray.of([
    [[1, 2], [3, 4]],
    [[5, 6], [7, 8]],
    [[9, 10], [11, 12]]
  ]);
  let out = dense.binaryOp(DenseNDArray.of([1, 2, 3]), mult);

  let denseExpected = DenseNDArray.of([
    [[1, 2], [3, 4]],
    [[10, 12], [14, 16]],
    [[27, 30], [33, 36]]
  ]);

  expect(out.shape()).toStrictEqual([2, 2, 3]);
  expect(denseExpected.equals(out)).toBe(true);

  dense = DenseNDArray.of([1, 1, 1]);
  out = dense.binaryOp(DenseNDArray.of([1, 2, 3], [3, 1]), mult);
  denseExpected = DenseNDArray.of([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
  expect(out.equals(denseExpected)).toBe(true);

  out = dense.binaryOp(1, (x, y) => x + y);
  expect(out.equals(DenseNDArray.of([2, 2, 2]))).toBe(true);
});

test("test map with index", () => {
  const array = new DenseNDArray([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const arrayExpected = new DenseNDArray(
    [3, 3],
    [0, 0, 0, 0, 5, 12, 0, 16, 36]
  );
  expect(
    array
      .mapWithIndex((x, index) => x * index.reduce((x, y) => x * y, 1))
      .equals(arrayExpected)
  ).toBe(true);
  array.transformWithIndex((x, index) => x * index.reduce((x, y) => x * y, 1));
  expect(array.equals(arrayExpected)).toBe(true);
});

test("test index out of bound", () => {
  try {
    DenseNDArray.of([1, 2, 3]).get(3);
    expcet(false).toBe(true);
  } catch (e) {
    expect(true).toBe(true);
  }
});

test("test get low index size", () => {
  expect(DenseNDArray.of([[1, 2], [3, 4]]).get(1)).toBe(3);
});
