const Canvas = require("../main/Canvas.js");
const Canvas2D = require("../main/Canvas2D.js");
const ImageIO = require("../main/ImageIO.js");
const Choice = require("../../Choice/main/Choice.js");
const SimManager = require("../../SimManager/main/SimManager.js");

function randomVector(a, b) {
  return [a + (b - a) * Math.random(), a + (b - a) * Math.random()];
}

function giveMeLine(a, u) {
  const points = [];
  points.push([a[0] + u[0], a[1] + u[1]]);
  points.push([a[0] - u[0], a[1] - u[1]]);
  return points;
}

function invertVector(init, v, t) {
  const ans = [];
  ans[0] = init[0] + v[0] * (1 - t) + v[0] * t;
  ans[1] = init[1] + v[1] * (1 - t) - v[1] * t;
  return ans;
}

const f = Canvas.simpleShader([0, 255, 0, 255]);
const g = Canvas.simpleShader([0, 0, 255, 255]);
const r = Canvas.simpleShader([255, 0, 0, 255]);

const Test1 = function(divName) {
  this.divName = divName;
  this.canvasLines = new Canvas2D(document.getElementById("canvasLines"), [
    [-1, 1],
    [-1, 1]
  ]);
  this.isFirstIte = true;

  this.a = [-1, 1];
  this.v = [0.1, 0.1];
  this.n = [1, -1];
  this.speed = 0.01;
  this.points = giveMeLine(this.a, this.v);

  this.colorInterShader = function(x, line, canvas, t) {
    const c1 = [0, 0, 0, 255];
    const c2 = [255, 255, 255, 255];
    const gradient = [
      c2[0] - c1[0],
      c2[1] - c1[1],
      c2[2] - c1[2],
      c2[3] - c1[3]
    ];
    canvas.drawPxl(x, [
      c1[0] + gradient[0] * t,
      c1[1] + gradient[1] * t,
      c1[2] + gradient[2] * t,
      c1[3] + gradient[3] * t
    ]);
  };

  this.update = function() {
    if (this.isFirstIte) {
      const samples = 100;
      for (let i = 0; i < samples; i++) {
        const first = randomVector(-1, 1);
        const second = randomVector(-1, 1);
        this.canvasLines.drawLine(first, second, f);
      }

      for (let i = 0; i < samples; i++) {
        const first = randomVector(-3, 3);
        const second = randomVector(-3, 3);
        this.canvasLines.drawLine(first, second, g);
      }

      this.canvasLines.drawLine([0, 0], [2, 2], r);
      this.canvasLines.drawLine(
        [0, 0],
        [-2, -2],
        Canvas.interpolateLineShader(this.colorInterShader)
      );
      this.canvasLines.paintImage();
      this.isFirstIte = false;
    } else {
      this.canvasLines.drawLine(
        this.points[0],
        this.points[1],
        Canvas.interpolateLineShader(this.colorInterShader)
      );

      this.points[0] = [
        this.points[0][0] + this.speed * this.n[0],
        this.points[0][1] + this.speed * this.n[1]
      ];
      this.points[1] = [
        this.points[1][0] + this.speed * this.n[0],
        this.points[1][1] + this.speed * this.n[1]
      ];

      this.canvasLines.paintImage();
    }
  };
};

const Test2 = function(divName) {
  this.divName = divName;
  this.canvasPoints = new Canvas(document.getElementById("canvasPoints"));
  this.i = 0;
  this.j = 0;
  this.t = 0;
  this.img = ImageIO.loadImage("resources/R.png");

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
    const sizePoints = this.canvasPoints.getSize();
    this.i = this.t % sizePoints[0];
    this.j = Math.floor(this.t / sizePoints[0]);
  };
};

