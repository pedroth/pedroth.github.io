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

H
*/

/**
 * Setup
 */
 //drawing variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var down = false;

var startTime;
var width, height;
var mouse;
var time = 0;

var alpha = Math.PI/4;
var distanceToPlane = 1;

var xmin, xmax; 

//error correcting variables
var accelerationFifo;
var eulerSpeedFifo;
var samples = 20;

// calibration variables
var accelerationCalibration = [0, 0, 0];
var eulerSpeedCalibration = [0, 0, 0];
var calibrationIte = 1;
var isCalibrating = true;
var maxCalibrationTimeInSeconds = 10;
var calibrationLoadingUI;

//curve variables
var curve = [];
var minCurve = [-3, -3, -3];
var maxCurve = [ 3,  3,  3];
var cam;
var myDevice;

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
* My math
**/
function clamp(x, xmin, xmax) {
    return Math.max(xmin, Math.min(xmax, x));
}

function floor(x) {
    x[0] = Math.floor(x[0]);
    x[1] = Math.floor(x[1]);
    return x;
}
/*
 * 3D vectors
 */
function vec3(x,y,z) {
    var ans = [];
    ans[0] = x;
    ans[1] = y;
    ans[2] = z;
    return ans;
}

var add = function(u,v) {
 var ans = [];
 ans[0] = u[0] + v[0];
 ans[1] = u[1] + v[1];
 ans[2] = u[2] + v[2];
 return ans;
};

var diff = function(u,v) {
 var ans = [];
 ans[0] = u[0] - v[0];
 ans[1] = u[1] - v[1];
 ans[2] = u[2] - v[2];
 return ans;
};

var scalarMult = function(s,v) {
 var ans = [];
 ans[0] = s * v[0];
 ans[1] = s * v[1];
 ans[2] = s * v[2];
 return ans;
};

var squaredNorm = function(v) {
 return v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
};

var myNorm = function(v) {
 return Math.sqrt(squaredNorm(v));
};

var normalize = function(v) {
 if(v[0] !== 0.0 && v[1] !== 0.0 && v[2] !== 0.0){
   return scalarMult(1 / myNorm(v), v);  
 } else {
    return v; 
 }
};

var innerProd = function(u,v) {
 return u[0]*v[0] + u[1]*v[1] + u[2]*v[2];
};
/**
* return product between the matrix formed by (u,v,w) and x;
* */
var matrixProd = function(u,v,w,x) {
 return add(add(scalarMult(x[0],u),scalarMult(x[1],v)),scalarMult(x[2],w));
}; 

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

/**
*  Utils
**/
var Camera = function() {
	this.basis = [];
	this.invBasis = [];
	/**
	 * 0 - rho
	 * 1 - theta
	 * 2 - phi
	 */
	this.param = [0, 0, 0];
	this.eye = [];
	this.focalPoint = [];

	this.orbit = function () {
		this.basis = [];
		var cosP = Math.cos(this.param[2]);
	    var cosT = Math.cos(this.param[1]);
	    var sinP = Math.sin(this.param[2]);
	    var sinT = Math.sin(this.param[1]);

	    // z - axis
	    this.basis[2] = [-cosP * cosT, -cosP * sinT, -sinP];
	    // y - axis
	    this.basis[1] = [-sinP * cosT, -sinP * sinT,  cosP];
	    // x -axis
	    this.basis[0] = [-sinT, cosT, 0];

	    this.invBasis[0] = [this.basis[0][0], this.basis[1][0], this.basis[2][0]];
	    this.invBasis[1] = [this.basis[0][1], this.basis[1][1], this.basis[2][1]];
	    this.invBasis[2] = [this.basis[0][2], this.basis[1][2], this.basis[2][2]];

	    this.eye = [this.param[0] * cosP * cosT + this.focalPoint[0], this.param[0] * cosP * sinT + this.focalPoint[1], this.param[0] * sinP + this.focalPoint[2]];
	}
};

