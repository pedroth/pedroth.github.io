function LoadFile(file) {
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp != null) {
        xmlhttp.open("GET", file, false); // the false makes this synchronous!
        xmlhttp.send();
        var text = xmlhttp.responseText;
        return text;
    }
}

/**
 * x,y position
 * w,h width and height
 */
function buildThumbnail(name, w, h) {
    var megaDiv = document.getElementById("megaDiv");
    /* construction of box */
    var div = document.createElement('li');
    var nameH = document.createElement('h3');
    nameH.innerHTML = "" + name;
    var link = document.createElement('a');
    link.setAttribute('href', name + "/" + name + ".html");
    var img = document.createElement('img');
    img.setAttribute("src", name + "/" + name + ".gif");
    img.setAttribute("width", w);
    img.setAttribute("height", h);
    link.appendChild(img);
    div.appendChild(link);
    div.appendChild(nameH);
    megaDiv.appendChild(div);
}

function swap(v, i, j) {
    if (i >= 0 && i < v.length && j >= 0 && j < v.length) {
        var temp = v[i];
        v[i] = v[j];
        v[j] = temp;
    }
}

function sort(v, key) {
    var n = v.length;
    var stack = [];
    stack.push(0);
    stack.push(n - 1);
    while (stack.length > 0) {
        var high = stack.pop();
        var low = stack.pop();
        /*
         * partition
         */
        if (low < high) {
            var pivot = low + Math.floor((high - low) * Math.random());
            var pvalue = key(v, pivot);
            swap(v, pivot, high);
            var j = 0;
            for (var i = 0; i < high; i++) {
                if (key(v, i) <= pvalue) {
                    swap(v, i, j);
                    j++;
                }
            }
            swap(v, j, high);
            stack.push(low);
            stack.push(j - 1);
            stack.push(j + 1);
            stack.push(high);
        }
    }
}

function key(apps, i) {
    return apps[i][1];
}

function build(address) {
    var imgW = 200;
    /**
     * read database
     */
    var text = LoadFile(address);
    /**
     * process data
     */
    var appsName = text.split("\n");
    var apps = [];
    for (var i = 0; i < appsName.length; i++) {
        apps[i] = appsName[i].split(" ");
        var dateStrs = apps[i][1].split("/");
        var acm = 0;
        var ide = 1;
        for (var j = 0; j < dateStrs.length; j++) {
            acm += parseFloat(dateStrs[j]) * ide;
            ide *= 100;
        }
        apps[i][1] = acm;
    }

    sort(apps,key);

    var megaDiv = document.createElement('ul');
    var step = 200;
    megaDiv.setAttribute("id", "megaDiv");
    megaDiv.setAttribute("class", "rig");
    var mainSection = document.getElementById("main_content");
    mainSection.appendChild(megaDiv);

    for (var i = apps.length - 1; i >= 0; i--) {
      buildThumbnail(apps[i][0],imgW,imgW);
    };
}

build(document.getElementById("input").value);