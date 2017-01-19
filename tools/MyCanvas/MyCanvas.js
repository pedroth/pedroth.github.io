/*
Canvas coordinates

0            W
+-------------> y
|      
|      
|       *
|
|
v x

*/

var MyCanvas = function(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.image = ctx.getImageData(0, 0, canvas.width, canvas.height);
	// width * height * 4 array of integers
	this.imageData = this.image.data;
}

MyCanvas.prototype.paintImage = function() {
	this.ctx.putImageData(image, 0, 0);
}

MyCanvas.prototype.clearImage = function(rgba) {

}

MyCanvas.prototype.getSize = function() {
	return [this.canvas.width, this.canvas.height];
}

/* x1     :   2-dim array
 * x2     :   2-dim array
 * shader :   is a function that receives a 2-dim array and returns a rgba 4-dim array
*/
MyCanvas.prototype.drawLine = function(x1, x2, shader) {

}

/* x1     :   2-dim array
 * x2     :   2-dim array
 * x3     :   2-dim array
 * shader :   is a function that receives a 2-dim array and returns a rgba 4-dim array
*/
MyCanvas.prototype.drawTriangle = function(x1, x2, x3, shader) {

}

// cameraSpace : 2-dim array with two 2-dim arrays that are intervals [a,b] | a < b
var CanvasSpace = function(canvas, cameraSpace) {
	MyCanvas.call(this, canvas);
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
	MyCanvas.drawLine.call(this, y1, y2, shader);
}

/* x1     :   2-dim array
 * x2     :   2-dim array
 * x3     :   2-dim array
 * shader :   is a function that receives a 2-dim array and returns a rgba 4-dim array
*/
MyCanvas.prototype.drawTriangle = function(x1, x2, x3, shader) {
	y1 = this.integerTransform(x1);
	y2 = this.integerTransform(x2);
	y3 = this.integerTransform(x3);
	MyCanvas.drawTriangle.call(this, y1, y2, y3, shader);
}