var MyCanvas = require('../../tools/JsLib/MyCanvas/MyCanvas.js');
var CanvasSpace = require('../../tools/JsLib/MyCanvas/CanvasSpace.js');
var ImageIO = require('../../tools/JsLib/MyCanvas/ImageIO.js');


function drawArrow(init, v, canvas, shader) {
    var p = 0.05;
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

function Sim1() {
    this.canvasGraph = new CanvasSpace(document.getElementById("linearFunctionGraph"), [[-0.1, 1], [-0.1, 1]]);
    this.canvasTransformation = new CanvasSpace(document.getElementById("linearFunctionTransformation"), [[-0.1, 1], [-0.1, 1]]);
    this.fa = [1/3, 1/3];
    this.fb = [2/3, 2/3];
    this.xImg = ImageIO.loadImage("resources/x.png");
    this.yImg = ImageIO.loadImage("resources/y.png");
    this.fImg = ImageIO.loadImage("resources/f.png");
    this.canvasGraph.addEventListener("touchmove", this.touchMove, false);
    this.canvasGraph.addEventListener("mousemove", this.mouseMove, false);

    this.baseMouse = function(integerMouse) {
        var mouse = this.canvasGraph.inverseTransform(integerMouse);
        var points = [this.fa , this.fb];
        var index = classifyCluster(mouse, points, squareNormDistance);
        points[index] = mouse;
    }

    this.mouseMove = function (e) {
        var rect = this.canvasGraph.canvas.getBoundingClientRect();
        var mx = (e.clientX - rect.left), my = (e.clientY - rect.top);
        this.baseMouse([mx, my]);
    }

    this.touchMove = function (e) {
        var rect = this.canvasGraph.canvas.getBoundingClientRect();
        var mx = (e.touches[0].clientX - rect.left), my = (e.touches[0].clientY - rect.top);
        this.baseMouse([mx, my]);
    }

    this.checkIfCanDraw = function() {
        return $("#sim1").is(":visible");
    }

    this.draw = function() {
        //this.canvasGraph.clearImage([255, 255, 255, 255]);
        drawArrow([-0.1, 0], [1 ,0], this.canvasGraph, MyCanvas.simpleShader([0, 0, 0, 255]));
        drawArrow([0, -0.1], [0 ,1], this.canvasGraph, MyCanvas.simpleShader([0, 0, 0, 255]));
        this.canvasGraph.drawImage(this.xImg, [0.9, -0.01]);
        this.canvasGraph.drawImage(this.yImg, [-0.05, 0.9]);
        this.canvasGraph.drawCircle(this.fa, 0.01, MyCanvas.simpleShader([255, 0, 0, 255]));
        this.canvasGraph.drawCircle(this.fb, 0.01, MyCanvas.simpleShader([0, 255, 0, 255]));
        this.canvasGraph.paintImage();
        if(this.checkIfCanDraw()) {
            requestAnimationFrame(this.draw);
        }
    }

    this.start = function() {
        ("#sim1").slideToggle();
        this.draw();
    }
}

var simulations = [
    new Sim1()
];

function runSimulation(index) {
    console.log("Hello");
    simulations[index].start();
}


IntuitionOfCalculus.js
IntuitionOfCalculus.js

