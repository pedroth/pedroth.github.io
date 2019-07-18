const Sort = require("../main/Sort");

test("Sort test", () => {
  const sorted = [1, 2, 3, 4, 5, 6, 7];
  const toBeSorted = [7, 6, 5, 4, 3, 2, 1];
  const sort = Sort.quicksort(toBeSorted);
  expect(sort).toStrictEqual(sorted);
});