var Device = function() {
	this.pos   = [0, 0, 0];
	this.vel   = [0, 0, 0];
	this.euler = [0, 0, 0];
	this.basis = [];
	this.computeBasisFromEuler = function() {
		var alpha = -this.euler[0];
		var beta  = this.euler[1];
		var gamma = this.euler[2];
		var ca = Math.cos(alpha);
		var sa = Math.sin(alpha);
		var cb = Math.cos(beta);
		var sb = Math.sin(beta);
		var cg = Math.cos(gamma);
		var sg = Math.sin(gamma);

		// Ry(alpha)* Rx(beta) * Rz(gamma), where Rx is the x-axis rotation matrix
		this.basis[0] = [ca * cg + sa * sb * sg, cb * sg, ca * sb * sg - sa * cg];
		this.basis[1] = [sa * sb * cg - ca * sg, cb * cg, sa * sg + ca * sb * cg];
		this.basis[2] = [sa * cb               , -sb    , ca * cb               ];


	}
}

var Fifo = function(n) {
	this.index = 0;
	this.maxSize = n;
	this.buffer = [];

	this.push = function(x) {
		this.buffer[this.index] = x;
		this.index = (this.index + 1) % this.maxSize;
	}
}

var LoadingBar = function(pos, size) {
	this.pos = pos;
	this.size = size;
	this.percentFill = 0;
}

function getImageIndex(x, size) {
    return 4 * (size[0] *  x[0] + x[1]);
}

function canvasTransformInt(x, xmin, xmax) {
    var xint  = -height / (xmax[1] - xmin[1]) * (x[1] - xmax[1]);
    var yint  =  width  / (xmax[0] - xmin[0]) * (x[0] - xmin[0]);
    return [xint, yint];
}

function canvasTransform(xInt, xmin, xmax) {
    var xt = xmin[0] + (xmax[0] - xmin[0]) / width  * xInt[1];
    var yt = xmax[1] - (xmax[1] - xmin[1]) / height * xInt[0];
    return [xt, yt];
}

/**
* x is a vector
* size is a vector where x-coord is width and y-coord is height
*/
function getPxlData(x, data, size) {
    var rgba = [];
    var index = getImageIndex(x, size);
    rgba[0] = data[index    ];
    rgba[1] = data[index + 1];
    rgba[2] = data[index + 2];
    rgba[3] = data[index + 3];
    return rgba;
}

function drawPxl(x, data, rgb) {
    var size = [width, height];
    var index = getImageIndex(x, size);
    data[index    ] = rgb[0];
    data[index + 1] = rgb[1];
    data[index + 2] = rgb[2];
    data[index + 3] = rgb[3];
}

function drawLineIntClipped(x1, x2, rgb, data) {
    x1 = floor(x1);
    x2 = floor(x2);

    var index = [-1, 0, 1];

    var n  = index.length;
    var nn = n * n; 

    var x = [];
    x[0] = x1[0];
    x[1] = x1[1];

    var tangent = [x2[0] - x1[0], x2[1] - x1[1]];
    var normal = [];
    normal[0] = -tangent[1];
    normal[1] =  tangent[0];

    drawPxl(x, data, rgb);

    while (x[0] !== x2[0] || x[1] !== x2[1]) {
        var fmin = Number.MAX_VALUE;
        var minDir = [];
        for (var k = 0; k < nn; k++) {
            var i = index[k % n];
            var j = index[Math.floor(k % nn / n)];
            
            var nextX = [x[0] + i, x[1] + j];
            
            var v = [nextX[0] - x1[0], nextX[1] - x1[1]];
            var f = Math.abs(v[0] * normal[0] + v[1] * normal[1]) - (v[0] * tangent[0] + v[1] * tangent[1]);
            if(fmin > f) {
                fmin = f;
                minDir = [i, j];
            }
        }

        x = [x[0] + minDir[0], x[1] + minDir[1]];
        drawPxl(x, data, rgb);
    }	
}

function drawLineInt(x1, x2, rgb, data) {
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
		drawLineIntClipped(inStack[0], inStack[1], rgb, data);
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
			return drawLineIntClipped(p1, p2, rgb, data);
		}
	}
	if(validIntersection.length == 0) {
		return
	}
	//it can be shown that at this point there is only one valid intersection
	var p = [x1[0] + validIntersection[0][0] * v[0], x1[1] + validIntersection[0][0] * v[1]];
	drawLineIntClipped(inStack.pop(), p, rgb, data);
}

function drawLine(x1, x2, rgb, data) {
    var x1Int = canvasTransformInt(x1, xmin, xmax);
    var x2Int = canvasTransformInt(x2, xmin, xmax);
    drawLineInt(x1Int, x2Int, rgb, data)
}

