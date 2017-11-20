var ImageIO = function() {
    // empty constructor
};

ImageIO.getDataFromImage = function(img) {
    var canvasAux = document.createElement('canvas');
    canvasAux.width = img.width;
    canvasAux.height = img.height;
    var contextAux = canvasAux.getContext('2d');
    contextAux.fillStyle = 'rgba(0, 0, 0, 0)';
    contextAux.globalCompositeOperation = 'source-over';
    contextAux.fillRect(0, 0, canvasAux.width, canvasAux.height);
    contextAux.drawImage(img, 0 ,0);
    return contextAux.getImageData(0, 0, img.width, img.height);
};

ImageIO.loadImage= function(src) {
    var img = new Image();
    img.src = src;
    img.isReady = false;
    img.onload = function() {
        img.isReady = true;
    };
    return img;
};

module.exports = ImageIO;