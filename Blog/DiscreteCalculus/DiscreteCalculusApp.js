var SimManager = require('../../JsLib/SimManager/main/SimManager.js');
var Canvas = require('../../JsLib/Canvas/main/Canvas.js');
var Canvas2D = require('../../JsLib/Canvas/main/Canvas2D.js');
var ArrayUtils = require('../../JsLib/ArrayUtils/main/ArrayUtils.js');

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

function showTable2() {
    $("#psiComputeTable2").empty();
        var n = Number.parseFloat($("#nPsi2").val());
        var k = Number.parseFloat($("#kPsi2").val());
        var stringBuilder = [];
        stringBuilder.push("$$");
        stringBuilder.push(`\\begin{array}{|c|c|} \\hline n | k & `);
        for(var i = 0; i < k + 1; i++) stringBuilder.push(`${i} &`);
        stringBuilder.push(`\\\\ \\hline`);
        for(var i = 0; i < n + 1; i++) {
            stringBuilder.push(`${i} &`);
            for(var j = 0; j < k + 1; j++) {
                stringBuilder.push(`${psiDP(i, j)} &`);
            }
            stringBuilder.push(`\\\\ \\hline`);
        }
        stringBuilder.push(`\\hline \\end{array}`);
        stringBuilder.push("$$");
        $("#psiComputeTable2").html(stringBuilder.join(""));
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "psiComputeTable2"]);
        $("#psiComputeTable2").slideDown();
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

function kdiff(array, n , k) {
    if(k == 0) return array[n];
    var acc = 0;
    var ide = 1;
    for(var j = 0; j <= k; j++) {
        acc += psiClosed(k, j) * ide * array[n + k - j];
        ide *= -1;
    }
    return acc;
}

function seqInter(array, x) {
    var acc = 0;
    for(var k = 0; k < array.length; k++) {
        acc += kdiff(array, 0, k) * psiClosed(x, k);
    }
    return acc;
}

function Sim1() {
    this.maxAmp = 2;
    this.sequenceSize = 5;
    this.samples = 100;
    this.isMouseDown = false;
    this.canvasGraph = new Canvas2D(document.getElementById("interpolation"), [[-0.1, this.sequenceSize], [-0.1, this.maxAmp * 1.1]]);
    this.sequence = []
    this.mouse = [0, 0];
    this.startTime = new Date().getMilliseconds();

    this.randomSeq = function() {
        var ans = [];
        for(var i = 0; i < this.sequenceSize; i++) ans.push(this.maxAmp * Math.random());
        return ans;
    }

    this.sequence = this.randomSeq();

    this.nextRandomSeq = function() {
        this.sequence = this.randomSeq();
    }

    this.increaseSeq = function() {
        this.sequenceSize++;
        this.sequence = this.randomSeq();
        this.canvasGraph.setCamera([[-0.1, this.sequenceSize], [-0.1, this.maxAmp * 1.1]]);
    }

    this.decreaseSeq = function() {
        this.sequenceSize--;
        this.sequence = this.randomSeq();
        this.canvasGraph.setCamera([[-0.1, this.sequenceSize], [-0.1, this.maxAmp * 1.1]]);
    }

    // function that do stuff with mouse coordinates
    this.baseMouse = function(integerMouse) {
        if(!this.isMouseDown) {
            return;
        }
        this.mouse = this.canvasGraph.inverseTransform(integerMouse);
    }

    this.mouseStart = function (e) {
        var rect = this.canvasGraph.canvas.getBoundingClientRect();
        var mx = (e.clientX - rect.left), my = (e.clientY - rect.top);
        this.isMouseDown = true;
        this.baseMouse([my, mx]);
    }

    this.mouseEnd = function (e) {
        this.isMouseDown = false;
    }

    this.mouseMove = function (e) {
        var rect = this.canvasGraph.canvas.getBoundingClientRect();
        var mx = (e.clientX - rect.left), my = (e.clientY - rect.top);
        if(this.isMouseDown) this.baseMouse([my, mx]);
    }

    this.touchStart = function (e) {
        var rect = this.canvasGraph.canvas.getBoundingClientRect();
        var mx = (e.touches[0].clientX - rect.left), my = (e.touches[0].clientY - rect.top);
        this.isMouseDown = true;
        this.baseMouse([my, mx]);
    }

    this.touchEnd = function (e) {
        this.isMouseDown = false;
    }

    this.touchMove = function (e) {
        var rect = this.canvasGraph.canvas.getBoundingClientRect();
        var mx = (e.touches[0].clientX - rect.left), my = (e.touches[0].clientY - rect.top);
        if(this.isMouseDown) this.baseMouse([my, mx]);
    }

    this.checkIfCanDraw = function() {
        return $("#sim1").is(":visible");
    }

    this.drawCanvasGraph = function() {
        var dt = Math.min(0.1, Math.max(1E-3, 1E-3 * (new Date().getMilliseconds() - this.startTime)));
        this.startTime = new Date().getMilliseconds();
        //console.log(`dt : ${dt}, mouse :[${this.mouse}], seq : ${this.sequence}`);
        for(var i = 0; i < this.sequenceSize; i++) {
            this.sequence[i] = this.sequence[i] + dt * ((this.isMouseDown ? 1 : 0) * (this.mouse[1] - this.sequence[i]) * (Math.exp(-Math.abs(this.mouse[0] - i))));
        }
        ArrayUtils.range(0, this.sequenceSize, 1).forEach(i => {
            this.canvasGraph.drawLine([i, 0], [i, this.sequence[i]], Canvas.simpleShader([0, 0, 0, 255]))
        });
        var h = (this.sequenceSize - 1) / (this.samples - 1);
        for(var i = 0; i < this.samples-1; i++) {
            var x = i * h;
            var xh = x + h; 
            this.canvasGraph.drawLine([x, seqInter(this.sequence, x)], [xh, seqInter(this.sequence, xh)], Canvas.simpleShader([255, 0, 0, 255]));
        }
    }

    this.draw = function() {
        this.canvasGraph.clearImage([255, 255, 255, 255]);
        this.drawCanvasGraph();
        this.canvasGraph.paintImage();
    }

    this.start = function() {
        $("#sim1").slideDown();
    }

    this.end = function() {
        $("#sim1").slideUp();
    }

    this.init = function() {
        this.canvasGraph.addEventListener("touchstart",e => { apply(0, x => { x.touchStart(e) })}, false);
        this.canvasGraph.addEventListener("touchend",  e => { apply(0, x => { x.touchEnd(e) })}, false);
        this.canvasGraph.addEventListener("touchmove", e => { apply(0, x => { x.touchMove(e) })}, false);

        this.canvasGraph.addEventListener("mousedown",e => { apply(0, x => { x.mouseStart(e) })}, false);
        this.canvasGraph.addEventListener("mouseup",  e => { apply(0, x => { x.mouseEnd(e) })}, false);
        this.canvasGraph.addEventListener("mousemove",e => { apply(0, x => { x.mouseMove(e) })}, false);
    }
}


/**
 * Simulation Management
 */
 var simulations = [
     new Sim1()
 ];

 var simManagerBuilder = SimManager.builder();

 for(var i = 0; i < simulations.length; i++){
     simManagerBuilder.push(simulations[i]);
 }

 var simManager = simManagerBuilder.build();

function runSimulation(index) {
	simManager.runSimulation(index);
}

function apply(index, lambda) {
    simManager.apply(index, lambda);
}

simManager.init();

module.exports =  {
    showTable : showTable,
    showTable2 : showTable2,
    run : runSimulation,
    apply : apply
}