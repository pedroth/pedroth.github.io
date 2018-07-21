(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Choice = function(opt1, opt2, predicate) {
    this.opt1 = opt1;
    this.opt2 = opt2;

    this.get = function() {
        if(predicate()) return this.opt1;
        return this.opt2;
    }
}

module.exports = Choice;
},{}],2:[function(require,module,exports){
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

// camera : 2-dim array with two 2-dim arrays that are intervals [a,b] | a < b
CanvasSpace.prototype.setCamera = function(camera) {
    if(camera.length != 2 || (camera[0].length != 2 && camera[1].length != 2)) {
		throw "camera space must be 2-dim array with 2-dim arrays representing an interval";
	}
	this.cameraSpace = camera;
}


module.exports = CanvasSpace;
},{"./MyCanvas.js":4}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
 * Returns a two vector with Width as first coordinate and Height as second. [Width, Height].
 */
MyCanvas.prototype.getSize = function () {
    return [this.canvas.width, this.canvas.height];
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
      this.drawPolygon(array, shader, this.isInsideTriangle);
};

/* x1     :   2-dim array
 * x2     :   2-dim array
 * x3     :   2-dim array
 * x4     :   2-dim array
 * shader :   is a function that receives a 2-dim array and returns a rgba 4-dim array
*/
MyCanvas.prototype.drawQuad = function (x1, x2, x3, x4, shader) {
    this.drawPolygon([x1, x2, x3, x4], shader, this.isInsidePolygon);
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



MyCanvas.interpolateQuadShader = function(shader) {
    return function(x, quad, canvas) {
        var t1 = [quad[0], quad[1], quad[2]];
        var t2 = [quad[2], quad[3], quad[0]];
        var alpha = triangleBaryCoord(x, t1);
        if(alpha[0] > 0 && alpha[1] > 0 && alpha[2] > 0 && Math.abs(alpha[0] + alpha[1] + alpha[2] - 1) < 1E-10) {
            shader(x, quad, canvas, [alpha[0], alpha[1], alpha[2], 0]);
        } else {
            alpha = triangleBaryCoord(x, t2);
            shader(x, quad, canvas, [alpha[2], 0, alpha[0], alpha[1]])
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
            interpolateTexCoord = add(interpolateTexCoord, scale(quadTexCoord[i], alpha[i]));
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
},{"./ImageIO.js":3}],5:[function(require,module,exports){
var MyCanvas = require('../main/MyCanvas.js');
var CanvasSpace = require('../main/CanvasSpace.js');
var ImageIO = require('../main/ImageIO.js');
var Choice = require('../../Choice/main/Choice.js');


function randomVector(a, b) {
    return [a + (b - a) * Math.random(), a + (b - a) * Math.random()];
}

function giveMeLine(a, u) {
    var points = [];
    points.push([a[0] + u[0], a[1] + u[1]]);
    points.push([a[0] - u[0], a[1] - u[1]]);
    return points;
}

function invertVector(init, v, t) {
    var ans = [];
    ans[0] = init[0] + v[0] * (1 - t) + v[0] * t;
    ans[1] = init[1] + v[1] * (1 - t) - v[1] * t;
    return ans;
}

f = MyCanvas.simpleShader([0, 255, 0, 255]);
g = MyCanvas.simpleShader([0, 0, 255, 255]);
r = MyCanvas.simpleShader([255, 0, 0, 255]);

var Test1 = function() {
    this.canvasLines = new CanvasSpace(document.getElementById("canvasLines"), [[-1, 1], [-1, 1]]);

    this.isFirstIte = true;

    this.a = [-1, 1];
    this.v = [0.1, 0.1];
    this.n = [1, -1];
    this.speed = 0.01;
    this.points = giveMeLine(this.a, this.v);

    this.colorInterShader = function(x, line, canvas, t) {
         var c1 = [0, 0, 0, 255];
         var c2 = [255, 255, 255, 255];
         var gradient = [c2[0] - c1[0], c2[1] - c1[1], c2[2] - c1[2], c2[3] - c1[3]];
         canvas.drawPxl(x, [c1[0] + gradient[0] * t, c1[1] + gradient[1] * t, c1[2] + gradient[2] * t, c1[3] + gradient[3] * t]);
    };

    this.update = function() {
        if(this.isFirstIte) {
            var samples = 100;
            for (var i = 0; i < samples; i++) {
                var first = randomVector(-1, 1);
                var second = randomVector(-1, 1);
                this.canvasLines.drawLine(first, second, f);
            }

            for (var i = 0; i < samples; i++) {
                var first = randomVector(-3, 3);
                var second = randomVector(-3, 3);
                this.canvasLines.drawLine(first, second, g);
            }

            this.canvasLines.drawLine([0, 0], [2, 2], r);
            this.canvasLines.drawLine(
                                        [0, 0],
                                        [-2, -2],
                                        MyCanvas.interpolateLineShader(this.colorInterShader)
            );
            this.canvasLines.paintImage();
            this.isFirstIte = false;
        } else {
            this.canvasLines.drawLine(this.points[0], this.points[1], MyCanvas.interpolateLineShader(this.colorInterShader));

            this.points[0] = [this.points[0][0] + this.speed * this.n[0], this.points[0][1] + this.speed * this.n[1]];
            this.points[1] = [this.points[1][0] + this.speed * this.n[0], this.points[1][1] + this.speed * this.n[1]];

            this.canvasLines.paintImage();
        }
    }
}

var Test2 = function() {
    this.canvasPoints = new MyCanvas(document.getElementById("canvasPoints"));
    this.i = 0;
    this.j = 0;
    this.t = 0;
    this.img = ImageIO.loadImage("R.png");
    
    this.update = function() {
        this.canvasPoints.clearImage([0, 0, 0, 255]);
        this.canvasPoints.drawPxl([this.i, this.j], [255, 0, 0, 255]);
        this.canvasPoints.drawPxl([this.i + 1, this.j], [255, 0, 0, 255]);
        this.canvasPoints.drawPxl([this.i - 1, this.j], [255, 0, 0, 255]);
        this.canvasPoints.drawPxl([this.i, this.j - 1], [255, 0, 0, 255]);
        this.canvasPoints.drawPxl([this.i, this.j + 1], [255, 0, 0, 255]);
    
        this.canvasPoints.drawImage(this.img, [this.i + 10, this.j]);
    
        this.canvasPoints.paintImage();

        this.t++;
        var sizePoints = this.canvasPoints.getSize();
        this.i = this.t % sizePoints[0];
        this.j = Math.floor(this.t / sizePoints[0]);
    }
}

var Test3 = function() {
    this.canvasTriangles = new MyCanvas(document.getElementById("canvasTriangles"));

    this.isFirstIte = true;

    var size = this.canvasTriangles.getSize();
    this.animeTriangle = [randomVector(0, size[0]), randomVector(0, size[0]), randomVector(0, size[0])];
    this.average = [0, 0];
    this.diff = [];
    for (var k = 0; k < this.animeTriangle.length; k++) {
        this.average[0] += this.animeTriangle[k][0];
        this.average[1] += this.animeTriangle[k][1];
    }
    this.average[0] /= 3;
    this.average[1] /= 3;
    for(var k = 0; k < this.animeTriangle.length; k++) {
        this.diff[k] = [this.animeTriangle[k][0] - this.average[0], this.animeTriangle[k][1] - this.average[1]];
    }
    this.animeCircle = randomVector(0, size[0]);

    this.t = 0
    
    this.update = function() {
        var size = this.canvasTriangles.getSize();
        if(this.isFirstIte) {
            var samples = 100;
            this.canvasTriangles.drawLine([0, Math.floor(size[0] / 10)], [size[1], Math.floor(size[0] / 10)], r);
            this.canvasTriangles.drawLine([Math.floor(size[1] / 10), 0], [Math.floor(size[1] / 10), size[0]], g);
            this.canvasTriangles.drawLine([0, 0], [size[0]-1, size[1] - 1], f);
            
            var avgTime = 0;
            for(var i = 0; i < samples; i++) {
                var first = randomVector(0, size[0]);
                var second = randomVector(0, size[0]);
                var third = randomVector(0, size[0]);
                var time = new Date().getTime();
                this.canvasTriangles.drawTriangle(first, second, third, g);
                avgTime += (new Date().getTime() - time) / 1000;
            }
            console.log(avgTime / samples);
            this.canvasTriangles.paintImage();
            this.isFirstIte = false;
        } else {
            this.canvasTriangles.clearImage([250, 250, 250, 255]);
            var sin = Math.sin(this.t / (2 * Math.PI * 10))
            var sinsin = sin * sin;
            this.canvasTriangles.drawTriangle(invertVector(this.average, this.diff[0], sinsin), invertVector(this.average, this.diff[1], sinsin), invertVector(this.average, this.diff[2], sinsin), r);

            this.canvasTriangles.drawCircle(this.animeCircle, sinsin * size[0] * 0.25, g);

            this.t++;
            this.canvasTriangles.paintImage();
        }
    }
}

var Test4 = function() {
    this.canvasTexture = new CanvasSpace(document.getElementById("canvasTexture"), [[-1, 1], [-1,  1]]);
    this.oldTime = new Date().getTime();

    this.texture = ImageIO.loadImage("R.png");
    this.t = 0;
    this.quad = [
                 [-0.25, -0.25],
                 [ 0.35, -0.25],
                 [ 0.25,  0.35],
                 [-0.25,  0.25],
                ];

    this.shader = new Choice(MyCanvas.quadTextureShader(this.texture, [[0,0], [1, 0], [1, 1], [0, 1]]), MyCanvas.simpleShader([255, 0, 255, 255]), ImageIO.generateImageReadyPredicate(this.texture));

    this.update = function() {
        var dt = 1E-3 * (new Date().getTime() - this.oldTime);
        this.oldTime = new Date().getTime();

        this.canvasTexture.clearImage([0, 0, 0, 255]);
        var cos = Math.cos(this.t / (2 * Math.PI * 10));
        var coscos = cos * cos;

        var transformQuad = [];
        for(var i = 0; i < this.quad.length; i++) {
            transformQuad.push([coscos * this.quad[i][0], coscos * this.quad[i][1]]);
        }

        this.canvasTexture.drawQuad(
                                    transformQuad[0],
                                    transformQuad[1],
                                    transformQuad[2],
                                    transformQuad[3],
                                    this.shader.get()
                                   );
        this.t+= dt;
        this.canvasTexture.paintImage();
    }
}



var tests = [
//             new Test1(),
//             new Test2(),
//             new Test3(),
             new Test4()
]

function draw() {
    for(var i = 0; i < tests.length; i++) {
        tests[i].update();
    }
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);


},{"../../Choice/main/Choice.js":1,"../main/CanvasSpace.js":2,"../main/ImageIO.js":3,"../main/MyCanvas.js":4}]},{},[5]);
