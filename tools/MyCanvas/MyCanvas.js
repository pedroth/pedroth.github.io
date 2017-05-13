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

/**
* return solution to : [ u_0 , h] x = z_0
*
*					   [ u_1,  0] y = z_1
*/
function solve2by2UpperTriMatrix(u, h, z) {
	var aux = z[1] / u[1];
	return [aux, (-u[0] * aux + z[0]) / h];
}
/**
* return solution to : [ u_0 , 0] x = z_0
*
*					   [ u_1,  w] y = z_1
*/
function solve2by2LowerTriMatrix(u, w, z) {
	var aux = z[0] / u[0];
	return [aux, (-u[1] * aux + z[1]) / w];
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
	// do clipping
	var stack = [];
	stack.push(x1);
	stack.push(x2);
	var inStack  = [];
	var outStack = [];
	for(var i = 0; i < stack.length; i++) {
		var x = stack[i];
		if( (0 <= x[0]) && (x[0] <= canvas.height) && (0 <= x[1]) && (x[1] <= canvas.width)) {
			inStack.push(x);
		} else {
			outStack.push(x);
		}
	}
	// both points are inside canvas
	if(inStack.length == 2) {
		this.drawLineInt(inStack[0], inStack[1], shader);
		return;
	}
	//intersecting line with canvas
	var intersectionSolutions = [];
	var v = [x2[0] - x1[0] , x2[1] - x1[1]];
	// Let s \in [0,1]
	// line intersection with [0, 0]^T + [H, 0]^T s
	intersectionSolutions.push(solve2by2UpperTriMatrix(v, -canvas.height, [-x1[0]               , -x1[1]]));
	// line intersection with [H, 0]^T + [0, W]^T s
	intersectionSolutions.push(solve2by2LowerTriMatrix(v, -canvas.width , [canvas.height - x1[0], -x1[1]]));
	// line intersection with [H, W]^T + [-H, 0]^T s
	intersectionSolutions.push(solve2by2UpperTriMatrix(v,  canvas.height, [canvas.height - x1[0],  canvas.width - x1[1]]));
	// line intersection with [0, W]^T + [0, -W]^T s
	intersectionSolutions.push(solve2by2LowerTriMatrix(v,  canvas.width , [-x1[0]               ,  canvas.width - x1[1]]));
	
	var validIntersection = [];
	for(var i = 0; i < intersectionSolutions.length; i++) {
		var x = intersectionSolutions[i];
		if((0 <= x[0]) && (x[0] <= 1) && (0 <= x[1]) && (x[1] <= 1)) {
			validIntersection.push(x);
		}
		if(validIntersection.length == 2) {
			var p1 = [x1[0] + validIntersection[0][0] * v[0], x1[1] + validIntersection[0][0] * v[1]];
			var p2 = [x1[0] + validIntersection[1][0] * v[0], x1[1] + validIntersection[1][0] * v[1]];
			return this.drawLineInt(p1, p2, shader);
		}
	}
	if(validIntersection.length == 0) {
		return
	}
	//it can be shown that at this point there is only one valid intersection
	var p = [x1[0] + validIntersection[0][0] * v[0], x1[1] + validIntersection[0][0] * v[1]];
	this.drawLineInt(inStack.pop(), p, shader);
}

MyCanvas.prototype.drawLineInt = function(x1, x2, shader) {
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