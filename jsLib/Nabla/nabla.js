let Canvas = require("./Canvas/main/Canvas.js");
let Canvas2D = require("./Canvas/main/Canvas2D.js");
let ImageIO = require("./Canvas/main/ImageIO.js");
let Stream = require("./Stream/main/Stream.js");

let Nabla = {};
Nabla.Canvas = Canvas;
Nabla.Canvas2D = Canvas2D;
Nabla.ImageIO = ImageIO;
Nabla.Stream = Stream;

module.exports.default = Nabla;