function intersectImagePlaneInCameraSpace(vertexOut, vertexIn) {
 	var outX = vertexOut[0];
    var outY = vertexOut[1];
    var outZ = vertexOut[2];
    var inZ  = vertexIn[2];
    var xInter = outX + (vertexIn[0] - outX) * (distanceToPlane - outZ) / (inZ - outZ);
    var yInter = outY + (vertexIn[1] - outY) * (distanceToPlane - outZ) / (inZ - outZ);
    return [xInter, yInter, distanceToPlane];
}

function draw3DLine(line, rgb, data) {
	// camera coords
	var cameraLine = [];
	cameraLine[0] = matrixProd(cam.invBasis[0], cam.invBasis[1], cam.invBasis[2], diff(line[0], cam.eye));
	cameraLine[1] = matrixProd(cam.invBasis[0], cam.invBasis[1], cam.invBasis[2], diff(line[1], cam.eye));

	//fustrum clip
	var inFrustum =  [];
	var outFrustum = [];
	for (var i = 0; i < cameraLine.length; i++) {
        if (cameraLine[i][2] < distanceToPlane) {
            outFrustum.push(i);
        } else {
            inFrustum.push(i);
        }
    }
    if (outFrustum.length == 2) {
        return;
    }
    if (outFrustum.length == 1) {
        var inVertex = inFrustum[0];
        var outVertex = outFrustum[0];
        var inter = intersectImagePlaneInCameraSpace(cameraLine[outVertex], cameraLine[inVertex]);
        cameraLine[outVertex] = inter;
    }

    //project
    for (var i = 0; i < cameraLine.length; i++) {
        cameraLine[i][0] = cameraLine[i][0] * distanceToPlane / cameraLine[i][2];
        cameraLine[i][1] = cameraLine[i][1] * distanceToPlane / cameraLine[i][2];
    }
    drawLine([cameraLine[0][0], cameraLine[0][1]], [cameraLine[1][0], cameraLine[1][1]], rgb, data);
}

/**
 * Main program
 */

function preventScroolingMobile() {
    document.body.addEventListener("touchstart", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, false);
    document.body.addEventListener("touchend", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, false);
}

function init() {
    canvas.addEventListener("touchstart", touchStart, false);
    canvas.addEventListener("touchend", touchEnd, false);
    canvas.addEventListener("touchmove", touchMove, false);

    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);

    document.addEventListener("keydown", keyDown, false);
    
    startTime = new Date().getTime();
    width = canvas.width;
    height = canvas.height;

    var size = distanceToPlane * Math.tan(alpha);
    xmin = [-size, -size];
    xmax = [ size,  size];

    mouse = [0,0];

    cam = new Camera();
    cam.param  = [3, Math.PI + Math.PI/3, Math.PI/3];
    cam.focalPoint = [0, 0, 0];
    cam.eye = [3, 0, 0];

    myDevice = new Device();

    accelerationFifo = new Fifo(samples);
    eulerSpeedFifo = new Fifo(samples);

    calibrationLoadingUI = new LoadingBar([canvas.width / 4, canvas.height / 3], [canvas.width / 2, 25]);

    //add device accelerometer  callback ?
    if (window.DeviceMotionEvent != undefined && isMobile) {
		window.ondevicemotion = function(e) {
			accelerationFifo.push([-e.acceleration.y, -e.acceleration.x, -e.acceleration.z]);
			eulerSpeedFifo.push([e.rotationRate.alpha, e.rotationRate.beta, e.rotationRate.gamma]);
			document.getElementById("accelerationX").innerHTML = accelerationFifo.buffer[accelerationFifo.buffer.length-1][0];
			document.getElementById("accelerationY").innerHTML = accelerationFifo.buffer[accelerationFifo.buffer.length-1][1];
			document.getElementById("accelerationZ").innerHTML = accelerationFifo.buffer[accelerationFifo.buffer.length-1][2];
			document.getElementById("alpha").innerHTML = eulerSpeedFifo.buffer[eulerSpeedFifo.index][0].toFixed(2);
			document.getElementById("beta").innerHTML  = eulerSpeedFifo.buffer[eulerSpeedFifo.index][1].toFixed(2);
			document.getElementById("gamma").innerHTML = eulerSpeedFifo.buffer[eulerSpeedFifo.index][2].toFixed(2);
		};
	}
    preventScroolingMobile();
}


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

function touchStart(e) {
    var rect = canvas.getBoundingClientRect();
    mouse[0] = e.touches[0].clientY - rect.top;
    mouse[1] = e.touches[0].clientX - rect.left;
    down = true;
}

