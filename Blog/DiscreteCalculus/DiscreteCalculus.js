(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.app = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SimManager = require('../../JsLib/SimManager/main/SimManager.js');
var MyCanvas = require('../../JsLib/MyCanvas/main/MyCanvas.js');
var CanvasSpace = require('../../JsLib/MyCanvas/main/CanvasSpace.js');
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
    this.canvasGraph = new CanvasSpace(document.getElementById("interpolation"), [[-0.1, this.sequenceSize], [-0.1, this.maxAmp * 1.1]]);
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
            this.canvasGraph.drawLine([i, 0], [i, this.sequence[i]], MyCanvas.simpleShader([0, 0, 0, 255]))
        });
        var h = (this.sequenceSize - 1) / (this.samples - 1);
        for(var i = 0; i < this.samples-1; i++) {
            var x = i * h;
            var xh = x + h; 
            this.canvasGraph.drawLine([x, seqInter(this.sequence, x)], [xh, seqInter(this.sequence, xh)], MyCanvas.simpleShader([255, 0, 0, 255]));
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
},{"../../JsLib/ArrayUtils/main/ArrayUtils.js":2,"../../JsLib/MyCanvas/main/CanvasSpace.js":3,"../../JsLib/MyCanvas/main/MyCanvas.js":5,"../../JsLib/SimManager/main/SimManager.js":6}],2:[function(require,module,exports){
var ArrayUtils = {};

/**
 * Union of array a1 and a2
 * @param {*} a1 
 * @param {*} a2 
 */
ArrayUtils.join = function(a1, a2) {
    var copy = [];
    for(var i = 0; i < a1.length; i++) copy.push(a1[i]);
    for(var i = 0; i < a2.length; i++) copy.push(a2[i]);
    return copy;
}

/**
 *  Test if linear arrays are equal
 * @param {*} a1 
 * @param {*} a2 
 */
ArrayUtils.arrayEquals = function(a1, a2) {
    if(a1.length != a2.length) return false;
    for(var i = 0; i < a1.length; i++) {
        if (a1[i] != a2[i]) return false;
    }
    return true;
}

/**
 * Return a new array permutation
 * @param {*} array 
 * @param {*} permutation is an array with length <= array.length that has the new indexes
 */
ArrayUtils.permute = function(array, permutation) {
    if(permutation.length > array.length ){
        throw `permutation array length > array length[${array.length}]`
    }
    var copy = array.slice();
    for(var i = 0; i < permutation.length; i++) {
        copy[permutation[i]] = array[i];
    }
    return copy;
}

/**
 * return swap array indexes
 */
ArrayUtils.swap = function(array, i, j) {
    var t = array[i];
    array[i] = array[j];
    array[j] = t;
    return array;
}

ArrayUtils.findJsArrayDim = function(array) {
    if(array instanceof Array) {
        return ArrayUtils.join(ArrayUtils.findJsArrayDim(array[0]), [array.length]); 
    } else {
        return [];
    }
}

ArrayUtils.unpackJsArray = function(array) {
    if(array instanceof Array) {
        var joinIdentity = []
        for(var i = 0; i < array.length; i++) {
            joinIdentity = ArrayUtils.join(joinIdentity, ArrayUtils.unpackJsArray(array[i]));
        }
        return joinIdentity;
    } else {
        return [array];
    }
}

ArrayUtils.map = function(array, f) {
    var ans = [];
    for(var i = 0; i < array.length; i++) ans[i] = f(array[i]);
    return ans;
}

ArrayUtils.range = function(xmin, xmax, step) {
    var ans = [];
    for(var i = xmin; i < xmax; i += step) ans.push(i);
    return ans;
}

ArrayUtils.reduce = function(array, identity, binaryOperator) {
    for(var i = 0; i < array.length; i++) identity = binaryOperator(identity, array[i]);
    return identity;
}

module.exports = ArrayUtils;
},{}],3:[function(require,module,exports){
var MyCanvas = require('./MyCanvas.js');

//Note that we can switch from heritage to composition, think about that

// cameraSpace : 2-dim array with two 2-dim arrays that are intervals [a,b] | a < b
var CanvasSpace = function(canvas, cameraSpace) {
	MyCanvas.call(this, canvas);
	if(cameraSpace.length != 2 || (cameraSpace[0].length != 2 && cameraSpace[1].length != 2)) {
		throw "camera space must be 2-dim array with 2-dim arrays representing an interval";
	}
	this.cameraSpace = cameraSpace;
}

CanvasSpace.prototype = Object.create(MyCanvas.prototype);
CanvasSpace.prototype.constructor = CanvasSpace;

/* x : 2-dim array in camera space coordinates
 * returns : 2-dim array in integer coordinates
 */
CanvasSpace.prototype.integerTransform = function(x) {
	var xint = -( this.canvas.height - 1)  / (this.cameraSpace[1][1] - this.cameraSpace[1][0]) * (x[1] - this.cameraSpace[1][1]);
	var yint =   ( this.canvas.width - 1)  / (this.cameraSpace[0][1] - this.cameraSpace[0][0]) * (x[0] - this.cameraSpace[0][0]);
	return [xint, yint];
}

/* x : 2-dim array in integer coordinates
 * returns : 2-dim array in camera space coordinates
 */
CanvasSpace.prototype.inverseTransform = function(x) {
	var xt = this.cameraSpace[0][0] + (this.cameraSpace[0][1] - this.cameraSpace[0][0]) / (this.canvas.width - 1)  * x[1];
	var yt = this.cameraSpace[1][1] - (this.cameraSpace[1][1] - this.cameraSpace[1][0]) / (this.canvas.height - 1) * x[0];
	return [xt, yt];
}

/* x1     :   2-dim array
 * x2     :   2-dim array
 * shader :   is a function that receives a 2-dim array and returns a rgba 4-dim array
 */
CanvasSpace.prototype.drawLine = function(x1, x2, shader) {
	y1 = this.integerTransform(x1);
	y2 = this.integerTransform(x2);
	MyCanvas.prototype.drawLine.call(this, y1, y2, shader);
}

/* x1     :   2-dim array
 * x2     :   2-dim array
 * x3     :   2-dim array
 * shader :   is a function that receives a 2-dim array and returns a rgba 4-dim array
 */
CanvasSpace.prototype.drawTriangle = function(x1, x2, x3, shader) {
	y1 = this.integerTransform(x1);
	y2 = this.integerTransform(x2);
	y3 = this.integerTransform(x3);
	MyCanvas.prototype.drawTriangle.call(this, y1, y2, y3, shader);
}

/* x1     :   2-dim array
 * x2     :   2-dim array
 * x3     :   2-dim array
 * x4     :   2-dim array
 * shader :   is a function that receives a 2-dim array and returns a rgba 4-dim array
 */
CanvasSpace.prototype.drawQuad = function(x1, x2, x3, x4, shader) {
	y1 = this.integerTransform(x1);
	y2 = this.integerTransform(x2);
	y3 = this.integerTransform(x3);
	y4 = this.integerTransform(x4);
	MyCanvas.prototype.drawQuad.call(this, y1, y2, y3, y4, shader);
}

CanvasSpace.prototype.drawCircle = function(x, r, shader) {
    // it assumes squared canvas, for now ...
    y = this.integerTransform(x);
    z = this.integerTransform([r, 0])[1] - this.integerTransform([0, 0])[1];
    MyCanvas.prototype.drawCircle.call(this, y, z, shader);
}

CanvasSpace.prototype.drawImage = function (img, x, shader) {
    MyCanvas.prototype.drawImage.call(this, img, this.integerTransform(x), shader);
}

CanvasSpace.prototype.drawString = function(x, string, contextShader) {
    y = this.integerTransform(x);
    MyCanvas.prototype.drawString.call(this, y, string, contextShader);
};

// camera : 2-dim array with two 2-dim arrays that are intervals [a,b] | a < b
CanvasSpace.prototype.setCamera = function(camera) {
    if(camera.length != 2 || (camera[0].length != 2 && camera[1].length != 2)) {
		throw "camera space must be 2-dim array with 2-dim arrays representing an interval";
	}
	this.cameraSpace = camera;
}


module.exports = CanvasSpace;
},{"./MyCanvas.js":5}],4:[function(require,module,exports){
var ImageIO = {
    // empty object
};

/**
 * img : html image
 */
ImageIO.getImageCanvas = function(img) {
    var canvasAux = document.createElement('canvas');
    canvasAux.width = img.width;
    canvasAux.height = img.height;
    var contextAux = canvasAux.getContext('2d');
    contextAux.fillStyle = 'rgba(0, 0, 0, 0)';
    contextAux.globalCompositeOperation = 'source-over';
    contextAux.fillRect(0, 0, canvasAux.width, canvasAux.height);
    contextAux.drawImage(img, 0 ,0);
    return canvasAux;
}

/**
 * img : html image
 */
ImageIO.getDataFromImage = function(img) {
    canvas = ImageIO.getImageCanvas(img);
    return canvas.getContext('2d').getImageData(0 , 0, img.width, img.height);
};

ImageIO.loadImage = function(src) {
    var img = new Image();
    img.src = src;
    img.isReady = false;
    img.onload = function() {
        img.isReady = true;
    };
    return img;
};

ImageIO.generateImageReadyPredicate = function(img) {
    return function() { return img.isReady;};
}

module.exports = ImageIO;
},{}],5:[function(require,module,exports){
var ImageIO = require('./ImageIO.js');
/*
 Canvas coordinates

 0                  W-1
 +-------------> y
 |
 |
 |       *
 |
 |
 v x

 H-1
 */

/*

The canvas data is an array of length colors(C) * width(W) * height(H). Is a 3D-array.
The index is a number in [0, C * W * H - 1].
Having (x, y, z) where z is the color axis, the formula to index the array is :

f(x, y, z) = C * W * x + C * y + z.

Where x in [0, H - 1], y in [0, W - 1] and z in [0, C - 1].

Note that f(H - 1, W - 1, C - 1) = C * W * H - 1.

*/
function scale(u, r) {
    var ans = [];
    ans[0] = u[0] * r;
    ans[1] = u[1] * r;
    return ans;
}

function add(u, v) {
    var ans = [];
    ans[0] = u[0] + v[0];
    ans[1] = u[1] + v[1];
    return ans;
}

function floor(x) {
    var ans = [];
    ans[0] = Math.floor(x[0]);
    ans[1] = Math.floor(x[1]);
    return ans;
}

function diff(u, v) {
    var ans = [];
    ans[0] = u[0] - v[0];
    ans[1] = u[1] - v[1];
    return ans;
}

function dot(u, v) {
    return u[0] * v[0] + u[1] * v[1];
}

function squareNorm(x) {
    return dot(x, x);
}

function norm(x) {
    return Math.sqrt(dot(x, x));
}

function min(u, v) {
    var ans = [];
    ans[0] = Math.min(u[0], v[0]);
    ans[1] = Math.min(u[1], v[1]);
    return ans;
}

function max(u, v) {
    var ans = [];
    ans[0] = Math.max(u[0], v[0]);
    ans[1] = Math.max(u[1], v[1]);
    return ans;
}

/**
 * return solution to : [ u_0 , h] x = z_0
 *
 *                       [ u_1,  0] y = z_1
 */
function solve2by2UpperTriMatrix(u, h, z) {
    var aux = z[1] / u[1];
    return [aux, (-u[0] * aux + z[0]) / h];
}
/**
 * return solution to : [ u_0 , 0] x = z_0
 *
 *                       [ u_1,  w] y = z_1
 */
function solve2by2LowerTriMatrix(u, w, z) {
    var aux = z[0] / u[0];
    return [aux, (-u[1] * aux + z[1]) / w];
}

function triangleBaryCoord(x, triangle) {
    var y = [x[0] - triangle[0][0], x[1] - triangle[0][1]];
    var u = [triangle[1][0] - triangle[0][0], triangle[1][1] - triangle[0][1]];
    var v = [triangle[2][0] - triangle[0][0], triangle[2][1] - triangle[0][1]];
    var det = (u[0] * v[1] - u[1] * v[0]);
    if(det == 0) return [0, 0, 0];
    var alpha = [(v[1] * y[0] - v[0] * y[1]) / det, (u[0] * y[1] - u[1] * y[0]) / det];
    return [1 - alpha[0] - alpha[1], alpha[0], alpha[1]];
}

/**
 * values \in R^{k * 4}
 * x \in [0,1]^2
 */
function bilinearInterpolation(values, x) {
    var acc = [];
    for(var k = 0; k < values.length; k++) {
        var f03 = values[0][k] + (values[3][k] - values[0][k]) * x[1];
        var f12 = values[1][k] + (values[2][k] - values[1][k]) * x[1];
        var f = f03 + (f12 - f03) * x[0];
        acc.push(f);
    }
    return acc;
}


var MyCanvas = function (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.image = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    // width * height * 4 array of integers
    this.imageData = this.image.data;
};

/**
 * Returns a two vector with Height as first coordinate and Width as second. [Height, Width].
 */
MyCanvas.prototype.getSize = function () {
    return [this.canvas.height, this.canvas.width];
};

/**
 *  Draw update image on canvas.
 */
MyCanvas.prototype.paintImage = function () {
    this.ctx.putImageData(this.image, 0, 0);
};

MyCanvas.prototype.getCanvas = function() {
    return this.canvas;
}

/**
 * Clear Image with @rgba color.
 *
 * @param rgba
 */
MyCanvas.prototype.clearImage = function (rgba) {
    this.useCanvasCtx(function (canvas) {
        var size = canvas.getSize();
        canvas.ctx.fillStyle = 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
        canvas.ctx.globalCompositeOperation = 'source-over';
        canvas.ctx.fillRect(0, 0, size[1], size[0]);
    }, true);
};

MyCanvas.prototype.useCanvasCtx = function (lambda, isClearImage) {
    if (isClearImage == null || !isClearImage) {
        this.ctx.putImageData(this.image, 0, 0);
    }
    lambda(this);
    this.image = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.imageData = this.image.data;
};

MyCanvas.prototype.getImageIndex = function (x) {
    return 4 * (this.canvas.width * x[0] + x[1]);
};

MyCanvas.prototype.getPxl = function(x) {
    var index = this.getImageIndex(x);
    return [this.imageData[index], this.imageData[index + 1], this.imageData[index + 2], this.imageData[index + 3]];
}

MyCanvas.prototype.drawPxl = function (x, rgb) {
    var index = this.getImageIndex(x);
    this.imageData[index] = rgb[0];
    this.imageData[index + 1] = rgb[1];
    this.imageData[index + 2] = rgb[2];
    this.imageData[index + 3] = rgb[3];
};

/* 
 * x1     :   2-dim array 
 * x2     :   2-dim array
 * shader :   is a function that receives a 2-dim array and a line (array with 2 points) and returns a rgba 4-dim array
 */
MyCanvas.prototype.drawLine = function (x1, x2, shader) {
    // add points before clip
    shader.points = [x1, x2];

    // do clipping
    var stack = [];
    stack.push(x1);
    stack.push(x2);
    var inStack = [];
    var outStack = [];
    for (var i = 0; i < stack.length; i++) {
        var x = stack[i];
        if ((0 <= x[0]) && (x[0] < this.canvas.height) && (0 <= x[1]) && (x[1] < this.canvas.width)) {
            inStack.push(x);
        } else {
            outStack.push(x);
        }
    }
    // both points are inside canvas
    if (inStack.length == 2) {
        this.drawLineInt(inStack[0], inStack[1], shader);
        return;
    }
    //intersecting line with canvas
    var intersectionSolutions = [];
    var v = [x2[0] - x1[0], x2[1] - x1[1]];
    // Let s \in [0,1]
    // line intersection with [0, 0]^T + [H - 1, 0]^T s
    intersectionSolutions.push(solve2by2UpperTriMatrix(v, -(this.canvas.height - 1), [-x1[0], -x1[1]]));
    // line intersection with [H - 1, 0]^T + [0, W - 1]^T s
    intersectionSolutions.push(solve2by2LowerTriMatrix(v, -(this.canvas.width - 1), [(this.canvas.height - 1) - x1[0], -x1[1]]));
    // line intersection with [H - 1, W - 1]^T + [-(H - 1), 0]^T s
    intersectionSolutions.push(solve2by2UpperTriMatrix(v, (this.canvas.height - 1), [(this.canvas.height - 1) - x1[0], (this.canvas.width - 1) - x1[1]]));
    // line intersection with [0, W - 1]^T + [0, -(W - 1)]^T s
    intersectionSolutions.push(solve2by2LowerTriMatrix(v, (this.canvas.width - 1), [-x1[0], (this.canvas.width - 1) - x1[1]]));

    var validIntersection = [];
    for (var i = 0; i < intersectionSolutions.length; i++) {
        var x = intersectionSolutions[i];
        if ((0 <= x[0]) && (x[0] <= 1) && (0 <= x[1]) && (x[1] <= 1)) {
            validIntersection.push(x);
        }
    }
    if (validIntersection.length == 0) {
        return;
    }
    //it can be shown that at this point there is at least one valid intersection.
    if(inStack.length > 0) {
        var p = [x1[0] + validIntersection[0][0] * v[0], x1[1] + validIntersection[0][0] * v[1]];
        this.drawLineInt(inStack.pop(), p, shader);
        return;
    }

    var p0 = [x1[0] + validIntersection[0][0] * v[0], x1[1] + validIntersection[0][0] * v[1]];
    for(var i = 1; i < validIntersection.length; i++) {
        var p = [x1[0] + validIntersection[i][0] * v[0], x1[1] + validIntersection[i][0] * v[1]];
        var v = diff(p, p0);
        if(dot(v, v) > 1E-3) {
            this.drawLineInt(p0, p, shader);
            return;
        }
    }
    this.drawLineInt(p0, p0, shader);
};

MyCanvas.prototype.drawLineInt = function (x1, x2, shader) {
    x1 = floor(x1);
    x2 = floor(x2);

    var index = [-1, 0, 1];

    var n = index.length;
    var nn = n * n;

    var x = [];
    x[0] = x1[0];
    x[1] = x1[1];

    var tangent = diff(x2, x1);
    var normal = [];
    normal[0] = -tangent[1];
    normal[1] = tangent[0];

    shader(x, shader.points, this);

    while (x[0] !== x2[0] || x[1] !== x2[1]) {
        var fmin = Number.MAX_VALUE;
        var minDir = [];
        for (var k = 0; k < nn; k++) {
            var i = index[k % n];
            var j = index[Math.floor(k / n)];

            var nextX = add(x, [i, j]);

            var v = diff(nextX, x1);
            var f = Math.abs(dot(v, normal)) - dot(v, tangent);
            if (fmin > f) {
                fmin = f;
                minDir = [i, j];
            }
        }

        x = add(x, minDir);
        shader(x, shader.points, this);
    }
    shader(x, shader.points, this);

};

MyCanvas.prototype.drawPolygon = function(array, shader, isInsidePoly) {
    var upperBox = [[Number.MAX_VALUE, Number.MAX_VALUE], [Number.MIN_VALUE, Number.MIN_VALUE]];
    for(var i = 0; i < array.length; i++) {
      upperBox[0] = min(array[i], upperBox[0]);
      upperBox[1] = max(array[i], upperBox[1]);
    }
    var size = this.getSize();
    upperBox[0] = floor(min(diff(size, [1, 1]), max([0, 0], upperBox[0])));
    upperBox[1] = floor(min(diff(size, [1, 1]), max([0, 0], upperBox[1])));

    for(var i = upperBox[0][0]; i < upperBox[1][0]; i++) {
      for(var j = upperBox[0][1]; j < upperBox[1][1]; j++) {
          var x = [i, j];
          if(isInsidePoly(x, array)) {
            shader(x, array, this);
          }
      }
    }
}

/* 
 * x1     :   2-dim array
 * x2     :   2-dim array
 * x3     :   2-dim array
 * shader :   is a function that receives a 2-dim array and a triangle (array with 3 points) and returns a rgba 4-dim array
 */
MyCanvas.prototype.drawTriangle = function (x1, x2, x3, shader) {
      var array = [x1, x2, x3];
      this.drawPolygon(array, shader, this.isInsideConvex);
};

/* x1     :   2-dim array
 * x2     :   2-dim array
 * x3     :   2-dim array
 * x4     :   2-dim array
 * shader :   is a function that receives a 2-dim array and returns a rgba 4-dim array
*/
MyCanvas.prototype.drawQuad = function (x1, x2, x3, x4, shader) {
    this.drawPolygon([x1, x2, x3, x4], shader, this.isInsideConvex);
};

// slower than the method below
MyCanvas.prototype.isInsidePolygon = function(x, array) {
    var v = [];
    var theta = 0;
    var length = array.length;
    for(var i = 0; i < length; i++) {
        v[0] = diff(array[(i + 1) % length], x);
        v[1] = diff(array[i], x);
        theta += Math.acos(dot(v[0], v[1]) / (norm(v[0]) * norm(v[1])));
    }
    return Math.abs(theta -  2 * Math.PI) < 1E-3;
}

MyCanvas.prototype.isInsideConvex = function(x, array) {
    var length = array.length;
    var v = [];
    var vDotN = [];
    for(var i = 0; i < length; i++) {
        v[i] = diff(array[( i + 1 ) % length], array[i]);
        var n = [-v[i][1], v[i][0]];
        var r = diff(x, array[i]);
        vDotN[i] = dot(r, n);
    }
    orientation = v[0][0] * v[1][1] - v[0][1] * v[1][0] > 0 ? 1 : -1;
    for(var i = 0; i < length; i++) {
        var myDot = vDotN[i] * orientation;
        if (myDot < 0) {
            return false;
        }
    }
    return true;
}

MyCanvas.prototype.drawImage = function (img, x, shader) {
    if("isReady" in img) {
        if(!img.isReady) {
            return;
        }
    }
    if (shader == null) {
        this.useCanvasCtx(function (canvas) {
            canvas.ctx.drawImage(img, x[1], x[0]);
        });
    }
};


MyCanvas.prototype.drawCircle = function(x, r, shader) {
    var corner = scale([1, 1], r);
    var upperBox = [diff(x, corner), add(x, corner)];
    var size = this.getSize();
    upperBox[0] = floor(min(diff(size, [1, 1]), max([0, 0], upperBox[0])));
    upperBox[1] = floor(min(diff(size, [1, 1]), max([0, 0], upperBox[1])));
    for(var i = upperBox[0][0]; i <= upperBox[1][0]; i++) {
        for(var j = upperBox[0][1]; j <= upperBox[1][1]; j++) {
            var p = [i, j];
            if(this.isInsideCircle(p, x, r)) {
                shader(p, [x, r], this);
            }
        }
    }
}

MyCanvas.prototype.isInsideCircle = function(p, x, r) {
    return squareNorm(diff(p, x)) <= r * r;
}

MyCanvas.prototype.addEventListener = function(key, lambda, useCapture) {
    this.canvas.addEventListener(key, lambda, useCapture);
};

MyCanvas.prototype.drawString = function(x, string, contextShader) {
    this.useCanvasCtx(
        function (canvas) {
            contextShader(canvas.ctx);
            canvas.ctx.fillText(string, x[1], x[0]);
        }
    );
};


MyCanvas.simpleShader = function (color) {
    return function (x, element, canvas) {
        canvas.drawPxl(x, color);
    };
};

MyCanvas.colorShader = function(colors) {
    var auxShader = function(x, poly, canvas, alpha) {
        var interpolateColors = [0, 0, 0, 0];
        for(var i = 0; i < poly.length; i++) {
            interpolateColors[0] = interpolateColors[0] + colors[i][0] * alpha[i];
            interpolateColors[1] = interpolateColors[1] + colors[i][1] * alpha[i];
            interpolateColors[2] = interpolateColors[2] + colors[i][2] * alpha[i];
            interpolateColors[3] = interpolateColors[3] + colors[i][3] * alpha[i];
        }
        canvas.drawPxl(x, interpolateColors);
    }
    return MyCanvas.interpolateTriangleShader(auxShader);
}


MyCanvas.interpolateQuadShader = function(shader) {
    return function(x, quad, canvas) {
        var t1 = [quad[0], quad[1], quad[2]];
        var t2 = [quad[2], quad[3], quad[0]];
        var alpha = triangleBaryCoord(x, t1);
        if(alpha[0] > 0 && alpha[1] > 0 && alpha[2] > 0 && Math.abs(alpha[0] + alpha[1] + alpha[2] - 1) < 1E-10) {
            shader(x, quad, canvas, [alpha[0], alpha[1], alpha[2], 0]);
        } else {
            alpha = triangleBaryCoord(x, t2);
            shader(x, quad, canvas, [alpha[2], 0, alpha[0], alpha[1]]);
        }
    }
}

MyCanvas.interpolateTriangleShader = function(shader) {
    return function(x, triangle, canvas) {
        alpha = triangleBaryCoord(x, triangle);
        shader(x, triangle, canvas, alpha);
    }
}

MyCanvas.interpolateLineShader = function(shader) {
    return function (x, line, canvas) {
        var v = diff(line[1], line[0]);
        var z = diff(x, line[0]);
        var vnorm = squareNorm(v);
        var projection = dot(z, v);
        var t = vnorm == 0.0 ? 0 : projection / vnorm;
        shader(x, line, canvas, t);
    };
};

/**
 * img: html loaded image.
 * quadTexCoord: [0, 1]^{2 * 4}, texture coordinates
 */
MyCanvas.quadTextureShader = function(img, quadTexCoord) {
    var imageShader = function(x, quad, canvas, alpha) {
        var imageCanvas = new MyCanvas(ImageIO.getImageCanvas(img));
        var imgSize = imageCanvas.getSize();
        var interpolateTexCoord = [0, 0];
        for(var i = 0; i < quadTexCoord.length; i++) {
            interpolateTexCoord[0] = interpolateTexCoord[0] + quadTexCoord[i][0] * alpha[i];
            interpolateTexCoord[1] = interpolateTexCoord[1] + quadTexCoord[i][1] * alpha[i];
        }
        var i = [(1 - interpolateTexCoord[1]) * (imgSize[1] - 1), (imgSize[0] - 1) * interpolateTexCoord[0]];
        // bound coordinates
        i = max([0, 0], min(diff([imgSize[0], imgSize[1]], [1, 1]), i));
        // pxl lower corner
        var j = floor(i);
        var cornerColors = [imageCanvas.getPxl(j), imageCanvas.getPxl(add(j, [1,0])), imageCanvas.getPxl(add(j, [1, 1])), imageCanvas.getPxl(add(j, [0, 1]))];
        var bilinearColor = bilinearInterpolation(cornerColors, diff(i, j));
        canvas.drawPxl(x, bilinearColor);
    }
    return MyCanvas.interpolateQuadShader(imageShader);
}


module.exports = MyCanvas;
},{"./ImageIO.js":4}],6:[function(require,module,exports){
var SimManager = {}

/**
 * Tried to put private methods and variables but it didn´t work!!
 */
SimManager.builder = function() {
    return new function() {
        this.simulations = [];

        this.push = function(sim) {
            this.simulations.push(sim);
            return this;
        }

        this.build = function() {
            return new SimManager.SimManager(this.simulations);
        }
    };
}

SimManager.SimManager = function(_simulations){
    /**
    * state of opened simulations, is a number \in {0, ... , n}.
    * Where state 0, represents closed simulations, and state != 0 represents all simulations close unless simulations[state-1].
    **/
    this.stateIndexApplicationOpen = 0;
    this.simulations = _simulations;

    this.closeState = function(state) {
        if(state > 0) {
            this.simulations[state - 1].end();
        }
    }

    this.openState = function(state) {
        this.simulations[state - 1].start();
    }

    // click number > 0
    this.clickOperator = function(clickNumber, state) {
        var condition = state != clickNumber;
        if(condition) {
            this.closeState(state);
            this.openState(clickNumber);
        } else {
            this.closeState(state);
        }
        return condition ? clickNumber : 0;
    }

    this.simulate = function(index) {
        this.simulations[index].draw();
        if (this.simulations[index].checkIfCanDraw()) {
            requestAnimationFrame(() => this.simulate(index));
        }
    }

    this.runSimulation = function(index) {
        this.stateIndexApplicationOpen = this.clickOperator(index + 1, this.stateIndexApplicationOpen);
        requestAnimationFrame(() => this.simulate(index));
    }

    this.apply = function(index, lambda) {
        lambda(this.simulations[index]);
        return this;
    }

    this.init = function() {
        this.simulations.forEach(element => element.init());
        return this;
    }
}

SimManager.simulatorBuilder = function() {
    return new function() {
        var throwUndefined = function() {
            throw "Undefined obligatory function";
        }
        this.simulator = {
            "base": {},
            "init": throwUndefined,
            "checkIfCanDraw": throwUndefined,
            "draw": () => throwUndefined,
            "start": () => throwUndefined,
            "end": () => throwUndefined
        };

        this.addBaseSimulator = function(obj) {
            this.simulator.base = obj;
            return this;
        }

        this.init = function(f) {
            this.simulator.init = () => f(this.simulator.base);
            return this;
        }

        this.checkIfCanDraw = function(f) {
            this.simulator.checkIfCanDraw = () => f(this.simulator.base);
            return this;
        }
        
        this.draw = function(f) {
            this.simulator.draw = () => f(this.simulator.base);
            return this;
        }

        this.start = function(f) {
            this.simulator.start = () => f(this.simulator.base);
            return this;
        }

        this.end = function(f) {
            this.simulator.end = () => f(this.simulator.base);
            return this;
        }

        this.build = function() {
            return this.simulator;
        }
    };
}


module.exports = SimManager; 
},{}]},{},[1])(1)
});