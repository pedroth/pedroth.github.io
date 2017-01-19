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
var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var down = false;

var startTime;
var width, height;
var mouse;
var time = 0;

var xmin = [-1, -1];
var xmax = [1, 1];
var curve = [];

/**
*  Utils
**/
/**
* My math
**/
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
    return add(scalarMult(x[0], u), scalarMult(x[1], v));
};

var floor = function(v) {
    var ans = [];
    ans[0] = Math.floor(v[0]);
    ans[1] = Math.floor(v[1]);
    return ans;
}

var conjugate = function(u) {
    var ans = [];
    ans[0] = u[0];
    ans[1] = -u[1];
    return ans;
}

var prod = function(u,v) {
    var ans = [];
    ans[0] = u[0] * v[0] - u[1] * v[1];
    ans[1] = u[0] * v[1] + u[1] * v[0];
    return ans;
}

var div = function(u,v) {
  var ans = scalarMult(1 / squaredNorm(v), prod(u,conjugate(v)));
  return ans;
}
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
    mouse = zeros();
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
    if (!down || mx == mouse[0] && my == mouse[1])
        return;
    mouse[0] = my;
    mouse[1] = mx;
};

function getImageIndex(x, size) {
    return 4 * (size[0] *  x[0] + x[1]);
}

function canvasTransformInt(x, xmin, xmax) {
    var ans = [xmin[0] , xmax[1]];
    var v = diff(x, ans);
    var dx = diff(xmax, xmin);
    return matrixProd([0, width / dx[0]], [-height / dx[1], 0], v);
}

function canvasTransform(xInt, xmin, xmax) {
    var aux = [xmin[0], xmax[1]];
    var dx = diff(xmax, xmin);
    return add(aux, matrixProd([0, -dx[1] / height], [dx[0] / width, 0], xInt));
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

    var size = 1;
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

    drawPxl(x,data,rgb)

    while (x[0] !== x2[0] || x[1] !== x2[1]) {

        var maxShade = -1;

        for ( var i = -size; i < size + 1; i++) {
            for ( var j = -size; j < size + 1; j++) {

                var nextX = add(x, [ i, j ]);
                var shadePow = Math.abs(innerProd(diff(nextX, x1), normal)); 
                var res = shadePow + Math.abs(nextX[0] - x2[0]) + Math.abs(nextX[1] - x2[1]);

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

        fmin = Number.MAX_VALUE;

        oldi[0] = -imin[0];
        oldi[1] = -imin[1];

        x = add(x, imin);
        drawPxl(x,data,rgb)
    }
}

function drawLine(x1, x2, rgb, data) {
    var x1Int = canvasTransformInt(x1, xmin, xmax);
    var x2Int = canvasTransformInt(x2, xmin, xmax);
    drawLineInt(x1Int, x2Int, rgb, data)
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
    drawLineInt([0,0], mouse, [255,0,0,255], data);
    ctx.putImageData(image, 0, 0);
    
    ctx.fillStyle = 'white';
    ctx.font = "bold 16px Arial";
    var tMouse = canvasTransform(mouse, xmin, xmax);
    ctx.fillText("x : " + tMouse[0] +  " y: " + tMouse[1], mouse[1], mouse[0]);
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);