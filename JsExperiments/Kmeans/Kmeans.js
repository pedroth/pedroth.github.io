/*
 *  Setup
 */
var canvas = document.getElementById('canvas');
var canvasVideo = document.getElementById('canvasVideo');
var ctx = canvas.getContext('2d');
var ctxVideo = canvasVideo.getContext('2d');

var down = false;

var startTime;

var width, height;

var mouse;

//video vars
var video = document.getElementById("video");
var videoObj = { "video": true };
var handleVideo = function handleVideo(stream) { video.src = window.URL.createObjectURL(stream);}
var errBack = function(error) { console.log("Video capture error: ", error.code);};

var numberOfCluster = document.getElementById('numOfClusters').value;

var clusters = [];
var phi = [];
var sigmas = [];

var numOfStates = 4;
var clustersState = [];

var numOfSamples = Math.floor(canvas.width * canvas.height * ( parseInt(document.getElementById('alpha').value) / 100.0));

var averageColor = [0,0,0];

var time = 0;

var isLearning = true;

var memoryData = [];
var maxDataFrames = 1;
var memoryIndex = 0;

/*
 * Utils
 */

function max(v) {
    var maximum = Number.MIN_VALUE;
    var maxIndex = -1;
    for (var i = 0; i < v.length; i++) {
        if(maximum < v[i]) {
            maximum = v[i];
            maxIndex = i;
        }
    }
    return [maximum, maxIndex];
}

function powInt(x,i) {
  if(i === 0) {
    return 1;
  } else if(i === 1) {
    return x;
  } else {
    var q = Math.floor(i/2);
    var r = i % 2;
    if(r === 0) {
      return powInt(x * x,q);
    } else {
      return x * powInt(x * x,q);
    }
  }
}

function clamp(x, xmin, xmax) {
    return Math.max(xmin, Math.min(x, xmax));
}

function buildRow(name, rgb, clusterId) {
    rgb[0] = Math.floor(rgb[0]);
    rgb[1] = Math.floor(rgb[1]);
    rgb[2] = Math.floor(rgb[2]);
    
    var row = document.createElement('tr');
    
    var nameCol = document.createElement('td');
    nameCol.innerHTML = name;
    row.appendChild(nameCol);
    
    var colorCol = document.createElement('td');
    colorCol.innerHTML = rgb;
    colorCol.style.background="rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    colorCol.style.color="rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    colorCol.id = "cluster"+clusterId;
    row.appendChild(colorCol);
    
    var layerCol = document.createElement('td');
    var auxButton = document.createElement('input');
    auxButton.setAttribute("type", "button");
    layerCol.appendChild(auxButton);
    auxButton.value = clusterId == -1 ? "" : clustersState[clusterId];
    auxButton.numId = clusterId;
    auxButton.onclick = function() {
        if(this.numId == -1) {
            //do nothing
        } else {
            clustersState[this.numId] = (clustersState[this.numId] + 1) % numOfStates;
            this.value = "" + clustersState[this.numId];
        }
    };
    row.appendChild(layerCol);
    
    return row;
}

function buildRowSoft(name, rgb) {
    rgb[0] = Math.floor(rgb[0]);
    rgb[1] = Math.floor(rgb[1]);
    rgb[2] = Math.floor(rgb[2]);
    $("#" + name).css('background', 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')');
    $("#" + name).css('color', 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')');
}

function updateTableSoft() {
    buildRowSoft("cluster-1", averageColor);
    for (var i = 0; i < clusters.length; i++) {
        buildRowSoft("cluster" + i, clusters[i]);
    }
}

function updateTable() {
    var table = document.getElementById('clusterTable');
    var n = table.childNodes.length;
    for(var i = 0; i < n; i++) {
        table.removeChild(table.childNodes[0]);
    }

    table.appendChild(buildRow("average", averageColor, -1));
    for(var i = 0; i < clusters.length; i++) {
        table.appendChild(buildRow("cluster " + i, clusters[i], i));
    }
}

function getImageIndex(x, size) {
    return 4 * (size[0] *  x[0] + x[1]);
}

/*
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

/*
 * 3D vectors
 */
function vec3(x,y,z) {
    var ans = [];
    ans[0] = x;
    ans[1] = y;
    ans[2] = z;
    return ans;
}

var add = function(u,v) {
 var ans = [];
 ans[0] = u[0] + v[0];
 ans[1] = u[1] + v[1];
 ans[2] = u[2] + v[2];
 return ans;
};

var diff = function(u,v) {
 var ans = [];
 ans[0] = u[0] - v[0];
 ans[1] = u[1] - v[1];
 ans[2] = u[2] - v[2];
 return ans;
};

var scalarMult = function(s,v) {
 var ans = [];
 ans[0] = s * v[0];
 ans[1] = s * v[1];
 ans[2] = s * v[2];
 return ans;
};

