var MyCanvas = require('./MyCanvas.js');
var CanvasSpace = require('./CanvasSpace.js');
var ImageIO = require('./ImageIO.js');


function randomVector(a, b) {
    return [a + (b - a) * Math.random(), a + (b - a) * Math.random()];
}

var canvasLines = new CanvasSpace(document.getElementById("canvasLines"), [[-1, 1], [-1, 1]]);
var canvasPoints = new MyCanvas(document.getElementById("canvasPoints"));
var canvasTriangles = new MyCanvas(document.getElementById("canvasTriangles"));
var f = MyCanvas.simpleShader([0, 255, 0, 255]);
var g = MyCanvas.simpleShader([0, 0, 255, 255]);
var r = MyCanvas.simpleShader([255, 0, 0, 255])

var interpolativeShader = function (x, line, canvas) {
    var black = [0, 0, 0, 255];
    var white = [255, 255, 255, 255];
    var gradient = [255, 255, 255, 0];
    var v = [line[1][0] - line[0][0], line[1][1] - line[0][0]];
    var z = [x[0] - line[0][0], x[1] - line[0][1]];
    var vnorm = v[0] * v[0] + v[1] * v[1];
    if(vnorm == 0) {
        return black;
    }
    var dot = z[0] * v[0] + z[1] * v[1];
    var t = dot / vnorm;
    canvas.drawPxl(x, [black[0] + gradient[0] * t, black[1] + gradient[1] * t, black[2] + gradient[2] * t, black[3] + gradient[3] * t]);
};

var giveMeLine = function(a, u) {
    var points = [];
    points.push([a[0] + u[0], a[1] + u[1]]);
    points.push([a[0] - u[0], a[1] - u[1]]);
    return points;
}

var samples = 100;

for (var i = 0; i < samples; i++) {
    var first = randomVector(-1, 1);
    var second = randomVector(-1, 1);
    canvasLines.drawLine(first, second, f);
}

for (var i = 0; i < samples; i++) {
    var first = randomVector(-3, 3);
    var second = randomVector(-3, 3);
    canvasLines.drawLine(first, second, g);
}

canvasLines.drawLine([0, 0], [2, 2], r);
canvasLines.drawLine([0, 0], [-2, -2], interpolativeShader);

canvasLines.paintImage();

var size = canvasTriangles.getSize();
canvasTriangles.drawLine([0, Math.floor(size[0] / 10)], [size[1], Math.floor(size[0] / 10)], r);
canvasTriangles.drawLine([Math.floor(size[1] / 10), 0], [Math.floor(size[1] / 10), size[0]], g);
canvasTriangles.drawLine([0, 0], [size[0]-1, size[1]-1], f);

var avgTime = 0;
for(var i = 0; i < samples; i++) {
    var first = randomVector(0, size[0]);
    var second = randomVector(0, size[0]);
    var third = randomVector(0, size[0]);
    var time = new Date().getTime();
    canvasTriangles.drawTriangle(first, second, third, g);
    avgTime += (new Date().getTime() - time) / 1000;
}
console.log(avgTime / samples);

canvasTriangles.paintImage();

var img = ImageIO.loadImage("R.png");

var i = 0;
var j = 0;
var t = 0;
var a = [-1, 1];
var v = [0.1, 0.1];
var n = [1, -1];
var speed = 0.01;
var points = giveMeLine(a, v);

var animeTriangle = [randomVector(0, size[0]), randomVector(0, size[0]), randomVector(0, size[0])]
var average = [0, 0]
var diff = []
for (var k = 0; k < animeTriangle.length; k++) {
    average[0] += animeTriangle[k][0];
    average[1] += animeTriangle[k][1];
}
average[0] /= 3;
average[1] /= 3;
for(var k = 0; k < animeTriangle.length; k++) {
    diff[k] = [animeTriangle[k][0] - average[0], animeTriangle[k][1] - average[1]]
}
var animeCircle = randomVector(0, size[0]);

function invertVector(init, v, t) {
    var ans = [];
    ans[0] = init[0] + v[0] * (1 - t) + v[0] * t;
    ans[1] = init[1] + v[1] * (1 - t) - v[1] * t;
    return ans;
}

function draw() {
    canvasLines.drawLine(points[0], points[1], interpolativeShader);

    points[0] = [points[0][0] + speed * n[0], points[0][1] + speed * n[1]];
    points[1] = [points[1][0] + speed * n[0], points[1][1] + speed * n[1]];

    canvasLines.paintImage();

    canvasPoints.clearImage([0, 0, 0, 255]);
    canvasPoints.drawPxl([i, j], [255, 0, 0, 255]);
    canvasPoints.drawPxl([i + 1, j], [255, 0, 0, 255]);
    canvasPoints.drawPxl([i - 1, j], [255, 0, 0, 255]);
    canvasPoints.drawPxl([i, j - 1], [255, 0, 0, 255]);
    canvasPoints.drawPxl([i, j + 1], [255, 0, 0, 255]);

    canvasPoints.drawImage(img, [i + 10, j]);

    canvasPoints.paintImage();

    canvasTriangles.clearImage([250, 250, 250, 255]);
    var sin = Math.sin(t / (2 * Math.PI * 10))
    var sinsin = sin * sin;
    canvasTriangles.drawTriangle(invertVector(average, diff[0], sinsin), invertVector(average, diff[1], sinsin), invertVector(average, diff[2], sinsin), r)

    canvasTriangles.drawCircle(animeCircle, sinsin * size[0] * 0.25, g)

    canvasTriangles.paintImage();

    t++;
    var sizePoints = canvasPoints.getSize();
    i = t % sizePoints[0];
    j = Math.floor(t / sizePoints[0]);
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

