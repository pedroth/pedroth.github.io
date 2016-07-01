/*
 *  Setup
 */
var canvas = document.getElementById('canvas');
var canvasVideo = document.getElementById('canvasVideo');
var ctx = canvas.getContext('2d');
var ctxVideo = canvasVideo.getContext('2d');

var down = false;

var startTime;

var width, height;

var mouse;

var video = document.getElementById("video");
var videoObj = { "video": true };
var errBack = function(error) { console.log("Video capture error: ", error.code);};

var numberOfCluster = 6;

var clusters = [];

/*
 * 3D vectors
 */
function vec3(x,y,x) {
    var ans = [];
    ans[0] = x;
    ans[1] = y;
    ans[2] = z;
    return 
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
 return sqrt(squaredNorm(v));
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


function init() {    
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    document.addEventListener("keydown", keyDown, false);
  
    startTime = new Date().getTime();
    
    width = canvas.width;
    height = canvas.height;
    
    mouse = [0,0];
    
    
    // Put video listeners into place
    if(navigator.getUserMedia) { // Standard
        navigator.getUserMedia(videoObj, function(stream) {
            video.src = stream;
            video.play();
        }, errBack);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia(videoObj, function(stream){
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
        }, errBack);
    } else if(navigator.mozGetUserMedia) { // WebKit-prefixed
        navigator.mozGetUserMedia(videoObj, function(stream){
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, errBack);
    }
    
    for(var i = 0; i < numberOfCluster; i++) {
        clusters[i] = vec3(Math.random(), Math.random(), Math.random());
    }
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

function runKmeans(data) {
    var sampleData = sampleData(data);
    
}

function draw() {
    var dt = 1E-3 * (new Date().getTime() - startTime);
    startTime = new Date().getTime();
    
    ctxVideo.drawImage(video, 0, 0, width,height);
    
    var videoImage = ctxVideo.getImageData(0, 0, canvasVideo.width, canvasVideo.height);
    
    runKmeans(videoImage);
    ctx.putImageData(videoImage, 0, 0);
    
    
    requestAnimationFrame(draw);
}
/**
*  Main
**/
init()
requestAnimationFrame(draw);