var squaredNorm = function(v) {
 return v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
};

var myNorm = function(v) {
 return Math.sqrt(squaredNorm(v));
};

var myPNorm = function(v,p) {
    return powInt(v[0],p) + powInt(v[1],p) + powInt(v[2],p);
}

var normalize = function(v) {
 if(v[0] !== 0.0 && v[1] !== 0.0 && v[2] !== 0.0){
   return scalarMult(1 / myNorm(v), v);  
 } else {
    return v; 
 }
};

var innerProd = function(u,v) {
 return u[0]*v[0] + u[1]*v[1] + u[2]*v[2];
};
/**
* return product between the matrix formed by (u,v,w) and x;
* */
var matrixProd = function(u,v,w,x) {
 return add(add(scalarMult(x[0],u),scalarMult(x[1],v)),scalarMult(x[2],w));
}; 


/**
 *  Init
 **/
function initNumOfSamples() {
    var alpha = parseInt(document.getElementById('alpha').value);
    var alpha = alpha / 100.0;
    numOfSamples = Math.floor(canvas.width * canvas.height * alpha);
    document.getElementById('alphaValue').innerHTML = "" + alpha;
}

function initClusters() {
    clusters = [];
    for(var i = 0; i < numberOfCluster; i++) {
        clusters[i] = vec3(255 * Math.random(), 255 * Math.random(), 255 * Math.random());
        clustersState[i] = 1;
        sigmas[i] = 255 * Math.random();
        phi[i] = (1.0 / numOfClusters);
    }
}


function updateNumberOfClusters() {
    numberOfCluster = document.getElementById('numOfClusters').value;
    initClusters();
    updateTable();
}

function init() {    
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    document.addEventListener("keydown", keyDown, false);

    startTime = new Date().getTime();

    width = canvas.width;
    height = canvas.height;

    mouse = [0,0];

    // Video setup : Put video listeners into place
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
 
    if (navigator.getUserMedia) {       
        navigator.getUserMedia({video: true}, handleVideo, errBack);
    }

    initClusters();
    updateTable();
}

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

function samplingData(data, numOfSamples) {
    var size = [data.width, data.height];
    for(var i = 0; i < numOfSamples; i++) {
        var x = [Math.floor(Math.random() * size[1]), Math.floor(Math.random() * size[0])];
        var rgba = getPxlData(x,data.data, size);
        memoryData[memoryIndex++] = vec3(rgba[0], rgba[1], rgba[2]);
        memoryIndex = memoryIndex % (numOfSamples * maxDataFrames);
    }
    return memoryData;
}

// KMeans
function classifyData(x) {
    var kIndex = -1;
    var minDistance = Number.MAX_VALUE;
    for(var i = 0; i < numberOfCluster; i++) {
        var dist = myNorm(diff(x,clusters[i]));
        if(minDistance > dist) {
            minDistance = dist;
            kIndex = i;
        }
    }
    return kIndex;
}

function classifyIntoClusters(sampleData, classifyFunction) {
    var clusterIndex = []
    for(var i = 0; i < numberOfCluster; i++) {
        clusterIndex[i] = [];    
    }
    for(var i = 0; i < sampleData.length; i++) {
        var kIndex = classifyFunction(sampleData[i]);
        var j = clusterIndex[kIndex].length;
        clusterIndex[kIndex][j] = i;
    }
    return clusterIndex;
}

function computeAverageColor(sampleData) {
    var average = vec3(0,0,0);
    for(var i = 0; i < sampleData.length; i++) {
        var rgb = sampleData[i];
        average = add(average, rgb);
    }
    average = scalarMult(1 / sampleData.length, average);
    return average;
}

function updateClusters(dataClusterIndex, sampleData) {
    for(var i = 0; i < numberOfCluster; i++) {
        clusterDataIndex = dataClusterIndex[i];
        var n = clusterDataIndex.length;
        var mu = vec3(0,0,0);
        for(var j = 0; j < n; j++) {
            var rgb = sampleData[clusterDataIndex[j]];
            mu = add(mu, rgb);
        }
        clusters[i] = n == 0 ? vec3(255 * Math.random(), 255 * Math.random(), 255 * Math.random()) : scalarMult(1.0 / n, mu);
    }
}

function drawClusters(image, classifyFunction, stateMachine) {
    var data = image.data;
    for(var i = 0; i < data.length; i += 4) {
        var rgb = vec3(data[i], data[i+1], data[i+2]);
        var index = classifyFunction(rgb);
        var newColor = stateMachine(rgb, index);
        data[i  ] = newColor[0];
        data[i+1] = newColor[1];
        data[i+2] = newColor[2];
    }
}

