var MyCanvas = require('../../tools/JsLib/MyCanvas/MyCanvas.js');
var CanvasSpace = require('../../tools/JsLib/MyCanvas/CanvasSpace.js');
var ImageIO = require('../../tools/JsLib/MyCanvas/ImageIO.js');

var simulations = [
    new Sim1(),
    new Sim2()
];

/**
* state of opened simulations, is a number \in {0, ... , n}.
* Where state 0, represents closed simulations, and state != 0 represents all simulations close unless simulations[state-1].
**/
var stateIndexApplicationOpen = 0;

function getDashedLineShader(color) {
    return MyCanvas.interpolativeShader(
        function(x, line, canvas, t) {
            var p = 0.1;
            var isDash = (t % p) < (p / 2) ? true : false;
            if(isDash) {
                canvas.drawPxl(x, color);
            }
    });
};

function drawArrow(init, v, canvas, shader, p) {
    var p = p == null ? 0.05 : p;
    var b = p / 4;

    canvas.drawLine(init, [init[0] + v[0], init[1] + v[1]], shader);
    var r = [ p * v[0], p * v[1]];
    var n = [ -b * v[1], b * v[0]];
    var first = [init[0] + v[0] - r[0] + n[0], init[1] + v[1] - r[1] + n[1]];
    var second = [init[0] + v[0] - r[0] - n[0], init[1] + v[1] - r[1] - n[1]];
    var third = [init[0] + v[0], init[1] + v[1]];
    canvas.drawTriangle(first, second, third, shader);
}

function classifyCluster(x, clusters, distance) {
    var minIndex = -1;
    var minValue = Number.MAX_VALUE;
    for (var i = 0; i < clusters.length; i++) {
        var dist = distance(x, clusters[i]);
        if (minValue > dist) {
            minValue = dist;
            minIndex = i;
        }
    }
    return minIndex;
}

function squareNormDistance(x, y) {
    var v = [x[0] - y[0], x[1] - y[1]];
    return v[0] * v[0] + v[1] * v[1];
}

function horizontalNormDistance(x, y) {
    var v = x[0] - y[0];
    return v * v;
}

function linearFunctor(p1, p2) {
    var m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    return function(x) { return p1[1] + m * (x - p1[0]);};
}

