/**
 * Setup
 */
window.requestAnimationFrame = window.requestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| window.mozRequestAnimationFrame || window.msRequestAnimationFrame
		|| (function(f) {
			window.setTimeout(f, 0);
		});

var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var start = {
	x : 0,
	y : 0
}, down = false;

var startTime;
var width, height;
var samples = 100;
var funcPoints = [];

function clamp(x, xmin, xmax) {
	return Math.max(xmin, Math.min(xmax, x));
}

/**
 * 2D vectors
 * 
 * */
var zeros = function() {
	var ans = [];
	ans[0] = 0;
	ans[1] = 0;
	return ans;
};

var add = function(u, v) {
	var ans = [];
	ans[0] = u[0] + v[0];
	ans[1] = u[1] + v[1];
	return ans;
};

var diff = function(u, v) {
	var ans = [];
	ans[0] = u[0] - v[0];
	ans[1] = u[1] - v[1];
	return ans;
};

var scalarMult = function(s, v) {
	var ans = [];
	ans[0] = s * v[0];
	ans[1] = s * v[1];
	return ans;
};

var innerProd = function(u, v) {
	return u[0] * v[0] + u[1] * v[1];
};

var squaredNorm = function(v) {
	return innerProd(v, v);
};

var myNorm = function(v) {
	return Math.sqrt(squaredNorm(v));
};

var normalize = function(v) {
	if (v[0] !== 0.0 && v[1] !== 0.0) {
		return scalarMult(1 / myNorm(v), v);
	} else {
		return v;
	}
};

/**
 * project u on v
 * */

var proj = function(u, v) {
	var aux = normalize(v);
	var dot = innerProd(u, v);
	return scalarMult(dot, aux);
};

var pointWise = function(u, v) {
	var ans = [];
	ans[0] = u[0] * v[0];
	ans[1] = u[1] * v[1];
	return ans;
};

/**
 * return product between the matrix formed by (u,v) and x;
 * */

var matrixProd = function(u, v, x) {
	return add(add(scalarMult(x[0], u), scalarMult(x[1], v)));
};

/**
 * end vectors
 * */

function init() {
	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("mousemove", mouseMove, false);
	document.addEventListener("keydown", keyDown, false);
	startTime = new Date().getTime();
	width = canvas.width;
	height = canvas.height;
	for(var i = 0; i < samples; i++) {
		Math
	}
}

init();

function keyDown(e) {
	if (e.keyCode == 87) {
	}

	if (e.keyCode == 83) {
	}

	if (e.keyCode == 65) {
	}

	if (e.keyCode == 68) {
	}
}

function mouseDown(e) {
	start.x = e.clientX - canvas.offsetLeft;
	start.y = e.clientY - canvas.offsetTop;
	down = true;
}

function mouseUp() {
	down = false;
}

function mouseMove(e) {
	var mx = (e.clientX - canvas.offsetLeft), my = (e.clientY - canvas.offsetTop);
	if (!down || mx == start.x && my == start.y)
		return;
	start.x = mx;
	start.y = my;
};

function drawLine(x1, x2, size, data, r, g, b) {
	size = Math.max(1, size);
	var x = [];
	x[0] = x1[0];
	x[1] = x1[1];

	var normal = diff(x2, x1);
	var temp = normal[0];
	normal[0] = -normal[1];
	normal[1] = temp;

	var imin = zeros();
	var oldi = zeros();
	var fmin = Number.MAX_VALUE;

	data[4 * height * x[0] + 4 * x[1]] = 255;//Math.floor(clamp(r * (1 - res),0,1));
	data[4 * height * x[0] + 4 * x[1] + 1] = 255;//Math.floor(clamp(g * (1 - res),0,1));
	data[4 * height * x[0] + 4 * x[1] + 2] = 255;//Math.floor(clamp(b * (1 - res),0,1));

	while (x[0] !== x2[0] || x[1] !== x2[1]) {
		
		var maxShade = -1;
		
		for ( var i = -size; i < size + 1; i++) {
			for ( var j = -size; j < size + 1; j++) {
				
				var nextX = add(x, [ i, j ]);
				var shadePow = Math.abs(innerProd(diff(nextX, x1), normal)); 
				var res = shadePow + Math.abs(nextX[0] - x2[0]) + Math.abs(nextX[1] - x2[1]);
				
				if(maxShade < shadePow) {
					maxShade = shadePow;
				}

				if ((i === 0 && j === 0) || (i === oldi[0] && j === oldi[1]) || (Math.abs(i) > 1 || Math.abs(j) > 1)) {
					// nothing here
				} else {
					if (fmin > res) {
						fmin = res;
						imin = [ i, j ];
					}
				}
			}
		}

		for ( var i = -size; i < size + 1; i++) {
			for ( var j = -size; j < size + 1; j++) {

				var nextX = add(x, [ i, j ]);
				var shadePow = Math.abs(innerProd(diff(nextX, x1), normal)); 
				data[4 * height * nextX[0] + 4 * nextX[1]    ] = Math.floor(clamp(r * (1 - shadePow / maxShade),0,255));
				data[4 * height * nextX[0] + 4 * nextX[1] + 1] = Math.floor(clamp(g * (1 - shadePow / maxShade),0,255));
				data[4 * height * nextX[0] + 4 * nextX[1] + 2] = Math.floor(clamp(b * (1 - shadePow / maxShade),0,255));
			}
		}
		
		fmin = Number.MAX_VALUE;

		oldi[0] = -imin[0];
		oldi[1] = -imin[1];

		x = add(x, imin);
	}
}

function draw() {
	var dt = 1E-3 * (new Date().getTime() - startTime);
	startTime = new Date().getTime();
	var image, data;

	ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
	ctx.globalCompositeOperation = 'source-over';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	image = ctx.getImageData(0, 0, canvas.width, canvas.height);
	data = image.data;
	/**
	 * drawing and animation
	 **/
	
	
	ctx.putImageData(image, 0, 0);
	requestAnimationFrame(draw, canvas);
}

requestAnimationFrame(draw, canvas);