function runKmeans(data, classifyFunction, clusterUpdateFunction, drawFunction, stateMachine) {
    if(isLearning) {
        var sampleData = samplingData(data, numOfSamples);
        var dataIntoClusters = classifyIntoClusters(sampleData, classifyFunction);
        averageColor = computeAverageColor(sampleData);
        clusterUpdateFunction(dataIntoClusters, sampleData);   
    }
    drawFunction(data, classifyFunction, stateMachine);
}
//End Kmeans

//GMM
function gaussian(x, mu, sigma) {
    var dist = myNorm( diff( x, sigma));
    return (1.0 / Math.sqrt(powInt(2 * Math.PI * sigma,3))) * Math.exp(-((dist * dist) / (2 * sigma * sigma)));
}

function classifyDataGMM(x){
    var w = [];
    var acc = 0;
    for (var i = 0; i < clusters.length; i++) {
        w[i] = gaussian(x, clusters[i], sigmas[i]) * phi[i];
        acc += w[i];
    }
    for (var i = 0; i < clusters.length; i++) {
        w[i] = w[i] / acc;
    }
    return w;
}

function updateClustersGMM(weights, sampleData) {
    for(var i = 0; i < numberOfCluster; i++) {
        w = weights[i];
        var n = w.length;
        var mu = vec3(0,0,0);
        var acc = 0;
        for(var j = 0; j < n; j++) {
            var rgb = sampleData[j];
            mu = add(mu, scalarMult(w[j],rgb));
            acc += w[j];
        }
        clusters[i] = scalarMult(1/acc, mu);
        sigma = 0;
        for(var j = 0; j < n; j++) {
            var rgb = sampleData[j];
            sigma += w[j] * squaredNorm(diff(rgb, clusters[i]));
        }
        sigmas[i] = Math.sqrt((2 / (3 * acc)) * sigma);
        phi[i] = (1 / n) * acc;
    }
}


function drawClustersGMM(image, classifyFunction, stateMachine) {
    var data = image.data;
    for(var i = 0; i < data.length; i += 4) {
        var rgb = vec3(data[i], data[i+1], data[i+2]);
        var w = classifyFunction(rgb);
        var newColor = vec3(0,0,0);
        for(var j = 0; j < numOfClusters; j++) {
            newColor = add(newColor, scalarMult(w[j], stateMachine(rgb, j)));
        }
        data[i  ] = newColor[0];
        data[i+1] = newColor[1];
        data[i+2] = newColor[2];
    }
}

function classifyIntoClustersGMM(sampleData, classifyFunction) {
    var clusterIndex = []
    for(var i = 0; i < numberOfCluster; i++) {
        clusterIndex[i] = [];    
    }
    for(var i = 0; i < sampleData.length; i++) {
        var weights = classifyFunction(sampleData[i]);
        for (var j = 0; j < weights.length; j++) {
            clusterIndex[j][i] = weights[j];
        }
    }
    return clusterIndex;
}

function runGMM(data, classifyFunction, clusterUpdateFunction, drawFunction, stateMachine) {
    if(isLearning) {
        var sampleData = samplingData(data, numOfSamples);
        var weights = classifyIntoClustersGMM(sampleData, classifyFunction);
        averageColor = computeAverageColor(sampleData);
        clusterUpdateFunction(weights, sampleData);   
    }
    drawFunction(data, classifyFunction, stateMachine);
}
//End GMM

function stopLearning() {
    isLearning = !isLearning;
    var button = document.getElementById('stopLearningButton');
    if(isLearning) {
        button.value = "Stop Learning";
    }else {
        button.value = "Start Learning";

    }
}

function myStateMachine(rgb, clusterIndex) {
    var state = clustersState[clusterIndex];
    switch(state) {
        case 0:
            return rgb;
        case 1:
            return clusters[clusterIndex];
        case 2:
            return [0, 0, 0];
        case 3:
            return [255, 255, 255];
        default:
            return rgb;
    }  
}

function draw() {
    var dt = 1E-3 * (new Date().getTime() - startTime);
    startTime = new Date().getTime();
    time += dt;
    
    ctxVideo.drawImage(video, 0, 0, width,height);

    var videoImage = ctxVideo.getImageData(0, 0, canvasVideo.width, canvasVideo.height);
    
    var stateMachine = myStateMachine;
    
    var yourSelect = document.getElementById( "selectAlgorithm" );
    if(yourSelect.options[yourSelect.selectedIndex].value == "Kmeans") {
        runKmeans(videoImage, classifyData, updateClusters, drawClusters , stateMachine);
    } else {
        runKmeans(videoImage, classifyDataGMM, updateClustersGMM, drawClustersGMM , stateMachine);
    }
    ctx.putImageData(videoImage, 0, 0);
    
    updateTableSoft();

    requestAnimationFrame(draw);
}
/**
*  Main
**/
init()
requestAnimationFrame(draw);