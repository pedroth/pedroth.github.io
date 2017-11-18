var CanvasSpace = require('./CanvasSpace.js');
var canvasLines = new CanvasSpace(document.getElementById("canvasLines"), [[-1, 1], [-1, 1]]);
var f = function(x) {return [0, 255, 0, 255]};
var g = function(x) {return [0, 0, 255, 255]};
var interpolativeShader = function(x, line) {
	black = [0, 0, 0, 255];
	white = [255, 255, 255, 255];
	gradient = [255, 255, 255, 0];
	v = [line[1][0] - line[0][0], line[1][1] - line[0][0]];
	z = [x[0] - line[0][0], x[1] - line[0][1]];
	t = v[0] == 0.0 ? z[1] / v[1] : z[0] / v[0];
	return [black[0] + gradient[0] * t, black[1] + gradient[1] * t, black[2] + gradient[2] * t, black[3] + gradient[3] * t];
};
var samples = 10;
for (var i = 0; i < samples; i++) {
	var first = [-1 + 2 * Math.random(), -1 + 2 * Math.random()];
	var second = [-1 + 2 * Math.random(), -1 + 2 * Math.random()];
	canvasLines.drawLine(first, second, f);
}
for (var i = 0; i < samples; i++) {
	var first = [-2 + 4 * Math.random(), -2 + 4 * Math.random()];
	var second = [-2 + 4 * Math.random(), -2 + 4 * Math.random()];
	canvasLines.drawLine(first, second, g);
}
canvasLines.drawLine([0,0], [1,1], function(x) {return [255, 0 , 0, 255]});
canvasLines.drawLine([0,0], [-1,-1], interpolativeShader);
canvasLines.paintImage();