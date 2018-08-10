var ArrayUtils = {};

ArrayUtils.join = function(a1, a2) {
    var copy = [];
    for(var i = 0; i < a1.length; i++) copy.push(a1[i]);
    for(var i = 0; i < a2.length; i++) copy.push(a2[i]);
    return copy;
}

ArrayUtils.arrayEquals = function(a1, a2) {
    if(a1.length != a2.length) return false;
    for(var i = 0; i < a1.length; i++) {
        if (a1[i] != a2[i]) return false;
    }
    return true;
}

/**
 * 
 * @param {*} array 
 * @param {*} permutation is 2-dim array [from, to], where from.length==to.length and from as the position from and to have the positions to  
 */
ArrayUtils.permute = function(array, permutation) {
    // TODO
}

module.exports = ArrayUtils;