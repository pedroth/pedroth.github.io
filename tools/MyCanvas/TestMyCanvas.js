var CanvasSpace = require('./CanvasSpace.js');
var canvasDOM = document.getElementById("canvas");
var canvas = new CanvasSpace(canvasDOM, [[-1, 1], [-1, 1]]);
var f = function(x) {return [0, 255, 0, 255]};
var samples = 100;
for (var i = 0; i < samples; i++) {
	var first = [-1 + 2 * Math.random(), -1 + 2 * Math.random()];
	var second = [-1 + 2 * Math.random(), -1 + 2 * Math.random()];
	canvas.drawLine(first, second, f);
}
canvas.drawLine([0,0], [1,1], function(x) {return [255,0,0,255]});
canvas.paintImage();