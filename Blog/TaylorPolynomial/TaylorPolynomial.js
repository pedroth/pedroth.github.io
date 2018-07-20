(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.app = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MyCanvas = require('../../JsLib/MyCanvas/MyCanvas.js');
var CanvasSpace = require('../../JsLib/MyCanvas/CanvasSpace.js');
var ImageIO = require('../../JsLib/MyCanvas/ImageIO.js');


factorial = function(x) {
    var acc = 1;
    for(var i=x; i > 0; i--) {
        acc *= x;
        x--;
    }
    return acc;
}


var simulations = [
    new Sim1(),
    new Sim2()
];

/**
* state of opened simulations, is a number \in {0, ... , n}.
* Where state 0, represents closed simulations, and state != 0 represents all simulations close unless simulations[state-1].
**/
var stateIndexApplicationOpen = 0;

/**
 * Copied from https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
 *
 **/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/*
 * Simulations
 */
function Sim1() {
    this.canvasGraph = new CanvasSpace(document.getElementById("graph"), [[-1.5, 1.5], [-1.5, 1.5]]);
    this.canvasAbsolute = new CanvasSpace(document.getElementById("absoluteGraph"), [[-1.5, 1.5], [-1.5, 1.5]]);
    this.samples = 50;
    this.x = [];
    this.y1 = [];
    this.y2 = [];
    this.mouse = []
    this.isMouseDown = false;

    for(var i = 0; i < this.samples; i++) {
        this.x[i] = -1 + 2 * (i / (this.samples - 1));
        this.y1[i] = this.x[i];
        this.y2[i] = Math.abs(this.y1[i]);
    }

    this.s1Shader = function(x, element, canvas) {
        var y = canvas.inverseTransform(x);
        var b = x[0] % 2 == x[1] % 2;
        if (y[1] > 0 && b) {
            canvas.drawPxl(x, [255, 0, 0, 255]);
        } else if(y[1] < 0 && b) {
            canvas.drawPxl(x, [0, 0, 255, 255]);
        }
    }

    this.smooth = function(y) {
        var z = [];
        z[0] = (y[0] + y[1]) / 2;
        for(var i = 1; i < y.length-1; i++) {
            z[i] = (y[i] + y[i+1] + y[i-1]) / 3;
        }
        z[y.length-1] = (y[y.length-2] + y[y.length-1]) / 2;
        return z;
    }

    this.map = function(y, f) {
        var z = [];
        for(var i = 0; i < y.length; i++) {
            z[i] = f(y[i]);
        }
        return z;
    }

    this.baseMouse = function(integerMouse) {
       this.mouse = this.canvasGraph.inverseTransform(integerMouse);
        var x = this.mouse[0];
        if(!this.isMouseDown) {
                return;
        }
        if(x >= -1.0 || x <= 1.0) {
            var i = Math.min(this.samples - 1, Math.max(0, Math.floor(((x + 1.0) * (this.y1.length - 1.0)) / 2.0 )));
            this.y1[i] = this.mouse[1];
            this.y1 = this.smooth(this.y1);
            this.y2 = this.map(this.y1, Math.abs);
        }
    }

    this.mouseStart = function (e) {
        this.isMouseDown = true;
    }

    this.mouseEnd = function (e) {
        this.isMouseDown = false;
    }

    this.mouseMove = function (e) {
        var rect = this.canvasGraph.canvas.getBoundingClientRect();
        var mx = (e.clientX - rect.left), my = (e.clientY - rect.top);
        this.baseMouse([my, mx]);
    }

    this.touchStart = function (e) {
        this.isMouseDown = true;
    }

    this.touchEnd = function (e) {
        this.isMouseDown = false;
    }

    this.touchMove = function (e) {
        var rect = this.canvasGraph.canvas.getBoundingClientRect();
        var mx = (e.touches[0].clientX - rect.left), my = (e.touches[0].clientY - rect.top);
        this.baseMouse([my, mx]);
    }

    this.checkIfCanDraw = function() {
        return $("#sim1").is(":visible");
    }

    this.drawCanvasGraph = function() {
        this.canvasGraph.drawLine([-2.1, 0], [2.1, 0], MyCanvas.simpleShader([0, 0, 0, 255]));
        for(var i = 0; i < this.y1.length - 1; i++) {
           var p1 = [this.x[i], this.y1[i]];
           var p2 = [this.x[i + 1], this.y1[i + 1]];
           this.canvasGraph.drawLine(p1, p2, MyCanvas.simpleShader([0, 0, 0, 255]))
           this.canvasGraph.drawTriangle(p1, p2, [this.x[i + 1], this.y1[i + 1]], this.s1Shader);
           this.canvasGraph.drawQuad([this.x[i], 0], [this.x[i + 1], 0], p2, p1, this.s1Shader);
        }
    }

    this.drawCanvasAbsolute = function() {
        this.canvasAbsolute.drawLine([-2.1, 0], [2.1, 0], MyCanvas.simpleShader([0, 0, 0, 255]));
        for(var i = 0; i < this.y2.length - 1; i++) {
            var p1 = [this.x[i], this.y2[i]];
            var p2 = [this.x[i + 1], this.y2[i + 1]];
            this.canvasAbsolute.drawLine(p1, p2, MyCanvas.simpleShader([0, 0, 0, 255]))
            this.canvasAbsolute.drawTriangle(p1, p2, [this.x[i + 1], this.y2[i + 1]], this.s1Shader);
            this.canvasAbsolute.drawQuad([this.x[i], 0], [this.x[i + 1], 0], p2, p1, this.s1Shader);
        }
    }

    this.draw = function() {
        this.canvasAbsolute.clearImage([255, 255, 255, 255]);
        this.canvasGraph.clearImage([255, 255, 255, 255]);

        this.drawCanvasGraph();
        this.drawCanvasAbsolute();

        this.canvasGraph.paintImage();
        this.canvasAbsolute.paintImage();
    }

    this.start = function() {
        $("#sim1").slideDown();
    }

    this.end = function() {
        $("#sim1").slideUp();
    }

    this.init = function() {
        this.canvasGraph.addEventListener("touchstart", function(e) { apply(0, function(x) { x.touchStart(e) })}, false);
        this.canvasGraph.addEventListener("touchend", function(e) { apply(0, function(x) { x.touchEnd(e) }) }, false);
        this.canvasGraph.addEventListener("touchmove", function(e) { apply(0, function(x) { x.touchMove(e) }) }, false);

        this.canvasGraph.addEventListener("mousedown", function(e) { apply(0, function(x) { x.mouseStart(e) }) }, false);
        this.canvasGraph.addEventListener("mouseup", function(e) { apply(0, function(x) { x.mouseEnd(e) }) }, false);
        this.canvasGraph.addEventListener("mousemove",function(e) { apply(0, function(x) { x.mouseMove(e) }) }, false);
    }
}


function Sim2() {
    this.canvasTaylor = new CanvasSpace(document.getElementById("taylor"), [[-0.1, 1], [-0.1, 1]]);
    this.canvasRemainder = new CanvasSpace(document.getElementById("remainder"), [[-0.1, 1.1], [-0.1, 1.1]]);
    this.isMouseDown = false;
    this.circleRadius = 0.01;
    this.fx = [];
    this.bandwidth = 4;
    this.maxAmp = 4;
    this.w = [];
    this.samplesPerPeriod = 25;
    this.samplesPoly = 75;
    this.x0 = 0;
    this.taylorDegree = 6;
    this.colors = [];
    this.restPolys = [];
    /**
     * I want to take k samples in a sine wave period (period of sine wave is 2 * pi = T).
     * In [0,1] interval I will take k / T samples.
     * If I have a sine wave with double the frequency ( sin(2 * x) ) I will have in [0,1] : 2 * k / T samples.
     * For the general case frequency f we get f * k / T samples in [0,1] interval.
     * The max frequency in our sine waves will (bandwidth - 1) * (2 ^ (bandwidth - 1).
     */
    this.samples = Math.ceil((this.bandwidth - 1) * (1 << this.bandwidth - 1) * (this.samplesPerPeriod / (2 * Math.PI)));

    this.generateFourier = function(w) {
        return function(x) {
            var acc = 0;
            var mul = 1;
            for(var i = 0; i < w.length; i++) {
                acc += mul * w[i] * Math.sin(i * (1.0 / mul) * x);
                mul /= 2;
            }
            return acc;
        }
    }

    this.rest = function(x, n) {
        return Math.pow(x, n + 1) / factorial(n + 1);
    }

    this.buildRestFunctions = function() {
        for(var i = 0; i < this.taylorDegree; i++) {
            this.restPolys.push([]);
        }
        var h = 1 / (this.samples - 1);
        for(var j = 0; j < this.taylorDegree; j++) {
            var y = this.restPolys[j]
            for(var i = 0; i < this.samples; i++) {
                var x = h * i;
                y.push(this.rest(x, j));
            }
        }
    }

    this.buildFunction = function(samples) {
        this.w = [];
        for(var i = 0; i < this.bandwidth; i++) {
            this.w[i] = -this.maxAmp + 2 * this.maxAmp * Math.random();
        }
        var f = this.generateFourier(this.w);
        var y = [];
        var minY = Number.MAX_VALUE;
        var maxY = Number.MIN_VALUE;
        var aveY = 0;
        var h = 1.0 / (samples - 1);
        for(var i = 0; i < samples; i++) {
            var x =  h * i;
            y[i] = f(x);
            minY = Math.min(minY, y[i]);
            maxY = Math.max(maxY, y[i]);
            aveY += y[i];
        }
        var xMinMax = this.canvasTaylor.cameraSpace[0]
        this.canvasTaylor.setCamera([xMinMax, [minY, maxY]]);
        return {func : f, funcSamples : y, min : minY, max : maxY, avg : aveY / samples};
    }

    // function that do stuff with mouse coordinates
    this.baseMouse = function(integerMouse) {
        if(!this.isMouseDown) {
            return;
        }
        var mouse = this.canvasTaylor.inverseTransform(integerMouse);
        this.x0 = mouse[0];
    }

    this.mouseStart = function (e) {
        this.isMouseDown = true;
    }

    this.mouseEnd = function (e) {
        this.isMouseDown = false;
    }

    this.mouseMove = function (e) {
        var rect = this.canvasTaylor.canvas.getBoundingClientRect();
        var mx = (e.clientX - rect.left), my = (e.clientY - rect.top);
        this.baseMouse([my, mx]);
    }

    this.touchStart = function (e) {
        this.isMouseDown = true;
    }

    this.touchEnd = function (e) {
        this.isMouseDown = false;
    }

    this.touchMove = function (e) {
        var rect = this.canvasTaylor.canvas.getBoundingClientRect();
        var mx = (e.touches[0].clientX - rect.left), my = (e.touches[0].clientY - rect.top);
        this.baseMouse([my, mx]);
    }

    this.checkIfCanDraw = function() {
        return $("#sim2").is(":visible");
    }

    this.dfr = function(f, x, n, h) {
        if(n == 0) {
            return f(x);
        }
        return (this.dfr(f, x + h, n-1, h) - this.dfr(f, x - h, n-1, h)) / (2 * h);
    }

    this.df = function(f, x, n) {
        var h = 1;
        var dfh1 = this.dfr(f, x, n, h);
        var dfh2 = dfh1;
        do {
           dfh1 = dfh2;
           h /= 2;
           dfh2 = this.dfr(f, x, n, h);
        } while(Math.abs(dfh1 - dfh2) > 1E-2);
        return dfh1;
    }

    this.taylorPoly = function(f, n, x0) {
        var derivatives = [];
        for(var i = 0; i <= n; i++) {
            derivatives.push(this.df(f, x0, i));
        }
        return function(x) {
            acc = 0;
            for(var i = 0; i <= n; i++) {
                acc += (derivatives[i] * Math.pow(x - x0, i)) / factorial(i);
            }
            return acc;
        }
    }

    this.drawTaylorPolynomial = function() {
        var polynomials = [];
        var h = 1 / this.taylorDegree;
        for(var i = 0; i < this.taylorDegree; i++) {
            polynomials.push(this.taylorPoly(this.fx.func, i, this.x0));
            if(this.colors.length < this.taylorDegree) {
                rgb = HSVtoRGB(h * i, 1.0, 1.0);
                this.colors.push([rgb.r, rgb.g, rgb.b, 255]);
            }
        }
        var h = 1 / (this.samplesPoly - 1);
        for(var i = 0; i < this.samplesPoly - 1; i++) {
            for(var j = 0; j < this.taylorDegree; j++) {
              var x = h * i;
              var xh = x + h;
              var y = polynomials[j](x);
              var yh = polynomials[j](xh);
              this.canvasTaylor.drawLine([x, y], [xh, yh], MyCanvas.simpleShader(this.colors[j]));
            }
        }
    }

    this.updateTaylorCanvas = function() {
        var dist = Math.abs(this.fx.min - this.fx.max);
        var percentCamera = 0.2;
        this.canvasTaylor.setCamera([[-0.1, 1],[this.fx.min - percentCamera * dist, this.fx.max + percentCamera * dist]])
        this.canvasTaylor.drawLine([-1, 0], [1.5, 0], MyCanvas.simpleShader([0, 0, 0, 255]));
        var h = 1.0 / this.samples;
        for(var i = 0; i < this.fx.funcSamples.length-1; i++) {
            var x = h * i;
            var y = this.fx.funcSamples[i];
            this.canvasTaylor.drawLine([x, y], [x + h, this.fx.funcSamples[i+1]], MyCanvas.simpleShader([0, 0, 0, 255]));
        }
        this.drawTaylorPolynomial();
    }

    this.drawLegend = function() {
        // draw legend
        for(var i = 0; i < this.taylorDegree; i++){
            var legendYCoord = 1 - 0.05 * i;
            this.canvasRemainder.drawLine([0.0, legendYCoord], [0.2, legendYCoord], MyCanvas.simpleShader(this.colors[i]));
            //this.canvasRemainder.drawString([0.9, 1 - 0.01 * i], [1, 1 - 0.01 * i], MyCanvas.simpleShader(this.colors[i]));
        }
    }

    this.updateRemainderCanvas = function() {
        this.drawLegend();
        this.canvasRemainder.drawLine([-1, 0], [1.5, 0], MyCanvas.simpleShader([0, 0, 0, 255]));
        var h = 1 / (this.samples-1);
        for(var j = 0; j < this.taylorDegree; j++) {
            for(var i = 0; i < this.samples - 1; i++) {
                var x = h * i;
                var xh = x + h;
                var y = this.restPolys[j][i]
                var yh = this.restPolys[j][i + 1]
                this.canvasRemainder.drawLine([x, y], [xh, yh], MyCanvas.simpleShader(this.colors[j]));
            }
        }
    }

    this.draw = function() {
        this.canvasTaylor.clearImage([255, 255, 255, 255]);
        this.canvasRemainder.clearImage([255, 255, 255, 255]);
        this.updateTaylorCanvas();
        this.updateRemainderCanvas();
        this.canvasTaylor.paintImage();
        this.canvasRemainder.paintImage();
    }

    this.start = function() {
        $("#sim2").slideDown();
        this.fx = this.buildFunction(this.samples);
        this.buildRestFunctions();
    }

    this.generateNewField = function() {
        this.fx = this.buildFunction(this.samples);
    }

    this.end = function() {
        $("#sim2").slideUp();
    }

    this.init = function() {
        this.canvasTaylor.addEventListener("touchstart", function(e) { apply(1, function(x) { x.touchStart(e) })}, false);
        this.canvasTaylor.addEventListener("touchend",   function(e) { apply(1, function(x) { x.touchEnd(e) }) }, false);
        this.canvasTaylor.addEventListener("touchmove",  function(e) { apply(1, function(x) { x.touchMove(e) }) }, false);

        this.canvasTaylor.addEventListener("mousedown", function(e)  { apply(1, function(x) { x.mouseStart(e) }) }, false);
        this.canvasTaylor.addEventListener("mouseup",   function(e)  { apply(1, function(x) { x.mouseEnd(e) }) }, false);
        this.canvasTaylor.addEventListener("mousemove", function(e)  { apply(1, function(x) { x.mouseMove(e) }) }, false);
    }
}


/**
 *
 * General utilitarian functions
 */
function closeState(state) {
    if(state > 0) {
        simulations[state-1].end();
    }
}

function openState(state) {
    simulations[state-1].start();
}

// click number > 0
function clickOperator(clickNumber, state) {
    var condition = state != clickNumber;
    if(condition) {
        closeState(state);
        openState(clickNumber);
    } else {
        closeState(state);
    }
    return condition ? clickNumber : 0;
}

function simulate(simulation) {
    simulation.draw();
    if (simulation.checkIfCanDraw()) {
        requestAnimationFrame(function() {
            simulate(simulation);
        });
    }
}

function runSimulation(index) {
	stateIndexApplicationOpen = clickOperator(index + 1, stateIndexApplicationOpen)
	requestAnimationFrame(function() {
	    simulate(simulations[index]);
	});
}

function apply(index, lambda) {
    lambda(simulations[index]);
}

for (var i = 0; i < simulations.length; i++) {
    var simulation = simulations[i];
    simulation.init();
}

module.exports =  {
    run : runSimulation,
    apply : apply
}
},{"../../JsLib/MyCanvas/CanvasSpace.js":2,"../../JsLib/MyCanvas/ImageIO.js":3,"../../JsLib/MyCanvas/MyCanvas.js":4}],2:[function(require,module,exports){
var MyCanvas = require('./MyCanvas.js');

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
	// I could not call MyCanvas.drawQuad since MyCanvas.drawQuad uses this.drawTriangle
	MyCanvas.prototype.drawTriangle.call(this, y1, y2, y3, shader);
	MyCanvas.prototype.drawTriangle.call(this, y3, y4, y1, shader);
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

// camera : 2-dim array with two 2-dim arrays that are intervals [a,b] | a < b
CanvasSpace.prototype.setCamera = function(camera) {
    if(camera.length != 2 || (camera[0].length != 2 && camera[1].length != 2)) {
		throw "camera space must be 2-dim array with 2-dim arrays representing an interval";
	}
	this.cameraSpace = camera;
}


module.exports = CanvasSpace;
},{"./MyCanvas.js":4}],3:[function(require,module,exports){
var ImageIO = function() {
    // empty constructor
};

ImageIO.getDataFromImage = function(img) {
    var canvasAux = document.createElement('canvas');
    canvasAux.width = img.width;
    canvasAux.height = img.height;
    var contextAux = canvasAux.getContext('2d');
    contextAux.fillStyle = 'rgba(0, 0, 0, 0)';
    contextAux.globalCompositeOperation = 'source-over';
    contextAux.fillRect(0, 0, canvasAux.width, canvasAux.height);
    contextAux.drawImage(img, 0 ,0);
    return contextAux.getImageData(0, 0, img.width, img.height);
};

ImageIO.loadImage= function(src) {
    var img = new Image();
    img.src = src;
    img.isReady = false;
    img.onload = function() {
        img.isReady = true;
    };
    return img;
};

module.exports = ImageIO;
},{}],4:[function(require,module,exports){
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

/* 
 * x1     :   2-dim array
 * x2     :   2-dim array
 * x3     :   2-dim array
 * shader :   is a function that receives a 2-dim array and a triangle (array with 3 points) and returns a rgba 4-dim array
 */
MyCanvas.prototype.drawTriangle = function (x1, x2, x3, shader) {
      var array = [x1, x2, x3];
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
              if(this.isInsideTriangle(x, array)) {
                  shader(x, array, this);
              }
          }
      }
  };

/* x1     :   2-dim array
 * x2     :   2-dim array
 * x3     :   2-dim array
 * x4     :   2-dim array
 * shader :   is a function that receives a 2-dim array and returns a rgba 4-dim array
*/
  MyCanvas.prototype.drawQuad = function (x1, x2, x3, x4, shader) {
      this.drawTriangle(x1, x2, x3, shader);
      this.drawTriangle(x3, x4, x1, shader);
  };

// slower than the method below
//MyCanvas.prototype.insideTriangle = function(x, array) {
//    var v = [];
//    var theta = 0;
//    var length = array.length;
//    for(var i = 0; i < length; i++) {
//        v[0] = diff(array[(i + 1) % length], x);
//        v[1] = diff(array[i], x);
//        theta += Math.acos(dot(v[0], v[1]) / (norm(v[0]) * norm(v[1])));
//    }
//    return Math.abs(theta -  2 * Math.PI) < 1E-3;
//}

MyCanvas.prototype.isInsideTriangle = function(x, array) {
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


MyCanvas.simpleShader = function (color) {
    return function (x, element, canvas) {
        canvas.drawPxl(x, color);
    };
};


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


module.exports = MyCanvas;
},{}]},{},[1])(1)
});