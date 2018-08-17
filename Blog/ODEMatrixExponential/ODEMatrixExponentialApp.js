var MyCanvas = require('../../JsLib/MyCanvas/main/MyCanvas.js');
var CanvasSpace = require('../../JsLib/MyCanvas/main/CanvasSpace.js');
var SimManager = require('../../JsLib/SimManager/main/SimManager.js');

/*
 * Simulations
 */
function Sim1() {
    this.canvasGraph = new CanvasSpace(document.getElementById("eulerAlgorithm"), [[-1.1, 1.1], [-1.1, 1.1]]);
    this.isMouseDown = false;
    this.circleRadius = 0.01;
    this.samples = 25;
    this.step = 0.01;
    this.ys = [];
    this.M = [[0, -1], [1, 0]];
    this.vectorField = {};

    // function that do stuff with mouse coordinates
    this.baseMouse = function(integerMouse) {
        if(!this.isMouseDown) {
            return;
        }
        var mouse = this.canvasGraph.inverseTransform(integerMouse);
        this.ys.push([ mouse ]);
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
    }

    this.checkIfCanDraw = function() {
        return $("#sim1").is(":visible");
    }

    this.sliderUpdate = function() {
        var sliderValue = $("#euler_slider").val();
        this.step = 0.01 + (0.1 / 99) * (sliderValue - 1);
        $("#euler_step").text("$ h = $" + this.step.toFixed(3));
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "euler_step"]);
    }

    this.drawArrow = function(init, v, shader) {
        var n = [-v[1], v[0]];
        var p = 0.1;
        var p1 = [init[0] + v[0], init[1] + v[1]];
        var p2 = [p1[0] + p * (-v[0] + n[0]), p1[1] + p * (-v[1] + n[1])];
        var p3 = [p1[0] + p * (-v[0] - n[0]), p1[1] + p * (-v[1] - n[1])];
        this.canvasGraph.drawLine(init, p1, shader);
        this.canvasGraph.drawLine(p1, p2, shader);
        this.canvasGraph.drawLine(p1, p3, shader);
    }

    this.field = function(x) {
        // fast computation
        return [this.M[0][0] * x[0] + this.M[0][1] * x[1], this.M[1][0] * x[0] + this.M[1][1] * x[1]];
    }

    this.buildVecField = function() {
        var minDist = Number.MAX_VALUE;
        var maxDist = Number.MIN_VALUE;
        var h = 1.0 / (this.samples - 1);
        var vectorFieldSamples = [];
        for(var j = 0; j < this.samples; j++) {
            for(var i = 0; i < this.samples; i++) {
                var x = -1 + 2 * h * i;
                var y = -1 + 2 * h * j;
                var v = this.field([x, y]);
                var dist = v[0] * v[0] + v[1] * v[1];
                minDist = Math.min(dist, minDist);
                maxDist = Math.max(dist, maxDist);
                vectorFieldSamples.push(v);
            }
        }
        return {"min" : minDist, "max" : maxDist, "samples" : vectorFieldSamples};
    }

    this.isInsideBox = function(x, box) {
        return x[0] > box[0][0] && x[0] < box[1][0] && x[1] > box[0][1] && x[1] < box[1][1];
    }

    this.drawCanvasGraph = function() {
        var scale = 0.25;
        // draw vector field
        var h = 1.0 / (this.samples - 1);
        for(var j = 0; j < this.samples; j++) {
            for(var i = 0; i < this.samples; i++) {
                var x = -1 + 2 * h * i;
                var y = -1 + 2 * h * j;
                var v = this.vectorField.samples[i + j * this.samples];
                var maxD = Math.sqrt(this.vectorField.max);
                // copy
                var u = [scale * v[0] / maxD, scale * v[1] / maxD];
                this.drawArrow([x, y], u, MyCanvas.simpleShader([0, 0, 255, 255]));
            }
        }

        var colorDegree = this.ys.length;
        for(var k = 0; k < this.ys.length; k++) {
            var integralCurve = this.ys[k];
            var n = integralCurve.length;
            if(this.isInsideBox(integralCurve[n - 1], [[-1, -1], [1, 1]])) {
                var v = this.field(integralCurve[n - 1]);
                integralCurve[n] = [integralCurve[n - 1][0] + this.step * v[0], integralCurve[n - 1][1] + this.step * v[1]];
            }
            var color = 1 - (1 / (2 * (colorDegree - 1))) * k;
            for(var l = 0; l < n - 1; l++) {
                this.canvasGraph.drawLine(integralCurve[l], integralCurve[l + 1], MyCanvas.simpleShader([255 * color, 0, 0, 255]));
            }
        }
    }

    this.draw = function() {
        this.canvasGraph.clearImage([255, 255, 255, 255]);
        this.drawCanvasGraph();
        this.canvasGraph.paintImage();
    }

    this.start = function() {
        $("#sim1").slideDown();
        this.sliderUpdate();
        this.vectorField = this.buildVecField();
    }

    this.random = function(min, max) {
        return min + (max - min) * Math.random();
    }

    this.generateNewField = function() {
        for(var i = 0; i < this.M.length; i++) {
            for(var j = 0; j < this.M[0].length; j++) {
                this.M[i][j] = this.random(-1,1);
            }
        }
        this.vectorField = this.buildVecField();
    }

    this.clearIntegralCurves = function() {
        this.ys = [];
    }

    this.end = function() {
        $("#sim1").slideUp();
    }

    this.init = function() {
        this.canvasGraph.addEventListener("touchstart", function(e) { apply(0, function(x) { x.touchStart(e) })}, false);
        this.canvasGraph.addEventListener("touchend",   function(e) { apply(0, function(x) { x.touchEnd(e) }) }, false);
        this.canvasGraph.addEventListener("touchmove",  function(e) { apply(0, function(x) { x.touchMove(e) }) }, false);

        this.canvasGraph.addEventListener("mousedown", function(e)  { apply(0, function(x) { x.mouseStart(e) }) }, false);
        this.canvasGraph.addEventListener("mouseup",   function(e)  { apply(0, function(x) { x.mouseEnd(e) }) }, false);
        this.canvasGraph.addEventListener("mousemove", function(e)  { apply(0, function(x) { x.mouseMove(e) }) }, false);

    }
}


/**
 * Main
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
    run : runSimulation,
    apply : apply
}