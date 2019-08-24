const Sort = require("../main/Sort");

test("Sort test", () => {
  const sorted = [1, 2, 3, 4, 5, 6, 7];
  const toBeSorted = [7, 6, 5, 4, 3, 2, 1];
  const sort = Sort.quicksort(toBeSorted);
  expect(sort).toStrictEqual(sorted);
});

test("Reverse sort test", () => {
  const decreasingSorted = [7, 6, 5, 4, 3, 2, 1];
  const toBeSorted = [1, 2, 3, 4, 5, 6, 7];
  const sort = Sort.quicksort(toBeSorted, Sort.REVERSE_SORT_COMPARATOR);
  expect(sort).toStrictEqual(decreasingSorted);
});