function touchEnd() {
    down = false;
}

function touchMove(e) {
    var rect = canvas.getBoundingClientRect();
    var mx = (e.touches[0].clientX - rect.left), my = (e.touches[0].clientY - rect.top);
    
    if (!down || mx == mouse[0] && my == mouse[1]) {
        return;
    }

    var dx = mx - mouse[1];
    var dy = my - mouse[0];
    cam.param[1] = cam.param[1] - 2 * Math.PI * (dx / canvas.width);
    cam.param[2] = cam.param[2] + 2 * Math.PI * (dy / canvas.height);

    mouse[0] = my;
    mouse[1] = mx;
}

function mouseDown(e) {
    var rect = canvas.getBoundingClientRect();
    mouse[0] = e.clientY - rect.top;
    mouse[1] = e.clientX - rect.left;
    down = true;
}

function mouseUp() {
    down = false;
}

function mouseMove(e) {
    var rect = canvas.getBoundingClientRect();
    var mx = (e.clientX - rect.left), my = (e.clientY - rect.top);
    if (!down || mx == mouse[0] && my == mouse[1]) {
        return;
    }
    
    var dx = mx - mouse[1];
    var dy = my - mouse[0];
    cam.param[1] = cam.param[1] - 2 * Math.PI * (dx / canvas.width);
    cam.param[2] = cam.param[2] + 2 * Math.PI * (dy / canvas.height);

    mouse[0] = my;
    mouse[1] = mx;
}

function drawCurve(data, rgb) {
	for(var i = 0; i < curve.length-1; i++) {
		draw3DLine([curve[i], curve[i+1]], rgb, data);
	}
}

function drawAxis(data) {
	draw3DLine([[0, 0, 0], [1, 0, 0]],[255, 255, 255, 255], data);
    draw3DLine([[0, 0, 0], [0, 1, 0]],[255, 255, 255, 255], data);
    draw3DLine([[0, 0, 0], [0, 0, 1]],[255, 255, 255, 255], data);
}

function sendData2PublicChat(accelerationFifo, eulerSpeedFifo) {
	var text = accelerationFifo + " : " + eulerSpeedFifo;
    //send request to server
    $.ajax({
            method:"POST",
            url:"http://pedroth.duckdns.org:8080/putText",
            data: {
               id : 1,
               log : text
            },
            success: function(result) {}
        });
}

function averageVectorFifo(x) {
	var acc = [0,0,0];
	for(var i = 0; i < x.buffer.length; i++) {
		acc = add(acc, x.buffer[i]);
	}
	return x.buffer.length === 0 ? acc : scalarMult(1.0 / x.buffer.length, acc);
}

function updateCurve(dt) {
	if(curve.length == 0) {
		curve[0] = [0, 0, 0];
	}

	if(!isMobile) {
		accelerationFifo.push([10, 0, 0]);
		eulerSpeedFifo.push([-90 + 2 * Math.random(), -90 + 2 * Math.random(), -90 + 2 * Math.random()]);
		//accelerationFifo.push([0, 0, 0]);
		//eulerSpeedFifo.push([0, 0, 0]);
	}

	var averageAcceleration = diff(averageVectorFifo(accelerationFifo), accelerationCalibration);
	var averageEulerSpeed = diff(averageVectorFifo(eulerSpeedFifo), eulerSpeedCalibration);

	//sendData2PublicChat(averageAcceleration, averageEulerSpeed);

	myDevice.computeBasisFromEuler();
	accelerationSpace = matrixProd(myDevice.basis[0], myDevice.basis[1], myDevice.basis[2], averageAcceleration);
	accelerationSpace = diff(accelerationSpace, myDevice.vel);
	myDevice.pos = add(myDevice.pos, add(scalarMult(dt, myDevice.vel), scalarMult(0.5 * dt * dt, accelerationSpace)));
	myDevice.vel = add(myDevice.vel, scalarMult(dt, accelerationSpace));

	var eulerSpeedRad = scalarMult(Math.PI / 180, averageEulerSpeed);
	myDevice.euler = add(myDevice.euler, scalarMult(dt, eulerSpeedRad));

	curve.push(vec3(myDevice.pos[0], myDevice.pos[1], myDevice.pos[2]));
	
	minCurve = [Math.min(minCurve[0], myDevice.pos[0]), Math.min(minCurve[1], myDevice.pos[1]), Math.min(minCurve[2], myDevice.pos[2])];
	maxCurve = [Math.max(maxCurve[0], myDevice.pos[0]), Math.max(maxCurve[1], myDevice.pos[1]), Math.max(maxCurve[2], myDevice.pos[2])];

	var center = add(minCurve, maxCurve);
	center = scalarMult(0.5, center);
	var radius = myNorm(diff(maxCurve, center));
	cam.param[0] = radius;

}

