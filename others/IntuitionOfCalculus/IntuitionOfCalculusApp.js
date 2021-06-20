var Canvas = require("../../JsLib/Canvas/main/Canvas.js");
var Canvas2D = require("../../JsLib/Canvas/main/Canvas2D.js");
var ImageIO = require("../../JsLib/Canvas/main/ImageIO.js");
var SimManager = require("../../JsLib/SimManager/main/SimManager.js");
var Stream = require("../../JsLib/Stream/main/Stream.js");

function getDashedLineShader(color) {
  return Canvas.interpolateLineShader((x, line, canvas, t) => {
    var p = 0.1;
    var isDash = t % p < p / 2 ? true : false;
    if (isDash) {
      canvas.drawPxl(x, color);
    }
  });
}

function drawArrow(init, v, canvas, shader, p) {
  var p = p == null ? 0.05 : p;
  var b = p / 4;

  canvas.drawLine(init, [init[0] + v[0], init[1] + v[1]], shader);
  var r = [p * v[0], p * v[1]];
  var n = [-b * v[1], b * v[0]];
  var first = [init[0] + v[0] - r[0] + n[0], init[1] + v[1] - r[1] + n[1]];
  var second = [init[0] + v[0] - r[0] - n[0], init[1] + v[1] - r[1] - n[1]];
  var third = [init[0] + v[0], init[1] + v[1]];
  canvas.drawTriangle(first, second, third, shader);
}

function classifyCluster(x, clusters, distance) {
  var minIndex = -1;
  var minValue = Number.MAX_VALUE;
  for (var i = 0; i < clusters.length; i++) {
    var dist = distance(x, clusters[i]);
    if (minValue > dist) {
      minValue = dist;
      minIndex = i;
    }
  }
  return minIndex;
}

function horizontalNormDistance(x, y) {
  var v = x[0] - y[0];
  return v * v;
}

function linearFunctor(p1, p2) {
  var m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  return function(x) {
    return p1[1] + m * (x - p1[0]);
  };
}

/*
 * Simulations
 */
function Sim0() {
  this.canvas = new Canvas2D(document.getElementById("functionGraph"), [
    [-0.1, 1.1],
    [-0.1, 1.1]
  ]);
  this.fImg = ImageIO.loadImage("static/f.png");
  this.xaxisH = 0.9;
  this.yaxisH = 0.0;
  this.height = 0.1;
  this.isNotDrawn = true;
  this.samples = 50;
  this.fminMax = [-1, 1];

  this.checkIfCanDraw = function() {
    return $("#sim0").is(":visible");
  };

  /**
   * Generate Heat color shader based on function f
   * @param {*} f, f:[0, 1]->[0, 1]
   */
  this.getHeatColorShader = function(f) {
    return (x, quad, canvas) => {
      let xline = canvas.inverseTransform(x);
      let intensity = Math.min(1, Math.max(0, f(xline[0])));
      let red = 255 * Math.min(1, Math.max(0, (10.0 / 4.0) * intensity));
      let green =
        255 * Math.min(1, Math.max(0, (10.0 / 4.0) * (intensity - 0.4)));
      let blue = 255 * Math.min(1, Math.max(0, 5 * (intensity - 0.8)));
      canvas.drawPxl(x, [
        Math.floor(red),
        Math.floor(green),
        Math.floor(blue),
        255
      ]);
    };
  };

  this.smooth = function(y) {
    var z = [];
    z[0] = (y[0] + y[1]) / 2;
    for (var i = 1; i < y.length - 1; i++) {
      z[i] = (y[i] + y[i + 1] + y[i - 1]) / 3;
    }
    z[y.length - 1] = (y[y.length - 2] + y[y.length - 1]) / 2;
    return z;
  };

  this.generateNewFunction = function() {
    let df = this.fminMax[1] - this.fminMax[0];
    let randomArray = Stream.range(0, this.samples)
      .map(x => this.fminMax[0] + df * Math.random())
      .reduce([], (acc, x) => {
        acc.push(x);
        return acc;
      });
    let s = Stream.of(this.smooth(randomArray));
    return s.map;
  };

  this.draw = function() {
    if (this.isNotDrawn) {
      var dy = this.xaxisH - this.yaxisH;

      this.canvas.clearImage([255, 255, 255, 255]);
      // f arrow
      var init = [0.5, this.xaxisH - 0.05 * dy];
      var end = [0.5, this.yaxisH + 0.15 * dy];
      drawArrow(
        init,
        [end[0] - init[0], end[1] - init[1]],
        this.canvas,
        Canvas.simpleShader([0, 0, 0, 255])
      );
      this.canvas.drawImage(this.fImg, [0.45, 0.5 * dy]);

      //x-axis color
      var xTop = this.xaxisH + this.height;
      this.canvas.drawLine(
        [0, this.xaxisH],
        [1, this.xaxisH],
        Canvas.simpleShader([0, 0, 0, 255])
      );
      this.canvas.drawQuad(
        [0, this.xaxisH],
        [1, this.xaxisH],
        [1, xTop],
        [0, xTop],
        this.getHeatColorShader(x => x)
      );

      //y-axis color
      var yTop = this.yaxisH + this.height;
      var fsamples = this.generateNewFunction();
      this.canvas.drawLine(
        [0, this.yaxisH],
        [1, this.yaxisH],
        Canvas.simpleShader([0, 0, 0, 255])
      );
      this.canvas.drawQuad(
        [0, this.yaxisH],
        [1, this.yaxisH],
        [1, yTop],
        [0, yTop],
        this.getHeatColorShader(x => fsamples[Math.floor(x * fsamples.length)])
      );

      this.canvas.paintImage();
      this.isNotDrawn = false;
    }
  };

  this.start = function() {
    $("#sim0").slideDown();
  };

  this.end = function() {
    $("#sim0").slideUp();
  };

  this.init = function() {
    // empty
  };
}

