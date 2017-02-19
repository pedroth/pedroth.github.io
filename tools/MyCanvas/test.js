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
	var xint = -this.canvas.height / (this.cameraSpace[1][1] - this.cameraSpace[1][0]) * (x[1] - this.cameraSpace[1][1]);
	var yint =  this.canvas.width  / (this.cameraSpace[0][1] - this.cameraSpace[0][0]) * (x[0] - this.cameraSpace[0][0]);
	return [xint, yint];
}

/* x : 2-dim array in integer coordinates
 * returns : 2-dim array in camera space coordinates
*/
CanvasSpace.prototype.inverseTransform = function(x) {
	var xt = this.cameraSpace[0][0] + (this.cameraSpace[0][1] - this.cameraSpace[0][0]) / this.canvas.width  * x[1];
	var yt = this.cameraSpace[1][1] - (this.cameraSpace[1][1] - this.cameraSpace[1][0]) / this.canvas.height * x[0];
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
},{"./MyCanvas.js":2}],2:[function(require,module,exports){
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

function innerProd(u, v) {
    return u[0] * v[0] + u[1] * v[1];
}


var MyCanvas = function(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.image = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
	// width * height * 4 array of integers
	this.imageData = this.image.data;
}

MyCanvas.prototype.paintImage = function() {
	this.ctx.putImageData(this.image, 0, 0);
}

MyCanvas.prototype.clearImage = function(rgba) {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

MyCanvas.prototype.getSize = function() {
	return [this.canvas.width, this.canvas.height];
}

MyCanvas.prototype.getImageIndex = function(x) {
    return 4 * (this.canvas.width *  x[0] + x[1]);
}

MyCanvas.prototype.drawPxl =function(x, rgb) {
    var index = this.getImageIndex(x);
    this.imageData[index    ] = rgb[0];
    this.imageData[index + 1] = rgb[1];
    this.imageData[index + 2] = rgb[2];
    this.imageData[index + 3] = rgb[3];
}

/* 
 * x1     :   2-dim array
 * x2     :   2-dim array
 * shader :   is a function that receives a 2-dim array and returns a rgba 4-dim array
*/
MyCanvas.prototype.drawLine = function(x1, x2, shader) {
	x1 = floor(x1);
	x2 = floor(x2);

	var index = [-1, 0, 1];

	var n  = index.length;
	var nn = n * n; 

	var x = [];
	x[0] = x1[0];
	x[1] = x1[1];

	var tangent = diff(x2, x1);
	var normal = [];
	normal[0] = -tangent[1];
	normal[1] =  tangent[0];

	this.drawPxl(x, shader(x));

	while (x[0] !== x2[0] || x[1] !== x2[1]) {
		var fmin = Number.MAX_VALUE;
	    var minDir = [];
	    for (var k = 0; k < nn; k++) {
	    	var i = index[k % n];
	    	var j = index[Math.floor(k % nn / n)];
	        
	        var nextX = add(x, [i, j]);
	        
	        var v = diff(nextX, x1);
	        var f = Math.abs(innerProd(v, normal)) - innerProd(v, tangent);
	        if(fmin > f) {
	        	fmin = f;
	        	minDir = [i, j];
	        }
	    }

	    x = add(x, minDir);
	    this.drawPxl(x, shader(x));
	}
}

/* 
 * x1     :   2-dim array
 * x2     :   2-dim array
 * x3     :   2-dim array
 * shader :   is a function that receives a 2-dim array and returns a rgba 4-dim array
*/
MyCanvas.prototype.drawTriangle = function(x1, x2, x3, shader) {

}

module.exports = MyCanvas;
},{}],3:[function(require,module,exports){
var CanvasSpace = require('./CanvasSpace.js');
var canvasDOM = document.getElementById("canvas");
var canvas = new CanvasSpace(canvasDOM, [[-1, 1], [-1, 1]]);
var f = function(x) {return [0, 255, 0, 255]};
var samples = 100;
for (var i = 0; i < samples; i++) {
	var first = [-1 + 2 * Math.random(), -1 + 2 * Math.random()];
	var second = [-1 + 2 * Math.random(), -1 + 2 * Math.random()];
	canvas.drawLine(first, second, f);
}
canvas.drawLine([0,0], [1,1], function(x) {return [255,0,0,255]});
canvas.paintImage();
},{"./CanvasSpace.js":1}]},{},[3]);
