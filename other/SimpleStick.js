/**
 * Setup
 */
var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var down = false;
var animationImg = [];
var startTime;
var width, height;
var mouse;
var fps = 18;
var time = 0;
var numOfFrames = 9;
/**
*  Utils
**/
function loadImage(src) {
        var img = new Image();
        img.src = src;
        img.isReady = false;
        img.onload = function() {
            img.isReady = true;
        };
        return img;
}

function init() {
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    document.addEventListener("keydown", keyDown, false);
    var address = "canvasTest/p";
    for(var i = 0; i < numOfFrames; i++) {
        var finalAddress = address+(i+1)+".png";
        animationImg[i] = loadImage(finalAddress);
    }
    startTime = new Date().getTime();
    width = canvas.width;
    height = canvas.height;
    mouse = [0,0];
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

function draw() {
    var dt = 1E-3 * (new Date().getTime() - startTime);
    startTime = new Date().getTime();
    time += dt;
    ctx.fillStyle = 'rgba(0.1, 0.1, 0.1, 1.0)';
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    /**
     * drawing and animation
     **/
    var t = (time % (numOfFrames / fps));
    var animationIndex = Math.floor(fps * t);
    var animationFrame = animationImg[animationIndex];
    if(animationFrame.isReady) {
        ctx.drawImage(animationFrame,mouse[1],mouse[0]);
    }
    /**
    *
    **/
    //ctx.drawImage(animationFrame,0,0);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText("x : " + mouse[0] +  " y: " + mouse[1], mouse[1], mouse[0]);
    requestAnimationFrame(draw);
}
/**
*  Main
**/
init()
requestAnimationFrame(draw);