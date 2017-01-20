var CanvasSpace = require('./CanvasSpace.js');
var canvasDOM = document.getElementById("canvas");
var canvas = new CanvasSpace(canvasDOM, [[-1, 1], [-1, 1]]);
canvas.drawLine([0, 0], [-1, -1], function(x) {return [0, 255, 0, 255]});
canvas.paintImage();