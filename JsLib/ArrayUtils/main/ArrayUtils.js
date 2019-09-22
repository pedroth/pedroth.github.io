var ArrayUtils = {};

/**
 * Union of array a1 and a2
 * @param {*} a1
 * @param {*} a2
 */
ArrayUtils.concat = function(a1, a2) {
  return a1.concat(a2);
};

/**
 *  Test if linear arrays are equal
 * @param {*} a1
 * @param {*} a2
 */
ArrayUtils.arrayEquals = function(a1, a2) {
  if (a1.length != a2.length) return false;
  for (var i = 0; i < a1.length; i++) {
    if (a1[i] != a2[i]) return false;
  }
  return true;
};

/**
 * Return a new array permutation
 * @param {*} array
 * @param {*} permutation is an array with length <= array.length that has the new indexes
 */
ArrayUtils.permute = function(array, permutation) {
  if (permutation.length > array.length) {
    throw `permutation array length > array length[${array.length}]`;
  }
  var copy = array.slice();
  for (var i = 0; i < permutation.length; i++) {
    copy[permutation[i]] = array[i];
  }
  return copy;
};

/**
 * Fisher-Yates shuffle algorithm
 */
ArrayUtils.randomPermute = function(array) {
  const ans = [...array];
  for (let i = array.length - 1; i > 0; i--) {
    // random number between 0 and i
    const r = Math.floor(Math.random() * (i + 1));
    //swap in place
    const temp = ans[i];
    ans[i] = ans[r];
    ans[r] = temp;
  }
  return ans;
};

/**
 * return swap array indexes
 */
ArrayUtils.swap = function(array, i, j) {
  var t = array[i];
  array[i] = array[j];
  array[j] = t;
  return array;
};

ArrayUtils.findJsArrayDim = function(array) {
  if (array instanceof Array) {
    return ArrayUtils.concat(ArrayUtils.findJsArrayDim(array[0]), [
      array.length
    ]);
  } else {
    return [];
  }
};

ArrayUtils.unpackJsArray = function(array) {
  if (array instanceof Array) {
    var joinIdentity = [];
    for (var i = 0; i < array.length; i++) {
      joinIdentity = ArrayUtils.concat(
        joinIdentity,
        ArrayUtils.unpackJsArray(array[i])
      );
    }
    return joinIdentity;
  } else {
    return [array];
  }
};

ArrayUtils.range = function(xmin, xmax, step = 1) {
  var ans = [];
  for (var i = xmin; i < xmax; i += step) ans.push(i);
  return ans;
};

ArrayUtils.binaryOp = function(array1, array2, binaryOp) {
  var smaller = array1.length < array2.length ? array1.slice() : array2.slice();
  for (let i = 0; i < smaller.length; i++)
    smaller[i] = binaryOp(array1[i], array2[i]);
  return smaller;
};

module.exports = ArrayUtils;