function Sim1() {
  this.canvasGraph = new Canvas2D(
    document.getElementById("linearFunctionGraph"),
    [
      [-0.1, 1],
      [-0.1, 1]
    ]
  );
  this.canvasTransformation = new Canvas2D(
    document.getElementById("linearFunctionTransformation"),
    [
      [-0.1, 1],
      [-0.1, 1]
    ]
  );
  this.fa = [1 / 3, 1 / 3];
  this.fb = [2 / 3, 2 / 3];
  this.xImg = ImageIO.loadImage("static/x.png");
  this.yImg = ImageIO.loadImage("static/y.png");
  this.fImg = ImageIO.loadImage("static/f.png");
  this.isMouseDown = false;
  this.xaxisH = 0.8;
  this.yaxisH = 0.0;
  this.circleRadius = 0.01;

  this.baseMouse = function(integerMouse) {
    var mouse = this.canvasGraph.inverseTransform(integerMouse);
    var points = [this.fa, this.fb];
    var index = classifyCluster(mouse, points, horizontalNormDistance);
    if (!this.isMouseDown) {
      return;
    }
    if (index == 0) {
      this.fa = mouse;
    } else {
      this.fb = mouse;
    }
  };

  this.mouseStart = function(e) {
    this.isMouseDown = true;
  };

  this.mouseEnd = function(e) {
    this.isMouseDown = false;
  };

  this.mouseMove = function(e) {
    var rect = this.canvasGraph.canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    this.baseMouse([my, mx]);
  };

  this.touchStart = function(e) {
    this.isMouseDown = true;
  };

  this.touchEnd = function(e) {
    this.isMouseDown = false;
  };

  this.touchMove = function(e) {
    var rect = this.canvasGraph.canvas.getBoundingClientRect();
    var mx = e.touches[0].clientX - rect.left,
      my = e.touches[0].clientY - rect.top;
    this.baseMouse([my, mx]);
  };

  this.checkIfCanDraw = function() {
    return $("#sim1").is(":visible");
  };

  this.pointInLine = function(x) {
    var dx = this.fb[0] - this.fa[0];
    dx = dx == 0 ? 0.0001 : dx;
    var m = (this.fb[1] - this.fa[1]) / dx;
    var y = this.fa[1] + m * (x - this.fa[0]);
    return [x, y];
  };

  this.drawSetup = function() {
    drawArrow(
      [-0.1, 0],
      [1, 0],
      this.canvasGraph,
      Canvas.simpleShader([0, 0, 0, 255])
    );
    drawArrow(
      [0, -0.1],
      [0, 1],
      this.canvasGraph,
      Canvas.simpleShader([0, 0, 0, 255])
    );
    this.canvasGraph.drawImage(this.xImg, [0.9, -0.01]);
    this.canvasGraph.drawImage(this.yImg, [-0.05, 0.9]);

    drawArrow(
      [-0.1, this.xaxisH],
      [1, 0],
      this.canvasTransformation,
      Canvas.simpleShader([0, 0, 0, 255])
    );
    drawArrow(
      [-0.1, this.yaxisH],
      [1, 0],
      this.canvasTransformation,
      Canvas.simpleShader([0, 0, 0, 255])
    );
    this.canvasTransformation.drawImage(this.xImg, [0.9, this.xaxisH - 0.05]);
    this.canvasTransformation.drawImage(this.yImg, [0.9, this.yaxisH - 0.05]);
    drawArrow(
      [0.4, this.xaxisH - 0.05],
      [0, 0.7 * (this.yaxisH - this.xaxisH)],
      this.canvasTransformation,
      Canvas.simpleShader([0, 0, 0, 255])
    );
    this.canvasTransformation.drawImage(this.fImg, [0.45, 0.5]);
  };

  this.drawCanvasGraph = function() {
    this.canvasGraph.drawLine(
      this.pointInLine(-2),
      this.pointInLine(2),
      Canvas.simpleShader([0, 0, 0, 255])
    );
    this.canvasGraph.drawCircle(
      this.fa,
      this.circleRadius,
      Canvas.simpleShader([255, 0, 0, 255])
    );
    this.canvasGraph.drawCircle(
      this.fb,
      this.circleRadius,
      Canvas.simpleShader([0, 255, 0, 255])
    );

    // dashed red line
    this.canvasGraph.drawLine(
      this.fa,
      [this.fa[0], 0],
      getDashedLineShader([255, 0, 0, 255])
    );
    this.canvasGraph.drawLine(
      this.fa,
      [0, this.fa[1]],
      getDashedLineShader([255, 0, 0, 255])
    );

    // dashed blue line
    this.canvasGraph.drawLine(
      this.fb,
      [this.fb[0], 0],
      getDashedLineShader([0, 255, 0, 255])
    );
    this.canvasGraph.drawLine(
      this.fb,
      [0, this.fb[1]],
      getDashedLineShader([0, 255, 0, 255])
    );
  };

  this.drawCanvasTransform = function() {
    // draw samples
    var samples = 25;
    var xmin = -0.1;
    var xmax = 0.9;
    var x = xmin;
    var h = (xmax - xmin) / (samples - 1.0);
    var sampleRadius = 0.5 * this.circleRadius;
    for (var i = 0; i < samples; i++) {
      this.canvasTransformation.drawCircle(
        [x, this.xaxisH],
        sampleRadius,
        Canvas.simpleShader([0, 0, 255, 255])
      );
      this.canvasTransformation.drawCircle(
        [this.pointInLine(x)[1], this.yaxisH],
        sampleRadius,
        Canvas.simpleShader([0, 0, 255, 255])
      );
      x += h;
    }

    this.canvasTransformation.drawCircle(
      [this.fa[0], this.xaxisH],
      this.circleRadius,
      Canvas.simpleShader([255, 0, 0, 255])
    );
    this.canvasTransformation.drawCircle(
      [this.fb[0], this.xaxisH],
      this.circleRadius,
      Canvas.simpleShader([0, 255, 0, 255])
    );

    this.canvasTransformation.drawCircle(
      [this.fa[1], this.yaxisH],
      this.circleRadius,
      Canvas.simpleShader([255, 0, 0, 255])
    );
    this.canvasTransformation.drawCircle(
      [this.fb[1], this.yaxisH],
      this.circleRadius,
      Canvas.simpleShader([0, 255, 0, 255])
    );
  };

  this.draw = function() {
    this.canvasTransformation.clearImage([255, 255, 255, 255]);
    this.canvasGraph.clearImage([255, 255, 255, 255]);

    this.drawSetup();
    this.drawCanvasGraph();
    this.drawCanvasTransform();

    this.canvasGraph.paintImage();
    this.canvasTransformation.paintImage();
  };

  this.start = function() {
    $("#sim1").slideDown();
  };

  this.end = function() {
    $("#sim1").slideUp();
  };

  this.init = function() {
    this.canvasGraph.addEventListener(
      "touchstart",
      function(e) {
        apply(1, function(x) {
          x.touchStart(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "touchend",
      function(e) {
        apply(1, function(x) {
          x.touchEnd(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "touchmove",
      function(e) {
        apply(1, function(x) {
          x.touchMove(e);
        });
      },
      false
    );

    this.canvasGraph.addEventListener(
      "mousedown",
      function(e) {
        apply(1, function(x) {
          x.mouseStart(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "mouseup",
      function(e) {
        apply(1, function(x) {
          x.mouseEnd(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "mousemove",
      function(e) {
        apply(1, function(x) {
          x.mouseMove(e);
        });
      },
      false
    );
  };
}

function Sim2() {
  this.canvasGraph = new Canvas2D(
    document.getElementById("secantApproximation"),
    [
      [-0.1, 1],
      [-0.1, 1]
    ]
  );
  this.xImg = ImageIO.loadImage("static/x.png");
  this.yImg = ImageIO.loadImage("static/y.png");
  this.fImg = ImageIO.loadImage("static/f.png");
  this.isMouseDown = false;
  this.circleRadius = 0.01;
  this.fx = [];
  this.step = 0.25;
  this.cursor = 0.5;
  this.movingStep = 0.25;
  this.bandwidth = 5;
  this.maxAmp = 10;
  this.fourierCoef = [];
  this.samplesPerPeriod = 12;
  /**
   * I want to take k samples in a sine wave period (period of sine wave is 2 * pi = T).
   * In [0,1] interval I will take k / T samples.
   * If I have a sine wave with double the frequency ( sin(2 * x) ) I will have in [0,1] : 2 * k / T samples.
   * For the general case frequency f we get f * k / T samples in [0,1] interval.
   * The max frequency in our sine waves will (bandwidth - 1) * (2 ^ (bandwidth - 1).
   */
  this.samples = Math.ceil(
    (this.bandwidth - 1) *
      (1 << (this.bandwidth - 1)) *
      (this.samplesPerPeriod / (2 * Math.PI))
  );

  // functionMap must be updated since it depends on object variables
  this.functionMap = {};

  this.createFourierLambda = function(w) {
    return function(x) {
      var acc = 0;
      var mul = 1;
      for (var i = 0; i < w.length; i++) {
        acc += mul * w[i] * Math.sin(i * (1.0 / mul) * x);
        mul /= 2;
      }
      return acc;
    };
  };

  this.updateFunctionMap = function() {
    for (var i = 0; i < this.bandwidth; i++) {
      this.fourierCoef[i] = this.maxAmp * Math.random();
    }
    this.functionMap = {
      Quadratic: function(x) {
        return (x - 0.5) * (x - 0.5);
      },
      Polynomial: function(x) {
        var z = 7.5 * x - 4;
        return (z * z * z * z + z * z * z - 11 * z * z - 9 * z + 18) * 0.1;
      },
      Fourier: this.createFourierLambda(this.fourierCoef),
      Exponential: function(x) {
        var z = 5 * x;
        return z * Math.exp(-z);
      }
    };
  };

  this.buildFunction = function(samples) {
    var y = [];
    var minY = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;
    var aveY = 0;
    var f = this.functionMap[$("#function_sim2").val()];
    var h = 1.0 / (samples - 1);
    for (var i = 0; i < samples; i++) {
      var x = h * i;
      y[i] = f(x);
      minY = Math.min(minY, y[i]);
      maxY = Math.max(maxY, y[i]);
      aveY += y[i];
    }
    return {
      func: f,
      funcSamples: y,
      min: minY,
      max: maxY,
      avg: aveY / samples
    };
  };

  // function that do stuff with mouse coordinates
  this.baseMouse = function(integerMouse) {
    if (!this.isMouseDown) {
      return;
    }
    var mouse = this.canvasGraph.inverseTransform(integerMouse);
    this.cursor = Math.max(mouse[0], 0);
  };

  this.mouseStart = function(e) {
    this.isMouseDown = true;
  };

  this.mouseEnd = function(e) {
    this.isMouseDown = false;
  };

  this.mouseMove = function(e) {
    var rect = this.canvasGraph.canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    this.baseMouse([my, mx]);
  };

  this.touchStart = function(e) {
    this.isMouseDown = true;
  };

  this.touchEnd = function(e) {
    this.isMouseDown = false;
  };

  this.touchMove = function(e) {
    var rect = this.canvasGraph.canvas.getBoundingClientRect();
    var mx = e.touches[0].clientX - rect.left,
      my = e.touches[0].clientY - rect.top;
    this.baseMouse([my, mx]);
  };

  this.checkIfCanDraw = function() {
    return $("#sim2").is(":visible");
  };

  this.sliderUpdate = function() {
    var sliderValue = $("#h_slider").val();
    this.step = 1.0 / (100 - (sliderValue - 1));
    $("#h_sim").text("$ h = $" + this.step);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "h_sim"]);
  };

  this.selectUpdate = function() {
    this.updateFunctionMap();
    this.fx = this.buildFunction(this.samples);
  };

  this.drawSetup = function() {
    drawArrow(
      [-0.1, 0],
      [1, 0],
      this.canvasGraph,
      Canvas.simpleShader([0, 0, 0, 255])
    );
    drawArrow(
      [0, -0.1],
      [0, 1],
      this.canvasGraph,
      Canvas.simpleShader([0, 0, 0, 255])
    );
    this.canvasGraph.drawImage(this.xImg, [0.9, -0.01]);
    this.canvasGraph.drawImage(this.yImg, [-0.05, 0.9]);
  };

  this.drawCanvasGraph = function() {
    var h = 1.0 / (this.samples - 1);
    var epsilon = 0.2;
    var scale = (1 + epsilon) * (this.fx.max - this.fx.min);
    for (var i = 0; i < this.samples - 1; i++) {
      var zi = (this.fx.funcSamples[i] - this.fx.min) / scale;
      var zj = (this.fx.funcSamples[i + 1] - this.fx.min) / scale;
      var x = h * i;
      this.canvasGraph.drawLine(
        [x, zi],
        [x + h, zj],
        Canvas.simpleShader([0, 0, 255, 255])
      );
    }

    this.movingStep += (this.step - this.movingStep) * 0.01;

    var f = (this.fx.func(this.cursor) - this.fx.min) / scale;
    var fh =
      (this.fx.func(this.cursor + this.movingStep) - this.fx.min) / scale;

    this.canvasGraph.drawCircle(
      [this.cursor, f],
      this.circleRadius,
      Canvas.simpleShader([255, 0, 0, 255])
    );
    this.canvasGraph.drawCircle(
      [this.cursor + this.movingStep, fh],
      this.circleRadius,
      Canvas.simpleShader([255, 0, 0, 255])
    );

    var g = linearFunctor(
      [this.cursor, f],
      [this.cursor + this.movingStep, fh]
    );
    this.canvasGraph.drawLine(
      [-1, g(-1)],
      [1.5, g(1.5)],
      Canvas.simpleShader([0, 0, 0, 255])
    );

    var df = (fh - f) / this.movingStep;
    $("#df_sim").text("df = " + df.toFixed(3));
  };

  this.draw = function() {
    this.canvasGraph.clearImage([255, 255, 255, 255]);
    this.drawSetup();
    this.drawCanvasGraph();
    this.canvasGraph.paintImage();
  };

  this.start = function() {
    $("#sim2").slideDown();
    this.updateFunctionMap();
    //buildFunction depends on updateFunctionMap;
    this.fx = this.buildFunction(this.samples);
    this.sliderUpdate();
  };

  this.end = function() {
    $("#sim2").slideUp();
  };

  this.init = function() {
    this.canvasGraph.addEventListener(
      "touchstart",
      function(e) {
        apply(2, function(x) {
          x.touchStart(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "touchend",
      function(e) {
        apply(2, function(x) {
          x.touchEnd(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "touchmove",
      function(e) {
        apply(2, function(x) {
          x.touchMove(e);
        });
      },
      false
    );

    this.canvasGraph.addEventListener(
      "mousedown",
      function(e) {
        apply(2, function(x) {
          x.mouseStart(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "mouseup",
      function(e) {
        apply(2, function(x) {
          x.mouseEnd(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "mousemove",
      function(e) {
        apply(2, function(x) {
          x.mouseMove(e);
        });
      },
      false
    );
  };
}

function Sim3() {
  this.canvasGraph = new Canvas2D(
    document.getElementById("optimizationProblem"),
    [
      [-0.1, 1],
      [-0.5, 1]
    ]
  );
  this.isMouseDown = false;
  this.circleRadius = 0.01;
  this.fx = [];
  this.measurementsSamples = 20;
  this.measurements = [];
  this.trueMeasure = 0.5;
  this.samples = 100;
  this.cursor = 0.5;
  this.step = 0.01;

  this.costFunction = function(mu) {
    var acc = 0;
    for (var i = 0; i < this.measurementsSamples; i++) {
      var diff = mu - this.measurements[i];
      acc += diff * diff;
    }
    return acc;
  };

  this.buildFunction = function(samples) {
    var y = [];
    var minY = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;
    var aveY = 0;
    var h = 1.0 / (samples - 1);
    for (var i = 0; i < samples; i++) {
      var x = h * i;
      y[i] = this.costFunction(x);
      minY = Math.min(minY, y[i]);
      maxY = Math.max(maxY, y[i]);
      aveY += y[i];
    }
    return { funcSamples: y, min: minY, max: maxY, avg: aveY / samples };
  };

  this.generateMeasurementSamples = function() {
    var epsilon = this.step;
    this.trueMeasure = Math.random();
    for (var i = 0; i < this.measurementsSamples; i++) {
      var noise = this.step * (-1 + 2 * Math.random());
      this.measurements[i] = this.trueMeasure + noise;
    }
    this.fx = this.buildFunction(this.samples);
  };

  // function that do stuff with mouse coordinates
  this.baseMouse = function(integerMouse) {
    if (!this.isMouseDown) {
      return;
    }
    var mouse = this.canvasGraph.inverseTransform(integerMouse);
    this.cursor = Math.max(mouse[0], 0);
  };

  this.mouseStart = function(e) {
    this.isMouseDown = true;
  };

  this.mouseEnd = function(e) {
    this.isMouseDown = false;
  };

  this.mouseMove = function(e) {
    var rect = this.canvasGraph.canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    this.baseMouse([my, mx]);
  };

  this.touchStart = function(e) {
    this.isMouseDown = true;
  };

  this.touchEnd = function(e) {
    this.isMouseDown = false;
  };

  this.touchMove = function(e) {
    var rect = this.canvasGraph.canvas.getBoundingClientRect();
    var mx = e.touches[0].clientX - rect.left,
      my = e.touches[0].clientY - rect.top;
    this.baseMouse([my, mx]);
  };

  this.checkIfCanDraw = function() {
    return $("#sim3").is(":visible");
  };

  this.sliderUpdate = function() {
    var sliderValue = $("#epsilon_slider").val();
    this.step = 0.01 + (0.99 / 99) * (sliderValue - 1);
    $("#epsilon_sim").text("$ \\tau = $" + this.step.toFixed(3));
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "epsilon_sim"]);
  };

  this.drawCanvasGraph = function() {
    this.canvasGraph.drawLine(
      [-0.2, 0],
      [1.2, 0.0],
      Canvas.simpleShader([0, 0, 0, 255])
    );

    var h = 1.0 / (this.samples - 1);
    var scale = this.fx.max - this.fx.min;
    scale = scale == 0 ? 1.0 : scale;
    for (var i = 0; i < this.samples - 1; i++) {
      var zi = (this.fx.funcSamples[i] - this.fx.min) / scale;
      var zj = (this.fx.funcSamples[i + 1] - this.fx.min) / scale;
      var x = h * i;
      this.canvasGraph.drawLine(
        [x, zi],
        [x + h, zj],
        Canvas.simpleShader([0, 0, 255, 255])
      );
    }

    for (var i = 0; i < this.measurementsSamples; i++) {
      this.canvasGraph.drawCircle(
        [this.measurements[i], 0.0],
        this.circleRadius,
        Canvas.simpleShader([0, 0, 0, 255])
      );
    }

    this.canvasGraph.drawCircle(
      [this.trueMeasure, 0.0],
      this.circleRadius,
      Canvas.simpleShader([0, 255, 0, 255])
    );

    var cost = (this.costFunction(this.cursor) - this.fx.min) / scale;
    this.canvasGraph.drawCircle(
      [this.cursor, cost],
      this.circleRadius,
      Canvas.simpleShader([255, 0, 0, 255])
    );
    this.canvasGraph.drawCircle(
      [this.cursor, 0],
      this.circleRadius,
      Canvas.simpleShader([255, 0, 0, 255])
    );

    $("#cost_sim").text("C = " + cost.toFixed(3));
  };

  this.draw = function() {
    this.canvasGraph.clearImage([255, 255, 255, 255]);
    this.drawCanvasGraph();
    this.canvasGraph.paintImage();
  };

  this.start = function() {
    $("#sim3").slideDown();
    this.sliderUpdate();
    this.generateMeasurementSamples();
  };

  this.end = function() {
    $("#sim3").slideUp();
  };

  this.init = function() {
    this.canvasGraph.addEventListener(
      "touchstart",
      function(e) {
        apply(3, function(x) {
          x.touchStart(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "touchend",
      function(e) {
        apply(3, function(x) {
          x.touchEnd(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "touchmove",
      function(e) {
        apply(2, function(x) {
          x.touchMove(e);
        });
      },
      false
    );

    this.canvasGraph.addEventListener(
      "mousedown",
      function(e) {
        apply(3, function(x) {
          x.mouseStart(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "mouseup",
      function(e) {
        apply(3, function(x) {
          x.mouseEnd(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "mousemove",
      function(e) {
        apply(3, function(x) {
          x.mouseMove(e);
        });
      },
      false
    );
  };
}

function Sim4() {
  this.tImg = ImageIO.loadImage("static/t.png");
  this.yImg = ImageIO.loadImage("static/y.png");
  this.canvasGraph = new Canvas2D(document.getElementById("eulerAlgorithm"), [
    [-0.1, 1.1],
    [-0.1, 1.1]
  ]);
  this.isMouseDown = false;
  this.circleRadius = 0.01;
  this.fx = [];
  this.samples = 25;
  this.step = 0.01;
  this.maxAmp = 10;
  this.bandwidth = 5;
  this.ys = [];

  this.generateField = function(w) {
    return function(x) {
      var acc = 0;
      var mul = 1;
      for (var i = 0; i < w.length; i++) {
        acc += mul * w[i] * Math.sin(i * (1.0 / mul) * x);
        mul /= 2;
      }
      return acc;
    };
  };

  this.buildFunction = function(samples) {
    var w = [];
    for (var i = 0; i < this.bandwidth; i++) {
      w[i] = -this.maxAmp + 2 * this.maxAmp * Math.random();
    }
    var f = this.generateField(w);
    var y = [];
    var minY = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;
    var aveY = 0;
    var h = 1.0 / (samples - 1);
    for (var i = 0; i < samples; i++) {
      var x = h * i;
      y[i] = f(x);
      minY = Math.min(minY, y[i]);
      maxY = Math.max(maxY, y[i]);
      aveY += y[i];
    }
    return {
      func: f,
      funcSamples: y,
      min: minY,
      max: maxY,
      avg: aveY / samples
    };
  };

  // function that do stuff with mouse coordinates
  this.baseMouse = function(integerMouse) {
    if (!this.isMouseDown) {
      return;
    }
    var mouse = this.canvasGraph.inverseTransform(integerMouse);
    this.ys.push([mouse]);
  };

  this.mouseStart = function(e) {
    var rect = this.canvasGraph.canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    this.isMouseDown = true;
    this.baseMouse([my, mx]);
  };

  this.mouseEnd = function(e) {
    this.isMouseDown = false;
  };

  this.mouseMove = function(e) {
    var rect = this.canvasGraph.canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
  };

  this.touchStart = function(e) {
    var rect = this.canvasGraph.canvas.getBoundingClientRect();
    var mx = e.touches[0].clientX - rect.left,
      my = e.touches[0].clientY - rect.top;
    this.isMouseDown = true;
    this.baseMouse([my, mx]);
  };

  this.touchEnd = function(e) {
    this.isMouseDown = false;
  };

  this.touchMove = function(e) {
    var rect = this.canvasGraph.canvas.getBoundingClientRect();
    var mx = e.touches[0].clientX - rect.left,
      my = e.touches[0].clientY - rect.top;
  };

  this.checkIfCanDraw = function() {
    return $("#sim4").is(":visible");
  };

  this.sliderUpdate = function() {
    var sliderValue = $("#euler_slider").val();
    this.step = 0.01 + (0.1 / 99) * (sliderValue - 1);
    $("#euler_step").text("$ h = $" + this.step.toFixed(3));
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "euler_step"]);
  };

  this.drawCanvasGraph = function() {
    drawArrow(
      [-0.1, 0],
      [1, 0],
      this.canvasGraph,
      Canvas.simpleShader([0, 0, 0, 255])
    );
    drawArrow(
      [0, -0.1],
      [0, 1],
      this.canvasGraph,
      Canvas.simpleShader([0, 0, 0, 255])
    );
    this.canvasGraph.drawImage(this.tImg, [0.9, -0.01]);
    this.canvasGraph.drawImage(this.yImg, [-0.05, 0.9]);

    // draw tangent field
    var h = 1.0 / this.samples;
    for (var j = 0; j < this.fx.funcSamples.length; j++) {
      for (var i = 0; i < this.fx.funcSamples.length; i++) {
        var x = h * i;
        var y = h * j;
        var m = this.fx.funcSamples[i];
        var epsilon = h / 10;
        this.canvasGraph.drawLine(
          [x - epsilon, y - m * epsilon],
          [x + epsilon, y + m * epsilon],
          Canvas.simpleShader([0, 0, 255, 255])
        );
      }
    }

    var colorDegree = this.ys.length;
    for (var k = 0; k < this.ys.length; k++) {
      var integralCurve = this.ys[k];
      var n = integralCurve.length;
      if (integralCurve[n - 1][0] < 1.0) {
        integralCurve[n] = [
          integralCurve[n - 1][0] + this.step,
          integralCurve[n - 1][1] +
            this.fx.func(integralCurve[n - 1][0]) * this.step
        ];
      }
      var color = 1 - (1 / (2 * (colorDegree - 1))) * k;
      for (var l = 0; l < n - 1; l++) {
        this.canvasGraph.drawLine(
          integralCurve[l],
          integralCurve[l + 1],
          Canvas.simpleShader([255 * color, 0, 0, 255])
        );
      }
    }
  };

  this.draw = function() {
    this.canvasGraph.clearImage([255, 255, 255, 255]);
    this.drawCanvasGraph();
    this.canvasGraph.paintImage();
  };

  this.start = function() {
    $("#sim4").slideDown();
    this.sliderUpdate();
    this.fx = this.buildFunction(this.samples);
  };

  this.generateNewField = function() {
    this.fx = this.buildFunction(this.samples);
  };

  this.clearIntegralCurves = function() {
    this.ys = [];
  };

  this.end = function() {
    $("#sim4").slideUp();
  };

  this.init = function() {
    this.canvasGraph.addEventListener(
      "touchstart",
      function(e) {
        apply(4, function(x) {
          x.touchStart(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "touchend",
      function(e) {
        apply(4, function(x) {
          x.touchEnd(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "touchmove",
      function(e) {
        apply(4, function(x) {
          x.touchMove(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "mousedown",
      function(e) {
        apply(4, function(x) {
          x.mouseStart(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "mouseup",
      function(e) {
        apply(4, function(x) {
          x.mouseEnd(e);
        });
      },
      false
    );
    this.canvasGraph.addEventListener(
      "mousemove",
      function(e) {
        apply(4, function(x) {
          x.mouseMove(e);
        });
      },
      false
    );
  };
}

/**
 * Simulation Management
 */

var simulations = [new Sim0(), new Sim1(), new Sim2(), new Sim3(), new Sim4()];

var simManagerBuilder = SimManager.builder();

for (var i = 0; i < simulations.length; i++) {
  simManagerBuilder.push(simulations[i]);
}

var simManager = simManagerBuilder.build();

function runSimulation(index) {
  simManager.runSimulation(index);
}

function apply(index, lambda) {
  simManager.apply(index, lambda);
}

simManager.init();

module.exports = {
  run: runSimulation,
  apply: apply
};
