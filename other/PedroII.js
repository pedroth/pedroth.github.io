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
    function getDataFromImage(img) {
            var canvasAux = document.createElement('canvas');
            canvasAux.width = img.width;
            canvasAux.height = img.height;
            var contextAux = canvasAux.getContext('2d');
            contextAux.fillStyle = 'rgba(0, 0, 0, 0)';
            contextAux.globalCompositeOperation = 'source-over';
            contextAux.fillRect(0, 0, canvas.width, canvas.height);
            contextAux.drawImage(img, 0 ,0);
            return contextAux.getImageData(0, 0, img.width, img.height);
    }

    function loadImage(src) {
            var img = new Image();
            img.src = src;
            img.isReady = false;
            img.onload = function() {
                img.isReady = true;
                img.data = getDataFromImage(img).data;
            };
            return img;
    }


    /**
    * My math
    **/
    function clamp(x, xmin, xmax) {
        return Math.max(xmin, Math.min(xmax, x));
    }

    /**
     * 2D vectors
     * 
     * */
    var zeros = function() {
        var ans = [];
        ans[0] = 0;
        ans[1] = 0;
        return ans;
    };

    var add = function(u, v) {
        var ans = [];
        ans[0] = u[0] + v[0];
        ans[1] = u[1] + v[1];
        return ans;
    };

    var diff = function(u, v) {
        var ans = [];
        ans[0] = u[0] - v[0];
        ans[1] = u[1] - v[1];
        return ans;
    };

    var scalarMult = function(s, v) {
        var ans = [];
        ans[0] = s * v[0];
        ans[1] = s * v[1];
        return ans;
    };

    var innerProd = function(u, v) {
        return u[0] * v[0] + u[1] * v[1];
    };

    var squaredNorm = function(v) {
        return innerProd(v, v);
    };

    var myNorm = function(v) {
        return Math.sqrt(squaredNorm(v));
    };

    var normalize = function(v) {
        if (v[0] !== 0.0 && v[1] !== 0.0) {
            return scalarMult(1 / myNorm(v), v);
        } else {
            return v;
        }
    };

    /**
     * project u on v
     * */

    var proj = function(u, v) {
        var aux = normalize(v);
        var dot = innerProd(u, v);
        return scalarMult(dot, aux);
    };

    var pointWise = function(u, v) {
        var ans = [];
        ans[0] = u[0] * v[0];
        ans[1] = u[1] * v[1];
        return ans;
    };

    /**
     * return product between the matrix formed by (u,v) and x;
     * */

    var matrixProd = function(u, v, x) {
        return add(add(scalarMult(x[0], u), scalarMult(x[1], v)));
    };

    var floor = function(v) {
        var ans = [];
        ans[0] = Math.floor(v[0]);
        ans[1] = Math.floor(v[1]);
        return ans;
    }

    /**
     * end vectors
     * */

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
        mouse = zeros();
    }

    init();

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

    function getImageIndex(x, size) {
        return 4 * (size[0] *  x[0] + x[1]);
    }

    function alphaCorrection(c0,c1) {
        var finalC = [];
        alpha0 = c0[3] / 255;
        alpha1 = c1[3] / 255;
        var norm = alpha0 + alpha1 * (1 - alpha0);
        finalC[0] = (alpha0 * c0[0] + c1[0] * alpha1 * (1 - alpha0)) / norm;
        finalC[1] = (alpha0 * c0[1] + c1[1] * alpha1 * (1 - alpha0)) / norm;
        finalC[2] = (alpha0 * c0[2] + c1[2] * alpha1 * (1 - alpha0)) / norm;
        finalC[3] = (alpha0 * c0[3] + c1[3] * alpha1 * (1 - alpha0)) / norm;
        return finalC;
    }

    function myAlphaCorrection(c0,c1) {
        alpha = c1[3];
        if(alpha < 255) {
            return c0;
        }
        return c1;
    }

    /**
    * x is a vector
    * size is a vector where x-coord is width and y-coord is height
    */
    function getPxlData(x, data, size) {
        var rgba = [];
        var index = getImageIndex(x, size);
        rgba[0] = data[index    ];
        rgba[1] = data[index + 1];
        rgba[2] = data[index + 2];
        rgba[3] = data[index + 3];
        return rgba;
    }

    function drawPxl(x, data, rgb) {
        var size = [width, height];
        var index = getImageIndex(x, size);
        data[index    ] = rgb[0];
        data[index + 1] = rgb[1];
        data[index + 2] = rgb[2];
        data[index + 3] = rgb[3];
    }

    function drawPxlAlpha(x, data, rgb) {
        var size = [width, height];
        var index = getImageIndex(x, size);
        var backRgb = getPxlData(x, data, size);
        var alphaColor = myAlphaCorrection(backRgb,rgb);
        data[index    ] = alphaColor[0];
        data[index + 1] = alphaColor[1];
        data[index + 2] = alphaColor[2];
        data[index + 3] = alphaColor[3];
    }

    function drawLine(x1, x2, data, rgb) {

        x1 = floor(x1);
        x2 = floor(x2);

        var size = 1;
        var x = [];
        x[0] = x1[0];
        x[1] = x1[1];

        var normal = diff(x2, x1);
        var temp = normal[0];
        normal[0] = -normal[1];
        normal[1] = temp;

        var imin = zeros();
        var oldi = zeros();
        var fmin = Number.MAX_VALUE;

        drawPxl(x,data,rgb)

        while (x[0] !== x2[0] || x[1] !== x2[1]) {

            var maxShade = -1;

            for ( var i = -size; i < size + 1; i++) {
                for ( var j = -size; j < size + 1; j++) {

                    var nextX = add(x, [ i, j ]);
                    var shadePow = Math.abs(innerProd(diff(nextX, x1), normal)); 
                    var res = shadePow + Math.abs(nextX[0] - x2[0]) + Math.abs(nextX[1] - x2[1]);

                    if ((i === 0 && j === 0) || (i === oldi[0] && j === oldi[1]) || (Math.abs(i) > 1 || Math.abs(j) > 1)) {
                        // nothing here
                    } else {
                        if (fmin > res) {
                            fmin = res;
                            imin = [ i, j ];
                        }
                    }
                }
            }

            fmin = Number.MAX_VALUE;

            oldi[0] = -imin[0];
            oldi[1] = -imin[1];

            x = add(x, imin);
            drawPxl(x,data,rgb)
        }
    }

    /**
    * x is a vector
    * size is a vector where x-coord is width and y-coord is height
    */
    function drawImageData(dataIn, dataOut, x, sizeOut, transform) {
        var imin = Math.max(0,x[0]);
        var jmin = Math.max(0,x[1]);
        var imax = Math.min(height, x[0] + sizeOut[1]);
        var jmax = Math.min(width , x[1] + sizeOut[0]);
    	for (var i = imin; i <= imax; i++) {
    		for(var j = jmin; j <= jmax; j++) {
              var point = [i,j];
              var pointTrans = transform([i-imin, j-jmin]);
              drawPxlAlpha(point, dataIn, getPxlData(pointTrans, dataOut, sizeOut));
    		}
    	}
    }

    function draw() {
        var dt = 1E-3 * (new Date().getTime() - startTime);
        startTime = new Date().getTime();
        time += dt;

        var image, data;

        ctx.fillStyle = 'rgba(0.1, 0.1, 0.1, 1.0)';
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        data = image.data;
        /**
         * drawing and animation
         **/
        drawLine([0,0], mouse, data, [255,0,0,255]);
        
        var t = (time % (numOfFrames / fps));
        var animationIndex = Math.floor(fps * t);
        var animationFrame = animationImg[animationIndex];
        //console.log("t: " + t + "\t" + "index: " + animationIndex + "\t" + "isReady:" + animationFrame.isReady);
        if(animationFrame.isReady) {
            var imageSize = [animationFrame.width, animationFrame.height];
            drawImageData(data, animationFrame.data, mouse, imageSize,
            function(x) {
                return [x[0], imageSize[0] - x[1]];    
            });
            ctx.putImageData(image, 0, 0);
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

    requestAnimationFrame(draw);