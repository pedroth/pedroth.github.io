function showTable() {
    $("#psiComputeTable").empty();
    var n = Number.parseFloat($("#nPsi").val());
    var k = Number.parseFloat($("#kPsi").val());
    var stringBuilder = [];
    stringBuilder.push("$$");
    stringBuilder.push(`\\begin{array}{|c|c|c|c|} \\hline n & \\Psi_{\\text{sum}} & \\Psi_{\\text{recursive}} & \\Psi_{\\text{closed}} \\\\ \\hline`);
    for(var i = 0; i < n + 1; i++) {
        stringBuilder.push(`${i} &`);
        stringBuilder.push(`${psiSum(i, k)} &`);
        stringBuilder.push(`${i < 20 ? psiRecursive(i, k) : psiDP(i, k)} &`);
        stringBuilder.push(`${psiClosed(i, k)} `);
        stringBuilder.push(`\\\\ \\hline`);
    }
    stringBuilder.push(`\\hline \\end{array}`);
    stringBuilder.push("$$");
    $("#psiComputeTable").html(stringBuilder.join(""));
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "psiComputeTable"]);
    $("#psiComputeTable").slideDown();
}

function psiRecursive(n, k) {
  if (n >= 0 && k === 0) {
    return 1;
  } else if (n === 0 && k > 0) {
    return 0;
  } else if (n > 0 && k > 0) {
    return psiRecursive(n - 1, k) + psiRecursive(n - 1, k - 1);
  } else {
    return 0;
  }
}

function psiSum(n, k) {
  if (n >= 0 && k === 0) {
    return 1;
  } else if (n === 0 && k > 0) {
    return 0;
  } else if (n > 0 && k > 0) {
    var acm = 0;
    for (var i = 0; i < n; i++) {
      acm += psiSum(i, k - 1);
    }
    return acm;
  } else {
    return 0;
  }
}

function psiClosed(n, k) {
  var ide = 1;
  var acm = 1;
  for (var i = 0; i < k; i++) {
    //console.log("n " + n + " acm " + acm + " ans " + ide);
    ide = ide * n / acm;
    acm++;
    n = n - 1;
  }
  return ide;
}

// Psi recursive with memoization, for completeness
function psiDP(n, k) {
  var psiMat = [];
  for (var i = 0; i <= n; i++) {
    psiMat[i] = [];
    psiMat[i][0] = 1;
  }
  for (var i = 1; i <= k; i++) {
    psiMat[0][i] = 0;
  }
  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= k; j++) {
      psiMat[i][j] = psiMat[i - 1][j] + psiMat[i - 1][j - 1];
    }
  }
  return psiMat[n][k];
}

module.exports =  {
    showTable : showTable
}