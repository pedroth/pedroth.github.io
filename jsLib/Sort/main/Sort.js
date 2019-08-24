const Sort = {};

function swap(v, i, j) {
  if (i >= 0 && i < v.length && j >= 0 && j < v.length) {
    var temp = v[i];
    v[i] = v[j];
    v[j] = temp;
  }
}

/**
 * array: array with objects
 * comparator: comparator function that compares elements of v. Comparator is a function f(a,b) -> z in integers, where z < 0
 */
Sort.quicksort = function(array, comparator = (a, b) => a - b) {
  const n = array.length;
  const v = [...array];
  const stack = [];
  stack.push(0);
  stack.push(n - 1);
  while (stack.length > 0) {
    const high = stack.pop();
    const low = stack.pop();
    /*
     * partition
     */
    if (low < high) {
      const pivot = low + Math.floor((high - low) * Math.random());
      const pvalue = v[pivot];
      swap(v, pivot, high);
      let j = low;
      for (let i = low; i < high; i++) {
        if (comparator(v[i], pvalue) <= 0) {
          swap(v, i, j);
          j++;
        }
      }
      swap(v, j, high);
      stack.push(low);
      stack.push(j - 1);
      stack.push(j + 1);
      stack.push(high);
    }
  }
  return v;
};

Sort.REVERSE_SORT_COMPARATOR = (a, b) => b - a;

module.exports = Sort;
