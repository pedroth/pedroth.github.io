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

/**
 * Setup
 */
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

var acceleration = [0, 0, 0];

var eulerSpeed = [0, 0, 0];
var curve = [];
var minCurve = [-3, -3, -3];
var maxCurve = [ 3,  3,  3];
var cam;
var myDevice;


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
}
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
/*
* end math
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
    cam.param  = [3, 0, 0];
    cam.focalPoint = [0, 0, 0];
    cam.eye = [3, 0, 0];

    myDevice = new Device();

    //add device accelerometer  callback ?
    if (window.DeviceMotionEvent != undefined) {
		window.ondevicemotion = function(e) {
			acceleration = [e.acceleration.x, e.acceleration.y, e.acceleration.z];
			eulerSpeed = [e.rotationRate.alpha, e.rotationRate.beta, e.rotationRate.gamma];
			document.getElementById("accelerationX").innerHTML = acceleration[0];
			document.getElementById("accelerationY").innerHTML = acceleration[1];
			document.getElementById("accelerationZ").innerHTML = acceleration[2];
			document.getElementById("alpha").innerHTML = eulerSpeed[0];
			document.getElementById("beta").innerHTML  = eulerSpeed[1];
			document.getElementById("gamma").innerHTML = eulerSpeed[2];
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

function drawLineInt(x1, x2, rgb, data) {

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
            
            var nextX = add(x, [i, j]);
            
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

function updateCurve(dt) {
	if(curve.length == 0) {
		curve[0] = [0, 0, 0];
	}

	if(acceleration == null || acceleration[0] == null || myNorm(acceleration) < 1) {
		acceleration = [0, 0, 0];
	}

	acceleration = diff(acceleration, myDevice.vel);
	myDevice.pos = add(myDevice.pos, add(scalarMult(dt, myDevice.vel), scalarMult(0.5 * dt * dt, acceleration)));
	myDevice.vel = add(myDevice.vel, scalarMult(dt, acceleration));

	var eulerSpeedRad = scalarMult(Math.PI / 180, eulerSpeed);
	myDevice.euler = add(myDevice.euler, scalarMult(dt, eulerSpeedRad));

	curve.push(vec3(myDevice.pos[0], myDevice.pos[1], myDevice.pos[2]));
	
	minCurve = [Math.min(minCurve[0], myDevice.pos[0]), Math.min(minCurve[1], myDevice.pos[1]), Math.min(minCurve[2], myDevice.pos[2])];
	maxCurve = [Math.max(maxCurve[0], myDevice.pos[0]), Math.max(maxCurve[1], myDevice.pos[1]), Math.max(maxCurve[2], myDevice.pos[2])];

	// if(acceleration[0] == null) {
	// 	acceleration = [-1 + 2 * Math.random(), -1 + 2 * Math.random(), -1 + 2 * Math.random()];
	// 	myDevice.pos = add(myDevice.pos, add(scalarMult(dt, myDevice.vel), scalarMult(0.5 * dt * dt, acceleration)));
	// 	myDevice.vel = add(myDevice.vel, scalarMult(dt, acceleration));
	// 	curve.push(vec3(myDevice.pos[0], myDevice.pos[1], myDevice.pos[2]));
	// 	minCurve = [Math.min(minCurve[0], myDevice.pos[0]), Math.min(minCurve[1], myDevice.pos[1]), Math.min(minCurve[2], myDevice.pos[2])];
	// 	maxCurve = [Math.max(maxCurve[0], myDevice.pos[0]), Math.max(maxCurve[1], myDevice.pos[1]), Math.max(maxCurve[2], myDevice.pos[2])];
	// 	isPointAdded = true;
	// 	acceleration = [null, null, null];
	// }
	var center = add(minCurve, maxCurve);
	center = scalarMult(0.5, center);
	var radius = myNorm(diff(maxCurve, center));
	cam.param[0] = radius;

}

function drawDeviceAxis(data) {
	var alpha = myDevice.euler[0];
	var beta  = myDevice.euler[1];
	var gamma = myDevice.euler[2];
	var ca = Math.cos(alpha);
	var sa = Math.sin(alpha);
	var cb = Math.cos(beta);
	var sb = Math.sin(beta);
	var cg = Math.cos(gamma);
	var sg = Math.sin(gamma);
	draw3DLine([myDevice.pos, add(myDevice.pos, [cg * ca + sg * sb * sa, cb * sa, cg * sb * sa - sg * ca])],[255, 0, 0, 255], data);
	draw3DLine([myDevice.pos, add(myDevice.pos, [sg * sb * ca - cg * sa, cb * ca, sg * sa + cg * sb * ca])],[0, 255, 0, 255], data);
	draw3DLine([myDevice.pos, add(myDevice.pos, [sg*cb, -sb, cg * cb])],[0, 0, 255, 255], data);
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
    cam.orbit();
    updateCurve(dt);
    drawDeviceAxis(data);
    drawAxis(data);
    drawCurve(data, [0, 255, 0, 255]);
    
    ctx.putImageData(image, 0, 0);
    requestAnimationFrame(draw);
}

init();
requestAnimationFrame(draw);