function Sim1() {
    this.canvasGraph = new CanvasSpace(document.getElementById("linearFunctionGraph"), [[-0.1, 1], [-0.1, 1]]);
    this.canvasTransformation = new CanvasSpace(document.getElementById("linearFunctionTransformation"), [[-0.1, 1], [-0.1, 1]]);
    this.fa = [1/3, 1/3];
    this.fb = [2/3, 2/3];
    this.xImg = ImageIO.loadImage("resources/x.png");
    this.yImg = ImageIO.loadImage("resources/y.png");
    this.fImg = ImageIO.loadImage("resources/f.png");
    this.isMouseDown = false;
    this.xaxisH = 0.8;
    this.yaxisH = 0.0;
    this.circleRadius = 0.01;

    this.baseMouse = function(integerMouse) {
        var mouse = this.canvasGraph.inverseTransform(integerMouse);
        var points = [this.fa, this.fb];
        var index = classifyCluster(mouse, points, horizontalNormDistance);
        if(!this.isMouseDown) {
            return;
        }
        if(index == 0) {
            this.fa = mouse;
        } else {
            this.fb = mouse;
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

    this.pointInLine = function(x) {
        var dx = this.fb[0] - this.fa[0];
        dx = dx == 0 ? 0.0001 : dx;
        var m = (this.fb[1] - this.fa[1]) / dx;
        var y = this.fa[1] + m * (x - this.fa[0]);
        return [x, y];
    }

    this.drawSetup = function() {
        drawArrow([-0.1, 0], [1 ,0], this.canvasGraph, MyCanvas.simpleShader([0, 0, 0, 255]));
        drawArrow([0, -0.1], [0 ,1], this.canvasGraph, MyCanvas.simpleShader([0, 0, 0, 255]));
        this.canvasGraph.drawImage(this.xImg, [0.9, -0.01]);
        this.canvasGraph.drawImage(this.yImg, [-0.05, 0.9]);
        
        drawArrow([-0.1, this.xaxisH], [1, 0], this.canvasTransformation, MyCanvas.simpleShader([0, 0, 0, 255]));
        drawArrow([-0.1, this.yaxisH], [1, 0], this.canvasTransformation, MyCanvas.simpleShader([0, 0, 0, 255]));
        this.canvasTransformation.drawImage(this.xImg, [0.9, this.xaxisH-0.05]);
        this.canvasTransformation.drawImage(this.yImg, [0.9, this.yaxisH-0.05]);
        drawArrow([0.4, this.xaxisH - 0.05], [0, 0.7 * (this.yaxisH - this.xaxisH)], this.canvasTransformation, MyCanvas.simpleShader([0, 0, 0, 255]));
        this.canvasTransformation.drawImage(this.fImg, [0.45, 0.5]);
    }

    this.drawCanvasGraph = function() {
        this.canvasGraph.drawLine(this.pointInLine(-2), this.pointInLine(2), MyCanvas.simpleShader([0, 0, 0, 255]));
        this.canvasGraph.drawCircle(this.fa, this.circleRadius, MyCanvas.simpleShader([255, 0, 0, 255]));
        this.canvasGraph.drawCircle(this.fb, this.circleRadius, MyCanvas.simpleShader([0, 255, 0, 255]));

        // dashed red line
        this.canvasGraph.drawLine(this.fa, [this.fa[0], 0], getDashedLineShader([255, 0, 0, 255]));
        this.canvasGraph.drawLine(this.fa, [0, this.fa[1]], getDashedLineShader([255, 0, 0, 255]));

        // dashed blue line
        this.canvasGraph.drawLine(this.fb, [this.fb[0], 0], getDashedLineShader([0, 255, 0, 255]));
        this.canvasGraph.drawLine(this.fb, [0, this.fb[1]], getDashedLineShader([0, 255, 0, 255]));
    }

    this.drawCanvasTransform = function() {
        // draw samples
        var samples = 25;
        var xmin = -0.1;
        var xmax = 0.9;
        var x = xmin;
        var h = (xmax - xmin)  / (samples - 1.0);
        var sampleRadius = 0.5 * this.circleRadius;
        for(var i = 0; i < samples; i++) {
            this.canvasTransformation.drawCircle([x, this.xaxisH], sampleRadius, MyCanvas.simpleShader([0, 0, 255, 255]));
            this.canvasTransformation.drawCircle([this.pointInLine(x)[1], this.yaxisH], sampleRadius, MyCanvas.simpleShader([0, 0, 255, 255]));
            x += h;
        }

        this.canvasTransformation.drawCircle([this.fa[0], this.xaxisH], this.circleRadius, MyCanvas.simpleShader([255, 0, 0, 255]));
        this.canvasTransformation.drawCircle([this.fb[0], this.xaxisH], this.circleRadius, MyCanvas.simpleShader([0, 255, 0, 255]));

        this.canvasTransformation.drawCircle([this.fa[1], this.yaxisH], this.circleRadius, MyCanvas.simpleShader([255, 0, 0, 255]));
        this.canvasTransformation.drawCircle([this.fb[1], this.yaxisH], this.circleRadius, MyCanvas.simpleShader([0, 255, 0, 255]));

    }

    this.draw = function() {
        this.canvasTransformation.clearImage([255, 255, 255, 255]);
        this.canvasGraph.clearImage([255, 255, 255, 255]);

        this.drawSetup()        
        this.drawCanvasGraph();
        this.drawCanvasTransform();

        this.canvasGraph.paintImage();
        this.canvasTransformation.paintImage();
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
    this.samples = 50;
    this.fx = [];
    this.step = 0.25;
    this.cursor = 0.5;
    this.movingStep = 0.25;

    this.functionMap = {
        Quadratic : function(x) { return (x - 0.5) * (x - 0.5)},
        Polynomial : function(x) {
            var z = 7.5 * x - 4;
            return (z * z * z * z + z * z * z - 11 * z * z - 9 * z + 18) * 0.1;
        },
        Sine : function(x) {
            return Math.sin(10 * x);
        },
        Exponential: function(x) {
            var z = 5 * x;
            return z * Math.exp(-z);
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
        var scale = (this.fx.max - this.fx.min);
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

        var f = linearFunctor([this.cursor, f], [this.cursor + this.movingStep, fh]);
        this.canvasGraph.drawLine([-1, f(-1)], [1.5, f(1.5)], MyCanvas.simpleShader([0, 0, 0, 255]));
    }

    this.draw = function() {
        this.canvasGraph.clearImage([255, 255, 255, 255]);
        this.drawSetup()
        this.drawCanvasGraph();
        this.canvasGraph.paintImage();
    }

    this.start = function() {
        $("#sim2").slideDown();
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