const Test3 = function(divName) {
  this.divName = divName;
  this.triangleShader = Canvas.colorShader([
    [255, 0, 0, 255],
    [0, 255, 0, 255],
    [0, 0, 255, 255]
  ]);
  this.canvasTriangles = new Canvas(document.getElementById("canvasTriangles"));
  this.samples = 25;
  this.avgTime = 0;
  this.ite = this.samples;

  const size = this.canvasTriangles.getSize();
  this.animeTriangle = [
    randomVector(0, size[0]),
    randomVector(0, size[0]),
    randomVector(0, size[0])
  ];
  this.average = [0, 0];
  this.diff = [];
  for (let k = 0; k < this.animeTriangle.length; k++) {
    this.average[0] += this.animeTriangle[k][0];
    this.average[1] += this.animeTriangle[k][1];
  }
  this.average[0] /= 3;
  this.average[1] /= 3;
  for (let k = 0; k < this.animeTriangle.length; k++) {
    this.diff[k] = [
      this.animeTriangle[k][0] - this.average[0],
      this.animeTriangle[k][1] - this.average[1]
    ];
  }
  this.animeCircle = randomVector(0, size[0]);

  this.t = 0;

  this.update = function() {
    const size = this.canvasTriangles.getSize();

    if (this.ite > 0) {
      this.canvasTriangles.drawLine(
        [0, Math.floor(size[0] / 10)],
        [size[1], Math.floor(size[0] / 10)],
        r
      );
      this.canvasTriangles.drawLine(
        [Math.floor(size[1] / 10), 0],
        [Math.floor(size[1] / 10), size[0]],
        g
      );
      this.canvasTriangles.drawLine([0, 0], [size[0] - 1, size[1] - 1], f);

      const first = randomVector(0, size[0]);
      const second = randomVector(0, size[0]);
      const third = randomVector(0, size[0]);
      const time = new Date().getTime();
      this.canvasTriangles.drawTriangle(first, second, third, g);

      this.avgTime += (new Date().getTime() - time) / 1000;
      this.canvasTriangles.paintImage();
      this.ite--;
      if (this.ite == 0) console.log(this.avgTime / this.samples);
    } else {
      this.canvasTriangles.clearImage([250, 250, 250, 255]);
      const sin = Math.sin(this.t / (2 * Math.PI * 10));
      const sinsin = sin * sin;
      this.canvasTriangles.drawTriangle(
        invertVector(this.average, this.diff[0], sinsin),
        invertVector(this.average, this.diff[1], sinsin),
        invertVector(this.average, this.diff[2], sinsin),
        this.triangleShader
      );

      this.canvasTriangles.drawCircle(
        this.animeCircle,
        sinsin * size[0] * 0.25,
        g
      );

      this.t++;
      this.canvasTriangles.paintImage();
    }
  };
};

const Test4 = function(divName) {
  this.divName = divName;
  this.canvasTexture = new Canvas2D(document.getElementById("canvasTexture"), [
    [-1, 1],
    [-1, 1]
  ]);
  this.oldTime = new Date().getTime();

  this.texture = ImageIO.loadImage("resources/R.png");
  this.t = 0;
  this.quad = [[-0.25, -0.25], [0.45, -0.25], [0.25, 0.45], [-0.25, 0.25]];

  this.shader = new Choice(
    Canvas.quadTextureShader(this.texture, [[0, 0], [1, 0], [1, 1], [0, 1]]),
    Canvas.simpleShader([255, 0, 255, 255]),
    ImageIO.generateImageReadyPredicate(this.texture)
  );

  this.update = function() {
    const dt = 1e-3 * (new Date().getTime() - this.oldTime);
    this.oldTime = new Date().getTime();

    this.canvasTexture.clearImage([0, 0, 0, 255]);

    this.canvasTexture.drawString([-0.95, 0.9], "FPS : " + 1 / dt, function(
      ctx
    ) {
      ctx.fillStyle = "white";
      ctx.font = "bold 16px Arial";
    });

    const cos = Math.cos(3 * this.t);
    const coscos = 0.5 * cos * cos;

    const transformQuad = [];
    for (let i = 0; i < this.quad.length; i++) {
      transformQuad.push([coscos * this.quad[i][0], coscos * this.quad[i][1]]);
    }

    this.canvasTexture.drawQuad(
      transformQuad[0],
      transformQuad[1],
      transformQuad[2],
      transformQuad[3],
      this.shader.get()
    );
    this.t += dt;
    this.canvasTexture.paintImage();
  };
};

/*
 * Main
 */
const tests = [
  new Test1("test1"),
  new Test2("test2"),
  new Test3("test3"),
  new Test4("test4")
];

const simManagerBuilder = SimManager.builder();
for (let i = 0; i < tests.length; i++) {
  simManagerBuilder.push(
    SimManager.simulatorBuilder()
      .addBaseSimulator(tests[i])
      .checkIfCanDraw(x => $(`#${x.divName}`).is(":visible"))
      .draw(x => x.update())
      .start(x => $(`#${x.divName}`).slideDown())
      .end(x => $(`#${x.divName}`).slideUp())
      .build()
  );
}

const simManager = simManagerBuilder.build();

function run(index) {
  simManager.runSimulation(index);
}

module.exports.default = {
  run: run
};