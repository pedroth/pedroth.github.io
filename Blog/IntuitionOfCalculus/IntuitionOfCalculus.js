(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.intuition = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MyCanvas = require('../../tools/JsLib/MyCanvas/MyCanvas.js');
var CanvasSpace = require('../../tools/JsLib/MyCanvas/CanvasSpace.js');
var ImageIO = require('../../tools/JsLib/MyCanvas/ImageIO.js');

var simulations = [
    new Sim1()
];

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

function horizontalNormDistance(x, y) {
    var v = x[0] - y[0];
    return v * v;
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
        $("#sim1").slideToggle();
    }

    this.init = function(touch, mouse) {
        this.canvasGraph.addEventListener("touchstart", touch[0], false);
        this.canvasGraph.addEventListener("touchend", touch[1], false);
        this.canvasGraph.addEventListener("touchmove", touch[2], false);

        this.canvasGraph.addEventListener("mousedown", mouse[0], false);
        this.canvasGraph.addEventListener("mouseup", mouse[1], false);
        this.canvasGraph.addEventListener("mousemove", mouse[2], false);
    }
}

function simulate(simulation) {
    simulation.draw();
    if (simulation.checkIfCanDraw()) {
        requestAnimationFrame(function() {
            simulate(simulation);
        });
    }
}

function runSimulation(index, lambda) {
	lambda(simulations[index]);
	requestAnimationFrame(function() {
	    simulate(simulations[index]);
	});
}

for (var i = 0; i < simulations.length; i++) {
    var simulation = simulations[i];
    simulation.init([
        function(e) {
            simulation.touchStart(e);
        },
        function(e) {
            simulation.touchEnd(e);
        },
        function(e) {
            simulation.touchMove(e);
        }
    ], [
        function(e) {
            simulation.mouseStart(e);
        },
        function(e) {
            simulation.mouseEnd(e);
        },
        function(e) {
            simulation.mouseMove(e);
        }
    ]
    );
}

module.exports =  {
    run : runSimulation,
    simulate : simulate
}
},{"../../tools/JsLib/MyCanvas/CanvasSpace.js":2,"../../tools/JsLib/MyCanvas/ImageIO.js":3,"../../tools/JsLib/MyCanvas/MyCanvas.js":4}],2:[function(require,module,exports){
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

CanvasSpace.prototype.drawCircle = function(x, r, shader) {
    // it assumes squared canvas, for now ...
    y = this.integerTransform(x);
    z = this.integerTransform([r, 0])[1] - this.integerTransform([0, 0])[1];
    MyCanvas.prototype.drawCircle.call(this, y, z, shader);
}

CanvasSpace.prototype.drawImage = function (img, x, shader) {
    MyCanvas.prototype.drawImage.call(this, img, this.integerTransform(x), shader);
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


MyCanvas.interpolativeShader = function(shader) {
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