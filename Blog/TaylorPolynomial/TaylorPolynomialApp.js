var MyCanvas = require('../../JsLib/MyCanvas/MyCanvas.js');
var CanvasSpace = require('../../JsLib/MyCanvas/CanvasSpace.js');
var ImageIO = require('../../JsLib/MyCanvas/ImageIO.js');

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
    this.samples = 25;
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
    this.canvasRemainder = new CanvasSpace(document.getElementById("remainder"), [[-0.1, 1], [-0.1, 1]]);
    this.isMouseDown = false;
    this.circleRadius = 0.01;
    this.fx = [];
    this.bandwidth = 5;
    this.maxAmp = 10;
    this.w = [];
    this.samplesPerPeriod = 12;
    this.samplesPoly = 25;
    this.x0 = 0;
    this.taylorDegree = 5;
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
        var rect = this.canvasTaylor.canvas.getBoundingClientRect();
        var mx = (e.clientX - rect.left), my = (e.clientY - rect.top);
        this.isMouseDown = true;
        this.baseMouse([my, mx]);
    }

    this.mouseEnd = function (e) {
        this.isMouseDown = false;
    }

    this.mouseMove = function (e) { }

    this.touchStart = function (e) {
        var rect = this.canvasTaylor.canvas.getBoundingClientRect();
        var mx = (e.touches[0].clientX - rect.left), my = (e.touches[0].clientY - rect.top);
        this.isMouseDown = true;
        this.baseMouse([my, mx]);
    }

    this.touchEnd = function (e) {
        this.isMouseDown = false;
    }

    this.touchMove = function (e) { }

    this.checkIfCanDraw = function() {
        return $("#sim2").is(":visible");
    }

    this.factorial = function(x) {
        var acc = 1;
        for(var i=x; i > 0; i--) {
            acc *= x;
            x--;
        }
    }

    this.df = function(f, x, n) {
        if(n == 0) {
            return f(x);
        }
        var h = 1;
        do {
            (df(f, x + h, n-1) - df(f, x - h, n-1)) / h;
        }while();
    }

    this.taylorPoly = function(f, n) {
        var derivatives = [];
        for(var i = 0; i < n; i++) {
            derivatives.append()
        }
        return function(x) {

        }

    }

    this.drawTaylorPolynomial = function() {
        var polynomials = [];
        var colors = []
        var h = 1 / (this.taylorDegree - 1);
        for(var i = 0; i < this.taylorDegree; i++) {
            polynomials.append(this.taylorPoly(this.fx.f, i));
            rgb = HSVtoRGB(h * i, 1.0, 1.0);
            colors.append([rgb.r, rgb.g, rgb.b, 255]);
        }
        var h = 1 / (this.samplesPoly - 1);
        for(var i = 0; i < this.samplesPoly - 1; i++) {
            for(var j = 0; j < this.taylorDegree; j++) {
              var x = h * j;
              var xh = x + h;
              var y = polynomials[j](x);
              var yh = polynomials[j](xh);
              this.canvasTaylor.drawLine([x, y], [xh, yh], MyCanvas.simpleShader(colors[j]));
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

    this.updateRemainderCanvas = function() {

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