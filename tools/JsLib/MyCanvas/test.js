(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

module.exports = CanvasSpace;
},{"./MyCanvas.js":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
/*
 Canvas coordinates

 0                  W
 +-------------> y
 |
 |
 |       *
 |
 |
 v x

 H
 */

/*

The canvas data is an array of length colors(C) * width(W) * height(H). Is a 3D-array.
The index is a number in [0, C * W * H - 1].
Having (x, y, z) where z is the color axis, the formula to index the array is :

f(x, y, z) = C * W * x + C * y + z.

Where x in [0, H - 1], y in [0, W - 1] and z in [0, C - 1].

Note that f(H - 1, W - 1, C - 1) = C * W * H - 1.

*/


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

/**
 * Clear Image with @rgba color.
 *
 * @param rgba
 */
MyCanvas.prototype.clearImage = function (rgba) {
    var rgbaNormalized = [];
    for (var i = 0; i < rgba.length; i++) {
        rgbaNormalized[i] = rgba[i] / 255;
    }
    this.useCanvasCtx(function (canvas) {
        var size = canvas.getSize();
        canvas.ctx.fillStyle = 'rgba(' + rgbaNormalized[0] + ',' + rgbaNormalized[1] + ',' + rgbaNormalized[2] + ',' + rgbaNormalized[3] + ')';
        canvas.ctx.globalCompositeOperation = 'source-over';
        canvas.ctx.fillRect(0, 0, size[0], size[1]);
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

};

MyCanvas.prototype.drawImage = function (img, x, shader) {
    if (shader == null) {
        this.useCanvasCtx(function (canvas) {
            canvas.ctx.drawImage(img, x[1], x[0]);
        });
    }
};

MyCanvas.simpleShader = function (color) {
    return function (x, element, canvas) {
        canvas.drawPxl(x, color);
    };
};

module.exports = MyCanvas;
},{}],4:[function(require,module,exports){
var MyCanvas = require('./MyCanvas.js');
var CanvasSpace = require('./CanvasSpace.js');
var ImageIO = require('./ImageIO.js');

var canvasLines = new CanvasSpace(document.getElementById("canvasLines"), [[-1, 1], [-1, 1]]);
var canvasPoints = new CanvasSpace(document.getElementById("canvasPoints"), [[-1, 1], [-1, 1]]);
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

var samples = 10;

for (var i = 0; i < samples; i++) {
    var first = [-1 + 2 * Math.random(), -1 + 2 * Math.random()];
    var second = [-1 + 2 * Math.random(), -1 + 2 * Math.random()];
    canvasLines.drawLine(first, second, f);
}

for (var i = 0; i < samples; i++) {
    var first = [-3 + 6 * Math.random(), -3 + 6 * Math.random()];
    var second = [-3 + 6 * Math.random(), -3 + 6 * Math.random()];
    canvasLines.drawLine(first, second, g);
}

canvasLines.drawLine([0, 0], [2, 2], r);
canvasLines.drawLine([0, 0], [-2, -2], interpolativeShader);

canvasLines.paintImage();

var size = canvasTriangles.getSize();
canvasTriangles.drawLine([0, Math.floor(size[0] / 10)], [size[1], Math.floor(size[0] / 10)], r);
canvasTriangles.drawLine([Math.floor(size[1] / 10), 0], [Math.floor(size[1] / 10), size[0]], g);
canvasTriangles.drawLine([0, 0], [size[0]-1, size[1]-1], f);
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
    if (img.isReady) {
        canvasPoints.drawImage(img, [i + 10, j]);
    }
    canvasPoints.paintImage();
    t++;
    i = t % 500;
    j = Math.floor(t / 500);
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);


},{"./CanvasSpace.js":1,"./ImageIO.js":2,"./MyCanvas.js":3}]},{},[4]);
