var MyCanvas = require('../../JsLib/MyCanvas/MyCanvas.js');
var CanvasSpace = require('../../JsLib/MyCanvas/CanvasSpace.js');
var ImageIO = require('../../JsLib/MyCanvas/ImageIO.js');

var simulations = [
    new Sim1()
];

/**
* state of opened simulations, is a number \in {0, ... , n}.
* Where state 0, represents closed simulations, and state != 0 represents all simulations close unless simulations[state-1].
**/
var stateIndexApplicationOpen = 0;

/*
 * Simulations
 */
function Sim1() {
    this.canvasGraph = new CanvasSpace(document.getElementById("graph"), [[-2, 2], [-2, 2]]);
    this.canvasAbsolute = new CanvasSpace(document.getElementById("absoluteGraph"), [[-2, 2], [-2, 2]]);
    this.samples = 100;
    this.x = [];
    this.y1 = [];
    this.y2 = [];

    for(var i = 0; i < this.samples; i++) {
        this.x[i] = -1 + 2 * (i / (this.samples - 1));
        this.y1[i] = x;
        this.y2[i] = Math.abs(x);
    }

    this.baseMouse = function(integerMouse) {
        var mouse = this.canvasGraph.inverseTransform(integerMouse);
        var x = mouse[0];
        if(x >= -1 || x <= 1) {
            var i = Math.floor((x + 1) * (this.y1.length - 1) / 2 );
            this.y1[i] = mouse[1];
            this.y2[i] = Math.abs(mouse[1]);
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
            this.canvasGraph.drawTriangle([this.x[i], this.y[i]],[this.x[i + 1], this.y1[i]], [this.] );

        }
    }

    this.drawCanvasAbsolute = function() {

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
    this.canvasGraph = new CanvasSpace(document.getElementById("secantApproximation"), [[-0.1, 1], [-0.1, 1]]);
    this.xImg = ImageIO.loadImage("resources/x.png");
    this.yImg = ImageIO.loadImage("resources/y.png");
    this.fImg = ImageIO.loadImage("resources/f.png");
    this.isMouseDown = false;
    this.circleRadius = 0.01;
    this.fx = [];
    this.step = 0.25;
    this.cursor = 0.5;
    this.movingStep = 0.25;
    this.bandwidth = 5;
    this.maxAmp = 10;
    this.fourierCoef = [];
    this.samplesPerPeriod = 12;
    /**
     * I want to take k samples in a sine wave period (period of sine wave is 2 * pi = T).
     * In [0,1] interval I will take k / T samples.
     * If I have a sine wave with double the frequency ( sin(2 * x) ) I will have in [0,1] : 2 * k / T samples.
     * For the general case frequency f we get f * k / T samples in [0,1] interval.
     * The max frequency in our sine waves will (bandwidth - 1) * (2 ^ (bandwidth - 1).
     */
    this.samples = Math.ceil((this.bandwidth - 1) * (1 << this.bandwidth - 1) * (this.samplesPerPeriod / (2 * Math.PI)));

    // functionMap must be updated since it depends on object variables
    this.functionMap = {};

    this.createFourierLambda = function(w) {
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

    this.updateFunctionMap = function() {
        for(var i = 0; i < this.bandwidth; i++) {
                    this.fourierCoef[i] = this.maxAmp * Math.random();
        }
        this.functionMap = {
            Quadratic : function(x) { return (x - 0.5) * (x - 0.5)},
            Polynomial : function(x) {
                var z = 7.5 * x - 4;
                return (z * z * z * z + z * z * z - 11 * z * z - 9 * z + 18) * 0.1;
            },
            Fourier : this.createFourierLambda(this.fourierCoef),
            Exponential: function(x) {
                var z = 5 * x;
                return z * Math.exp(-z);
            }
        }
    }

    this.buildFunction = function(samples) {
        var y = [];
        var minY = Number.MAX_VALUE;
        var maxY = Number.MIN_VALUE;
        var aveY = 0;
        var f = this.functionMap[$("#function_sim2").val()];
        var h = 1.0 / (samples - 1);
        for(var i = 0; i < samples; i++) {
            var x =  h * i;
            y[i] = f(x);
            minY = Math.min(minY, y[i]);
            maxY = Math.max(maxY, y[i]);
            aveY += y[i];
        }
        return {func : f, funcSamples : y, min : minY, max : maxY, avg : aveY / samples};
    }

    // function that do stuff with mouse coordinates
    this.baseMouse = function(integerMouse) {
        if(!this.isMouseDown) {
            return;
        }
        var mouse = this.canvasGraph.inverseTransform(integerMouse);
        this.cursor = Math.max(mouse[0], 0);
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
        return $("#sim2").is(":visible");
    }

    this.sliderUpdate = function() {
        var sliderValue = $("#h_slider").val();
        this.step = (1.0 / (100 - (sliderValue - 1)));
        $("#h_sim").text("$ h = $" + this.step);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "h_sim"]);
    }

    this.selectUpdate = function() {
        this.updateFunctionMap();
        this.fx = this.buildFunction(this.samples);
    }

    this.drawSetup = function() {
        drawArrow([-0.1, 0], [1, 0], this.canvasGraph, MyCanvas.simpleShader([0, 0, 0, 255]));
        drawArrow([0, -0.1], [0, 1], this.canvasGraph, MyCanvas.simpleShader([0, 0, 0, 255]));
        this.canvasGraph.drawImage(this.xImg, [0.9, -0.01]);
        this.canvasGraph.drawImage(this.yImg, [-0.05, 0.9]);
    }

    this.drawCanvasGraph = function() {
        var h = 1.0 / (this.samples - 1);
        var epsilon = 0.2
        var scale = (1 + epsilon) * (this.fx.max - this.fx.min);
        for(var i = 0; i < this.samples - 1; i++) {
            var zi = (this.fx.funcSamples[i] - this.fx.min) / scale;
            var zj = (this.fx.funcSamples[i + 1] - this.fx.min) / scale;
            var x = h * i;
            this.canvasGraph.drawLine([x, zi], [x + h, zj], MyCanvas.simpleShader([0, 0, 255, 255]));
        }

        this.movingStep += (this.step - this.movingStep) * 0.01;

        var f = (this.fx.func(this.cursor) - this.fx.min) / scale;
        var fh = (this.fx.func(this.cursor + this.movingStep) - this.fx.min) / scale;

        this.canvasGraph.drawCircle([this.cursor, f], this.circleRadius, MyCanvas.simpleShader([255, 0, 0, 255]));
        this.canvasGraph.drawCircle([this.cursor + this.movingStep, fh], this.circleRadius, MyCanvas.simpleShader([255, 0, 0, 255]));

        var g = linearFunctor([this.cursor, f], [this.cursor + this.movingStep, fh]);
        this.canvasGraph.drawLine([-1, g(-1)], [1.5, g(1.5)], MyCanvas.simpleShader([0, 0, 0, 255]));

        var df = ((fh - f) / this.movingStep);
        $("#df_sim").text("df = " + df.toFixed(3));
    }

    this.draw = function() {
        this.canvasGraph.clearImage([255, 255, 255, 255]);
        this.drawSetup()
        this.drawCanvasGraph();
        this.canvasGraph.paintImage();
    }

    this.start = function() {
        $("#sim2").slideDown();
        this.updateFunctionMap();
        //buildFunction depends on updateFunctionMap;
        this.fx = this.buildFunction(this.samples);
        this.sliderUpdate();
    }

    this.end = function() {
        $("#sim2").slideUp();
    }

    this.init = function() {
        this.canvasGraph.addEventListener("touchstart", function(e) { apply(1, function(x) { x.touchStart(e) })}, false);
        this.canvasGraph.addEventListener("touchend", function(e) { apply(1, function(x) { x.touchEnd(e) }) }, false);
        this.canvasGraph.addEventListener("touchmove", function(e) { apply(1, function(x) { x.touchMove(e) }) }, false);

        this.canvasGraph.addEventListener("mousedown", function(e) { apply(1, function(x) { x.mouseStart(e) }) }, false);
        this.canvasGraph.addEventListener("mouseup", function(e) { apply(1, function(x) { x.mouseEnd(e) }) }, false);
        this.canvasGraph.addEventListener("mousemove",function(e) { apply(1, function(x) { x.mouseMove(e) }) }, false);

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