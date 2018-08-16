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

    this.triangleShader = MyCanvas.colorShader([[255,0,0,255],[0,255,0,255],[0,0,255,255]]);

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
            this.canvasTriangles.drawTriangle(invertVector(this.average, this.diff[0], sinsin), invertVector(this.average, this.diff[1], sinsin), invertVector(this.average, this.diff[2], sinsin), this.triangleShader);

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

        this.canvasTexture.drawString(
                                        [-0.95, 0.9],
                                         "FPS : " + (1 / dt),
                                         function(ctx) {
                                            ctx.fillStyle = "white";
                                            ctx.font = "bold 16px Arial";
                                         }
        );

        var cos = Math.cos(this.t / (2 * Math.PI));
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

/**
* state of opened simulations, is a number \in {0, ... , n}.
* Where state 0, represents closed simulations, and state != 0 represents all simulations close unless simulations[state-1].
**/
var stateIndexApplicationOpen = 0; 
var tests = [
             ["test1", new Test1()],
             ["test2", new Test2()],
             ["test3", new Test3()],
             ["test4", new Test4()]
];

function closeState(state) {
    if(state > 0) {
        $(`#${tests[state-1][0]}`).slideUp();
    }
}

function openState(state) {
    $(`#${tests[state-1][0]}`).slideDown();
}

// click number > 0
function clickOperator(clickNumber, state) {
    var condition = state != clickNumber;
    if(condition) {
        closeState(state);
        openState(clickNumber);
    } else {
        closeState(state);
    }
    return condition ? clickNumber : 0;
}

function simulate(index) {
    return () => {
        tests[index][1].update();
        if($(`#${tests[index][0]}`).is(":visible")) {
            requestAnimationFrame(simulate(index));
        }
    };
}

function run(index) {
    stateIndexApplicationOpen = clickOperator(index + 1, stateIndexApplicationOpen);
    requestAnimationFrame(simulate(index));
}

module.exports =  {
    run : run
} 