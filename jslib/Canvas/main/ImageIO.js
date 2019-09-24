var ImageIO = {
    // empty object
};

/**
 * img : html image
 */
ImageIO.getImageCanvas = function(img) {
    var canvasAux = document.createElement('canvas');
    canvasAux.width = img.width;
    canvasAux.height = img.height;
    var contextAux = canvasAux.getContext('2d');
    contextAux.fillStyle = 'rgba(0, 0, 0, 0)';
    contextAux.globalCompositeOperation = 'source-over';
    contextAux.fillRect(0, 0, canvasAux.width, canvasAux.height);
    contextAux.drawImage(img, 0 ,0);
    return canvasAux;
}

/**
 * img : html image
 */
ImageIO.getDataFromImage = function(img) {
    canvas = ImageIO.getImageCanvas(img);
    return canvas.getContext('2d').getImageData(0 , 0, img.width, img.height);
};

ImageIO.loadImage = function(src) {
    var img = new Image();
    img.src = src;
    img.isReady = false;
    img.onload = () => img.isReady = true;
    return img;
};

ImageIO.generateImageReadyPredicate = function(img) {
    return () => img.isReady;
}

module.exports = ImageIO;