function drawDeviceAxis(data) {
	draw3DLine([myDevice.pos, add(myDevice.pos, myDevice.basis[0])], [255, 0, 0, 255], data);
	draw3DLine([myDevice.pos, add(myDevice.pos, myDevice.basis[1])], [0, 255, 0, 255], data);
	draw3DLine([myDevice.pos, add(myDevice.pos, myDevice.basis[2])], [0, 0, 255, 255], data);
	//draw3DLine([[0,0,0], myDevice.basis[0]], [255, 0, 0, 255], data);
	//draw3DLine([[0,0,0], myDevice.basis[1]], [0, 255, 0, 255], data);
	//draw3DLine([[0,0,0], myDevice.basis[2]], [0, 0, 255, 255], data);
}

function calibration(dt, data) {
	// calibration 
	var averageAcceleration = averageVectorFifo(accelerationFifo);
	var averageEulerSpeed = averageVectorFifo(eulerSpeedFifo);
	accelerationCalibration = add(accelerationCalibration, scalarMult(1.0 / calibrationIte, diff(averageAcceleration, accelerationCalibration)));
	eulerSpeedCalibration = add(eulerSpeedCalibration, scalarMult(1.0 / calibrationIte, diff(averageEulerSpeed, eulerSpeedCalibration)));
	calibrationIte++;

	sendData2PublicChat(averageAcceleration, averageEulerSpeed);
	
	// UI stuff
	var color = [255,255,255,255];
	calibrationLoadingUI.percentFill = calibrationLoadingUI.percentFill + dt / maxCalibrationTimeInSeconds;
	var maxIndex = Math.floor(calibrationLoadingUI.percentFill * calibrationLoadingUI.size[0]);	
	
	var endPoint = calibrationLoadingUI.pos;
	var endPointW = add(calibrationLoadingUI.pos, [calibrationLoadingUI.size[0], 0]);
	var endPointH = add(calibrationLoadingUI.pos, [0, calibrationLoadingUI.size[1]]);
	var endPointWH = add(calibrationLoadingUI.pos, calibrationLoadingUI.size);

	// revert x with y
	drawLineInt([endPoint[1], endPoint[0]], [endPointW[1], endPointW[0]], color, data);
	drawLineInt([endPointW[1], endPointW[0]], [endPointWH[1], endPointWH[0]], color, data);
	drawLineInt([endPointWH[1], endPointWH[0]], [endPointH[1], endPointH[0]], color, data);
	drawLineInt([endPointH[1], endPointH[0]], [endPoint[1], endPoint[0]], color, data);

	for (var i = 0; i < maxIndex; i++) {
		var x1 = add(endPoint, [i, 0]);
		var x2 = add(endPointH, [i, 0]);
		drawLineInt([x1[1], x1[0]], [x2[1], x2[0]], color, data);
	}

	if(calibrationLoadingUI.percentFill > 1) {
		calibrationLoadingUI.percentFill = 0;
		isCalibrating = false;
	}
}

function draw() {
    var dt = 1E-3 * (new Date().getTime() - startTime);
    startTime = new Date().getTime();
    time += dt;

    var image, data;

    ctx.fillStyle = 'rgba(0, 0, 0, 255)';
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = image.data;

    /**
     * drawing and animation
     **/
    
    if(isCalibrating && isMobile) {
    	calibration(dt, data);
    } else {
	    cam.orbit();
	    updateCurve(dt);
	    drawDeviceAxis(data);
	    drawAxis(data);
	    drawCurve(data, [0, 255, 0, 255]);
    }

    ctx.putImageData(image, 0, 0);
    
    // rapid fix for text
    if(isCalibrating && isMobile) {
    	ctx.font = '15px serif';
    	ctx.fillStyle = 'rgba(255, 255, 255, 255)';	
    	ctx.fillText('Get your device in a stationary position for calibration', calibrationLoadingUI.pos[0], calibrationLoadingUI.pos[1] - 10);	
    }
    
    requestAnimationFrame(draw);
}

init();
requestAnimationFrame(draw);